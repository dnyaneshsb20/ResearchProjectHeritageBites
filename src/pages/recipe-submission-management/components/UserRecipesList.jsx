import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";

const UserRecipesList = ({ onNewRecipe }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user recipes
  useEffect(() => {
    fetchUserRecipes();
  }, []);

  const fetchUserRecipes = async () => {
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }

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
      .eq("created_by", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching recipes:", error);
    } else {
      setRecipes(data);
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <p className="text-center text-muted-foreground">Loading recipes...</p>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-heading font-bold">My Recipe Contributions</h2>
        <Button onClick={onNewRecipe} variant="primary" iconName="Plus">
          Submit New Recipe
        </Button>
      </div>

      {/* Recipe Cards */}
      {recipes.length === 0 ? (
        <p className="text-center text-muted-foreground mt-8">
          You haven't submitted any recipes yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => (
            <div
              key={recipe.recipe_id}
              className="bg-card rounded-xl shadow-sm overflow-hidden border relative group transition hover:shadow-md"
            >
              {/* Recipe image */}
              <div className="relative">
                <img
                  src={recipe.image_url || "/placeholder-image.jpg"}
                  alt={recipe.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-3 right-3 bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Published
                </span>
              </div>

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
                <div className="flex justify-between items-center gap-3 border-t pt-4 mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => onViewRecipe?.(recipe.recipe_id)}
                    iconName="Eye"
                  >
                    View
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full justify-center"
                    onClick={() => onEditRecipe?.(recipe.recipe_id)}
                    iconName="Edit3"
                  >
                    Edit
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

export default UserRecipesList;
