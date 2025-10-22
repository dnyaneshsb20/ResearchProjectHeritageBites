import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const FilterChips = ({ categories = [], onFilterChange }) => {
  const [activeFilters, setActiveFilters] = useState([]);

  const toggleFilter = (filterId) => {
    const newActiveFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
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
      <div className="space-y-3">
        {categories.map((category) => (
          <div key={category.id}>
            <div className="flex items-center space-x-2 mb-2">
              <Icon name={category.icon || 'Circle'} size={16} className="text-muted-foreground" />
              <span className="text-sm font-medium text-foreground">{category.label}</span>
            </div>
            <div className="flex flex-wrap gap-2 ml-6">
              {category.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => toggleFilter(option.id)}
                  className={`inline-flex items-center space-x-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                    activeFilters.includes(option.id)
                      ? 'bg-secondary text-secondary-foreground'
                      : 'bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20'
                  }`}
                >
                  <Icon name={option.icon || 'Circle'} size={12} />
                  <span>{option.label}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <span className="text-sm text-muted-foreground">
            {activeFilters.length} filter{activeFilters.length !== 1 ? 's' : ''} applied
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
