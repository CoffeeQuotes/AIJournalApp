from sqlalchemy import func, cast, Date, text
from datetime import datetime, timedelta
from sqlalchemy import asc, desc
import humanize
import torch
import requests
from transformers import pipeline
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, flash, request, jsonify, render_template, redirect, url_for, session
from flask_cors import CORS
from typing import List, Dict
import logging
from functools import lru_cache
from sqlalchemy.ext.automap import automap_base
from werkzeug.security import generate_password_hash, check_password_hash



# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
# Enable CORS for all routes
app.jinja_env.filters['naturaltime'] = humanize.naturaltime
app.jinja_env.filters['naturaldate'] = humanize.naturaldate

CORS(app)

app.secret_key = "AI"
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:root@localhost:3306/notesapp"
db = SQLAlchemy(app)
Base = automap_base()

# Ensure reflection runs within an app context
with app.app_context():
    Base.prepare(db.engine, reflect=True)
# admins table is mapped to the Admins class
Admin = Base.classes.admins
User = Base.classes.users
Prompt = Base.classes.prompts
Notification = Base.classes.notifications
Journal = Base.classes.journal_entries
JournalClassifier = Base.classes.journal_classifiers
MoodMetric = Base.classes.mood_metrics
Setting = Base.classes.settings

print(Base.classes.keys())  # Debugging

class JournalAnalyzer:
    """Singleton class to handle journal entry analysis operations"""
    _instance = None
    
    JOURNAL_CATEGORIES = [
        "Personal Reflection",
        "Goal Setting",
        "Emotional Processing",
        "Daily Recap",
        "Career Thoughts",
        "Relationship Insights",
        "Mental Health Check",
        "Creative Writing",
        "Learning and Growth",
        "Travel and Adventure",
        "Gratitude and Positivity",
        "Stress and Challenges",
        "Future Planning",
        "Self-Care",
        "Spiritual or Philosophical Musings"
    ]

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(JournalAnalyzer, cls).__new__(cls)
            cls._instance._initialized = False
        return cls._instance

    def __init__(self):
        """Initialize the ML models only once"""
        if self._initialized:
            return
            
        try:
            logger.info("Loading ML models...")
            self.sentiment_analyzer = pipeline("sentiment-analysis")
            self.category_classifier = pipeline("zero-shot-classification")
            self._initialized = True
            logger.info("ML models successfully loaded")
        except Exception as e:
            logger.error(f"Error loading ML models: {str(e)}")
            raise

    def analyze_sentiment(self, text: str) -> Dict:
        """Analyze sentiment of input text"""
        result = self.sentiment_analyzer(text)
        if result:
            result = result[0]
            return {
                "label": result["label"],
                "score": result["score"]
            }
        else:
            return {"label": "Neutral", "score": 0.0}

    def classify_categories(self, text: str, threshold: float = 0.1, top_k: int = 3) -> List[Dict]:
        """Classify text into journal categories"""
        result = self.category_classifier(
            text,
            self.JOURNAL_CATEGORIES,
            multi_label=True
        )
        
        return [
            {"category": label, "score": float(score)}
            for label, score in zip(result['labels'], result['scores'])
            if score > threshold
        ][:top_k]

@lru_cache(maxsize=1)
def get_analyzer():
    """Cached analyzer instance"""
    return JournalAnalyzer()

# Initialize analyzer outside of route handlers
analyzer = get_analyzer()

@app.route('/analyze', methods=["POST"])
def analyze_journal():
    """Endpoint to analyze journal entries"""
    try:
        # Validate request
        if not request.is_json:
            return jsonify({"error": "Content-Type must be application/json"}), 400
        
        data = request.json
        if "text" not in data:
            return jsonify({"error": "Missing required field: text"}), 400
        
        text = data["text"]
        if not isinstance(text, str) or not text.strip():
            return jsonify({"error": "Text field must be a non-empty string"}), 400

        # Process the journal entry
        sentiment_result = analyzer.analyze_sentiment(text)
        categories = analyzer.classify_categories(text)

        response = {
            "sentiment": sentiment_result["label"],
            "score": sentiment_result["score"],
            "categories": categories
        }

        logger.info("Successfully processed journal entry")
        return jsonify(response)

    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        return jsonify({"error": "Internal server error"}), 500

