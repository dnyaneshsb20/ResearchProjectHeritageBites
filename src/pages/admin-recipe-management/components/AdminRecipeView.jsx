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
    calories: <FaFire className="text-yellow-500 w-5 h-5" />,
    protein: <FaDrumstickBite className="text-red-500 w-5 h-5" />,
    fat: <FaEgg className="text-orange-500 w-5 h-5" />,
    carbohydrates: <FaBreadSlice className="text-yellow-600 w-5 h-5" />,
    water: <FaTint className="text-blue-400 w-5 h-5" />,
    fiber: <FaAppleAlt className="text-green-500 w-5 h-5" />,
  };
  const recipeId = initialRecipe?.indg_recipe_id;

  useEffect(() => {
    if (!recipeId) return;

    const fetchRecipeDetails = async () => {
      const { data, error } = await supabase
        .from("rec_contributions")
        .select(`
          *,
          users!rec_contributions_created_by_fkey(user_id, name),
          states!rec_contributions_state_id_fkey(state_id, state_name, region)
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
        contributorName: data.users?.name || "Anonymous",
        region: data.states?.state_name || "Unknown",
      });
    };

    fetchRecipeDetails();
  }, [recipeId]);

  if (!recipe) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50">
      <div className="bg-card rounded-xl shadow-2xl max-w-5xl w-full h-[85vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">Loading recipe details...</p>
        </div>
      </div>
    </div>
  );

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 pt-24">
      <div className="bg-card rounded-xl shadow-2xl max-w-5xl w-full h-[85vh] flex flex-col overflow-hidden border border-border">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-border bg-card">
          <div className="flex items-start gap-4 flex-1">
            {recipe.image_url && (
              <div className="w-20 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                <Image 
                  src={recipe.image_url} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h2 className="text-2xl font-semibold text-foreground truncate">{recipe.name}</h2>
                  <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Icon name="MapPin" size={14} />
                      {recipe.region || "Unknown"}
                    </span>
                    <span>•</span>
                    <span>{recipe.meal_type || recipe.dietary_type}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Icon name="User" size={14} />
                      {recipe.contributorName || "Anonymous"}
                    </span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 ml-4 flex-shrink-0">
                  <Button 
                    variant="default"
                    size="sm"
                    disabled={updating} 
                    onClick={() => handleStatusUpdate("approved")}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Icon name="Check" size={16} /> Approve
                  </Button>
                  <Button 
                    variant="default"
                    size="sm"
                    disabled={updating} 
                    onClick={() => setShowChangesModal(true)}
                    className="bg-amber-500 hover:bg-amber-600"
                  >
                    <Icon name="Edit" size={16} /> Changes
                  </Button>
                  <Button 
                    variant="destructive"
                    size="sm"
                    disabled={updating} 
                    onClick={() => handleStatusUpdate("rejected")}
                  >
                    <Icon name="X" size={16} /> Reject
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="ml-4 hover:bg-accent"
          >
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border bg-card">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex justify-center items-center py-4 text-sm font-medium transition-all border-b-2 ${
                activeTab === tab.id
                  ? "border-primary text-primary bg-background"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary hover:text-white"
              }`}
            >
              <Icon name={tab.icon} size={16} className="mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-background">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-6">
                <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
                
                {(recipe.origin_story || recipe.family_tradition || recipe.heritage_significance) && (
                  <>
                    <h3 className="text-lg font-semibold text-foreground mt-6 mb-3">Cultural Significance</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {recipe.origin_story || recipe.family_tradition || recipe.heritage_significance}
                    </p>
                  </>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-sm transition-shadow">
                  <Icon name="Clock" size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{formatTime(recipe.prep_time)}</p>
                  <p className="text-xs text-muted-foreground">Prep Time</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-sm transition-shadow">
                  <Icon name="ChefHat" size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{formatTime(recipe.cooking_time)}</p>
                  <p className="text-xs text-muted-foreground">Cook Time</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-sm transition-shadow">
                  <Icon name="Users" size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{recipe.serves || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Servings</p>
                </div>
                <div className="bg-card rounded-lg border border-border p-4 text-center hover:shadow-sm transition-shadow">
                  <Icon name="Flame" size={20} className="text-primary mx-auto mb-2" />
                  <p className="text-sm font-semibold text-foreground">{recipe.difficulty_level || "N/A"}</p>
                  <p className="text-xs text-muted-foreground">Difficulty</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === "ingredients" && (
            <div className="bg-card rounded-lg border border-border overflow-hidden">
              <div className="px-6 py-4 border-b border-border bg-muted/50">
                <h3 className="text-lg font-semibold text-foreground">Ingredients</h3>
              </div>
              <div className="divide-y divide-border">
                {ingredients.map((ing, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-center px-6 py-4 hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="font-medium text-foreground">{ing.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-foreground">{ing.quantity}</span>
                      {ing.notes && (
                        <div className="text-sm text-muted-foreground mt-1">{ing.notes}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "instructions" && (
            <div className="space-y-4">
              {instructions.map((step, idx) => (
                <div
                  key={idx}
                  className="bg-card rounded-lg border border-border p-6 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-foreground font-medium leading-relaxed">{step.step || step}</p>
                      {step.description && (
                        <p className="text-muted-foreground text-sm mt-2 leading-relaxed">{step.description}</p>
                      )}
                      {step.image && (
                        <div className="mt-3 w-full max-w-xs overflow-hidden rounded-lg border border-border">
                          <Image
                            src={step.image}
                            alt={`Step ${idx + 1}`}
                            className="w-full h-32 object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "nutrition" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(nutrition).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-card rounded-lg border border-border p-4 hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted rounded-lg">
                      {nutrientIcons[key.toLowerCase()] || <FaAppleAlt className="text-muted-foreground w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-foreground">{value}</p>
                      <p className="text-sm capitalize text-muted-foreground">
                        {key.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Request Changes Modal */}
        {showChangesModal && (
          <div className="fixed inset-0 z-60 flex items-center justify-center p-6 bg-black/50">
            <div className="bg-card rounded-xl shadow-2xl max-w-lg w-full border border-border">
              <div className="p-6 border-b border-border">
                <h3 className="text-xl font-semibold text-foreground">Request Changes</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  Provide specific feedback on what needs to be modified
                </p>
              </div>
              <div className="p-6">
                <textarea
                  className="w-full p-3 border border-border rounded-lg resize-none bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  rows={4}
                  placeholder="Please describe why this recipe needs changes and what specific modifications are required..."
                  value={changeReason}
                  onChange={(e) => setChangeReason(e.target.value)}
                />
                <div className="flex justify-end gap-3 mt-4">
                  <Button 
                    variant="outline" 
                    disabled={updating} 
                    onClick={() => setShowChangesModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="bg-amber-500 hover:bg-amber-600"
                    disabled={updating || !changeReason.trim()} 
                    onClick={() => handleStatusUpdate("changes requested", changeReason)}
                  >
                    Request Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRecipeView;