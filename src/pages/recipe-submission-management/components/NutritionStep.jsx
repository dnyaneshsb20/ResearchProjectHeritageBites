import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const NutritionStep = ({ formData, updateFormData, onNext, onPrevious }) => {
  const difficultyOptions = [
    { value: 'easy', label: 'Easy (Beginner friendly)' },
    { value: 'medium', label: 'Medium (Some experience needed)' },
    { value: 'hard', label: 'Hard (Advanced cooking skills)' }
  ];

  const dietaryOptions = [
    { value: 'vegetarian', label: 'Vegetarian' },
    { value: 'vegan', label: 'Vegan' },
    { value: 'gluten-free', label: 'Gluten Free' },
    { value: 'dairy-free', label: 'Dairy Free' },
    { value: 'nut-free', label: 'Nut Free' },
    { value: 'low-carb', label: 'Low Carb' },
    { value: 'high-protein', label: 'High Protein' },
    { value: 'diabetic-friendly', label: 'Diabetic Friendly' },
    { value: 'heart-healthy', label: 'Heart Healthy' },
    { value: 'weight-loss', label: 'Weight Loss Friendly' }
  ];

  const healthBenefitOptions = [
    { value: 'immunity-boost', label: 'Immunity Boosting' },
    { value: 'digestive-health', label: 'Good for Digestion' },
    { value: 'anti-inflammatory', label: 'Anti-inflammatory' },
    { value: 'energy-boost', label: 'Energy Boosting' },
    { value: 'bone-health', label: 'Good for Bone Health' },
    { value: 'skin-health', label: 'Good for Skin' },
    { value: 'brain-health', label: 'Brain Health' },
    { value: 'detox', label: 'Detoxifying' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleMultiSelectChange = (field, value) => {
    const currentValues = formData?.[field] || [];
    const updatedValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    updateFormData({ [field]: updatedValues });
  };

  const calculateTotalCalories = () => {
    const { calories, carbs, protein, fat } = formData;
    if (carbs && protein && fat) {
      return (carbs * 4) + (protein * 4) + (fat * 9);
    }
    return calories || 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
          Nutritional Information & Health Benefits
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-heading font-medium text-foreground mb-4">
                Basic Nutrition (Per Serving)
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Calories"
                  type="number"
                  placeholder="e.g., 250"
                  value={formData?.calories || ''}
                  onChange={(e) => handleInputChange('calories', e?.target?.value)}
                />
                
                <Input
                  label="Carbs (g)"
                  type="number"
                  placeholder="e.g., 45"
                  value={formData?.carbs || ''}
                  onChange={(e) => handleInputChange('carbs', e?.target?.value)}
                />
                
                <Input
                  label="Protein (g)"
                  type="number"
                  placeholder="e.g., 12"
                  value={formData?.protein || ''}
                  onChange={(e) => handleInputChange('protein', e?.target?.value)}
                />
                
                <Input
                  label="Fat (g)"
                  type="number"
                  placeholder="e.g., 8"
                  value={formData?.fat || ''}
                  onChange={(e) => handleInputChange('fat', e?.target?.value)}
                />
                
                <Input
                  label="Fiber (g)"
                  type="number"
                  placeholder="e.g., 5"
                  value={formData?.fiber || ''}
                  onChange={(e) => handleInputChange('fiber', e?.target?.value)}
                />
                
                <Input
                  label="Sugar (g)"
                  type="number"
                  placeholder="e.g., 3"
                  value={formData?.sugar || ''}
                  onChange={(e) => handleInputChange('sugar', e?.target?.value)}
                />
              </div>
              
              {(formData?.carbs || formData?.protein || formData?.fat) && (
                <div className="mt-4 p-3 bg-muted rounded-lg">
                  <p className="text-sm font-body text-foreground">
                    <Icon name="Calculator" size={16} className="inline mr-2" />
                    Calculated Calories: {calculateTotalCalories()} kcal
                  </p>
                </div>
              )}
            </div>
            
            <Select
              label="Difficulty Level"
              placeholder="Select cooking difficulty"
              options={difficultyOptions}
              value={formData?.difficulty || ''}
              onChange={(value) => handleInputChange('difficulty', value)}
            />
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Key Ingredients Benefits
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="Describe the nutritional benefits of key ingredients..."
                value={formData?.ingredientBenefits || ''}
                onChange={(e) => handleInputChange('ingredientBenefits', e?.target?.value)}
              />
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-3">
                Dietary Categories
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {dietaryOptions?.map((option) => (
                  <Checkbox
                    key={option?.value}
                    label={option?.label}
                    checked={(formData?.dietaryCategories || [])?.includes(option?.value)}
                    onChange={() => handleMultiSelectChange('dietaryCategories', option?.value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-3">
                Health Benefits
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {healthBenefitOptions?.map((benefit) => (
                  <Checkbox
                    key={benefit?.value}
                    label={benefit?.label}
                    checked={(formData?.healthBenefits || [])?.includes(benefit?.value)}
                    onChange={() => handleMultiSelectChange('healthBenefits', benefit?.value)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-heading font-medium text-foreground mb-4">
            Additional Health Information
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Allergen Information"
                type="text"
                placeholder="Contains nuts, dairy, gluten, etc."
                value={formData?.allergens || ''}
                onChange={(e) => handleInputChange('allergens', e?.target?.value)}
              />
              
              <Input
                label="Suitable Age Group"
                type="text"
                placeholder="e.g., All ages, Adults only, 6+ months"
                value={formData?.ageGroup || ''}
                onChange={(e) => handleInputChange('ageGroup', e?.target?.value)}
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Medical Considerations"
                type="text"
                placeholder="Any medical conditions to consider"
                value={formData?.medicalConsiderations || ''}
                onChange={(e) => handleInputChange('medicalConsiderations', e?.target?.value)}
              />
              
              <Input
                label="Ayurvedic Properties"
                type="text"
                placeholder="Hot/Cold nature, Dosha effects"
                value={formData?.ayurvedicProperties || ''}
                onChange={(e) => handleInputChange('ayurvedicProperties', e?.target?.value)}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <label className="block text-sm font-body font-medium text-foreground mb-2">
              Nutritionist Notes
            </label>
            <textarea
              className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
              rows={3}
              placeholder="Additional nutritional insights or recommendations..."
              value={formData?.nutritionistNotes || ''}
              onChange={(e) => handleInputChange('nutritionistNotes', e?.target?.value)}
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-secondary/5 rounded-lg border border-secondary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Heart" size={20} className="text-secondary mt-0.5" />
            <div>
              <h4 className="font-body font-medium text-foreground mb-2">
                Health-Conscious Community
              </h4>
              <p className="text-sm text-muted-foreground">
                Providing accurate nutritional information helps our community make informed 
                dietary choices. Even approximate values are helpful - you can always update 
                this information later.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        
        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Preview Recipe
        </Button>
      </div>
    </div>
  );
};

export default NutritionStep;