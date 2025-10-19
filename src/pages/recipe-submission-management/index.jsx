import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import ProgressIndicator from './components/ProgressIndicator';
import BasicInfoStep from './components/BasicInfoStep';
import IngredientsStep from './components/IngredientsStep';
import InstructionsStep from './components/InstructionsStep';
import CulturalContextStep from './components/CulturalContextStep';
import NutritionStep from './components/NutritionStep';
import PreviewStep from './components/PreviewStep';
import SubmissionGuidelines from './components/SubmissionGuidelines';
import UserRecipesList from './components/UserRecipesList';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import Footer from '../dashboard/components/Footer';
import { supabase } from "../../supabaseClient";
import UserRecipeView from './components/UserRecipeView';


const RecipeSubmissionManagement = () => {
  const [currentView, setCurrentView] = useState('list'); // 'list' or 'form'
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  const [currentStep, setCurrentStep] = useState(1);
  const [showGuidelines, setShowGuidelines] = useState(false);
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    const fetchRecipe = async () => {
      if (!selectedRecipeId || currentView !== "edit") return;

      const { data, error } = await supabase
        .from("rec_contributions")
        .select("*")
        .eq("indg_recipe_id", selectedRecipeId)
        .single();

      if (error) {
        console.error("❌ Error fetching recipe:", error);
      } else {
        console.log("✅ Loaded recipe for editing:", data);
        setFormData({
          // 🥘 Basic Info
          dishName: data.name || "",
          shortDescription: data.description || "",
          heroImage: data.image_url,
          state_id: data.state_id || "",
          category: data.meal_type || "",
          festivalTag: data.festival_tag || "",
          dietaryType: data.dietary_type || "",
          difficulty: data.difficulty_level || "",
          cookTime: data.cooking_time || "",
          prepTime: data.prep_time || "",
          serves: data.serves || "",

          // 🧂 Ingredients & Instructions (JSONB)
          ingredients: data.ingredients || [],
          instructions: data.instructions || [],

          // 🏺 Cultural Context
          originStory: data.origin_story || "",
          heritageSignificance: data.heritage_significance || "",
          familyTraditions: data.family_tradition || "",
          recipeSource: data.recipe_source || "",
          regionalVariations: data.regional_variations || "",
          festivals: data.associated_festivals || [],
          additionalNotes: data.additional_notes || "",

          // 🍎 Nutrition (JSONB)
          calories: data.nutrition_info?.calories || "",
          carbs: data.nutrition_info?.carbs || "",
          protein: data.nutrition_info?.protein || "",
          fat: data.nutrition_info?.fat || "",
          fiber: data.nutrition_info?.fiber || "",
          sugar: data.nutrition_info?.sugar || "",
          ingredientBenefits: data.nutrition_info?.ingredient_benefits || "",

          // ⚕️ Health / Dietary
          dietaryCategories: data.dietary_categories || [],
          allergens: data.allergens || "",
          medicalConsiderations: data.medical_conditions || "",
          ayurvedicProperties: data.ayurvedic_properties || "",
          healthBenefits: data.health_considerations || [],
        });

        setCurrentStep(1); // start at Step 1 with filled data
      }
    };

    fetchRecipe();
  }, [selectedRecipeId, currentView]);

  const steps = [
    { id: 1, title: 'Basic Info', component: BasicInfoStep },
    { id: 2, title: 'Ingredients', component: IngredientsStep },
    { id: 3, title: 'Instructions', component: InstructionsStep },
    { id: 4, title: 'Culture', component: CulturalContextStep },
    { id: 5, title: 'Nutrition', component: NutritionStep },
    { id: 6, title: 'Preview', component: PreviewStep }
  ];

  // Load saved draft from localStorage on component mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('recipe-draft');
    if (savedDraft && currentView === 'form') {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        setFormData(parsedDraft?.formData || {});
        setCurrentStep(parsedDraft?.currentStep || 1);
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }, [currentView]);

  // Auto-save draft every 30 seconds
  useEffect(() => {
    if (currentView === 'form' && Object.keys(formData)?.length > 0) {
      const interval = setInterval(() => {
        saveDraft();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [formData, currentStep, currentView]);

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps?.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveDraft = () => {
    const draftData = {
      formData,
      currentStep,
      lastSaved: new Date()?.toISOString()
    };
    localStorage.setItem('recipe-draft', JSON.stringify(draftData));
  };
  // const handleSubmit = async () => {
  //   setIsSubmitting(true);

  //   try {
  //     const { data: { user } } = await supabase.auth.getUser();
  //     if (!user) {
  //       alert("Please log in to submit a recipe.");
  //       setIsSubmitting(false);
  //       return;
  //     }

  //     // 🧩 Map form fields to rec_contributions table
  //     const recipeData = {
  //       name: formData.dishName || '',
  //       description: formData.shortDescription || '',
  //       state_id: formData.state_id || null,
  //       cooking_time: formData.cookTime ? parseInt(formData.cookTime, 10) : null,
  //       prep_time: formData.prepTime ? parseInt(formData.prepTime, 10) : null,
  //       difficulty_level: formData.difficulty
  //         ? formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1).toLowerCase()
  //         : null,
  //       festival_tag: formData.festivalTag || null,
  //       dietary_type: formData.dietaryType || null,
  //       meal_type: formData.category || null,
  //       image_url: formData.heroImage || null,
  //       origin_story: formData.originStory || null,
  //       heritage_significance: formData.heritageSignificance || null,
  //       created_by: user.id,
  //       status: 'pending'  // ✅ moderation workflow
  //     };

  //     const { data, error } = await supabase
  //       .from("rec_contributions")
  //       .insert([recipeData])
  //       .select();

  //     if (error) {
  //       console.error("❌ Error submitting recipe:", error);
  //       alert("There was an error submitting your recipe. Please try again.");
  //     } else {
  //       alert("🎉 Recipe submitted successfully!");
  //       localStorage.removeItem("recipe-draft");
  //       setFormData({});
  //       setCurrentStep(1);
  //       setCurrentView("list");
  //     }
  //   } catch (error) {
  //     console.error("❌ Submission error:", error);
  //     alert("There was an error submitting your recipe. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };
  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Please log in to submit a recipe.");
        setIsSubmitting(false);
        return;
      }

      const recipeData = {
        name: formData.dishName || '',
        description: formData.shortDescription || '',
        image_url: formData.heroImage || null,
        state_id: formData.state_id || null,
        meal_type: formData.category || null,
        festival_tag: formData.festivalTag || null,
        dietary_type: formData.dietaryType || null,
        difficulty_level: formData.difficulty
          ? formData.difficulty.charAt(0).toUpperCase() + formData.difficulty.slice(1).toLowerCase()
          : null,
        prep_time: formData.prepTime ? parseInt(formData.prepTime, 10) : null,
        cooking_time: formData.cookTime ? parseInt(formData.cookTime, 10) : null,
        serves: formData.serves ? parseInt(formData.serves, 10) : null,

        // 🍅 Ingredients & Instructions
        ingredients: formData.ingredients ? JSON.parse(JSON.stringify(formData.ingredients)) : null,
        instructions: formData.instructions ? JSON.parse(JSON.stringify(formData.instructions)) : null,

        // 🏺 Cultural Context
        origin_story: formData.originStory || null,
        heritage_significance: formData.heritageSignificance || null,
        family_tradition: formData.familyTraditions || null,
        recipe_source: formData.recipeSource || null,
        regional_variations: formData.regionalVariations || null,
        associated_festivals: formData.festivals || [],
        additional_notes: formData.additionalNotes || null,

        // 🍎 Nutrition (combine into one JSON field)
        nutrition_info: {
          calories: formData.calories || null,
          carbs: formData.carbs || null,
          protein: formData.protein || null,
          fat: formData.fat || null,
          fiber: formData.fiber || null,
          sugar: formData.sugar || null,
          ingredient_benefits: formData.ingredientBenefits || null,
        },
        dietary_categories: formData.dietaryCategories || [],
        allergens: formData.allergens || null,
        medical_conditions: formData.medicalConsiderations || null,
        ayurvedic_properties: formData.ayurvedicProperties || null,
        health_considerations: formData.healthBenefits || [],

        created_by: user.id,
        status: 'pending',
      };

      console.log("🧾 Submitting recipe:", recipeData);

      const isEditing = currentView === "edit" && selectedRecipeId;

      let error;
      if (isEditing) {
        // 🔄 UPDATE existing recipe
        ({ error } = await supabase
          .from("rec_contributions")
          .update(recipeData)
          .eq("indg_recipe_id", selectedRecipeId));
      } else {
        // 🆕 INSERT new recipe
        ({ error } = await supabase
          .from("rec_contributions")
          .insert([recipeData]));
      }

      if (error) {
        console.error("❌ Error saving recipe:", error);
        alert("There was an error saving your recipe. Please try again.");
      } else {
        alert(isEditing ? "✅ Recipe updated successfully!" : "🎉 Recipe submitted successfully!");
        localStorage.removeItem("recipe-draft");
        setFormData({});
        setCurrentStep(1);
        setCurrentView("list");
      }
    } catch (error) {
      console.error("❌ Submission error:", error);
      alert("There was an error submitting your recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleSaveDraft = () => {
    saveDraft();
    alert('Draft saved successfully!');
  };

  const startNewRecipe = () => {
    setCurrentView('form');
    setCurrentStep(1);
    setFormData({});
  };

  const backToList = () => {
    if (Object.keys(formData)?.length > 0) {
      const confirmLeave = window.confirm(
        'You have unsaved changes. Do you want to save as draft before leaving?'
      );
      if (confirmLeave) {
        saveDraft();
      }
    }
    setCurrentView('list');
  };

  const CurrentStepComponent = steps?.[currentStep - 1]?.component;

  // if (currentView === 'list') {
  //   return (
  //     <div className="min-h-screen bg-background">
  //       <Header />
  //       <main className="container mx-auto px-4 py-8">
  //         <UserRecipesList onNewRecipe={startNewRecipe} />
  //       </main>
  //       <Footer />
  //     </div>
  //   );
  // }
  if (currentView === 'list') {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />

        <main className="flex-grow container mx-auto px-4 py-8">
          <UserRecipesList
            onNewRecipe={() => setCurrentView('form')}
            onViewRecipe={(id) => {
              setSelectedRecipeId(id);
              setCurrentView('view');
            }}
            onEditRecipe={(id) => {
              setSelectedRecipeId(id);
              setCurrentView('edit');
            }}
          />
        </main>

        <Footer />
      </div>
    );
  }
  if (currentView === 'view') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <UserRecipeView
            recipeId={selectedRecipeId}
            onBack={() => setCurrentView('list')}
            onEdit={(id) => {
              setSelectedRecipeId(id);
              setCurrentView('edit');
            }}
          />
        </main>
        <Footer />
      </div>
    );
  }
  // ✅ Fetch recipe data when in edit mode (auto-fill form)


  if (currentView === 'edit') {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('view')}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back
              </Button>
              <h1 className="text-2xl font-heading font-bold text-foreground">
                Edit Recipe
              </h1>
            </div>

            <ProgressIndicator
              currentStep={currentStep}
              totalSteps={steps?.length}
              steps={steps}
            />

            {CurrentStepComponent && (
              <CurrentStepComponent
                formData={formData}
                updateFormData={updateFormData}
                onNext={nextStep}
                onPrevious={previousStep}
                onSubmit={handleSubmit}
                onSaveDraft={handleSaveDraft}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

        </main>
        <Footer />
      </div>
    );
  }



  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={backToList}
                iconName="ArrowLeft"
                iconPosition="left"
              >
                Back to My Recipes
              </Button>

              <div className="h-6 w-px bg-border" />

              <h1 className="text-2xl font-heading font-bold text-foreground">
                Submit New Recipe
              </h1>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGuidelines(true)}
                iconName="Info"
                iconPosition="left"
              >
                Guidelines
              </Button>

              <Button
                variant="secondary"
                size="sm"
                onClick={handleSaveDraft}
                iconName="Save"
                iconPosition="left"
              >
                Save Draft
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Form Area */}
            <div className="lg:col-span-3">
              <ProgressIndicator
                currentStep={currentStep}
                totalSteps={steps?.length}
                steps={steps}
              />

              {CurrentStepComponent && (
                <CurrentStepComponent
                  formData={formData}
                  updateFormData={updateFormData}
                  onNext={nextStep}
                  onPrevious={previousStep}
                  onSubmit={handleSubmit}
                  onSaveDraft={handleSaveDraft}
                  isSubmitting={isSubmitting}
                />
              )}
            </div>

            {/* Sidebar - Desktop Only */}
            <div className="hidden lg:block">
              <div className="sticky top-24 space-y-6">
                {/* Quick Tips */}
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-heading font-semibold text-foreground mb-3 flex items-center">
                    <Icon name="Lightbulb" size={16} className="mr-2 text-warning" />
                    Quick Tips
                  </h3>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    {currentStep === 1 && (
                      <>
                        <p>• Use clear, appetizing photos</p>
                        <p>• Include regional origin</p>
                        <p>• Be specific with dish names</p>
                      </>
                    )}
                    {currentStep === 2 && (
                      <>
                        <p>• Use standard measurements</p>
                        <p>• Include preparation notes</p>
                        <p>• Specify ingredient quality</p>
                      </>
                    )}
                    {currentStep === 3 && (
                      <>
                        <p>• Break down complex steps</p>
                        <p>• Add visual cues</p>
                        <p>• Include timing information</p>
                      </>
                    )}
                    {currentStep === 4 && (
                      <>
                        <p>• Share family stories</p>
                        <p>• Mention festival connections</p>
                        <p>• Include regional variations</p>
                      </>
                    )}
                    {currentStep === 5 && (
                      <>
                        <p>• Approximate values are fine</p>
                        <p>• Highlight health benefits</p>
                        <p>• Consider dietary restrictions</p>
                      </>
                    )}
                    {currentStep === 6 && (
                      <>
                        <p>• Review all information</p>
                        <p>• Check image quality</p>
                        <p>• Verify measurements</p>
                      </>
                    )}
                  </div>
                </div>

                {/* Progress Summary */}
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-heading font-semibold text-foreground mb-3">
                    Completion Status
                  </h3>
                  <div className="space-y-2">
                    {steps?.map((step, index) => (
                      <div
                        key={step?.id}
                        className={`flex items-center space-x-2 text-sm ${index + 1 < currentStep
                          ? 'text-success'
                          : index + 1 === currentStep
                            ? 'text-primary' : 'text-muted-foreground'
                          }`}
                      >
                        {index + 1 < currentStep ? (
                          <Icon name="CheckCircle" size={16} />
                        ) : index + 1 === currentStep ? (
                          <Icon name="Circle" size={16} />
                        ) : (
                          <Icon name="Circle" size={16} className="opacity-50" />
                        )}
                        <span>{step?.title}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Auto-save Status */}
                <div className="bg-muted rounded-lg p-3">
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <Icon name="Save" size={12} />
                    <span>Auto-saving every 30 seconds</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Guidelines Modal */}
      <SubmissionGuidelines
        isOpen={showGuidelines}
        onClose={() => setShowGuidelines(false)}
      />
      <Footer />
    </div>
  );
};

export default RecipeSubmissionManagement;