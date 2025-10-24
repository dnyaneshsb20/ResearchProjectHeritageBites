import pandas as pd
import random

# --- Sample words ---
positive_phrases = [
    "Excellent experience", "Loved it", "Very smooth", "Super helpful",
    "Worked perfectly", "Fantastic feature", "Impressive design", "Very intuitive"
]
neutral_phrases = [
    "Could be better", "Average experience", "Okay experience", "Not bad", "Satisfactory"
]
negative_phrases = [
    "Bad experience", "Did not work", "Very confusing", "Needs improvement",
    "Terrible interface", "Slow and buggy", "Not satisfied", "Hard to use"
]

user_types = ["User", "Admin", "Farmer"]
names = [
    'Divya Shah', 'Rahul Verma', 'Ananya Singh', 'Rohan Patel', 'Sneha Reddy',
    'Vikram Kumar', 'Aisha Khan', 'Arjun Das', 'Pooja Joshi', 'Karan Mehta'
]

# --- Generate synthetic mixed feedback ---
data = []
num_records = 500

for i in range(num_records):
    name = random.choice(names)
    email = f"user{i+1}@example.com"
    user_type = random.choice(user_types)

    # Overall sentiment
    overall_rating = random.randint(1,5)
    if overall_rating >= 4:
        overall_sentiment = "positive"
    elif overall_rating == 3:
        overall_sentiment = "neutral"
    else:
        overall_sentiment = "negative"

    # Section ratings: +/- 1 from overall, bounded 1-5
    def section_rating(base):
        return min(5, max(1, base + random.randint(-1,1)))

    e_market_rating = section_rating(overall_rating)
    recipe_rating = section_rating(overall_rating)
    chatbot_rating = section_rating(overall_rating)
    contribution_rating = section_rating(overall_rating)

    # Generate review text per section
    def make_review(rating, section):
        if rating >= 4:
            return f"{section} - {random.choice(positive_phrases)}"
        elif rating == 3:
            return f"{section} - {random.choice(neutral_phrases)}"
        else:
            return f"{section} - {random.choice(negative_phrases)}"

    e_market_review = make_review(e_market_rating, "E-market")
    recipe_review = make_review(recipe_rating, "Recipe section")
    chatbot_review = make_review(chatbot_rating, "Chatbot")
    contribution_review = make_review(contribution_rating, "Contribution section")
    overall_review = make_review(overall_rating, "Overall website")

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
        "sentiment": overall_sentiment
    })

# --- Shuffle & save ---
df = pd.DataFrame(data).sample(frac=1, random_state=42).reset_index(drop=True)
df.to_csv("feedback_dataset_mixed.csv", index=False)
print("✅ feedback_dataset_mixed.csv generated with mixed feedback for realistic model training")
print(df.head())
