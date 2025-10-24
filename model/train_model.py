# backend/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib, os

# --- Step 1: Load dataset ---
data = pd.read_csv("feedback_dataset.csv")  # adjust path if needed

# Combine all review columns into one text column
data["combined_review"] = data[
    ["e_market_review", "recipe_review", "chatbot_review", "contribution_review", "overall_review"]
].apply(lambda x: " ".join(x.astype(str)), axis=1)

# --- Step 2: Split data ---
X_train, X_test, y_train, y_test = train_test_split(
    data["combined_review"],
    data["sentiment"],
    test_size=0.2,
    random_state=42,
    stratify=data["sentiment"]
)

# --- Step 3: TF-IDF ---
vectorizer = TfidfVectorizer(max_features=5000, stop_words="english")
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# --- Step 4: Train Model ---
model = LogisticRegression(max_iter=300)
model.fit(X_train_tfidf, y_train)

# --- Step 5: Evaluate ---
y_pred = model.predict(X_test_tfidf)
print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=1))
print("✅ Accuracy:", accuracy_score(y_test, y_pred))

# --- Step 6: Save model + vectorizer ---
os.makedirs("backend/models", exist_ok=True)
joblib.dump(model, "backend/models/sentiment_model.pkl")
joblib.dump(vectorizer, "backend/models/tfidf_vectorizer.pkl")

print("\n✅ Model and vectorizer saved successfully in 'backend/models/'!")
