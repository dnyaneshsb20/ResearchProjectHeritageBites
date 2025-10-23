import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';

const RecipeHero = ({ recipe, onBookmark, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const navigate = useNavigate();

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    onBookmark(recipe?.id);
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === recipe?.images?.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? recipe?.images?.length - 1 : prev - 1
    );
  };

  return (
    <div className="relative w-full h-64 md:h-80 lg:h-96 bg-muted rounded-lg overflow-hidden">
      {/* Image Carousel */}
      <div className="relative w-full h-full">
        <Image
          src={recipe?.hero_image_url || recipe?.image_url}
          alt={recipe?.name || "Recipe Image"}
          className="w-full h-full object-cover"
        />

        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute top-4 left-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/recipe-discovery-dashboard')}
            className="bg-black/50 text-white hover:bg-black/70 w-10 h-10"
            aria-label="Go Back"
          >
            <Icon name="ArrowLeft" size={18} />
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-4 right-4 flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className="bg-black/50 text-white hover:bg-black/70 w-10 h-10"
          >
            <Icon
              name={isBookmarked ? "Bookmark" : "BookmarkPlus"}
              size={18}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={onShare}
            className="bg-black/50 text-white hover:bg-black/70 w-10 h-10"
          >
            <Icon name="Share2" size={18} />
          </Button>
        </div>

        {/* Recipe Title, Festival Badge, and Region */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
            {recipe?.name}
          </h1>

          <div className="flex items-center flex-wrap gap-2 text-white/90">
            {/* Festival Tag Badge */}
            {recipe?.festival_tag && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {recipe.festival_tag}
              </span>
            )}

            {/* Region */}
            {recipe?.region && (
              <>
                <Icon name="MapPin" size={16} />
                <span className="text-sm font-body">{recipe.region}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHero;
