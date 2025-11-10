# backend/train_model_user.py
import pandas as pd
import re, os, joblib
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score
from sklearn.utils import class_weight

# --- Step 1: Load dataset ---
data = pd.read_csv("feedback_dataset_user.csv")

# Filter only User feedback
data = data[data["user_type"] == "User"].reset_index(drop=True)

# --- Step 2: Preprocess text ---
def clean_text(text):
    text = re.sub(r"[^a-zA-Z\s]", "", text)
    text = text.lower().strip()
    return text

data["combined_review"] = data[
    ["e_market_review", "recipe_review", "chatbot_review", "contribution_review", "overall_review"]
].apply(lambda x: " ".join(x.astype(str)), axis=1)

data["combined_review"] = data["combined_review"].apply(clean_text)

# --- Step 3: Split data ---
X_train, X_test, y_train, y_test = train_test_split(
    data["combined_review"], data["sentiment"],
    test_size=0.2, random_state=42, stratify=data["sentiment"]
)

# --- Step 4: TF-IDF ---
vectorizer = TfidfVectorizer(max_features=5000, stop_words="english", ngram_range=(1,2))
X_train_tfidf = vectorizer.fit_transform(X_train)
X_test_tfidf = vectorizer.transform(X_test)

# --- Step 5: Train Logistic Regression with class weights ---
class_weights = class_weight.compute_class_weight(
    class_weight='balanced',
    classes=np.unique(y_train),
    y=y_train
)
class_weights = dict(zip(np.unique(y_train), class_weights))

model = LogisticRegression(max_iter=500, class_weight=class_weights)
model.fit(X_train_tfidf, y_train)

# --- Step 6: Evaluate ---
y_pred = model.predict(X_test_tfidf)
print("\nClassification Report:\n", classification_report(y_test, y_pred, zero_division=0))
print("✅ Overall Accuracy:", accuracy_score(y_test, y_pred))

# Per-class accuracy
for cls in np.unique(y_test):
    cls_idx = y_test == cls
    cls_acc = accuracy_score(y_test[cls_idx], y_pred[cls_idx])
    print(f"Accuracy for {cls}: {cls_acc:.2f}")

# --- Step 7: Save model and vectorizer ---
os.makedirs("backend/models", exist_ok=True)
joblib.dump(model, "backend/models/sentiment_model_user.pkl")
joblib.dump(vectorizer, "backend/models/tfidf_vectorizer_user.pkl")

metadata = {
    "role": "User",
    "classes": list(model.classes_),
    "vectorizer_features": vectorizer.get_feature_names_out().tolist()
}
joblib.dump(metadata, "backend/models/model_metadata_user.pkl")

print("\n✅ User sentiment model saved successfully in 'backend/models/'!")
