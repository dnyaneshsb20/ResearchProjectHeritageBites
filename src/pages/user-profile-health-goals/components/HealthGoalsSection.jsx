import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const HealthGoalsSection = ({ isExpanded, onToggle, healthGoals, onUpdate }) => {
  const [selectedGoals, setSelectedGoals] = useState(healthGoals);

  const goalOptions = [
    {
      id: 'weight-loss',
      title: 'Weight Management',
      description: 'Maintain healthy weight with balanced nutrition',
      icon: 'Scale',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      progress: 65
    },
    {
      id: 'diabetes-friendly',
      title: 'Diabetes Management',
      description: 'Low glycemic index recipes for blood sugar control',
      icon: 'Activity',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      progress: 80
    },
    {
      id: 'heart-health',
      title: 'Heart Health',
      description: 'Low sodium, heart-friendly traditional recipes',
      icon: 'Heart',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      progress: 45
    },
    {
      id: 'digestive-health',
      title: 'Digestive Wellness',
      description: 'Gut-friendly ingredients and cooking methods',
      icon: 'Zap',
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      progress: 70
    },
    {
      id: 'immunity-boost',
      title: 'Immunity Boost',
      description: 'Ayurvedic ingredients for stronger immunity',
      icon: 'Shield',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      progress: 55
    },
    {
      id: 'energy-vitality',
      title: 'Energy & Vitality',
      description: 'Nutrient-dense foods for sustained energy',
      icon: 'Zap',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      progress: 60
    }
  ];

  const handleGoalToggle = (goalId) => {
    const updatedGoals = selectedGoals?.includes(goalId)
      ? selectedGoals?.filter(id => id !== goalId)
      : [...selectedGoals, goalId];

    setSelectedGoals(updatedGoals);
    onUpdate(updatedGoals);
  };

  const getProgressColor = (progress) => {
    if (progress >= 70) return 'bg-success';
    if (progress >= 50) return 'bg-warning';
    return 'bg-accent';
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
            <Icon name="Target" size={20} className="text-success" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Health Goals
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedGoals?.length} goals selected for personalized recommendations
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
            {/* Goals Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goalOptions?.map((goal) => {
                const isSelected = selectedGoals?.includes(goal?.id);
                return (
                  <div
                    key={goal?.id}
                    className={`relative p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer ${isSelected
                        ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/30'
                      }`}
                    onClick={() => handleGoalToggle(goal?.id)}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${goal?.bgColor}`}>
                        <Icon name={goal?.icon} size={20} className={goal?.color} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-body font-medium text-foreground">
                            {goal?.title}
                          </h4>
                          <Checkbox
                            checked={isSelected}
                            onChange={() => handleGoalToggle(goal?.id)}
                          />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {goal?.description}
                        </p>

                        {/* Progress Bar */}
                        {isSelected && (
                          <div className="mt-3">
                            <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                              <span>Progress</span>
                              <span>{goal?.progress}%</span>
                            </div>
                            <div className="w-full bg-muted rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal?.progress)}`}
                                style={{ width: `${goal?.progress}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            {/* Action Buttons */}
            <div className="flex items-center justify-end mt-6 pt-4 border-t border-border">
              <Button variant="default" size="sm">
                Save Preferences
              </Button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default HealthGoalsSection;