@app.route('/health', methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Admin Dashboard : 
@app.route('/', methods=["GET", "POST"])
def index():
    if request.method != 'POST':
        return render_template('login.html')
    username = request.form['username']
    password = request.form['password']
    user = db.session.query(Admin).filter_by(username=username).first()
    if user and check_password_hash(user.password, password):
        session['admin'] = username
        # get the id and store it in session 
        session['id'] = user.id
        return redirect(url_for('dashboard'))
    return "Invalid credentials!"

# Logout
@app.route('/logout')
def logout():
    session.pop('admin', None)
    session.pop('id', None)
    return redirect(url_for('index'))

#  Dashboard
@app.route('/dashboard', methods=['GET'])
def dashboard():
    if 'admin' not in session:
        return redirect(url_for('index'))
    return render_template('dashboard.html')

@app.route('/users', methods=['GET'])
def users():
    if 'admin' not in session:
        return redirect(url_for('index'))
    
    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    
    # Validate sort column
    valid_sort_columns = ['id', 'username', 'email']
    if sort_by not in valid_sort_columns:
        sort_by = 'id'
    
    # Query sorting
    query = db.session.query(User)
    if order == 'desc':
        query = query.order_by(getattr(User, sort_by).desc())
    else:
        query = query.order_by(getattr(User, sort_by).asc())
    
     # Paginate manually
    total_records = query.count()
    total_pages = (total_records + per_page - 1) // per_page  # Calculate total pages
    
    paginated_users = query.offset((page - 1) * per_page).limit(per_page).all()    
    
    return render_template(
        'users.html', 
        users=paginated_users,
        page=page,
        total_pages=total_pages,
        sort_by=sort_by,
        order=order
    )

@app.route('/user/edit/<int:id>', methods=['GET', 'POST'])
def edit_user(id):
    if 'admin' not in session:
        return redirect(url_for('index'))
    
    user = db.session.query(User).filter_by(id=id).first()
    if not user:
        return "User not found", 404

    setting = db.session.query(Setting).filter_by(user_id=id).first()
    
    if request.method == 'POST':
        theme = request.form.get('theme', '').strip()
        notification = request.form.get('notification', '').strip()
        language = request.form.get('language', '').strip()

        if not theme or not notification or not language:
            flash("Please fill in all fields", "error")
            return redirect(url_for('edit_user', id=id))

        if not setting:
            # If no existing setting, create a new one
            setting = Setting(user_id=id, theme=theme, notification=notification, language=language)
            db.session.add(setting)
        else:
            # Update existing settings
            setting.theme = theme
            setting.notification = notification
            setting.language = language

        db.session.commit()
        flash("Settings updated successfully", "success")
        return redirect(url_for('edit_user', id=id))

    return render_template('edit_user.html', user=user, setting=setting)

@app.route('/user/delete/<int:id>', methods=['POST'])
def delete_user(id):
    if 'admin' not in session:
        flash("Unauthorized access", "error")
        return redirect(url_for('index'))

    user = db.session.query(User).filter_by(id=id).first()

    if not user:
        flash("User not found", "error")
        return redirect(url_for('users'))

    try:
        # Delete related records only if they exist
        for model in [Setting, JournalClassifier, MoodMetric, Notification, Journal]:
            db.session.query(model).filter_by(user_id=id).delete(synchronize_session=False)

        # Delete the user
        db.session.delete(user)
        db.session.commit()
        
        flash("User deleted successfully", "success")
    except Exception as e:
        db.session.rollback()
        flash(f"Error deleting user: {str(e)}", "error")

    return redirect(url_for('users'))


@app.route('/user/<int:id>', methods=['GET'])
def user_details(id):
    if 'admin' not in session:
        return redirect(url_for('index'))

    # Get user details
    user = db.session.query(User).filter_by(id=id).first()

    if not user:
        return "User not found", 404

    # Pagination parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    offset = (page - 1) * per_page

    # Get all journals by user id and COUNT them
    journal_query = db.session.query(Journal).filter_by(user_id=id).order_by(Journal.created_at.desc())
    total_journals = journal_query.count()
    journals = journal_query.limit(per_page).offset(offset).all()

    # Calculate total pages for journals
    total_journal_pages = (total_journals + per_page - 1) // per_page

    # Get the category (classifier) the user has written most in
    most_used_classifier = (
        db.session.query(JournalClassifier.classifier, db.func.count(JournalClassifier.classifier).label('count'))
        .filter_by(user_id=id)
        .group_by(JournalClassifier.classifier)
        .order_by(db.desc('count'))
        .first()
    )

    # Get the mood distribution of the user
    mood_distribution = (
        db.session.query(Journal.mood, db.func.count(Journal.mood).label('count'))
        .filter_by(user_id=id)
        .group_by(Journal.mood)
        .order_by(db.desc('count'))
        .all()
    )

    # Get mood metrics over time for the last 7 days
    seven_days_ago = datetime.now() - timedelta(days=7)
    mood_metrics = (
        db.session.query(
            cast(MoodMetric.recorded_date, Date).label('recorded_date'),
            MoodMetric.mood,
            func.sum(MoodMetric.count).label('count')
        )
        .filter_by(user_id=id)
        .filter(MoodMetric.recorded_date >= seven_days_ago)
        .group_by('recorded_date', MoodMetric.mood)
        .order_by(text('recorded_date DESC'))
        .all()
    )

    return render_template(
        'user_details.html',
        user=user,
        journals=journals,
        most_used_classifier=most_used_classifier,
        mood_distribution=mood_distribution,
        mood_metrics=mood_metrics,
        page=page,
        per_page=per_page,
        total_journal_pages=total_journal_pages  # Pass the total pages to the template
    )

@app.route('/prompts', methods=['GET'])
def list_prompts():
    if 'admin' not in session:
        return redirect(url_for('index'))

    # Get query parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'id')
    order = request.args.get('order', 'asc')
    category_filter = request.args.get('category', None)  # Get category filter

    # Validate sort column
    valid_sort_columns = ['id', 'text', 'category']
    if sort_by not in valid_sort_columns:
        sort_by = 'id'

    # Query sorting
    query = db.session.query(Prompt)
    if order == 'desc':
        query = query.order_by(getattr(Prompt, sort_by).desc())
    else:
        query = query.order_by(getattr(Prompt, sort_by).asc())

    # Apply category filter if provided
    if category_filter:
        query = query.filter(Prompt.category == category_filter)

    # Paginate manually
    total_records = query.count()
    total_pages = (total_records + per_page - 1) // per_page  # Calculate total pages

    paginated_prompts = query.offset((page - 1) * per_page).limit(per_page).all()

    # Get distinct categories for dropdown filter
    categories = db.session.query(Prompt.category).distinct().all()
    categories = [c[0] for c in categories]  # Extract values from tuples

    return render_template(
        'prompts.html',
        prompts=paginated_prompts,
        page=page,
        total_pages=total_pages,
        sort_by=sort_by,
        order=order,
        categories=categories,
        selected_category=category_filter
    )
    
@app.route('/create_prompt', methods=['POST', 'GET'])
def create_prompt():
    if 'admin' not in session:
        return redirect(url_for('index'))

    if request.method == 'POST':
        # Use `.get()` to avoid KeyError
        text = request.form.get('prompt', '').strip()
        category = request.form.get('category', '').strip()

        if not text or not category:
            flash("Please fill in all fields", "error")
            return redirect(url_for('create_prompt'))

        try:
            new_prompt = Prompt(text=text, category=category)
            db.session.add(new_prompt)
            db.session.commit()
            flash("Prompt created successfully", "success")
        except Exception as e:
            db.session.rollback()
            flash(f"Error creating prompt: {str(e)}", "error")

        return redirect(url_for('list_prompts'))
    
    categories = [
        "Personal Reflection",
        "Goal Setting",
        "Emotional Processing",
        "Daily Recap",
        "Career Thoughts",
        "Relationship Insights",
        "Mental Health Check",
        "Creative Writing",
        "Learning and Growth",
        "Travel and Adventure",
        "Gratitude and Positivity",
        "Stress and Challenges",
        "Future Planning",
        "Self-Care",
        "Spiritual or Philosophical Musings"
    ]
    return render_template('create_prompt.html', categories=categories)

# send general notification 
@app.route('/send_notification', methods=['POST', 'GET'])
def send_notification():
    if 'admin' not in session:
        return redirect(url_for('index'))

    if request.method == 'POST':
        # Use `.get()` to avoid KeyError and strip whitespace
        title = request.form.get('title', '').strip()
        message = request.form.get('message', '').strip()
        clickable_url = request.form.get('clickable_url', '').strip()

        if not title or not message:
            flash("Please fill in all fields", "error")
            return redirect(url_for('send_notification'))

        # API Endpoint
        api_url = "http://localhost/notesapp/backend/api/v1/notification/index.php?action=send-general-notification"
        
        # Payload
        payload = {
            "title": title,
            "message": message
        }
        if clickable_url:
            payload["clickable_url"] = clickable_url  # Include if provided

        try:
            # Send request to the API
            response = requests.post(api_url, json=payload, timeout=5)
            response_data = response.json()  # Assuming API returns JSON response

            if response.status_code == 200 and response_data.get("status") == 200:
                flash("Notification sent successfully!", "success")
            else:
                flash(f"Failed to send notification: {response_data.get('message', 'Unknown error')}", "error")
        
        except requests.exceptions.RequestException as e:
            flash(f"Error communicating with notification API: {str(e)}", "error")

        return redirect(url_for('send_notification'))

    return render_template('send_notification.html')  # Render the notification form
            
@app.route('/notification', methods=['GET'])
def notification():
    if 'admin' not in session:
        return redirect(url_for('index'))

    # Get pagination and sorting parameters
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort_by', 'created_at')
    order = request.args.get('order', 'desc')

    # Ensure sorting column is valid
    valid_sort_columns = ['id', 'title', 'message', 'created_at']
    if sort_by not in valid_sort_columns:
        sort_by = 'created_at'

    # Define sorting order
    order_func = asc if order.lower() == 'asc' else desc

    # Query notifications and group by title & message
    notifications_query = (
        db.session.query(
            Notification.id,
            Notification.title,
            Notification.message,
            # func.group_concat(Notification.user_id.op('ORDER BY')(Notification.user_id)).label("users"),
            Notification.created_at,
        )
        .group_by(Notification.title, Notification.message)
        .order_by(order_func(getattr(Notification, sort_by)))  # Apply sorting
    )

    # Apply pagination
    paginated_notifications = notifications_query.paginate(page=page, per_page=per_page, error_out=False)

    return render_template(
        'notifications.html', 
        notifications=paginated_notifications.items, 
        page=page, 
        per_page=per_page, 
        total_pages=paginated_notifications.pages, 
        sort_by=sort_by, 
        order=order
    )

@app.route('/delete_prompt/<int:prompt_id>', methods=['POST', 'GET'])
def delete_prompt(prompt_id):
    if 'admin' not in session:
        return redirect(url_for('index'))

    prompt = db.session.query(Prompt).filter_by(id=prompt_id).first()

    if not prompt:
        flash("Prompt not found!", "error")
        return redirect(url_for('list_prompts'))

    try:
        db.session.delete(prompt)
        db.session.commit()
        flash("Prompt deleted successfully!", "success")
    except Exception as e:
        db.session.rollback()
        flash(f"Error deleting prompt: {str(e)}", "error")

    return redirect(url_for('list_prompts'))

@app.route('/create_default_admin', methods=['GET'])
def create_default_admin():
    with app.app_context():
        if (
            admin := db.session.query(Admin)
            .filter_by(username="admin")
            .first()
        ):
            return "Admin user already exists!", 409

        # Create a new admin user
        new_admin = Admin(username="admin", email="admin@admin.com", password=generate_password_hash("password"))
        db.session.add(new_admin)
        db.session.commit()

        return "Default admin user created successfully!", 201
    
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)