import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const NutritionPanel = ({ nutrition, healthBenefits }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const macronutrients = [
    {
      name: 'Calories',
      value: nutrition?.calories,
      unit: 'kcal',
      color: 'bg-primary',
      percentage: 100
    },
    {
      name: 'Protein',
      value: nutrition?.protein,
      unit: 'g',
      color: 'bg-secondary',
      percentage: (nutrition?.protein / 50) * 100 // Assuming 50g daily target
    },
    {
      name: 'Carbs',
      value: nutrition?.carbs,
      unit: 'g',
      color: 'bg-warning',
      percentage: (nutrition?.carbs / 300) * 100 // Assuming 300g daily target
    },
    {
      name: 'Fat',
      value: nutrition?.fat,
      unit: 'g',
      color: 'bg-accent',
      percentage: (nutrition?.fat / 65) * 100 // Assuming 65g daily target
    }
  ];

  const micronutrients = [
    { name: 'Fiber', value: nutrition?.fiber, unit: 'g', dailyValue: 25 },
    { name: 'Sugar', value: nutrition?.sugar, unit: 'g', dailyValue: 50 },
    { name: 'Sodium', value: nutrition?.sodium, unit: 'mg', dailyValue: 2300 },
    { name: 'Iron', value: nutrition?.iron, unit: 'mg', dailyValue: 18 },
    { name: 'Calcium', value: nutrition?.calcium, unit: 'mg', dailyValue: 1000 },
    { name: 'Vitamin C', value: nutrition?.vitaminC, unit: 'mg', dailyValue: 90 }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Nutrition Information
        </h2>
        <span className="text-sm text-muted-foreground">Per serving</span>
      </div>
      {/* Macronutrients */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {macronutrients?.map((macro, index) => (
          <div key={index} className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-muted stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${macro?.color?.replace('bg-', 'text-')} stroke-current`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={`${Math.min(macro?.percentage, 100)}, 100`}
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-heading font-bold text-foreground">
                  {macro?.value}
                </span>
              </div>
            </div>
            <p className="text-sm font-body font-medium text-foreground">
              {macro?.name}
            </p>
            <p className="text-xs text-muted-foreground">{macro?.unit}</p>
          </div>
        ))}
      </div>
      {/* Expand/Collapse Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full py-2 text-sm font-body font-medium text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all"
      >
        <span>{isExpanded ? 'Show Less' : 'Show Detailed Nutrition'}</span>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          className="ml-1" 
        />
      </button>
      {/* Detailed Nutrition */}
      {isExpanded && (
        <div className="mt-6 space-y-4">
          <h3 className="font-heading font-semibold text-foreground">
            Detailed Breakdown
          </h3>
          
          <div className="grid gap-3">
            {micronutrients?.map((nutrient, index) => {
              const percentage = (nutrient?.value / nutrient?.dailyValue) * 100;
              return (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm font-body text-foreground">
                    {nutrient?.name}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-20 bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      />
                    </div>
                    <span className="text-sm font-heading font-medium text-foreground w-16 text-right">
                      {nutrient?.value}{nutrient?.unit}
                    </span>
                    <span className="text-xs text-muted-foreground w-8 text-right">
                      {Math.round(percentage)}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      {/* Health Benefits */}
      {healthBenefits && healthBenefits?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Health Benefits
          </h3>
          <div className="space-y-3">
            {healthBenefits?.map((benefit, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Heart" size={12} className="text-success" />
                </div>
                <div>
                  <h4 className="font-body font-medium text-foreground">
                    {benefit?.title}
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    {benefit?.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Dietary Tags */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-heading font-semibold text-foreground mb-3">
          Dietary Information
        </h3>
        <div className="flex flex-wrap gap-2">
          {nutrition?.dietaryTags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-muted text-muted-foreground text-xs font-body font-medium rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NutritionPanel;