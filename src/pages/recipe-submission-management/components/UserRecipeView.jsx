import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";

const UserRecipeView = ({ recipeId, onBack, onEdit }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("rec_contributions")
        .select(`
          *,
          states (state_name, region)
        `)
        .eq("indg_recipe_id", recipeId)
        .single();

      if (error) console.error("Error fetching recipe:", error);
      else setRecipe(data);
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  const nutrition = recipe?.nutrition_info || {};
  const ingredients = recipe?.ingredients || [];
  const instructions = recipe?.instructions || [];

  const formatList = (arr) =>
    Array.isArray(arr) && arr.length > 0 ? arr.join(", ") : "None specified";

  const formatTime = (time) => (time ? `${time} mins` : "Not specified");

  return (
    <div className="max-w-5xl mx-auto mt-8 bg-card rounded-xl shadow p-6">
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack} iconName="ArrowLeft">
          Back
        </Button>
        <Button
          variant="secondary"
          iconName="Edit3"
          onClick={() => onEdit(recipe.indg_recipe_id)}
        >
          Edit Recipe
        </Button>
      </div>

      {/* Hero Image */}
      {recipe.image_url && (
        <div className="relative mb-6">
          <Image
            src={recipe.image_url}
            alt={recipe.name}
            className="w-full h-72 object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
          <div className="absolute bottom-4 left-4 text-white">
            <h1 className="text-3xl font-heading font-bold mb-1">
              {recipe.name}
            </h1>
            {recipe.description && (
              <p className="text-sm opacity-90 max-w-lg">{recipe.description}</p>
            )}
          </div>
        </div>
      )}

      {/* Quick Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Clock" size={20} className="mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Prep Time</p>
          <p className="font-body font-medium">{formatTime(recipe.prep_time)}</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="ChefHat" size={20} className="mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Cook Time</p>
          <p className="font-body font-medium">{formatTime(recipe.cooking_time)}</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Users" size={20} className="mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Serves</p>
          <p className="font-body font-medium">{recipe.serves || "N/A"}</p>
        </div>
        <div className="text-center p-3 bg-muted rounded-lg">
          <Icon name="Flame" size={20} className="mx-auto mb-1 text-primary" />
          <p className="text-xs text-muted-foreground">Difficulty</p>
          <p className="font-body font-medium capitalize">
            {recipe.difficulty_level || "N/A"}
          </p>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {recipe?.states?.state_name && (
          <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
            {recipe.states.state_name}
          </span>
        )}
        {recipe.meal_type && (
          <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
            {recipe.meal_type}
          </span>
        )}
        {(recipe.dietary_categories || []).map((diet) => (
          <span
            key={diet}
            className="px-3 py-1 bg-success text-success-foreground text-xs font-medium rounded-full"
          >
            {diet}
          </span>
        ))}
      
      {/* Extra tags (below existing ones) */}
      {recipe.festival_tag && (
        <span className="px-3 py-1 bg-accent text-accent-foreground text-xs font-medium rounded-full">
          {recipe.festival_tag}
        </span>
      )}
      {recipe.dietary_type && (
        <span className="px-3 py-1 bg-info text-info-foreground text-xs font-medium rounded-full">
          {recipe.dietary_type}
        </span>
      )}
      {(recipe.associated_festivals || []).map((fest) => (
        <span
          key={fest}
          className="px-3 py-1 bg-warning text-warning-foreground text-xs font-medium rounded-full"
        >
          {fest}
        </span>
      ))}
</div>
      {/* Ingredients & Nutrition */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
        <div>
          <h3 className="text-lg font-heading font-semibold mb-3">
            Ingredients ({ingredients.length})
          </h3>
          {ingredients.length > 0 ? (
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex items-center space-x-3 p-2 bg-muted rounded"
                >
                  <div className="w-2 h-2 bg-primary rounded-full" />
                  <span className="font-body font-medium">{ing.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {ing.quantity} {ing.unit}
                  </span>
                  {ing.notes && (
                    <span className="text-xs italic text-muted-foreground">
                      ({ing.notes})
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No ingredients added</p>
          )}
        </div>

        <div>
          <h3 className="text-lg font-heading font-semibold mb-3">
            Nutrition (per serving)
          </h3>
          {Object.keys(nutrition).length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(nutrition).map(([key, val]) => (
                <div key={key} className="p-3 bg-muted rounded">
                  <p className="text-xs text-muted-foreground capitalize">
                    {key.replace("_", " ")}
                  </p>
                  <p className="font-body font-medium">{val}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No nutrition data provided</p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-8">
        <h3 className="text-lg font-heading font-semibold mb-3">
          Instructions ({instructions.length})
        </h3>
        {instructions.length > 0 ? (
          <div className="space-y-4">
            {instructions.map((step, idx) => (
              <div key={idx} className="flex space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <h4 className="font-body font-medium mb-1">{step.step}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    {step.description}
                  </p>
                  {step.image && (
                    <Image
                      src={step.image}
                      alt={`Step ${idx + 1}`}
                      className="w-full max-w-md h-32 object-cover rounded mb-2"
                    />
                  )}
                  {step.tips && (
                    <div className="p-2 bg-warning/10 rounded text-xs text-warning-foreground">
                      <Icon name="Lightbulb" size={12} className="inline mr-1" />
                      {step.tips}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">No instructions added</p>
        )}
      </div>

      {/* Cultural Heritage */}
      {(recipe.origin_story ||
        recipe.family_tradition ||
        recipe.heritage_significance) && (
          <div className="mt-10 pt-6 border-t border-border">
            <h3 className="text-lg font-heading font-semibold mb-4">
              Cultural Heritage
            </h3>
            <div className="space-y-4">
              {recipe.origin_story && (
                <div>
                  <h4 className="font-medium mb-1">History & Origin</h4>
                  <p className="text-sm text-muted-foreground">
                    {recipe.origin_story}
                  </p>
                </div>
              )}
              {recipe.family_tradition && (
                <div>
                  <h4 className="font-medium mb-1">Family Traditions</h4>
                  <p className="text-sm text-muted-foreground">
                    {recipe.family_tradition}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {recipe.recipe_source}
                  </p>
                </div>
              )}
              {recipe.heritage_significance && (
                <div>
                  <h4 className="font-medium mb-1">Cultural Significance</h4>
                  <p className="text-sm text-muted-foreground">
                    {recipe.heritage_significance}
                  </p>
                </div>
              )}
            </div>
          </div>
          
        )}
    </div>
    
  );
};

export default UserRecipeView;
