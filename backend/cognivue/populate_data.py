#!/usr/bin/env python
import os
import sys
import django

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'cognivue.settings')
django.setup()

from nutrition.models import FoodItem, NutritionTip, MealPlan
from insights.models import Factoid, LifestyleTip

def populate_nutrition_data():
    # Create food items
    foods = [
        {"name": "Salmon", "category": "Fish", "vitamin_d_iu": 360, "is_vegetarian": False, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Fortified Milk", "category": "Dairy", "vitamin_d_iu": 120, "is_vegetarian": True, "is_lactose_free": False, "is_nut_free": True},
        {"name": "Egg Yolks", "category": "Protein", "vitamin_d_iu": 87, "is_vegetarian": True, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Fortified Cereals", "category": "Grains", "vitamin_d_iu": 100, "is_vegetarian": True, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Mushrooms", "category": "Vegetables", "vitamin_d_iu": 375, "is_vegetarian": True, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Tuna", "category": "Fish", "vitamin_d_iu": 154, "is_vegetarian": False, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Fortified Orange Juice", "category": "Beverages", "vitamin_d_iu": 100, "is_vegetarian": True, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Sardines", "category": "Fish", "vitamin_d_iu": 272, "is_vegetarian": False, "is_lactose_free": True, "is_nut_free": True},
        {"name": "Cheese", "category": "Dairy", "vitamin_d_iu": 24, "is_vegetarian": True, "is_lactose_free": False, "is_nut_free": True},
        {"name": "Beef Liver", "category": "Meat", "vitamin_d_iu": 42, "is_vegetarian": False, "is_lactose_free": True, "is_nut_free": True},
    ]
    
    for food_data in foods:
        food, created = FoodItem.objects.get_or_create(
            name=food_data["name"],
            defaults=food_data
        )
        if created:
            print(f"Created food item: {food.name}")
    
    # Create nutrition tips
    tips = [
        {
            "title": "Get Morning Sunlight",
            "tip_text": "Spend 10-15 minutes in morning sunlight to boost vitamin D production.",
            "expanded_text": "Morning sunlight exposure helps your skin produce vitamin D naturally. The best time is between 10 AM and 3 PM when UVB rays are strongest."
        },
        {
            "title": "Include Fatty Fish",
            "tip_text": "Eat fatty fish like salmon, mackerel, or sardines 2-3 times per week.",
            "expanded_text": "Fatty fish are among the best dietary sources of vitamin D. A 3.5-ounce serving of salmon provides about 360-700 IU of vitamin D."
        },
        {
            "title": "Choose Fortified Foods",
            "tip_text": "Look for vitamin D-fortified milk, cereals, and orange juice.",
            "expanded_text": "Many foods are fortified with vitamin D to help people meet their daily requirements. Check labels for 'vitamin D fortified' or 'vitamin D added'."
        }
    ]
    
    for tip_data in tips:
        tip, created = NutritionTip.objects.get_or_create(
            title=tip_data["title"],
            defaults=tip_data
        )
        if created:
            print(f"Created nutrition tip: {tip.title}")
    
    # Create meal plans
    days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    meal_types = ["breakfast", "lunch", "dinner"]
    
    # Get some food items for meal planning
    salmon = FoodItem.objects.get(name="Salmon")
    eggs = FoodItem.objects.get(name="Egg Yolks")
    milk = FoodItem.objects.get(name="Fortified Milk")
    cereals = FoodItem.objects.get(name="Fortified Cereals")
    tuna = FoodItem.objects.get(name="Tuna")
    mushrooms = FoodItem.objects.get(name="Mushrooms")
    
    meal_plan_data = [
        # Monday
        ("Monday", "breakfast", cereals),
        ("Monday", "lunch", tuna),
        ("Monday", "dinner", salmon),
        # Tuesday
        ("Tuesday", "breakfast", eggs),
        ("Tuesday", "lunch", mushrooms),
        ("Tuesday", "dinner", salmon),
        # Wednesday
        ("Wednesday", "breakfast", cereals),
        ("Wednesday", "lunch", tuna),
        ("Wednesday", "dinner", salmon),
        # Thursday
        ("Thursday", "breakfast", eggs),
        ("Thursday", "lunch", mushrooms),
        ("Thursday", "dinner", salmon),
        # Friday
        ("Friday", "breakfast", cereals),
        ("Friday", "lunch", tuna),
        ("Friday", "dinner", salmon),
        # Saturday
        ("Saturday", "breakfast", eggs),
        ("Saturday", "lunch", mushrooms),
        ("Saturday", "dinner", salmon),
        # Sunday
        ("Sunday", "breakfast", cereals),
        ("Sunday", "lunch", tuna),
        ("Sunday", "dinner", salmon),
    ]
    
    for day, meal_type, food in meal_plan_data:
        meal, created = MealPlan.objects.get_or_create(
            day=day,
            meal_type=meal_type,
            defaults={"food": food}
        )
        if created:
            print(f"Created meal plan: {day} {meal_type} - {food.name}")

def populate_insights_data():
    # Create factoids
    factoids = [
        {
            "title": "Vitamin D and Brain Health",
            "text": "Vitamin D receptors are found throughout the brain, particularly in areas involved in memory and cognitive function.",
            "source_url": "https://example.com/vitamin-d-brain",
            "badge": "Fact 1 of 3"
        },
        {
            "title": "Sunlight and Mood",
            "text": "Regular sunlight exposure can help improve mood and reduce symptoms of seasonal depression.",
            "source_url": "https://example.com/sunlight-mood",
            "badge": "Fact 2 of 3"
        },
        {
            "title": "Cognitive Protection",
            "text": "Adequate vitamin D levels may help protect against cognitive decline and dementia in older adults.",
            "source_url": "https://example.com/cognitive-protection",
            "badge": "Fact 3 of 3"
        }
    ]
    
    for factoid_data in factoids:
        factoid, created = Factoid.objects.get_or_create(
            title=factoid_data["title"],
            defaults=factoid_data
        )
        if created:
            print(f"Created factoid: {factoid.title}")
    
    # Create lifestyle tips
    lifestyle_tips = [
        {
            "title": "Daily Sun Exposure",
            "impact": "beneficial",
            "front_summary": "Aim for 10-30 minutes of midday sunlight several times per week.",
            "back_detail": "Regular sunlight exposure helps your skin produce vitamin D naturally. The best time is between 10 AM and 3 PM when UVB rays are strongest. This can significantly boost your vitamin D levels and improve overall health."
        },
        {
            "title": "Vitamin D Testing",
            "impact": "beneficial",
            "front_summary": "Get your vitamin D blood levels tested annually.",
            "back_detail": "Regular testing helps ensure you maintain optimal vitamin D levels (30-50 ng/mL). This is especially important if you live in northern climates or have limited sun exposure."
        },
        {
            "title": "Dietary Sources",
            "impact": "beneficial",
            "front_summary": "Include vitamin D-rich foods in your diet.",
            "back_detail": "Fatty fish like salmon and mackerel, egg yolks, and fortified products are excellent sources of vitamin D. These foods can help you meet your daily requirements when sun exposure is limited."
        }
    ]
    
    for tip_data in lifestyle_tips:
        tip, created = LifestyleTip.objects.get_or_create(
            title=tip_data["title"],
            defaults=tip_data
        )
        if created:
            print(f"Created lifestyle tip: {tip.title}")

if __name__ == "__main__":
    print("Populating nutrition data...")
    populate_nutrition_data()
    print("\nPopulating insights data...")
    populate_insights_data()
    print("\nData population complete!")