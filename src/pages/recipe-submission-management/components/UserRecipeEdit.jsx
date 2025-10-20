import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

const UserRecipeEdit = ({ recipeId, onBack }) => {
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("rec_contributions")
        .select("*")
        .eq("indg_recipe_id", recipeId)
        .single();
      if (error) console.error("Error fetching recipe:", error);
      else setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
  }, [recipeId]);

  const handleChange = (field, value) => {
    setRecipe((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!recipe.name) return toast.error("Recipe name is required.");
    setSaving(true);

    const { error } = await supabase
      .from("rec_contributions")
      .update({
        name: recipe.name,
        description: recipe.description,
        prep_time: recipe.prep_time,
        cooking_time: recipe.cooking_time,
        serves: recipe.serves,
        meal_type: recipe.meal_type,
        dietary_type: recipe.dietary_type,
        festival_tag: recipe.festival_tag,
        difficulty_level: recipe.difficulty_level,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        nutrition_info: recipe.nutrition_info,
        origin_story: recipe.origin_story,
        heritage_significance: recipe.heritage_significance,
        family_tradition: recipe.family_tradition,
        recipe_source: recipe.recipe_source,
      })
      .eq("indg_recipe_id", recipeId);

    setSaving(false);

    if (error) toast.error("Error saving recipe: " + error.message);
    else {
      toast.success("Recipe updated successfully!");
      onBack();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!recipe) return <p>Recipe not found.</p>;

  return (
    <div className="max-w-3xl mx-auto mt-8 bg-card rounded-xl shadow p-6">
      <Button variant="ghost" onClick={onBack} iconName="ArrowLeft">
        Back
      </Button>
      <h2 className="text-2xl font-bold mb-4">Edit Recipe</h2>

      <label className="block mb-2">Recipe Name</label>
      <input
        className="w-full border rounded p-2 mb-4"
        value={recipe.name || ""}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <label className="block mb-2">Description</label>
      <textarea
        className="w-full border rounded p-2 mb-4"
        value={recipe.description || ""}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <label className="block mb-2">Cooking Time (mins)</label>
      <input
        type="number"
        className="w-full border rounded p-2 mb-4"
        value={recipe.cooking_time || ""}
        onChange={(e) => handleChange("cooking_time", e.target.value)}
      />

      <label className="block mb-2">Preparation Time (mins)</label>
      <input
        type="number"
        className="w-full border rounded p-2 mb-4"
        value={recipe.prep_time || ""}
        onChange={(e) => handleChange("prep_time", e.target.value)}
      />

      <label className="block mb-2">Meal Type</label>
      <input
        className="w-full border rounded p-2 mb-4"
        value={recipe.meal_type || ""}
        onChange={(e) => handleChange("meal_type", e.target.value)}
      />

      <label className="block mb-2">Festival Tag</label>
      <input
        className="w-full border rounded p-2 mb-4"
        value={recipe.festival_tag || ""}
        onChange={(e) => handleChange("festival_tag", e.target.value)}
      />

      <Button variant="primary" onClick={handleSave} disabled={saving}>
        {saving ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
};

export default UserRecipeEdit;
