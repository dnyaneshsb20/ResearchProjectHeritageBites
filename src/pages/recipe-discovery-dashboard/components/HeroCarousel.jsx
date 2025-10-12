import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const featuredContent = [
    {
      id: 1,
      type: 'recipe',
      title: 'Authentic Rajasthani Dal Baati Churma',
      subtitle: 'Traditional Desert Delicacy',
      description: 'Experience the royal flavors of Rajasthan with this time-honored recipe passed down through generations.',
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&h=600&fit=crop',
      region: 'Rajasthan',
      cookingTime: '2 hours',
      difficulty: 'Medium',
      badge: 'Festival Special',
      link: '/recipe-detail-instructions'
    },
    {
      id: 2,
      type: 'story',
      title: 'Meet Kamala Devi: Guardian of Ancient Grains',
      subtitle: 'Farmer Story',
      description: 'Discover how this 65-year-old farmer from Karnataka is preserving indigenous millet varieties.',
      image: 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800&h=600&fit=crop',
      region: 'Karnataka',
      badge: 'Cultural Heritage',
      link: '/recipe-discovery-dashboard'
    },
    {
      id: 3,
      type: 'recipe',
      title: 'Kerala Fish Curry with Coconut',
      subtitle: 'Coastal Comfort Food',
      description: 'Dive into the aromatic spices and fresh coconut flavors of this traditional Kerala delicacy.',
      image: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&h=600&fit=crop',
      region: 'Kerala',
      cookingTime: '45 mins',
      difficulty: 'Easy',
      badge: 'Monsoon Special',
      link: '/recipe-detail-instructions'
    }
  ];

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featuredContent?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, featuredContent?.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToPrevious = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredContent?.length) % featuredContent?.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredContent?.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const currentContent = featuredContent?.[currentSlide];

  return (
    <div className="relative w-full h-80 lg:h-96 overflow-hidden rounded-xl bg-muted">
      {/* Main Slide */}
      <div className="relative w-full h-full">
        <Image
          src={currentContent?.image}
          alt={currentContent?.title}
          className="w-full h-full object-cover"
        />
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        
        {/* Content */}
        <div className="absolute inset-0 flex items-center">
          <div className="px-6 lg:px-12 max-w-2xl">
            {/* Badge */}
            <div className="flex items-center space-x-2 mb-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                {currentContent?.badge}
              </span>
              <span className="inline-flex items-center space-x-1 text-white/80 text-sm">
                <Icon name="MapPin" size={14} />
                <span>{currentContent?.region}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-2xl lg:text-4xl font-heading font-bold text-white mb-2">
              {currentContent?.title}
            </h1>
            
            {/* Subtitle */}
            <p className="text-lg lg:text-xl text-white/90 font-medium mb-3">
              {currentContent?.subtitle}
            </p>
            
            {/* Description */}
            <p className="text-white/80 text-sm lg:text-base mb-4 line-clamp-2">
              {currentContent?.description}
            </p>

            {/* Recipe Meta (if recipe type) */}
            {currentContent?.type === 'recipe' && (
              <div className="flex items-center space-x-4 mb-6 text-white/80 text-sm">
                <div className="flex items-center space-x-1">
                  <Icon name="Clock" size={16} />
                  <span>{currentContent?.cookingTime}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="BarChart3" size={16} />
                  <span>{currentContent?.difficulty}</span>
                </div>
              </div>
            )}

            {/* CTA Button */}
            <Link to={currentContent?.link}>
              <Button variant="default" className="bg-white text-foreground hover:bg-white/90">
                {currentContent?.type === 'recipe' ? 'View Recipe' : 'Read Story'}
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
        {featuredContent?.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-200 ${
              index === currentSlide ? 'bg-white' : 'bg-white/50'
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
    </div>
  );
};

export default HeroCarousel;