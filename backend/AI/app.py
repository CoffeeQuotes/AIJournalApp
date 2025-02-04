import torch
from transformers import pipeline
from flask import Flask, request, jsonify

app = Flask(__name__)

# Load the models
sentiment_analysis = pipeline("sentiment-analysis")
zero_shot_classifier = pipeline("zero-shot-classification")

# Define journal categories
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

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.json
        text = data["text"]

        # Perform sentiment analysis
        sentiment_result = sentiment_analysis(text)

        # Add zero-shot classification for categories
        category_result = zero_shot_classifier(
            text, 
            JOURNAL_CATEGORIES,
            multi_label=True
        )

        # Get top 3 categories with scores above 10%
        top_categories = [
            {"category": label, "score": score}
            for label, score in zip(category_result['labels'], category_result['scores'])
            if score > 0.1
        ][:3]

        # Structure response to match PHP client expectations
        response = {
            "sentiment": sentiment_result[0]["label"],
            "score": sentiment_result[0]["score"],  # Changed from sentiment_score to score
            "categories": top_categories
        }

        return jsonify(response)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)