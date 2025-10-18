import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import { Utensils, ChefHat, Salad, ScrollText } from "lucide-react";

const UserRecipeView = ({ recipeId, onBack, onEdit }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("rec_contributions")
        .select("*")
        .eq("indg_recipe_id", recipeId)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error.message);
      } else {
        setRecipe(data);
      }
      setLoading(false);
    };

    fetchRecipe();
  }, [recipeId]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!recipe) return <p className="text-center mt-10">Recipe not found.</p>;

  const nutrition = recipe?.nutrition_info || {};
  const ingredients = recipe?.ingredients || [];
  const instructions = recipe?.instructions || [];

  const formatTime = (time) => (time ? `${time} mins` : "Not specified");

  return (
    <div className="relative max-w-6xl mx-auto">
      {/* Sticky Back Button */}
      <div className="fixed top-20 left-14 z-50 mt-5">
        <Button variant="ghost2" onClick={onBack} iconName="ArrowLeft">
          Back
        </Button>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Hero Image + Tags */}
        {recipe.image_url && (
          <div className="relative">
            <Image
              src={recipe.image_url}
              alt={recipe.name}
              className="w-full h-[450px] object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <h1 className="text-5xl font-bold mb-3">{recipe.name}</h1>
              {recipe.description && (
                <p className="text-lg opacity-90 max-w-3xl">
                  {recipe.description}
                </p>
              )}

              <div className="flex flex-wrap gap-2 mt-4">
                {recipe.state_name && (
                  <span className="px-3 py-1 bg-blue-600 text-white text-xs rounded-full">
                    {recipe.state_name}
                  </span>
                )}
                {recipe.meal_type && (
                  <span className="px-3 py-1 bg-purple-600 text-white text-xs rounded-full">
                    {recipe.meal_type}
                  </span>
                )}
                {(recipe.dietary_categories || []).map((diet) => (
                  <span
                    key={diet}
                    className="px-3 py-1 bg-green-600 text-white text-xs rounded-full"
                  >
                    {diet}
                  </span>
                ))}
                {recipe.festival_tag && (
                  <span className="px-3 py-1 bg-pink-600 text-white text-xs rounded-full">
                    {recipe.festival_tag}
                  </span>
                )}
                {recipe.dietary_type && (
                  <span className="px-3 py-1 bg-teal-600 text-white text-xs rounded-full">
                    {recipe.dietary_type}
                  </span>
                )}
                {(recipe.associated_festivals || []).map((fest) => (
                  <span
                    key={fest}
                    className="px-3 py-1 bg-yellow-600 text-white text-xs rounded-full"
                  >
                    {fest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recipe Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 px-6 py-8 bg-gray-50">
          {[
            { icon: "Clock", label: "Prep Time", value: formatTime(recipe.prep_time) },
            { icon: "ChefHat", label: "Cook Time", value: formatTime(recipe.cooking_time) },
            { icon: "Users", label: "Serves", value: recipe.serves || "N/A" },
            { icon: "Flame", label: "Difficulty", value: recipe.difficulty_level || "N/A" },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center justify-center bg-white shadow rounded-lg p-4 hover:shadow-md transition"
            >
              <Icon name={item.icon} size={26} className="text-primary mb-2" />
              <p className="text-sm text-gray-500">{item.label}</p>
              <p className="font-semibold">{item.value}</p>
            </div>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-8 space-y-12">
          {/* Ingredients Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b-2 border-primary pb-2 w-fit">
              <Utensils className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-semibold">Ingredients</h2>
            </div>
            {ingredients.length > 0 ? (
              <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {ingredients.map((ing, idx) => (
                  <li
                    key={idx}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <p className="font-medium">{ing.name}</p>
                    <p className="text-sm text-gray-600">
                      {ing.quantity} {ing.unit}
                    </p>
                    {ing.notes && (
                      <p className="text-xs italic text-gray-400 mt-1">
                        ({ing.notes})
                      </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-400">No ingredients available.</p>
            )}
          </section>

          {/* Instructions Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b-2 border-primary pb-2 w-fit">
              <ChefHat className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-semibold">Cooking Instructions</h2>
            </div>
            {instructions.length > 0 ? (
              <ol className="space-y-8">
                {instructions.map((step, idx) => (
                  <li
                    key={idx}
                    className="flex flex-col md:flex-row items-start gap-6 bg-gray-50 p-5 rounded-lg shadow-sm hover:shadow-md transition"
                  >
                    <div className="flex items-center justify-center w-10 h-10 bg-primary text-white font-semibold rounded-full">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{step.step}</h4>
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                      {step.image && (
                        <Image
                          src={step.image}
                          alt={`Step ${idx + 1}`}
                          className="w-full max-w-md h-40 object-cover rounded shadow"
                        />
                      )}
                      {step.tips && (
                        <div className="mt-2 p-2 bg-yellow-50 rounded text-xs text-yellow-800">
                          <Icon
                            name="Lightbulb"
                            size={12}
                            className="inline mr-1"
                          />
                          {step.tips}
                        </div>
                      )}
                    </div>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-gray-400">No instructions provided.</p>
            )}
          </section>

          {/* Nutrition Section */}
          <section>
            <div className="flex items-center gap-2 mb-6 border-b-2 border-primary pb-2 w-fit">
              <Salad className="w-7 h-7 text-primary" />
              <h2 className="text-3xl font-semibold">Nutrition Information</h2>
            </div>
            {Object.keys(nutrition).length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {Object.entries(nutrition).map(([key, val]) => (
                  <div
                    key={key}
                    className="bg-gray-50 p-4 rounded-lg shadow-sm text-center hover:shadow-md transition"
                  >
                    <p className="text-xs uppercase text-gray-500">
                      {key.replace("_", " ")}
                    </p>
                    <p className="font-semibold">{val}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No nutrition data available.</p>
            )}
          </section>

          {/* Cultural Heritage Section */}
          {(recipe.origin_story ||
            recipe.family_tradition ||
            recipe.heritage_significance) && (
            <section>
              <div className="flex items-center gap-2 mb-6 border-b-2 border-primary pb-2 w-fit">
                <ScrollText className="w-7 h-7 text-primary" />
                <h2 className="text-3xl font-semibold">Cultural Heritage</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recipe.origin_story && (
                  <div className="bg-white shadow p-5 rounded-lg border-t-4 border-blue-500">
                    <h4 className="font-medium text-lg mb-2">History & Origin</h4>
                    <p className="text-sm text-gray-600">
                      {recipe.origin_story}
                    </p>
                  </div>
                )}
                {recipe.family_tradition && (
                  <div className="bg-white shadow p-5 rounded-lg border-t-4 border-green-500">
                    <h4 className="font-medium text-lg mb-2">
                      Family Traditions
                    </h4>
                    <p className="text-sm text-gray-600">
                      {recipe.family_tradition}
                    </p>
                  </div>
                )}
                {recipe.recipe_source && (
                  <div className="bg-white shadow p-5 rounded-lg border-t-4 border-yellow-500">
                    <h4 className="font-medium text-lg mb-2">Recipe Source</h4>
                    <p className="text-sm text-gray-600">
                      {recipe.recipe_source}
                    </p>
                  </div>
                )}
                {recipe.heritage_significance && (
                  <div className="bg-white shadow p-5 rounded-lg border-t-4 border-yellow-500">
                    <h4 className="font-medium text-lg mb-2">
                      Cultural Significance
                    </h4>
                    <p className="text-sm text-gray-600">
                      {recipe.heritage_significance}
                    </p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRecipeView;
