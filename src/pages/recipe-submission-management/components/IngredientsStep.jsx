import React, { useState } from 'react';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const IngredientsStep = ({ formData, updateFormData, onNext, onPrevious }) => {
  const [currentIngredient, setCurrentIngredient] = useState({
    name: '',
    quantity: '',
    unit: '',
    notes: ''
  });
  
  const [suggestions] = useState([
    'Basmati Rice', 'Turmeric Powder', 'Cumin Seeds', 'Coriander Seeds',
    'Garam Masala', 'Red Chili Powder', 'Ginger-Garlic Paste', 'Onions',
    'Tomatoes', 'Coconut Oil', 'Mustard Seeds', 'Curry Leaves',
    'Jaggery', 'Tamarind', 'Cardamom', 'Cinnamon', 'Cloves'
  ]);
  
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const ingredients = formData?.ingredients || [];

  const handleIngredientNameChange = (value) => {
    setCurrentIngredient({ ...currentIngredient, name: value });
    
    if (value?.length > 0) {
      const filtered = suggestions?.filter(suggestion =>
        suggestion?.toLowerCase()?.includes(value?.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (suggestion) => {
    setCurrentIngredient({ ...currentIngredient, name: suggestion });
    setShowSuggestions(false);
  };

  const addIngredient = () => {
    if (currentIngredient?.name && currentIngredient?.quantity) {
      const newIngredients = [...ingredients, { ...currentIngredient, id: Date.now() }];
      updateFormData({ ingredients: newIngredients });
      setCurrentIngredient({ name: '', quantity: '', unit: '', notes: '' });
    }
  };

  const removeIngredient = (id) => {
    const updatedIngredients = ingredients?.filter(ingredient => ingredient?.id !== id);
    updateFormData({ ingredients: updatedIngredients });
  };

  const editIngredient = (id) => {
    const ingredient = ingredients?.find(ing => ing?.id === id);
    if (ingredient) {
      setCurrentIngredient(ingredient);
      removeIngredient(id);
    }
  };

  const isFormValid = () => {
    return ingredients?.length > 0;
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
          Recipe Ingredients
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-foreground">
              Add Ingredient
            </h3>
            
            <div className="relative">
              <Input
                label="Ingredient Name"
                type="text"
                placeholder="Start typing ingredient name..."
                value={currentIngredient?.name}
                onChange={(e) => handleIngredientNameChange(e?.target?.value)}
                onFocus={() => currentIngredient?.name && setShowSuggestions(true)}
                required
              />
              
              {showSuggestions && filteredSuggestions?.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-popover border border-border rounded-lg shadow-warm-lg max-h-48 overflow-y-auto">
                  {filteredSuggestions?.map((suggestion, index) => (
                    <button
                      key={index}
                      className="w-full px-4 py-2 text-left text-sm font-body hover:bg-muted transition-colors"
                      onClick={() => selectSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity"
                type="text"
                placeholder="e.g., 2, 1/2"
                value={currentIngredient?.quantity}
                onChange={(e) => setCurrentIngredient({ ...currentIngredient, quantity: e?.target?.value })}
                required
              />
              
              <Input
                label="Unit"
                type="text"
                placeholder="cups, tsp, kg"
                value={currentIngredient?.unit}
                onChange={(e) => setCurrentIngredient({ ...currentIngredient, unit: e?.target?.value })}
              />
            </div>
            
            <Input
              label="Notes (Optional)"
              type="text"
              placeholder="e.g., finely chopped, organic"
              value={currentIngredient?.notes}
              onChange={(e) => setCurrentIngredient({ ...currentIngredient, notes: e?.target?.value })}
            />
            
            <Button
              variant="outline"
              onClick={addIngredient}
              disabled={!currentIngredient?.name || !currentIngredient?.quantity}
              iconName="Plus"
              iconPosition="left"
              fullWidth
            >
              Add Ingredient
            </Button>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-heading font-medium text-foreground">
              Ingredients List ({ingredients?.length})
            </h3>
            
            {ingredients?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Icon name="Package" size={48} className="mx-auto mb-4 opacity-50" />
                <p className="text-sm font-body">No ingredients added yet</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {ingredients?.map((ingredient) => (
                  <div
                    key={ingredient?.id}
                    className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-body font-medium text-foreground">
                          {ingredient?.name}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {ingredient?.quantity} {ingredient?.unit}
                        </span>
                      </div>
                      {ingredient?.notes && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {ingredient?.notes}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => editIngredient(ingredient?.id)}
                      >
                        <Icon name="Edit2" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeIngredient(ingredient?.id)}
                      >
                        <Icon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          disabled={!isFormValid()}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Next: Add Instructions
        </Button>
      </div>
    </div>
  );
};

export default IngredientsStep;