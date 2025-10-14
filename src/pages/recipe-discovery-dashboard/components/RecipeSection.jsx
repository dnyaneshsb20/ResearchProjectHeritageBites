import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import RecipeCard from './RecipeCard';

const RecipeSection = ({ title, subtitle, recipes, icon, showViewAll = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const itemsPerView = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    large: 4
  };

  const scrollToIndex = (index) => {
    if (scrollContainerRef?.current) {
      const container = scrollContainerRef?.current;
      const itemWidth = container?.scrollWidth / recipes?.length;
      container?.scrollTo({
        left: itemWidth * index,
        behavior: 'smooth'
      });
      setCurrentIndex(index);
    }
  };

  const scrollLeft = () => {
    const newIndex = Math.max(0, currentIndex - 1);
    scrollToIndex(newIndex);
  };

  const scrollRight = () => {
    const maxIndex = Math.max(0, recipes?.length - itemsPerView?.mobile);
    const newIndex = Math.min(maxIndex, currentIndex + 1);
    scrollToIndex(newIndex);
  };

  const canScrollLeft = currentIndex > 0;
  const canScrollRight = currentIndex < recipes?.length - itemsPerView?.mobile;

  return (
    <section className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {icon && <Icon name={icon} size={24} className="text-primary" />}
          <div>
            <h2 className="text-xl lg:text-2xl font-heading font-bold text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {showViewAll && (
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
            View All
            <Icon name="ArrowRight" size={16} className="ml-1" />
          </Button>
        )}
      </div>
      {/* Desktop Grid View */}
      <div className="hidden lg:grid lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {recipes?.slice(0, 8)?.map((recipe) => (
          <RecipeCard key={recipe?.recipe_id || recipe?.indg_recipe_id} recipe={recipe} />

        ))}
      </div>
      {/* Mobile/Tablet Horizontal Scroll */}
      <div className="lg:hidden relative">
        {/* Navigation Arrows */}
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full shadow-warm flex items-center justify-center"
            aria-label="Scroll left"
          >
            <Icon name="ChevronLeft" size={20} />
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 bg-background border border-border rounded-full shadow-warm flex items-center justify-center"
            aria-label="Scroll right"
          >
            <Icon name="ChevronRight" size={20} />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollContainerRef}
          className="flex space-x-4 overflow-x-auto scrollbar-hide pb-2"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {recipes?.map((recipe) => (
            <RecipeCard
              key={recipe?.id}
              recipe={recipe}
              className="flex-none w-72 sm:w-80 scroll-snap-align-start"
            />
          ))}
        </div>

        {/* Scroll Indicators */}
        <div className="flex justify-center space-x-2 mt-4">
          {Array.from({ length: Math.ceil(recipes?.length / itemsPerView?.mobile) })?.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollToIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                Math.floor(currentIndex / itemsPerView?.mobile) === index
                  ? 'bg-primary' :'bg-muted-foreground/30'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
      {/* Empty State */}
      {recipes?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No recipes found</h3>
          <p className="text-muted-foreground">
            Try adjusting your filters or explore different regions
          </p>
        </div>
      )}
    </section>
  );
};

export default RecipeSection;