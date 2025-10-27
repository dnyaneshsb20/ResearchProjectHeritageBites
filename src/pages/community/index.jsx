import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Button from "../../components/ui/Button";
import Icon from "../../components/AppIcon";
import UserRecipeView from "./UserRecipeView"; // ✅ import the detailed view component

const CommunityRecipes = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState(null); // ✅ track selected recipe

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

  // ✅ When a recipe is selected, render UserRecipeView
  if (selectedRecipeId) {
    return (
      <UserRecipeView
        recipeId={selectedRecipeId}
        onBack={() => setSelectedRecipeId(null)} // go back to list
      />
    );
  }

  if (loading)
    return (
      <p className="text-center text-muted-foreground mt-10">
        Loading community recipes...
      </p>
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-bold">Community Recipes</h2>
        <Button variant="primary" iconName="RefreshCcw" onClick={fetchCommunityRecipes}>
          Refresh
        </Button>
      </div>

      {/* Recipe Grid */}
      {recipes.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">
          No community recipes have been shared yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.indg_recipe_id}
              className="bg-card rounded-xl shadow-sm overflow-hidden border relative group transition hover:shadow-md"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={recipe.image_url || "/placeholder-image.jpg"}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Approved
                </span>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-lg truncate">{recipe.name}</h3>

                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {recipe.description || "A delicious traditional recipe."}
                </p>

                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-3">
                  {recipe.states?.region && (
                    <>
                      <Icon name="MapPin" size={12} />
                      <span>{recipe.states.region}</span>
                    </>
                  )}
                  {recipe.meal_type && (
                    <>
                      <Icon name="Utensils" size={12} />
                      <span>{recipe.meal_type}</span>
                    </>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Icon name="Clock" size={12} />
                    <span>
                      {recipe.cooking_time
                        ? `${recipe.cooking_time} mins`
                        : "Time not specified"}
                    </span>
                  </div>
                  <span>
                    {new Date(recipe.created_at).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                {/* ✅ View button opens UserRecipeView */}
                <div className="flex justify-center border-t pt-4 mt-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    iconName="Eye"
                    onClick={() => setSelectedRecipeId(recipe.indg_recipe_id)}
                  >
                    View
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommunityRecipes;
