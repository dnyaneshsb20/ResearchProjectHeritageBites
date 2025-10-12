import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TastePreferencesSection = ({ isExpanded, onToggle, preferences, onUpdate }) => {
  const [tastePreferences, setTastePreferences] = useState(preferences);

  const spiceCategories = [
    {
      id: 'heat-level',
      title: 'Heat Level',
      description: 'How spicy do you like your food?',
      icon: 'Flame',
      color: 'text-red-600',
      options: [
        { value: 1, label: 'Mild', description: 'Very little to no heat' },
        { value: 2, label: 'Medium', description: 'Moderate spice level' },
        { value: 3, label: 'Hot', description: 'Spicy and flavorful' },
        { value: 4, label: 'Very Hot', description: 'Intense heat level' },
        { value: 5, label: 'Extreme', description: 'Maximum spice tolerance' }
      ]
    },
    {
      id: 'sweetness',
      title: 'Sweetness',
      description: 'Preference for sweet flavors',
      icon: 'Candy',
      color: 'text-pink-600',
      options: [
        { value: 1, label: 'Minimal', description: 'Very little sweetness' },
        { value: 2, label: 'Light', description: 'Subtle sweet notes' },
        { value: 3, label: 'Moderate', description: 'Balanced sweetness' },
        { value: 4, label: 'Sweet', description: 'Noticeable sweetness' },
        { value: 5, label: 'Very Sweet', description: 'Rich, sweet flavors' }
      ]
    },
    {
      id: 'sourness',
      title: 'Sourness',
      description: 'Preference for tangy flavors',
      icon: 'Citrus',
      color: 'text-yellow-600',
      options: [
        { value: 1, label: 'Minimal', description: 'Very little tanginess' },
        { value: 2, label: 'Light', description: 'Subtle sour notes' },
        { value: 3, label: 'Moderate', description: 'Balanced tanginess' },
        { value: 4, label: 'Tangy', description: 'Noticeable sourness' },
        { value: 5, label: 'Very Tangy', description: 'Strong sour flavors' }
      ]
    },
    {
      id: 'saltiness',
      title: 'Saltiness',
      description: 'Preference for salty flavors',
      icon: 'Droplets',
      color: 'text-blue-600',
      options: [
        { value: 1, label: 'Low Salt', description: 'Minimal salt content' },
        { value: 2, label: 'Light', description: 'Subtle saltiness' },
        { value: 3, label: 'Moderate', description: 'Balanced salt level' },
        { value: 4, label: 'Salty', description: 'Noticeable saltiness' },
        { value: 5, label: 'Very Salty', description: 'High salt preference' }
      ]
    }
  ];

  const favoriteIngredients = [
    { id: 'ginger', name: 'Ginger', category: 'Spices' },
    { id: 'garlic', name: 'Garlic', category: 'Aromatics' },
    { id: 'turmeric', name: 'Turmeric', category: 'Spices' },
    { id: 'cumin', name: 'Cumin', category: 'Spices' },
    { id: 'coriander', name: 'Coriander', category: 'Spices' },
    { id: 'cardamom', name: 'Cardamom', category: 'Spices' },
    { id: 'cinnamon', name: 'Cinnamon', category: 'Spices' },
    { id: 'coconut', name: 'Coconut', category: 'Base' },
    { id: 'tomato', name: 'Tomato', category: 'Base' },
    { id: 'onion', name: 'Onion', category: 'Aromatics' },
    { id: 'curry-leaves', name: 'Curry Leaves', category: 'Herbs' },
    { id: 'mustard-seeds', name: 'Mustard Seeds', category: 'Spices' }
  ];

  const handleSliderChange = (categoryId, value) => {
    setTastePreferences(prev => ({
      ...prev,
      [categoryId]: value
    }));
    onUpdate({
      ...tastePreferences,
      [categoryId]: value
    });
  };

  const handleIngredientToggle = (ingredientId) => {
    const currentFavorites = tastePreferences?.favoriteIngredients || [];
    const updatedFavorites = currentFavorites?.includes(ingredientId)
      ? currentFavorites?.filter(id => id !== ingredientId)
      : [...currentFavorites, ingredientId];
    
    const updatedPreferences = {
      ...tastePreferences,
      favoriteIngredients: updatedFavorites
    };
    
    setTastePreferences(updatedPreferences);
    onUpdate(updatedPreferences);
  };

  const getSliderColor = (value) => {
    if (value <= 1) return 'bg-green-500';
    if (value <= 2) return 'bg-yellow-500';
    if (value <= 3) return 'bg-orange-500';
    if (value <= 4) return 'bg-red-500';
    return 'bg-red-700';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="ChefHat" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Taste Preferences
            </h3>
            <p className="text-sm text-muted-foreground">
              Customize flavor profiles for better recommendations
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </div>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6">
            {/* Flavor Intensity Sliders */}
            <div className="space-y-6">
              {spiceCategories?.map((category) => {
                const currentValue = tastePreferences?.[category?.id] || 3;
                const currentOption = category?.options?.find(opt => opt?.value === currentValue);
                
                return (
                  <div key={category?.id} className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Icon name={category?.icon} size={18} className={category?.color} />
                      <div>
                        <h4 className="font-body font-medium text-foreground">
                          {category?.title}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {category?.description}
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-body text-foreground">
                          {currentOption?.label}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {currentOption?.description}
                        </span>
                      </div>
                      
                      <div className="relative">
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={currentValue}
                          onChange={(e) => handleSliderChange(category?.id, parseInt(e?.target?.value))}
                          className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, ${getSliderColor(currentValue)} 0%, ${getSliderColor(currentValue)} ${(currentValue - 1) * 25}%, #e5e7eb ${(currentValue - 1) * 25}%, #e5e7eb 100%)`
                          }}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          {category?.options?.map((option) => (
                            <span key={option?.value} className="text-center">
                              {option?.value}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Favorite Ingredients */}
            <div className="mt-8">
              <h4 className="font-body font-medium text-foreground mb-4">
                Favorite Ingredients
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Select ingredients you love to see more recipes featuring them
              </p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {favoriteIngredients?.map((ingredient) => {
                  const isSelected = (tastePreferences?.favoriteIngredients || [])?.includes(ingredient?.id);
                  return (
                    <div
                      key={ingredient?.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5' :'border-border bg-background hover:border-primary/30'
                      }`}
                      onClick={() => handleIngredientToggle(ingredient?.id)}
                    >
                      <div className="text-center">
                        <span className="font-body font-medium text-foreground text-sm">
                          {ingredient?.name}
                        </span>
                        <p className="text-xs text-muted-foreground mt-1">
                          {ingredient?.category}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Taste Profile Summary */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <h4 className="font-body font-medium text-foreground mb-2">
                Your Taste Profile
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                {spiceCategories?.map((category) => {
                  const value = tastePreferences?.[category?.id] || 3;
                  const option = category?.options?.find(opt => opt?.value === value);
                  return (
                    <div key={category?.id} className="text-center">
                      <Icon name={category?.icon} size={16} className={`${category?.color} mx-auto mb-1`} />
                      <p className="font-body font-medium text-foreground">
                        {option?.label}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {category?.title}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                Reset to Default
              </Button>
              <Button variant="default" size="sm">
                Update Recommendations
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TastePreferencesSection;