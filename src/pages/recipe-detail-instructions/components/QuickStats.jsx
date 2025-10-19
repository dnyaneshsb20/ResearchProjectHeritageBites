import React from 'react';
import Icon from '../../../components/AppIcon';

const QuickStats = ({ recipe }) => {
  const stats = [
    {
      icon: 'Clock',
      label: 'Prep Time',
      value: recipe?.prep_time,
      color: 'text-primary'
    },
    {
      icon: 'ChefHat',
      label: 'Cook Time',
      value: recipe?.cooking_time,
      color: 'text-secondary'
    },
    {
      icon: 'Users',
      label: 'Serves',
      value: recipe?.servings,
      color: 'text-accent'
    },
    {
      icon: 'TrendingUp',
      label: 'Difficulty',
      value: recipe?.difficulty_level,
      color: 'text-warning'
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'text-success';
      case 'medium': return 'text-warning';
      case 'hard': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats?.map((stat, index) => (
          <div key={index} className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div className={`p-2 rounded-full bg-muted ${stat?.color}`}>
                <Icon name={stat?.icon} size={20} />
              </div>
            </div>
            <p className="text-sm font-body text-muted-foreground mb-1">
              {stat?.label}
            </p>
            <p className={`font-heading font-semibold ${
              stat?.label === 'Difficulty' 
                ? getDifficultyColor(stat?.value)
                : 'text-foreground'
            }`}>
              {stat?.value}
            </p>
          </div>
        ))}
      </div>
      {/* Rating */}
      <div className="flex items-center justify-center mt-4 pt-4 border-t border-border">
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5]?.map((star) => (
              <Icon
                key={star}
                name="Star"
                size={16}
                className={`${
                  star <= Math.floor(recipe?.rating)
                    ? 'text-warning fill-current' :'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          <span className="font-body font-medium text-foreground">
            {recipe?.rating}
          </span>
          <span className="text-sm text-muted-foreground">
            ({recipe?.reviewCount} reviews)
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuickStats;