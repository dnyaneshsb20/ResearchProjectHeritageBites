import pandas as pd
import random

# --- Sample feedback words (User only) ---
positive_phrases = [
    "Excellent experience", "Loved it", "Very smooth and easy to use",
    "Super helpful interface", "Worked perfectly", "Fantastic feature",
    "Impressive design", "Very intuitive", "Great product selection",
    "Fast checkout and clean UI", "Amazing recipes and service"
]
neutral_phrases = [
    "Could be better", "Average experience", "Okay experience overall",
    "Not bad", "Satisfactory", "It's fine", "Decent but nothing special",
    "Could use some improvements"
]
negative_phrases = [
    "Bad experience", "Did not work properly", "Very confusing interface",
    "Needs improvement", "Terrible design", "Slow and buggy",
    "Not satisfied", "Hard to use", "Checkout failed", "Unresponsive chatbot"
]

names = [
    'Divya Shah', 'Rahul Verma', 'Ananya Singh', 'Rohan Patel', 'Sneha Reddy',
    'Vikram Kumar', 'Aisha Khan', 'Arjun Das', 'Pooja Joshi', 'Karan Mehta'
]

# --- Generate synthetic user feedback ---
data = []
num_records = 1000  # increase slightly for better balance

for i in range(num_records):
    name = random.choice(names)
    email = f"user{i+1}@example.com"
    user_type = "User"  # fixed for user dataset

    # Overall sentiment and rating
    overall_rating = random.randint(1, 5)
    if overall_rating >= 4:
        sentiment = "positive"
    elif overall_rating == 3:
        sentiment = "neutral"
    else:
        sentiment = "negative"

    # Slight variations in ratings for realism
    def section_rating(base):
        return min(5, max(1, base + random.randint(-1, 1)))

    e_market_rating = section_rating(overall_rating)
    recipe_rating = section_rating(overall_rating)
    chatbot_rating = section_rating(overall_rating)
    contribution_rating = section_rating(overall_rating)

    # Generate realistic reviews per section
    def make_review(rating, section):
        if rating >= 4:
            phrase = random.choice(positive_phrases)
        elif rating == 3:
            phrase = random.choice(neutral_phrases)
        else:
            phrase = random.choice(negative_phrases)

        # Mix descriptive and concise styles
        if random.random() > 0.5:
            return f"{section} - {phrase}"
        else:
            return phrase

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
        "sentiment": sentiment
    })

# --- Shuffle & Save ---
df = pd.DataFrame(data).sample(frac=1, random_state=42).reset_index(drop=True)
df.to_csv("feedback_dataset_user.csv", index=False)

print("✅ feedback_dataset_user.csv generated successfully for User feedback only")
print(df['sentiment'].value_counts())
print(df.head(10))
