import React from 'react';
import Icon from '../../../components/AppIcon';

const CategoryTabs = ({ activeCategory, onCategoryChange }) => {
  const categories = [
    { id: 'all', label: 'All Products', icon: 'Grid3X3' },
    { id: 'grains-cereals', label: 'Grains & Cereals', icon: 'Wheat' },
    { id: 'spices-condiments', label: 'Spices & Condiments', icon: 'Flame' },
    { id: 'oil-seeds', label: 'Oil Seeds', icon: 'Droplets' },
    { id: 'pulses-legumes', label: 'Pulses & Legumes', icon: 'Circle' },
    { id: 'millets', label: 'Millets', icon: 'Grain' },
    { id: 'fruits-vegetables', label: 'Fruits & Vegetables', icon: 'Leaf' }
  ];

  return (
    <div className="bg-background border-b border-border sticky top-16 z-30">
      <div className="overflow-x-auto">
        <div className="flex space-x-1 p-4 min-w-max lg:justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 whitespace-nowrap ${
                activeCategory === category.id
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <Icon name={category.icon} size={16} />
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryTabs;
