import pandas as pd
import random

# --- Step 1: Define sample words for positive/negative reviews ---
positive_phrases = [
    "Excellent experience", "Loved it", "Very smooth", "Super helpful",
    "Worked perfectly", "Fantastic feature", "Impressive design", "Very intuitive"
]
negative_phrases = [
    "Bad experience", "Did not work", "Very confusing", "Needs improvement",
    "Terrible interface", "Slow and buggy", "Not satisfied", "Hard to use"
]

# --- Step 2: Define user types ---
user_types = ["Resident", "Admin", "Guest"]

# --- Step 3: Generate synthetic data ---
data = []
for i in range(500):  # number of records
    name = f"User_{i+1}"
    email = f"user{i+1}@example.com"
    user_type = random.choice(user_types)
    
    # Random ratings (1–5)
    e_market_rating = random.randint(1, 5)
    recipe_rating = random.randint(1, 5)
    chatbot_rating = random.randint(1, 5)
    contribution_rating = random.randint(1, 5)
    overall_rating = random.randint(1, 5)

    # Generate text reviews based on rating
    def make_review(rating, section):
        if rating >= 4:
            return f"{section} - {random.choice(positive_phrases)}"
        elif rating == 3:
            return f"{section} - Average experience"
        else:
            return f"{section} - {random.choice(negative_phrases)}"

    e_market_review = make_review(e_market_rating, "E-market")
    recipe_review = make_review(recipe_rating, "Recipe section")
    chatbot_review = make_review(chatbot_rating, "Chatbot")
    contribution_review = make_review(contribution_rating, "Contribution section")
    overall_review = make_review(overall_rating, "Overall website")

    # Simple sentiment label based on overall rating
    if overall_rating >= 4:
        sentiment = "positive"
    elif overall_rating == 3:
        sentiment = "neutral"
    else:
        sentiment = "negative"

    data.append({
        "name": name,
        "email": email,
        "user_type": user_type,
        "e_market_rating": e_market_rating,
        "e_market_review": e_market_review,
        "recipe_rating": recipe_rating,
        "recipe_review": recipe_review,
        "chatbot_rating": chatbot_rating,
        "chatbot_review": chatbot_review,
        "contribution_rating": contribution_rating,
        "contribution_review": contribution_review,
        "overall_rating": overall_rating,
        "overall_review": overall_review,
        "sentiment": sentiment
    })

# --- Step 4: Create DataFrame & Save ---
df = pd.DataFrame(data)
df.to_csv("feedback_dataset.csv", index=False)

print("✅ feedback_dataset.csv generated successfully with", len(df), "records.")
print(df.head())
