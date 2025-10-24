# backend/train_model.py
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
import joblib, os

# --- Step 1: Load dataset ---
data = pd.read_csv("feedback_dataset_mixed.csv")  # <-- use mixed dataset

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
vectorizer = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1,2))
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# --- Step 4: Train Model ---
model = LogisticRegression(max_iter=500)
model.fit(X_train_tfidf, y_train)

# --- Step 5: Evaluate ---
y_pred = model.predict(X_test_tfidf)
print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=0))
print("✅ Overall Accuracy:", accuracy_score(y_test, y_pred))

# --- Optional: Per-class accuracy ---
classes = data["sentiment"].unique()
for cls in classes:
    cls_idx = y_test == cls
    cls_acc = accuracy_score(y_test[cls_idx], y_pred[cls_idx])
    print(f"Accuracy for {cls}: {cls_acc:.2f}")

# --- Step 6: Save model + vectorizer ---
os.makedirs("backend/models", exist_ok=True)
joblib.dump(model, "backend/models/sentiment_model.pkl")
joblib.dump(vectorizer, "backend/models/tfidf_vectorizer.pkl")

print("\n✅ Model and vectorizer saved successfully in 'backend/models/'!")
