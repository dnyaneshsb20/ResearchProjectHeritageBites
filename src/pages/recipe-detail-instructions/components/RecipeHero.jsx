import React, { useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RecipeHero = ({ recipe, onBookmark, onShare }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);

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


        {/* Navigation Arrows */}
        {/* {recipe?.images?.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 w-10 h-10"
            >
              <Icon name="ChevronLeft" size={20} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 w-10 h-10"
            >
              <Icon name="ChevronRight" size={20} />
            </Button>
          </>
        )} */}

        {/* Image Indicators */}
        {/* {recipe?.images?.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {recipe?.images?.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                  }`}
              />
            ))}
          </div>
        )} */}

        {/* Overlay Content */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

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

        {/* Recipe Title and Region */}
        <div className="absolute bottom-4 left-4 right-4">
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-white mb-2">
            {recipe?.name}
          </h1>
          <div className="flex items-center space-x-2 text-white/90">
            <Icon name="MapPin" size={16} />
            <span className="text-sm font-body">{recipe?.region}</span>
            {/* <span className="text-sm">•</span>
            <span className="text-sm font-body">{recipe?.cuisine}</span> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeHero;