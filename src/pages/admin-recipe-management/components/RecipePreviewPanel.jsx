import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import { Checkbox } from "../../../components/ui/Checkbox";

const RecipePreviewPanel = ({
  recipeId,
  onClose,
  onApprove,
  onReject,
  onRequestModification,
}) => {
  const [recipe, setRecipe] = useState(null);
  const [checkedItems, setCheckedItems] = useState({
    authenticity: false,
    ingredients: false,
    instructions: false,
    cultural: false,
    images: false,
    nutrition: false,
  });
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ Fetch recipe details
  useEffect(() => {
    if (!recipeId) return;
    console.log("Fetching recipeId:", recipeId);

    const fetchRecipe = async () => {
      const { data, error } = await supabase
        .from("rec_contributions")
        .select(`
          indg_recipe_id,
          name,
          description,
          image_url,
          meal_type,
          festival_tag,
          dietary_type,
          difficulty_level,
          prep_time,
          cooking_time,
          serves,
          ingredients,
          instructions,
          origin_story,
          heritage_significance,
          family_tradition,
          recipe_source,
          regional_variations,
          associated_festivals,
          additional_notes,
          nutrition_info,
          health_considerations,
          status,
          created_at,
          created_by:users(name, rating),
          state_id:states(state_name)
        `)
        .eq("indg_recipe_id", recipeId)
        .single();

      if (error) {
        console.error("Error fetching recipe details:", error);
      } else {
        setRecipe({
          id: data.indg_recipe_id,
          title: data.name,
          description: data.description,
          image: data.image_url,
          region: data.state_id?.state_name || "Unknown",
          category: data.meal_type || data.dietary_type,
          contributorName: data.created_by?.name || "Anonymous",
          rating: data.created_by?.rating || 0,
          submissionDate: data.created_at,
          cookTime: `${data.cooking_time || 0} mins`,
          servings: data.serves || 0,
          difficulty: data.difficulty_level || "N/A",
          culturalBackground:
            data.origin_story ||
            data.heritage_significance ||
            data.family_tradition ||
            data.recipe_source ||
            data.regional_variations ||
            "Not specified",
          ingredients: Array.isArray(data.ingredients)
            ? data.ingredients
            : Object.values(data.ingredients || {}),
          instructions: Array.isArray(data.instructions)
            ? data.instructions
            : Object.values(data.instructions || {}),
          nutrition: data.nutrition_info || {},
          healthBenefits: data.health_considerations || [],
        });
      }
    };

    fetchRecipe();
  }, [recipeId]);

  const verificationChecklist = [
    { id: "authenticity", label: "Recipe Authenticity", description: "Traditional preparation method verified" },
    { id: "ingredients", label: "Ingredient Accuracy", description: "All ingredients are authentic and correctly listed" },
    { id: "instructions", label: "Instruction Clarity", description: "Steps are clear and easy to follow" },
    { id: "cultural", label: "Cultural Context", description: "Cultural background and significance provided" },
    { id: "images", label: "Image Quality", description: "High-quality images showing preparation steps" },
    { id: "nutrition", label: "Nutritional Information", description: "Accurate nutritional data and health benefits" },
  ];

  const handleChecklistChange = (id, checked) => {
    setCheckedItems(prev => ({ ...prev, [id]: checked }));
  };

  const getCompletionPercentage = () => {
    const checkedCount = Object.values(checkedItems).filter(Boolean).length;
    return Math.round((checkedCount / verificationChecklist.length) * 100);
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "FileText" },
    { id: "ingredients", label: "Ingredients", icon: "List" },
    { id: "instructions", label: "Instructions", icon: "BookOpen" },
    { id: "nutrition", label: "Nutrition", icon: "Heart" },
  ];

  if (!recipe) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pointer-events-auto">
        <div className="bg-card p-6 rounded-lg shadow-lg text-center pointer-events-auto">
          <p className="text-muted-foreground">Loading recipe details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 pointer-events-auto">
      <div className="bg-card rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex overflow-hidden pointer-events-auto">
        {/* Main content + Sidebar */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted">
                <Image src={recipe.image} alt={recipe.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">{recipe.title}</h2>
                <p className="text-muted-foreground">{recipe.category} • {recipe.region}</p>
                <p className="text-sm text-muted-foreground">
                  Submitted by {recipe.contributorName} on {new Date(recipe.submissionDate).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}><Icon name="X" size={20} /></Button>
          </div>

          {/* Tabs + Content */}
          <div className="flex-1 flex overflow-hidden">
            {/* Tab buttons */}
            <div className="flex flex-col flex-1 overflow-y-auto">
              <div className="flex border-b border-border bg-muted/30 flex-shrink-0">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium transition-colors ${activeTab === tab.id ? "text-primary border-b-2 border-primary bg-background" : "text-muted-foreground hover:text-foreground"}`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 overflow-y-auto">
                {activeTab === "overview" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Description</h3>
                      <p className="text-muted-foreground leading-relaxed">{recipe.description}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Cultural Background</h3>
                      <p className="text-muted-foreground leading-relaxed">{recipe.culturalBackground}</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <Icon name="Clock" size={24} className="text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{recipe.cookTime}</p>
                        <p className="text-xs text-muted-foreground">Cook Time</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <Icon name="Users" size={24} className="text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{recipe.servings}</p>
                        <p className="text-xs text-muted-foreground">Servings</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <Icon name="TrendingUp" size={24} className="text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{recipe.difficulty}</p>
                        <p className="text-xs text-muted-foreground">Difficulty</p>
                      </div>
                      <div className="bg-muted rounded-lg p-4 text-center">
                        <Icon name="Star" size={24} className="text-primary mx-auto mb-2" />
                        <p className="text-sm font-medium">{recipe.rating}/5</p>
                        <p className="text-xs text-muted-foreground">Rating</p>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "ingredients" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ingredients</h3>
                    <div className="space-y-3">
                      {recipe.ingredients.map((ing, i) => (
                        <div key={i} className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span className="font-medium">{ing.quantity}</span>
                          <span className="text-muted-foreground">{ing.name}</span>
                          {ing.notes && <span className="text-xs italic text-muted-foreground">({ing.notes})</span>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "instructions" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Instructions</h3>
                    <div className="space-y-4">
                      {recipe.instructions.map((step, i) => (
                        <div key={i} className="flex space-x-4">
                          <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">{i + 1}</div>
                          <div className="flex-1">
                            <p className="leading-relaxed">{step}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === "nutrition" && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Nutritional Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(recipe.nutrition).map(([key, value]) => (
                        <div key={key} className="bg-muted rounded-lg p-4 text-center">
                          <p className="text-lg font-semibold">{value}</p>
                          <p className="text-sm capitalize text-muted-foreground">{key.replace(/([A-Z])/g, " $1")}</p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-6">
                      <h4 className="text-md font-semibold mb-2">Health Benefits</h4>
                      <ul className="space-y-2">
                        {recipe.healthBenefits.map((b, i) => (
                          <li key={i} className="flex items-start space-x-2">
                            <Icon name="Check" size={16} className="text-success mt-0.5" />
                            <span className="text-muted-foreground">{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-80 border-l border-border bg-muted/30 overflow-y-auto flex-shrink-0 p-6 pointer-events-auto">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold">Verification</h3>
                  <span className="text-sm font-medium text-primary">{getCompletionPercentage()}%</span>
                </div>
                <div className="w-full bg-border rounded-full h-2">
                  <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: `${getCompletionPercentage()}%` }}></div>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                {verificationChecklist.map(item => (
                  <div key={item.id} className="space-y-2">
                    <Checkbox
                      label={item.label}
                      checked={checkedItems[item.id]}
                      onChange={e => handleChecklistChange(item.id, e.target.checked)}
                    />
                    <p className="text-xs text-muted-foreground ml-6">{item.description}</p>
                  </div>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">Review Comments</label>
                <textarea
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Add comments for the contributor..."
                  className="w-full h-24 px-3 py-2 border border-border rounded-lg bg-background text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-2">
                <Button variant="default" fullWidth onClick={() => onApprove(recipe.id)} disabled={getCompletionPercentage() < 100}>
                  <Icon name="Check" size={16} /><span className="ml-2">Approve Recipe</span>
                </Button>
                <Button variant="outline" fullWidth onClick={() => onRequestModification(recipe.id)}>
                  <Icon name="Edit" size={16} /><span className="ml-2">Request Changes</span>
                </Button>
                <Button variant="destructive" fullWidth onClick={() => onReject(recipe.id)}>
                  <Icon name="X" size={16} /><span className="ml-2">Reject Recipe</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipePreviewPanel;
