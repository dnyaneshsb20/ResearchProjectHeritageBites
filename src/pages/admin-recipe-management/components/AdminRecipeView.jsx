import React, { useState, useEffect } from "react";
import Button from "../../../components/ui/Button";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import { supabase } from "../../../supabaseClient";
import toast from "react-hot-toast";
import { FaFire, FaDrumstickBite, FaEgg, FaBreadSlice, FaTint, FaAppleAlt } from "react-icons/fa";

const AdminRecipeView = ({ recipe: initialRecipe, onClose, onApprove, onReject, onRequestModification }) => {
  const [recipe, setRecipe] = useState(initialRecipe || null);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Request changes modal state
  const [showChangesModal, setShowChangesModal] = useState(false);
  const [changeReason, setChangeReason] = useState("");
  const nutrientIcons = {
    calories: <FaFire className="text-yellow-500 w-6 h-6" />,
    protein: <FaDrumstickBite className="text-red-500 w-6 h-6" />,
    fat: <FaEgg className="text-orange-500 w-6 h-6" />,
    carbohydrates: <FaBreadSlice className="text-yellow-600 w-6 h-6" />,
    water: <FaTint className="text-blue-400 w-6 h-6" />,
    fiber: <FaAppleAlt className="text-green-500 w-6 h-6" />,
  };
  const recipeId = initialRecipe?.indg_recipe_id;

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipeDetails = async () => {
      const { data, error } = await supabase
        .from("rec_contributions")
        .select(`
          *,
          created_by:users(user_id, name),
          state_id:states(state_id, state_name, region)
        `)
        .eq("indg_recipe_id", recipeId)
        .single();

      if (error) {
        console.error("Error fetching recipe:", error);
        toast.error("Failed to load recipe.");
        return;
      }

      setRecipe({
        ...data,
        contributorName: data.created_by?.name || "Anonymous",
        region: data.state_id?.state_name || "Unknown",
      });
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (!recipe) return <p className="text-center mt-10">Loading recipe...</p>;

  const handleStatusUpdate = async (newStatus, reason) => {
    if (!recipe.indg_recipe_id) return;
    setUpdating(true);

    const { error } = await supabase
      .from("rec_contributions")
      .update({
        status: newStatus,
        review_reason: reason || null,
        reviewed_by: (await supabase.auth.getUser()).data.user?.id || null,
      })
      .eq("indg_recipe_id", recipe.indg_recipe_id);

    if (error) {
      toast.error("Error updating status: " + error.message);
    } else {
      toast.success(`Recipe ${newStatus} successfully!`);
      if (newStatus === "approved") onApprove(recipe.indg_recipe_id);
      else if (newStatus === "rejected") onReject(recipe.indg_recipe_id);
      else if (newStatus === "changes requested") onRequestModification(recipe.indg_recipe_id);

      // Close both modals if changes requested
      setShowChangesModal(false);
      onClose();
      setChangeReason("");
    }

    setUpdating(false);
  };

  const nutrition = recipe?.nutrition_info || {};
  const ingredients = recipe?.ingredients || [];
  const instructions = recipe?.instructions || [];

  const formatTime = (time) => (time ? `${time} mins` : "Not specified");

  const tabs = [
    { id: "overview", label: "Overview", icon: "FileText" },
    { id: "ingredients", label: "Ingredients", icon: "List" },
    { id: "instructions", label: "Instructions", icon: "BookOpen" },
    { id: "nutrition", label: "Nutrition", icon: "Heart" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
      <div className="bg-card rounded-xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden mt-18">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-4">
            {recipe.image_url && (
              <div className="w-28 h-28 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                <Image src={recipe.image_url} alt={recipe.name} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-foreground">{recipe.name}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {recipe.meal_type || recipe.dietary_type} • {recipe.region || "Unknown"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Submitted by <span className="font-medium">{recipe.contributorName || "Anonymous"}</span>
              </p>

              {/* Status Buttons */}
              <div className="flex gap-2 mt-3">
                <Button variant="default" disabled={updating} onClick={() => handleStatusUpdate("approved")}>
                  <Icon name="Check" size={16} /> Approve
                </Button>
                <Button variant="destructive" disabled={updating} onClick={() => handleStatusUpdate("rejected")}>
                  <Icon name="X" size={16} /> Reject
                </Button>
                <Button variant="outline" disabled={updating} onClick={() => setShowChangesModal(true)}>
                  <Icon name="Edit" size={16} /> Request Changes
                </Button>
              </div>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={24} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-muted/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex justify-center items-center py-3 text-sm font-semibold transition-all border-b-2 ${activeTab === tab.id
                ? "border-primary text-primary bg-background"
                : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              <Icon name={tab.icon} size={18} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {activeTab === "overview" && (
            <div className="space-y-4">
              <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
              <p className="text-muted-foreground leading-relaxed font-medium">
                {recipe.origin_story || recipe.family_tradition || recipe.heritage_significance}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{formatTime(recipe.prep_time)}</p>
                  <p className="text-xs text-muted-foreground">Prep Time</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Icon name="ChefHat" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{formatTime(recipe.cooking_time)}</p>
                  <p className="text-xs text-muted-foreground">Cook Time</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{recipe.serves || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Servings</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <Icon name="Flame" size={24} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-medium">{recipe.difficulty_level || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="space-y-2">
              {ingredients.map((ing, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-center bg-gray-50 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Ingredient Name on the Left */}
                  <span className="font-semibold text-gray-800">{ing.name}</span>

                  {/* Quantity + Notes on the Right */}
                  <div className="text-right">
                    <span className="font-medium text-gray-700">{ing.quantity}</span>
                    {ing.notes && (
                      <div className="text-xs italic text-gray-500">({ing.notes})</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "instructions" && (
            <ol className="space-y-6">
              {instructions.map((step, idx) => (
                <li
                  key={idx}
                  className="bg-white rounded-2xl p-5 shadow-lg hover:shadow-xl transition-shadow flex flex-col md:flex-row gap-5 border border-gray-100"
                >
                  {/* Step Number */}
                  <div className="flex-shrink-0 w-12 h-12 md:w-14 md:h-14 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg md:text-xl font-bold shadow">
                    {idx + 1}
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 space-y-3">
                    {/* Main step instruction */}
                    <p className="text-gray-900 leading-relaxed text-base md:text-lg font-medium">{step.step || step}</p>

                    {/* Optional description / notes */}
                    {step.description && (
                      <p className="text-gray-500 text-sm md:text-base italic">{step.description}</p>
                    )}

                    {/* Step image */}
                    {step.image && (
                      <div className="w-full h-48 md:h-44 lg:h-48 overflow-hidden rounded-xl shadow-sm">
                        <Image
                          src={step.image}
                          alt={`Step ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {activeTab === "nutrition" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Object.entries(nutrition).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-50 rounded-xl p-6 flex flex-col items-center justify-center shadow-md hover:shadow-lg transition-shadow h-40"
                >
                  {/* Icon */}
                  <div className="mb-3">
                    {nutrientIcons[key.toLowerCase()] || <FaAppleAlt className="text-gray-400 w-6 h-6" />}
                  </div>

                  {/* Nutrient Value */}
                  <p className="text-2xl font-bold text-gray-800">{value}</p>

                  {/* Nutrient Name */}
                  <p className="text-sm capitalize text-gray-500 mt-1">{key.replace("_", " ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Changes Modal */}
        {showChangesModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/50">
            <div className="bg-card rounded-xl shadow-2xl max-w-lg w-full p-6 flex flex-col space-y-4">
              <h3 className="text-xl font-bold">Changes Needed</h3>
              <textarea
                className="w-full p-3 border border-border rounded-md resize-none"
                rows={4}
                placeholder="Please describe why this recipe needs changes"
                value={changeReason}
                onChange={(e) => setChangeReason(e.target.value)}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="default"
                  disabled={updating || !changeReason.trim()}
                  onClick={() => handleStatusUpdate("changes requested", changeReason)}
                >
                  Submit
                </Button>
                <Button variant="outline" disabled={updating} onClick={() => setShowChangesModal(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecipeView;
