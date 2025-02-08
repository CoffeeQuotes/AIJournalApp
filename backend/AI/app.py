import torch
from transformers import pipeline
from flask_sqlalchemy import SQLAlchemy
from flask import Flask, request, jsonify, render_template, redirect, url_for, session
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

@app.route("/analyze", methods=["POST"])
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

@app.route("/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy"}), 200

# Admin Dashboard : 
@app.route("/", methods=["GET", "POST"])
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
    users = db.session.query(User).all()
    return render_template('users.html', users=users)

@app.route('/prompts', methods=['GET'])
def prompts():
    if 'admin' not in session:
        return redirect(url_for('index'))
    prompts = db.session.query(Prompt).all()
    print(prompts)
    return render_template('prompts.html', prompts=prompts)

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