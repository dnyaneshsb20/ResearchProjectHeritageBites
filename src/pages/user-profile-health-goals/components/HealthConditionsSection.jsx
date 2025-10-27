import React, { useState } from "react";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const HealthConditionsSection = ({ isExpanded, onToggle, conditions = [], onUpdate }) => {
  const [selectedConditions, setSelectedConditions] = useState(conditions || []);
  const [saveStatus, setSaveStatus] = useState("");


  // Health condition categories
  const conditionCategories = [
    {
      id: "metabolic",
      title: "Metabolic Conditions",
      description: "Conditions that affect metabolism or hormones",
      icon: "Activity",
      options: ["Diabetes", "Thyroid", "PCOS", "Obesity"],
    },
    {
      id: "cardiac",
      title: "Heart & Blood Pressure",
      description: "Cardiovascular and blood-related health issues",
      icon: "HeartPulse",
      options: ["Hypertension", "High Cholesterol", "Anemia"],
    },
    {
      id: "digestive",
      title: "Digestive & Food Sensitivities",
      description: "Conditions related to digestion or intolerances",
      icon: "Utensils",
      options: ["Lactose Intolerance", "Gluten Sensitivity", "Acidity"],
    },
    {
      id: "allergy",
      title: "Allergies",
      description: "Common food allergies that influence recipe choices",
      icon: "AlertCircle",
      options: ["Peanuts", "Soy", "Shellfish", "Eggs"],
    },
  ];

  // Toggle logic
  const handleConditionToggle = (condition) => {
    const updated = selectedConditions.includes(condition)
      ? selectedConditions.filter((c) => c !== condition)
      : [...selectedConditions, condition];

    setSelectedConditions(updated);
    onUpdate(updated);
  };

  // Reset
  const handleReset = () => {
    setSelectedConditions([]);
    onUpdate([]);
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      {/* Header */}
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
            <Icon name="HeartPulse" size={20} className="text-accent" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Health Conditions
            </h3>
            <p className="text-sm text-muted-foreground">
              Specify medical or dietary conditions for safer recommendations
            </p>
          </div>
        </div>
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={20}
          className="text-muted-foreground"
        />
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6 space-y-8">
            {conditionCategories.map((category) => (
              <div key={category.id}>
                <div className="flex items-center space-x-2 mb-3">
                  <Icon name={category.icon} size={18} className="text-primary" />
                  <div>
                    <h4 className="font-body font-medium text-foreground">
                      {category.title}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {category.description}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {category.options.map((condition) => {
                    const isSelected = selectedConditions.includes(condition);
                    return (
                      <div
                        key={condition}
                        className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 ${isSelected
                          ? "border-primary bg-primary/5"
                          : "border-border bg-background hover:border-primary/30"
                          }`}
                        onClick={() => handleConditionToggle(condition)}
                      >
                        <div className="text-center">
                          <span className="font-body font-medium text-foreground text-sm">
                            {condition}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          {/* Action Buttons */}
          <div className="flex items-center justify-end mt-8 pt-4 border-t border-border">
            <Button
              variant="default"
              size="sm"
              onClick={async () => {
                setSaveStatus("Saving...");
                await onUpdate(selectedConditions);
                setSaveStatus("Saved ✅");
                setTimeout(() => setSaveStatus(""), 2000);
              }}
            >
              {saveStatus || "Save Preferences"}
            </Button>
          </div>

        </div>
      )}
    </div>
  );
};

export default HealthConditionsSection;
