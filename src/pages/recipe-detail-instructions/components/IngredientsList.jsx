import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const IngredientsList = ({ ingredients, onBuyIngredients }) => {
  const [servings, setServings] = useState(4);
  const [checkedIngredients, setCheckedIngredients] = useState(new Set());

  const adjustServings = (change) => {
    const newServings = Math.max(1, servings + change);
    setServings(newServings);
  };

  const toggleIngredient = (index) => {
    const newChecked = new Set(checkedIngredients);
    if (newChecked?.has(index)) {
      newChecked?.delete(index);
    } else {
      newChecked?.add(index);
    }
    setCheckedIngredients(newChecked);
  };

  const calculateQuantity = (baseQuantity, baseServings = 4) => {
    const multiplier = servings / baseServings;
    const quantity = parseFloat(baseQuantity) * multiplier;
    return quantity % 1 === 0 ? quantity?.toString() : quantity?.toFixed(1);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Ingredients
        </h2>
        
        {/* Servings Adjuster */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-body text-muted-foreground">Serves:</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustServings(-1)}
              disabled={servings <= 1}
              className="w-8 h-8"
            >
              <Icon name="Minus" size={14} />
            </Button>
            <span className="font-heading font-semibold text-foreground w-8 text-center">
              {servings}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => adjustServings(1)}
              className="w-8 h-8"
            >
              <Icon name="Plus" size={14} />
            </Button>
          </div>
        </div>
      </div>
      {/* Ingredients List */}
      <div className="space-y-4 mb-6">
        {ingredients?.map((ingredient, index) => (
          <div
            key={index}
            className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
              checkedIngredients?.has(index)
                ? 'bg-muted border-primary/50 opacity-60' :'bg-background border-border hover:bg-muted/50'
            }`}
          >
            {/* Checkbox */}
            <button
              onClick={() => toggleIngredient(index)}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                checkedIngredients?.has(index)
                  ? 'bg-primary border-primary' :'border-muted-foreground hover:border-primary'
              }`}
            >
              {checkedIngredients?.has(index) && (
                <Icon name="Check" size={12} color="white" />
              )}
            </button>

            {/* Ingredient Image */}
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={ingredient?.image}
                alt={ingredient?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Ingredient Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className={`font-body font-medium ${
                  checkedIngredients?.has(index)
                    ? 'line-through text-muted-foreground'
                    : 'text-foreground'
                }`}>
                  {ingredient?.name}
                </h3>
                <div className="flex items-center space-x-2">
                  <span className={`font-heading font-semibold ${
                    checkedIngredients?.has(index)
                      ? 'line-through text-muted-foreground'
                      : 'text-foreground'
                  }`}>
                    {calculateQuantity(ingredient?.quantity)} {ingredient?.unit}
                  </span>
                  {ingredient?.available && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onBuyIngredients([ingredient])}
                      className="text-primary hover:text-primary-foreground hover:bg-primary h-6 px-2"
                    >
                      <Icon name="ShoppingCart" size={12} />
                      <span className="ml-1 text-xs">Buy</span>
                    </Button>
                  )}
                </div>
              </div>
              {ingredient?.note && (
                <p className="text-xs text-muted-foreground mt-1">
                  {ingredient?.note}
                </p>
              )}
              {ingredient?.available && (
                <div className="flex items-center space-x-1 mt-1">
                  <Icon name="CheckCircle" size={12} className="text-success" />
                  <span className="text-xs text-success">Available locally</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Buy All Ingredients Button */}
      <Button
        variant="default"
        fullWidth
        onClick={() => onBuyIngredients(ingredients?.filter(ing => ing?.available))}
        iconName="ShoppingBag"
        iconPosition="left"
        className="mb-4"
      >
        Add All Available Ingredients to Cart
      </Button>
      {/* Shopping Tips */}
      <div className="bg-muted/50 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Lightbulb" size={16} className="text-warning mt-0.5" />
          <div>
            <h4 className="font-body font-medium text-foreground mb-1">
              Shopping Tips
            </h4>
            <p className="text-sm text-muted-foreground">
              Fresh ingredients are sourced from local farmers. Dry spices and grains 
              are available year-round. Check availability for seasonal items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IngredientsList;