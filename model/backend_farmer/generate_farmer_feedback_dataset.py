import pandas as pd
import random

# --- Sample feedback words ---
positive_phrases = [
    "Great platform for farmers", "Easy to manage products",
    "Very smooth order handling", "User-friendly dashboard",
    "Superb profile features", "Loved the farmer dashboard",
    "Excellent website design", "Fast and efficient system",
    "Helpful insights", "Overall amazing experience"
]

neutral_phrases = [
    "It's fine", "Decent but can improve", "Average experience",
    "Nothing special", "Okay to use", "Could be better"
]

negative_phrases = [
    "Very confusing dashboard", "Bugs in profile section",
    "Hard to manage products", "Orders not updating properly",
    "Bad experience", "Slow and unresponsive", "Not satisfied",
    "Needs a lot of improvement"
]

names = [
    'Ravi Kumar', 'Manoj Singh', 'Priya Patel', 'Amit Reddy',
    'Kavita Sharma', 'Farhan Ali', 'Sita Devi', 'Arjun Kumar',
    'Meena Joshi', 'Deepak Verma'
]

# --- Generate synthetic farmer feedback ---
data = []
num_records = 1000

for i in range(num_records):
    name = random.choice(names)
    email = f"farmer{i+1}@example.com"
    user_type = "Farmer"

    overall_rating = random.randint(1, 5)
    if overall_rating >= 4:
        sentiment = "positive"
    elif overall_rating == 3:
        sentiment = "neutral"
    else:
        sentiment = "negative"

    def section_rating(base):
        return min(5, max(1, base + random.randint(-1, 1)))

    farmer_dashboard_rating = section_rating(overall_rating)
    farmer_products_rating = section_rating(overall_rating)
    farmer_orders_rating = section_rating(overall_rating)
    farmer_profile_rating = section_rating(overall_rating)

    def make_review(rating, section):
        if rating >= 4:
            phrase = random.choice(positive_phrases)
        elif rating == 3:
            phrase = random.choice(neutral_phrases)
        else:
            phrase = random.choice(negative_phrases)
        return f"{section}: {phrase}"

    farmer_dashboard_review = make_review(farmer_dashboard_rating, "Dashboard")
    farmer_products_review = make_review(farmer_products_rating, "Products")
    farmer_orders_review = make_review(farmer_orders_rating, "Orders")
    farmer_profile_review = make_review(farmer_profile_rating, "Profile")
    overall_review = make_review(overall_rating, "Overall")

    data.append({
        "name": name,
        "email": email,
        "user_type": user_type,
        "farmer_dashboard_rating": farmer_dashboard_rating,
        "farmer_dashboard_review": farmer_dashboard_review,
        "farmer_products_rating": farmer_products_rating,
        "farmer_products_review": farmer_products_review,
        "farmer_orders_rating": farmer_orders_rating,
        "farmer_orders_review": farmer_orders_review,
        "farmer_profile_rating": farmer_profile_rating,
        "farmer_profile_review": farmer_profile_review,
        "overall_rating": overall_rating,
        "overall_review": overall_review,
        "sentiment": sentiment
    })

# --- Shuffle & Save ---
df = pd.DataFrame(data).sample(frac=1, random_state=42).reset_index(drop=True)
df.to_csv("feedback_dataset_farmer.csv", index=False)

print("✅ feedback_dataset_farmer.csv generated successfully!")
print(df['sentiment'].value_counts())
print(df.head(10))
