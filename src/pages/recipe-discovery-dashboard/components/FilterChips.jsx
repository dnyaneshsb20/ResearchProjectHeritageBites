import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const filterCategories = [
    {
      id: 'meal',
      label: 'Meal Type',
      icon: 'Utensils',
      options: [
        { id: 'breakfast', label: 'Breakfast', icon: 'Coffee' },
        { id: 'lunch', label: 'Lunch', icon: 'Sun' },
        { id: 'dinner', label: 'Dinner', icon: 'Moon' },
        { id: 'snacks', label: 'Snacks', icon: 'Cookie' }
      ]
    },
    {
      id: 'dietary',
      label: 'Dietary',
      icon: 'Leaf',
      options: [
        { id: 'vegetarian', label: 'Vegetarian', icon: 'Leaf' },
        { id: 'vegan', label: 'Vegan', icon: 'Sprout' },
        { id: 'gluten-free', label: 'Gluten Free', icon: 'Shield' },
        { id: 'dairy-free', label: 'Dairy Free', icon: 'Milk' }
      ]
    },
    {
      id: 'occasion',
      label: 'Festival',
      icon: 'Calendar',
      options: [
        { id: 'diwali', label: 'Diwali', icon: 'Sparkles' },
        { id: 'holi', label: 'Holi', icon: 'Palette' },
        { id: 'eid', label: 'Eid', icon: 'Star' },
        { id: 'navratri', label: 'Navratri', icon: 'Crown' }
      ]
    },
    {
      id: 'cooking-time',
      label: 'Time',
      icon: 'Clock',
      options: [
        { id: 'quick', label: '< 30 min', icon: 'Zap' },
        { id: 'medium', label: '30-60 min', icon: 'Clock' },
        { id: 'long', label: '> 1 hour', icon: 'Timer' }
      ]
    },
    {
      id: 'difficulty',
      label: 'Difficulty',
      icon: 'BarChart3',
      options: [
        { id: 'easy', label: 'Easy', icon: 'ThumbsUp' },
        { id: 'medium', label: 'Medium', icon: 'Minus' },
        { id: 'hard', label: 'Hard', icon: 'Flame' }
      ]
    }
  ];

  // const quickFilters = [
  //   { id: 'trending', label: 'Trending', icon: 'TrendingUp' },
  //   { id: 'new', label: 'New Recipes', icon: 'Plus' },
  //   { id: 'seasonal', label: 'Seasonal', icon: 'Leaf' },
  //   { id: 'healthy', label: 'Healthy', icon: 'Heart' }
  // ];

  const toggleFilter = (filterId) => {
    const newActiveFilters = activeFilters?.includes(filterId)
      ? activeFilters?.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    
    setActiveFilters(newActiveFilters);
    onFilterChange?.(newActiveFilters);
  };

  const clearAllFilters = () => {
    setActiveFilters([]);
    onFilterChange?.([]);
  };

  return (
    <div className="space-y-4">
      {/* Quick Filters */}
      {/* <div className="flex flex-wrap gap-2">
        {quickFilters?.map((filter) => (
          <button
            key={filter?.id}
            onClick={() => toggleFilter(filter?.id)}
            className={`inline-flex items-center space-x-2 px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              activeFilters?.includes(filter?.id)
                ? 'bg-primary text-primary-foreground shadow-warm'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
            }`}
          >
            <Icon name={filter?.icon} size={14} />
            <span>{filter?.label}</span>
          </button>
        ))}
      </div> */}
      {/* Category Filters */}
      <div className="space-y-3">
        {filterCategories?.map((category) => (
          <div key={category?.id}>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={category?.icon} size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{category?.label}</span>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {category?.options?.map((option) => (
                <button
                  key={option?.id}
                  onClick={() => toggleFilter(option?.id)}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeFilters?.includes(option?.id)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20'
                  }`}
                >
                  <Icon name={option?.icon} size={12} />
                  <span>{option?.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      {/* Clear Filters */}
      {activeFilters?.length > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {activeFilters?.length} filter{activeFilters?.length !== 1 ? 's' : ''} applied
          </span>
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default FilterChips;