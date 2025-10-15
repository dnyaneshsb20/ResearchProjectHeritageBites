import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { supabase } from '../../../supabaseClient'; // Make sure your Supabase client is correctly imported

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [featuredContent, setFeaturedContent] = useState([]);

  // Fetch recipes from Supabase
  useEffect(() => {
    const fetchRecipes = async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          recipe_id,
          name,
          description,
          hero_image_url,
          cooking_time,
          difficulty_level,
          festival_tag,
          state_id,
          states(state_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5); // Limit number of slides if needed

      if (error) {
        console.error('Error fetching recipes:', error);
      } else {
        // Map the fetched recipes to the same structure used in the carousel
        const slides = data.map((recipe) => ({
          id: recipe.recipe_id,
          type: 'recipe',
          title: recipe.name,
          subtitle: recipe.states?.state_name || '',
          description: recipe.description,
          image: recipe.hero_image_url || 'https://via.placeholder.com/800x600',
          region: recipe.states?.state_name || 'Unknown',
          subtitle: recipe.states?.state_name || '',
          cookingTime: recipe.cooking_time ? `${recipe.cooking_time} mins` : 'N/A',
          difficulty: recipe.difficulty_level || 'Medium',
          badge: recipe.festival_tag || '',
          link: `/recipe-detail-instructions/${recipe.recipe_id}`
        }));
        setFeaturedContent(slides);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || featuredContent.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredContent]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredContent.length) % featuredContent.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredContent.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentContent = featuredContent[currentSlide];

  return (
    <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-xl bg-muted">
      {currentContent && (
        <>
          {/* Main Slide */}
          <div className="relative w-full h-full">
            <Image
              src={currentContent.image}
              alt={currentContent.title}
              className="w-full h-full object-cover"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />

            {/* Content */}
            <div className="absolute inset-0 flex items-center">
              <div className="px-6 lg:px-12 max-w-2xl">
                {/* Badge */}
                {currentContent.badge && (
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                      {currentContent.badge}
                    </span>
                    <span className="inline-flex items-center space-x-1 text-white/80 text-sm">
                      <Icon name="MapPin" size={14} />
                      <span>{currentContent.region}</span>
                    </span>
                  </div>
                )}

                {/* Title */}
                <h1 className="text-2xl lg:text-4xl font-heading font-bold text-white mb-2">
                  {currentContent.title}
                </h1>

                {/* Subtitle */}
                {currentContent.subtitle && (
                  <p className="text-lg lg:text-xl text-white/90 font-medium mb-3">
                    {/* {currentContent.subtitle} */}
                  </p>
                )}

                {/* Description */}
                {currentContent.description && (
                  <p className="text-white/80 text-sm lg:text-base mb-4 line-clamp-2">
                    {currentContent.description}
                  </p>
                )}

                {/* Recipe Meta */}
                {currentContent.type === 'recipe' && (
                  <div className="flex items-center space-x-4 mb-6 text-white/80 text-sm">
                    <div className="flex items-center space-x-1">
                      <Icon name="Clock" size={16} />
                      <span>{currentContent.cookingTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Icon name="BarChart3" size={16} />
                      <span>{currentContent.difficulty}</span>
                    </div>
                  </div>
                )}

                {/* CTA Button */}
                <Link to={currentContent.link}>
                  <Button variant="default" className="bg-white text-foreground hover:bg-white/90">
                    View Recipe
                    <Icon name="ArrowRight" size={16} className="ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Previous slide"
          >
            <Icon name="ChevronLeft" size={20} color="white" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
            aria-label="Next slide"
          >
            <Icon name="ChevronRight" size={20} color="white" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {featuredContent.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="w-8 h-8 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-200"
              aria-label={isAutoPlaying ? 'Pause slideshow' : 'Play slideshow'}
            >
              <Icon name={isAutoPlaying ? 'Pause' : 'Play'} size={14} color="white" />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
