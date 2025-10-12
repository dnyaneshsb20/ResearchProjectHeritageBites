import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Header from '../../components/ui/Header';
import RecipeHero from './components/RecipeHero';
import QuickStats from './components/QuickStats';
import IngredientsList from './components/IngredientsList';
import CookingInstructions from './components/CookingInstructions';
import NutritionPanel from './components/NutritionPanel';
import CulturalStory from './components/CulturalStory';
import SimilarRecipes from './components/SimilarRecipes';
import ReviewsSection from './components/ReviewsSection';
import Footer from 'pages/dashboard/components/Footer';

const RecipeDetailInstructions = () => {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams?.get('id') || '1';
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock recipe data
  const mockRecipe = {
    id: recipeId,
    name: "Authentic Rajasthani Dal Baati Churma",
    region: "Rajasthan",
    cuisine: "North Indian",
    images: [
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg"
    ],
    prepTime: "45 mins",
    cookTime: "1 hr 30 mins",
    totalTime: "2 hrs 15 mins",
    servings: "6 people",
    difficulty: "Medium",
    rating: 4.7,
    reviewCount: 234,
    ingredients: [
      {
        name: "Whole Wheat Flour",
        quantity: "2",
        unit: "cups",
        image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
        available: true,
        note: "Use coarse wheat flour for authentic texture"
      },
      {
        name: "Toor Dal (Arhar Dal)",
        quantity: "1",
        unit: "cup",
        image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
        available: true
      },
      {
        name: "Ghee (Clarified Butter)",
        quantity: "1/2",
        unit: "cup",
        image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
        available: true,
        note: "Pure cow ghee preferred"
      },
      {
        name: "Jaggery (Gur)",
        quantity: "1/2",
        unit: "cup",
        image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
        available: true
      },
      {
        name: "Cardamom Powder",
        quantity: "1",
        unit: "tsp",
        image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
        available: false
      },
      {
        name: "Almonds (chopped)",
        quantity: "1/4",
        unit: "cup",
        image: "https://images.pexels.com/photos/4198015/pexels-photo-4198015.jpeg",
        available: true
      }
    ],
    instructions: [
      {
        instruction: `Mix whole wheat flour with 2 tablespoons of ghee and a pinch of salt. Add water gradually to form a stiff dough. The dough should be firmer than regular roti dough for the baati to hold its shape during baking.`,
        timer: "10 mins",
        image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        tip: "The dough should be stiff enough that you can barely knead it. This ensures the baati doesn't break while cooking.",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        instruction: `Shape the dough into small round balls (baati). Make sure they are smooth and crack-free. Traditionally, these are cooked over cow dung cakes, but we'll use an oven at 200°C for 45 minutes, turning them every 15 minutes.`,
        timer: "45 mins",
        image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
        tip: "Brush baatis with ghee halfway through baking for a golden color."
      },
      {
        instruction: `For the dal: Pressure cook toor dal with turmeric, salt, and 3 cups water for 4-5 whistles. In a pan, heat ghee and add cumin seeds, asafoetida, ginger-garlic paste, and chopped tomatoes. Add the cooked dal and simmer.`,
        timer: "25 mins",
        image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg",
        videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
      },
      {
        instruction: `For churma: Coarsely grind the remaining wheat flour and roast in ghee until golden. Add powdered jaggery, cardamom powder, and chopped almonds. Mix well to form the sweet churma.`,
        timer: "15 mins",
        tip: "Don\'t over-grind the flour - churma should have a coarse texture."
      },
      {
        instruction: `Serve hot baati with dal and churma. Break the baati, pour ghee over it, and enjoy with the spicy dal and sweet churma. This combination represents the perfect balance of flavors in Rajasthani cuisine.`,
        timer: "5 mins"
      }
    ],
    nutrition: {
      calories: 485,
      protein: 12,
      carbs: 68,
      fat: 18,
      fiber: 8,
      sugar: 15,
      sodium: 420,
      iron: 3.2,
      calcium: 85,
      vitaminC: 12,
      dietaryTags: ["Vegetarian", "High Fiber", "Traditional", "Gluten-Free Option"]
    },
    healthBenefits: [
      {
        title: "Rich in Complex Carbohydrates",
        description: "Provides sustained energy from whole wheat and lentils, perfect for active lifestyles."
      },
      {
        title: "High Protein Content",
        description: "Toor dal provides complete amino acids essential for muscle health and repair."
      },
      {
        title: "Digestive Health",
        description: "High fiber content promotes healthy digestion and gut microbiome."
      }
    ],
    story: {
      content: `Dal Baati Churma is the crown jewel of Rajasthani cuisine, born from the harsh desert landscape where resourcefulness and nutrition were paramount. This iconic dish tells the story of Rajput warriors who needed portable, nutritious food during long battles and desert expeditions.\n\nThe baati, essentially a baked wheat ball, could be prepared in advance and stored for days without spoiling in the desert heat. Warriors would bury these in hot sand or cow dung to cook them slowly, creating a hard exterior that preserved the soft interior. The dal provided essential proteins, while churma offered quick energy from natural sugars.\n\nWhat makes this dish truly special is its representation of Rajasthani hospitality - the generous use of ghee symbolizes prosperity and the host's desire to nourish their guests completely. In traditional Rajasthani households, the amount of ghee poured over the baati is considered a measure of the host's affection for their guests.`,
      history: `Dating back to the 14th century, this dish was perfected during the reign of Maharana Pratap. The combination was designed to provide maximum nutrition with minimal water usage, crucial in the arid Thar Desert. Each component serves a purpose: baati for carbohydrates, dal for protein, and churma for immediate energy.`,
      tags: ["Traditional", "Royal Cuisine", "Desert Food", "Warrior Diet", "Hospitality", "Rajput Heritage"],
      funFacts: [
        "Traditionally cooked using cow dung cakes as fuel, which imparts a unique smoky flavor",
        "A single serving can provide energy for an entire day of desert travel",
        "The dish is considered incomplete without generous amounts of pure ghee",
        "Different regions of Rajasthan have their own variations of the churma preparation"
      ]
    },
    chef: {
      name: "Masterji Ratan Singh",
      title: "Traditional Rajasthani Chef",
      bio: "Born and raised in Jodhpur, Masterji has been preserving authentic Rajasthani recipes for over 40 years. He learned this recipe from his grandmother who served in the royal kitchens of Mehrangarh Fort.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      location: "Jodhpur, Rajasthan",
      recipesCount: 127,
      rating: 4.9
    },
    regionalInfo: {
      origin: "Rajasthan, India",
      popularIn: "Gujarat, Madhya Pradesh, Haryana",
      significance: `This dish represents the ingenuity of desert cuisine, where every ingredient serves multiple purposes. It's not just food, but a cultural symbol of Rajasthani resilience, hospitality, and the ability to create abundance from scarcity. The dish is central to festivals like Teej and is considered auspicious for new beginnings.`
    }
  };

  const mockSimilarRecipes = [
    {
      id: "2",
      name: "Gujarati Dhokla",
      region: "Gujarat",
      image: "https://images.pexels.com/photos/5560763/pexels-photo-5560763.jpeg",
      difficulty: "Easy",
      totalTime: "45 mins",
      rating: 4.5,
      reviewCount: 189,
      servings: "4",
      tags: ["Steamed", "Healthy", "Vegetarian"]
    },
    {
      id: "3",
      name: "Punjabi Makki di Roti",
      region: "Punjab",
      image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
      difficulty: "Medium",
      totalTime: "1 hr",
      rating: 4.6,
      reviewCount: 156,
      servings: "6",
      tags: ["Winter Special", "Traditional", "Gluten-Free"]
    },
    {
      id: "4",
      name: "South Indian Sambar",
      region: "Tamil Nadu",
      image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg",
      difficulty: "Easy",
      totalTime: "30 mins",
      rating: 4.4,
      reviewCount: 203,
      servings: "4",
      tags: ["Lentils", "Spicy", "Healthy"]
    }
  ];

  const mockReviews = [
    {
      author: {
        name: "Priya Sharma",
        avatar: "https://randomuser.me/api/portraits/women/32.jpg"
      },
      rating: 5,
      date: "2024-08-10T10:30:00Z",
      comment: `Absolutely authentic recipe! I'm from Rajasthan and this tastes exactly like my grandmother's dal baati churma. The tips about making the dough stiff and using cow ghee really make a difference. My family loved it and asked for seconds!`,
      helpfulCount: 23,
      modifications: "I added a pinch of hing (asafoetida) to the baati dough for extra flavor.",
      images: [
        "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg",
        "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg"
      ]
    },
    {
      author: {
        name: "Rajesh Kumar",
        avatar: "https://randomuser.me/api/portraits/men/28.jpg"
      },
      rating: 4,
      date: "2024-08-08T15:45:00Z",
      comment: `Great recipe with detailed instructions. The cooking times were perfect. Only suggestion would be to mention that the baati can also be cooked on a gas flame directly for that smoky flavor if you don't have an oven.`,
      helpfulCount: 18
    },
    {
      author: {
        name: "Meera Patel",
        avatar: "https://randomuser.me/api/portraits/women/41.jpg"
      },
      rating: 5,
      date: "2024-08-05T09:20:00Z",
      comment: `This recipe brought back so many childhood memories! The cultural story section was beautiful to read. I made this for my kids and they were amazed by the history behind the dish. Food truly is culture!`,
      helpfulCount: 31,
      modifications: "I used jaggery powder instead of solid jaggery for easier mixing in churma."
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadRecipe = async () => {
      setLoading(true);
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setRecipe(mockRecipe);
      setLoading(false);
    };

    loadRecipe();
  }, [recipeId]);

  const handleBookmark = (recipeId) => {
    console.log('Bookmarking recipe:', recipeId);
    // Implement bookmark functionality
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe?.name,
        text: `Check out this amazing ${recipe?.name} recipe from ${recipe?.region}!`,
        url: window.location?.href
      });
    } else {
      // Fallback to copying URL
      navigator.clipboard?.writeText(window.location?.href);
      alert('Recipe link copied to clipboard!');
    }
  };

  const handleBuyIngredients = (ingredients) => {
    console.log('Adding ingredients to cart:', ingredients);
    // Implement cart functionality
    alert(`Added ${ingredients?.length} ingredients to cart!`);
  };

  const handleSubmitReview = (reviewData) => {
    console.log('Submitting review:', reviewData);
    // Implement review submission
    alert('Review submitted successfully!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-muted rounded-lg" />
            <div className="h-32 bg-muted rounded-lg" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-64 bg-muted rounded-lg" />
                <div className="h-96 bg-muted rounded-lg" />
              </div>
              <div className="space-y-6">
                <div className="h-64 bg-muted rounded-lg" />
                <div className="h-32 bg-muted rounded-lg" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-heading font-bold text-foreground mb-4">
              Recipe Not Found
            </h1>
            <p className="text-muted-foreground">
              The recipe you're looking for doesn't exist or has been removed.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Hero Section */}
        <RecipeHero
          recipe={recipe}
          onBookmark={handleBookmark}
          onShare={handleShare}
        />

        {/* Quick Stats */}
        <QuickStats recipe={recipe} />

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Instructions & Reviews */}
          <div className="lg:col-span-2 space-y-6">
            <CookingInstructions
              instructions={recipe?.instructions}
              videos={recipe?.videos}
            />
            
            <ReviewsSection
              reviews={mockReviews}
              recipeId={recipe?.id}
              onSubmitReview={handleSubmitReview}
            />
          </div>

          {/* Right Column - Ingredients, Nutrition, Cultural Story */}
          <div className="space-y-6">
            <IngredientsList
              ingredients={recipe?.ingredients}
              onBuyIngredients={handleBuyIngredients}
            />
            
            <NutritionPanel
              nutrition={recipe?.nutrition}
              healthBenefits={recipe?.healthBenefits}
            />
            
            <CulturalStory
              story={recipe?.story}
              chef={recipe?.chef}
              region={recipe?.regionalInfo}
            />
          </div>
        </div>

        {/* Similar Recipes */}
        <div className="mt-8">
          <SimilarRecipes recipes={mockSimilarRecipes} />
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default RecipeDetailInstructions;