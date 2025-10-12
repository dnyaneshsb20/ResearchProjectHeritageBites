import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const SimilarRecipes = ({ recipes }) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Similar Recipes
        </h2>
        <Link to="/recipe-discovery-dashboard">
          <Button variant="ghost" size="sm" iconName="ArrowRight" iconPosition="right">
            View All
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes?.map((recipe) => (
          <Link
            key={recipe?.id}
            to={`/recipe-detail-instructions?id=${recipe?.id}`}
            className="group block"
          >
            <div className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-warm-md transition-all duration-200 group-hover:scale-[1.02]">
              {/* Recipe Image */}
              <div className="relative w-full h-32 bg-muted overflow-hidden">
                <Image
                  src={recipe?.image}
                  alt={recipe?.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
                
                {/* Difficulty Badge */}
                <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 text-xs font-caption font-medium rounded-full ${
                    recipe?.difficulty === 'Easy' ?'bg-success text-success-foreground'
                      : recipe?.difficulty === 'Medium' ?'bg-warning text-warning-foreground' :'bg-error text-error-foreground'
                  }`}>
                    {recipe?.difficulty}
                  </span>
                </div>

                {/* Bookmark Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-black/50 text-white hover:bg-black/70 w-8 h-8"
                  onClick={(e) => {
                    e?.preventDefault();
                    console.log('Bookmark recipe:', recipe?.id);
                  }}
                >
                  <Icon name="BookmarkPlus" size={14} />
                </Button>
              </div>

              {/* Recipe Content */}
              <div className="p-4">
                <h3 className="font-heading font-semibold text-foreground mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                  {recipe?.name}
                </h3>
                
                <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-3">
                  <div className="flex items-center space-x-1">
                    <Icon name="MapPin" size={12} />
                    <span>{recipe?.region}</span>
                  </div>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Icon name="Clock" size={12} />
                    <span>{recipe?.totalTime}</span>
                  </div>
                </div>

                {/* Rating */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <div className="flex items-center space-x-0.5">
                      {[1, 2, 3, 4, 5]?.map((star) => (
                        <Icon
                          key={star}
                          name="Star"
                          size={12}
                          className={`${
                            star <= Math.floor(recipe?.rating)
                              ? 'text-warning fill-current' :'text-muted-foreground'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-body text-muted-foreground">
                      ({recipe?.reviewCount})
                    </span>
                  </div>
                  
                  {/* Quick Stats */}
                  <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Icon name="Users" size={12} />
                      <span>{recipe?.servings}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {recipe?.tags?.slice(0, 2)?.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-caption rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {recipe?.tags?.length > 2 && (
                    <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-caption rounded-full">
                      +{recipe?.tags?.length - 2}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {/* Browse More */}
      <div className="mt-6 text-center">
        <Link to="/recipe-discovery-dashboard">
          <Button variant="outline" iconName="Search" iconPosition="left">
            Discover More Recipes
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default SimilarRecipes;