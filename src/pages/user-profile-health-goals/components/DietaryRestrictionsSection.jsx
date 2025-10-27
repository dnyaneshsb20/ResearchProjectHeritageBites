import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';

const DietaryRestrictionsSection = ({ isExpanded, onToggle, restrictions, onUpdate }) => {
  const [selectedRestrictions, setSelectedRestrictions] = useState(restrictions);
  const [customRestriction, setCustomRestriction] = useState('');
  const [saveStatus, setSaveStatus] = useState("");


  const commonRestrictions = [
    {
      id: 'vegetarian',
      label: 'Vegetarian',
      description: 'No meat, poultry, or fish',
      icon: 'Leaf',
      color: 'text-green-600'
    },
    {
      id: 'vegan',
      label: 'Vegan',
      description: 'No animal products including dairy',
      icon: 'Sprout',
      color: 'text-green-700'
    },
    {
      id: 'jain',
      label: 'Jain',
      description: 'No root vegetables, strict vegetarian',
      icon: 'Flower',
      color: 'text-orange-600'
    },
    {
      id: 'gluten-free',
      label: 'Gluten-Free',
      description: 'No wheat, barley, rye products',
      icon: 'Wheat',
      color: 'text-amber-600'
    },
    {
      id: 'dairy-free',
      label: 'Dairy-Free',
      description: 'No milk, cheese, yogurt, ghee',
      icon: 'Milk',
      color: 'text-blue-600'
    },
    {
      id: 'nut-free',
      label: 'Nut-Free',
      description: 'No tree nuts or peanuts',
      icon: 'Nut',
      color: 'text-red-600'
    },
    {
      id: 'low-sodium',
      label: 'Low Sodium',
      description: 'Reduced salt content',
      icon: 'Droplets',
      color: 'text-purple-600'
    },
    {
      id: 'low-sugar',
      label: 'Low Sugar',
      description: 'Minimal added sugars',
      icon: 'Candy',
      color: 'text-pink-600'
    },
    {
      id: 'keto-friendly',
      label: 'Keto-Friendly',
      description: 'Low carb, high fat',
      icon: 'Zap',
      color: 'text-indigo-600'
    }
  ];

  const handleRestrictionToggle = (restrictionId) => {
    const updatedRestrictions = selectedRestrictions?.includes(restrictionId)
      ? selectedRestrictions?.filter(id => id !== restrictionId)
      : [...selectedRestrictions, restrictionId];

    setSelectedRestrictions(updatedRestrictions);
    onUpdate(updatedRestrictions);
  };

  const handleAddCustomRestriction = () => {
    if (customRestriction?.trim() && !selectedRestrictions?.includes(customRestriction?.trim())) {
      const updatedRestrictions = [...selectedRestrictions, customRestriction?.trim()];
      setSelectedRestrictions(updatedRestrictions);
      onUpdate(updatedRestrictions);
      setCustomRestriction('');
    }
  };

  const handleRemoveCustomRestriction = (restriction) => {
    const updatedRestrictions = selectedRestrictions?.filter(r => r !== restriction);
    setSelectedRestrictions(updatedRestrictions);
    onUpdate(updatedRestrictions);
  };

  const customRestrictions = selectedRestrictions?.filter(
    r => !commonRestrictions?.some(common => common?.id === r)
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="AlertTriangle" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Dietary Restrictions
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedRestrictions?.length} restrictions to filter recipes
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
            {/* Common Restrictions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {commonRestrictions?.map((restriction) => {
                const isSelected = selectedRestrictions?.includes(restriction?.id);
                return (
                  <div
                    key={restriction?.id}
                    className={`p-3 rounded-lg border transition-all duration-200 cursor-pointer ${isSelected
                      ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30'
                      }`}
                    onClick={() => handleRestrictionToggle(restriction?.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={restriction?.icon} size={18} className={restriction?.color} />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-body font-medium text-foreground text-sm">
                            {restriction?.label}
                          </span>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleRestrictionToggle(restriction?.id)}
                            size="sm"
                          />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {restriction?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Add Custom Restriction */}
            <div className="mt-6">
              <h4 className="font-body font-medium text-foreground mb-3">
                Add Custom Restriction
              </h4>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  placeholder="e.g., No onion, No garlic, Sattvic diet"
                  value={customRestriction}
                  onChange={(e) => setCustomRestriction(e?.target?.value)}
                  className="flex-1"
                />
                <Button
                  variant="outline"
                  onClick={handleAddCustomRestriction}
                  disabled={!customRestriction?.trim()}
                  iconName="Plus"
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Custom Restrictions List */}
            {customRestrictions?.length > 0 && (
              <div className="mt-4">
                <h4 className="font-body font-medium text-foreground mb-3">
                  Your Custom Restrictions
                </h4>
                <div className="flex flex-wrap gap-2">
                  {customRestrictions?.map((restriction, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 bg-muted px-3 py-1 rounded-full"
                    >
                      <span className="text-sm font-body text-foreground">
                        {restriction}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="w-4 h-4 p-0"
                        onClick={() => handleRemoveCustomRestriction(restriction)}
                      >
                        <Icon name="X" size={12} />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restriction Impact */}
            {selectedRestrictions?.length > 0 && (
              <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Info" size={16} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="font-body font-medium text-foreground mb-1">
                      Recipe Filtering Active
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We'll only show recipes that comply with your dietary restrictions.
                      Our database includes traditional alternatives and substitutions to ensure
                      you don't miss out on authentic Indian flavors.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {/* Action Buttons */}
            <div className="flex items-center justify-end mt-6 pt-4 border-t border-border">
              <Button
                variant="default"
                size="sm"
                onClick={async () => {
                  setSaveStatus("Saving...");
                  await onUpdate(selectedRestrictions);
                  setSaveStatus("Saved ✅");
                  setTimeout(() => setSaveStatus(""), 2000);
                }}
              >
                {saveStatus || "Save Preferences"}
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default DietaryRestrictionsSection;