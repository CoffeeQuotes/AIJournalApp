import torch
from transformers import pipeline
from flask import Flask, request, jsonify
from flask_cors import CORS
from typing import List, Dict
import logging
from functools import lru_cache

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create Flask app
app = Flask(__name__)
# Enable CORS for all routes
CORS(app)

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
        return {
            "label": result[0]["label"],
            "score": result[0]["score"]
        }

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)