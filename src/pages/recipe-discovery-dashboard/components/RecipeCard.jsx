import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const RecipeCard = ({ recipe, className = '' }) => {
  const {
    id,
    title,
    image,
    region,
    cookingTime,
    difficulty,
    rating,
    reviewCount,
    tags = [],
    isBookmarked = false,
    chef,
    description
  } = recipe;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-success bg-success/10';
      case 'medium':
        return 'text-warning bg-warning/10';
      case 'hard':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const handleBookmark = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    console.log('Bookmark toggled for recipe:', id);
  };

  return (
    <Link to="/recipe-detail-instructions" className={`block ${className}`}>
      <div className="bg-card border border-border rounded-xl overflow-hidden shadow-warm hover:shadow-warm-md transition-all duration-200 animate-scale-hover">
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Bookmark Button */}
          <button
            onClick={handleBookmark}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
            aria-label={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
          >
            <Icon 
              name={isBookmarked ? 'Bookmark' : 'BookmarkPlus'} 
              size={16} 
              color={isBookmarked ? 'var(--color-primary)' : 'var(--color-muted-foreground)'} 
            />
          </button>

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="absolute bottom-3 left-3 flex flex-wrap gap-1">
              {tags?.slice(0, 2)?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full"
                >
                  {tag}
                </span>
              ))}
              {tags?.length > 2 && (
                <span className="px-2 py-1 bg-black/60 backdrop-blur-sm text-white text-xs font-medium rounded-full">
                  +{tags?.length - 2}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="font-heading font-semibold text-foreground text-lg mb-2 line-clamp-2">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {description}
            </p>
          )}

          {/* Meta Information */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Icon name="MapPin" size={14} />
                <span>{region}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Icon name="Clock" size={14} />
                <span>{cookingTime}</span>
              </div>
            </div>
            
            {difficulty && (
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(difficulty)}`}>
                {difficulty}
              </span>
            )}
          </div>

          {/* Rating and Chef */}
          <div className="flex items-center justify-between">
            {rating && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={14}
                      color={i < Math.floor(rating) ? 'var(--color-warning)' : 'var(--color-muted)'}
                      className={i < Math.floor(rating) ? 'fill-current' : ''}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {rating} ({reviewCount || 0})
                </span>
              </div>
            )}

            {chef && (
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <Icon name="User" size={12} color="white" />
                </div>
                <span className="text-xs text-muted-foreground">{chef}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;