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
import { supabase } from "../../supabaseClient";
import toast from 'react-hot-toast';


const RecipeDetailInstructions = () => {
  const [searchParams] = useSearchParams();
  const recipeId = searchParams?.get('id') || '1';
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);


  useEffect(() => {
    const fetchRecipe = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from("recipes")
        .select(`
        recipe_id,
        name,
        description,
        cooking_time,
        prep_time,
        difficulty_level,
        festival_tag,
        dietary_type,
        meal_type,
        image_url,
        hero_image_url,
        total_time,
        servings,
        rating,
        review_count,
        images,
        ingredients,
        instructions,
        nutrition,
        health_benefits,
        story,
        chef,
        regional_info,
        tags,
        states ( state_name, region )
      `)
        .eq("recipe_id", recipeId)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error);
        setRecipe(null);
      } else {
setRecipe({
  ...data,
  id: data.recipe_id,
  region: data.states?.state_name || "Unknown Region",
  images: data.images || [data.image_url],
  healthBenefits: data.health_benefits,
  regionalInfo: {
    significance: data.regional_info?.origin_story || "N/A",
     origin: `${data.regional_info?.district || "N/A"}, ${data.regional_info?.state || "N/A"}`,
    popularIn: data.regional_info?.region || "N/A",
  },
   instructions: Array.isArray(data.instructions)
    ? data.instructions
    : data.instructions
      ? JSON.parse(data.instructions)
      : [], // default empty array
     servings: parseInt(data.servings) || 1,
});

      }

      setLoading(false);
    };

    if (recipeId) fetchRecipe();
  }, [recipeId]);
useEffect(() => {
  const fetchReviews = async () => {
    if (!recipeId) return;

    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("recipe_id", recipeId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching reviews:", error);
    else setReviews(data);
  };

  fetchReviews();
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
      toast.success('Recipe link copied to clipboard!');
    }
  };

  const handleBuyIngredients = (ingredients) => {
    console.log('Adding ingredients to cart:', ingredients);
    // Implement cart functionality
    toast.success(`Added ${ingredients?.length} ingredients to cart!`);
  };

const handleSubmitReview = async (reviewData) => {
  const { rating, comment, user_name } = reviewData;

  const { data, error } = await supabase
    .from("reviews")
    .insert([
      {
        recipe_id: recipeId,
        rating,
        comment,
        user_name,
      },
    ])
    .select();

  if (error) {
    console.error("Error submitting review:", error);
    toast.error("Failed to submit review. Try again.");
  } else {
    toast.success("Review submitted successfully!");
    setReviews((prev) => [data[0], ...prev]); // instantly update list
  }
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

            {/* <ReviewsSection
              reviews={reviews}
              recipeId={recipe?.id}
              onSubmitReview={handleSubmitReview}
            /> */}

          </div>

          {/* Right Column - Ingredients, Nutrition, Cultural Story */}
          <div className="space-y-6">
            <IngredientsList
              ingredients={recipe?.ingredients}
               baseServings={recipe?.servings} 
              onBuyIngredients={handleBuyIngredients}
            />

            <NutritionPanel
              nutrition={recipe?.nutrition}
              healthBenefits={recipe?.healthBenefits}
               dietary_type= {recipe.dietary_type}
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
          
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default RecipeDetailInstructions;