import React, { useState } from "react";
import Icon from "../../../components/AppIcon";

const NutritionPanel = ({ nutrition = {}, healthBenefits, dietary_type }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Parse and normalize values (e.g. "5 g" → 5)
  const parseValue = (val) => {
    if (!val) return 0;
    if (typeof val === "number") return val;
    const num = parseFloat(val);
    return isNaN(num) ? 0 : num;
  };

  // 1️⃣ Dynamically categorize macros vs micros
  const macroKeys = ["calories", "protein", "carbohydrates", "fat"];
  const macronutrients = Object.entries(nutrition)
    .filter(([key]) => macroKeys.includes(key.toLowerCase()))
    .map(([key, value]) => {
      const numeric = parseValue(value);
      const unit =
        (value + "").replace(/[0-9.]/g, "").trim() ||
        (key === "calories" ? "kcal" : "g");

      // estimated daily % values for the 4 macros
      const dailyReference = {
        calories: 2000,
        protein: 50,
        carbohydrates: 300,
        fat: 65,
      };
      const percentage = (numeric / (dailyReference[key.toLowerCase()] || 100)) * 100;

      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: numeric,
        unit,
        color:
          key === "calories"
            ? "bg-primary"
            : key === "protein"
            ? "bg-secondary"
            : key === "carbohydrates"
            ? "bg-warning"
            : "bg-accent",
        percentage,
      };
    });

  const micronutrients = Object.entries(nutrition)
    .filter(([key]) => !macroKeys.includes(key.toLowerCase()))
    .map(([key, value]) => {
      const numeric = parseValue(value);
      const unit = (value + "").replace(/[0-9.]/g, "").trim();
      // Example daily values — optional
      const dailyValueRef = {
        fiber: 25,
        sugar: 50,
        sodium: 2300,
        iron: 18,
        calcium: 1000,
        vitaminc: 90,
      };
      const dailyValue = dailyValueRef[key.toLowerCase()] || 100;
      const percentage = (numeric / dailyValue) * 100;

      return {
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: numeric,
        unit,
        dailyValue,
        percentage,
      };
    });

  // 2️⃣ Render UI (same as before, just uses new arrays)
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Nutrition Information
        </h2>
        <span className="text-sm text-muted-foreground">Per serving</span>
      </div>

      {/* ✅ Macros */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {macronutrients.map((macro, index) => (
          <div key={index} className="text-center">
            <div className="relative w-16 h-16 mx-auto mb-2">
              <svg
                className="w-16 h-16 transform -rotate-90"
                viewBox="0 0 36 36"
              >
                <path
                  className="text-muted stroke-current"
                  strokeWidth="3"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className={`${macro.color.replace("bg-", "text-")} stroke-current`}
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="100, 100" 
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs font-heading font-bold text-foreground">
                  {macro.value}
                </span>
              </div>
            </div>
            <p className="text-sm font-body font-medium text-foreground">
              {macro.name}
            </p>
            <p className="text-xs text-muted-foreground">{macro.unit}</p>
          </div>
        ))}
      </div>

      {/* Toggle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-center w-full py-2 text-sm font-body font-medium text-primary hover:text-primary-foreground hover:bg-primary rounded-lg transition-all"
      >
        <span>{isExpanded ? "Show Less" : "Show Detailed Nutrition"}</span>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={16}
          className="ml-1"
        />
      </button>

      {/* ✅ Micros */}
      {isExpanded && (
        <div className="mt-6 space-y-4">
          <h3 className="font-heading font-semibold text-foreground">
            Detailed Breakdown
          </h3>
          <div className="grid gap-3">
            {micronutrients.map((nutrient, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm font-body text-foreground">
                  {nutrient.name}
                </span>
                <div className="flex items-center space-x-3">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(nutrient.percentage, 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-heading font-medium text-foreground w-16 text-right">
                    {nutrient.value}
                    {nutrient.unit}
                  </span>
                  <span className="text-xs text-muted-foreground w-8 text-right">
                    {Math.round(nutrient.percentage)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Health Benefits */}
      {healthBenefits && healthBenefits.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Health Benefits
          </h3>
          <div className="space-y-3">
            {healthBenefits.map((benefit, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Icon name="Heart" size={12} className="text-success" />
                </div>
                <p className="text-sm text-foreground">
                  {typeof benefit === "object"
                    ? `${benefit.title}: ${benefit.description}`
                    : benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ✅ Dietary Tags */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-heading font-semibold text-foreground mb-3">
          Dietary Information
        </h3>
        <div className="flex flex-wrap gap-2">
          {Array.isArray(dietary_type)
            ? dietary_type.map((type, i) => (
                <span
                  key={i}
                  className="px-3 py-1 bg-muted text-muted-foreground text-xs font-body font-medium rounded-full"
                >
                  {type}
                </span>
              ))
            : dietary_type && (
                <span className="px-3 py-1 bg-muted text-muted-foreground text-xs font-body font-medium rounded-full">
                  {dietary_type}
                </span>
              )}
        </div>
      </div>
    </div>
  );
};

export default NutritionPanel;
