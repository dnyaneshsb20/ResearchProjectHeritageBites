import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FloatingActionButton = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const actions = [
    {
      id: 'submit-recipe',
      label: 'Submit Recipe',
      icon: 'Plus',
      link: '/recipe-submission-management',
      color: 'bg-primary hover:bg-primary/90'
    },
    {
      id: 'quick-search',
      label: 'Quick Search',
      icon: 'Search',
      onClick: () => {
        document.querySelector('input[type="search"]')?.focus();
        setIsExpanded(false);
      },
      color: 'bg-secondary hover:bg-secondary/90'
    },
    {
      id: 'marketplace',
      label: 'Shop Ingredients',
      icon: 'ShoppingBag',
      link: '/ingredient-marketplace',
      color: 'bg-warning hover:bg-warning/90'
    }
  ];

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleActionClick = (action) => {
    if (action?.onClick) {
      action?.onClick();
    }
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Action Buttons */}
      <div className={`flex flex-col space-y-3 mb-3 transition-all duration-300 ${
        isExpanded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}>
        {actions?.map((action, index) => (
          <div
            key={action?.id}
            className="flex items-center space-x-3"
            style={{
              transitionDelay: isExpanded ? `${index * 50}ms` : '0ms'
            }}
          >
            {/* Label */}
            <div className="bg-popover border border-border rounded-lg px-3 py-2 shadow-warm-lg">
              <span className="text-sm font-medium text-foreground whitespace-nowrap">
                {action?.label}
              </span>
            </div>

            {/* Action Button */}
            {action?.link ? (
              <Link to={action?.link} onClick={() => setIsExpanded(false)}>
                <button
                  className={`w-12 h-12 rounded-full shadow-warm-lg flex items-center justify-center transition-all duration-200 ${action?.color}`}
                  aria-label={action?.label}
                >
                  <Icon name={action?.icon} size={20} color="white" />
                </button>
              </Link>
            ) : (
              <button
                onClick={() => handleActionClick(action)}
                className={`w-12 h-12 rounded-full shadow-warm-lg flex items-center justify-center transition-all duration-200 ${action?.color}`}
                aria-label={action?.label}
              >
                <Icon name={action?.icon} size={20} color="white" />
              </button>
            )}
          </div>
        ))}
      </div>
      {/* Main FAB */}
      <button
        onClick={toggleExpanded}
        className={`w-14 h-14 bg-primary hover:bg-primary/90 rounded-full shadow-warm-xl flex items-center justify-center transition-all duration-300 ${
          isExpanded ? 'rotate-45' : 'rotate-0'
        }`}
        aria-label={isExpanded ? 'Close menu' : 'Open quick actions'}
      >
        <Icon name="Plus" size={24} color="white" />
      </button>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
          onClick={() => setIsExpanded(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default FloatingActionButton;