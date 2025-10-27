import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import Header from "../../components/ui/Header"; // ✅ use your existing global header
import Footer from "../dashboard/components/Footer"; // ✅ use your existing global footer
import UserRecipeView from "./UserRecipeView";

const CommunityRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  useEffect(() => {
    fetchCommunityRecipes();
  }, []);

  const fetchCommunityRecipes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("rec_contributions")
      .select(`
        indg_recipe_id,
        name,
        description,
        image_url,
        cooking_time,
        created_at,
        meal_type,
        state_id,
        status,
        states ( state_name, region )
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching community recipes:", error);
    else setRecipes(data || []);

    setLoading(false);
  };

  // ✅ When a recipe is selected, show its detailed view
  if (selectedRecipeId) {
    return (
      <UserRecipeView
        recipeId={selectedRecipeId}
        onBack={() => setSelectedRecipeId(null)} // back to list
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* ===== Global Header ===== */}
      <Header />

      {/* ===== Page Main Content ===== */}
      <main className="flex-1 max-w-7xl mx-auto px-4 py-10 w-full">
        {/* Page Heading */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Community Recipes</h1>
            <p className="text-sm text-gray-500 mt-1">
              Discover and explore authentic recipes shared by our community.
            </p>
          </div>

          <Button
            variant="ghost2"
            iconName="RefreshCcw"
            onClick={fetchCommunityRecipes}
          >
            Refresh
          </Button>
        </div>

        {/* Recipes Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-muted-foreground text-lg">
              Loading community recipes...
            </p>
          </div>
        ) : recipes.length === 0 ? (
          <div className="text-center text-muted-foreground py-20">
            <Icon name="ChefHat" size={40} className="mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No community recipes yet.</p>
            <p className="text-sm text-gray-500">
              Be the first to share your traditional dish!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {recipes.map((recipe) => (
              <div
                key={recipe.indg_recipe_id}
                className="group bg-white rounded-2xl shadow hover:shadow-lg border transition-all overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="relative">
                  <img
                    src={recipe.image_url || "/placeholder-image.jpg"}
                    alt={recipe.name}
                    className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow">
                    Approved
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="font-semibold text-xl mb-2 text-gray-900 line-clamp-1">
                    {recipe.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {recipe.description || "A delicious traditional recipe."}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                    {recipe.states?.region && (
                      <div className="flex items-center gap-1">
                        <Icon name="MapPin" size={12} />
                        <span>{recipe.states.region}</span>
                      </div>
                    )}
                    {recipe.meal_type && (
                      <div className="flex items-center gap-1">
                        <Icon name="Utensils" size={12} />
                        <span>{recipe.meal_type}</span>
                      </div>
                    )}
                    {recipe.cooking_time && (
                      <div className="flex items-center gap-1">
                        <Icon name="Clock" size={12} />
                        <span>{recipe.cooking_time} mins</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                    <span>
                      {new Date(recipe.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  {/* ✅ View Button (same logic as before) */}
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full justify-center mt-auto"
                    iconName="Eye"
                    onClick={() => setSelectedRecipeId(recipe.indg_recipe_id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ===== Global Footer ===== */}
      <Footer />
    </div>
  );
};

export default CommunityRecipes;
