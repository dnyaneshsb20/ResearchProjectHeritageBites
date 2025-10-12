import React from 'react';
import { Link } from 'react-router-dom';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const StoryCard = ({ story, className = '' }) => {
  const {
    id,
    title,
    subtitle,
    image,
    author,
    readTime,
    category,
    publishedDate,
    excerpt,
    tags = []
  } = story;

  const getCategoryColor = (category) => {
    switch (category?.toLowerCase()) {
      case 'farmer story':
        return 'text-secondary bg-secondary/10';
      case 'chef interview':
        return 'text-primary bg-primary/10';
      case 'cultural heritage':
        return 'text-warning bg-warning/10';
      case 'ingredient spotlight':
        return 'text-success bg-success/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <Link to="/recipe-discovery-dashboard" className={`block ${className}`}>
      <article className="bg-card border border-border rounded-xl overflow-hidden shadow-warm hover:shadow-warm-md transition-all duration-200 animate-scale-hover">
        {/* Image Container */}
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryColor(category)}`}>
              {category}
            </span>
          </div>

          {/* Read Time */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            <Icon name="Clock" size={12} className="inline mr-1" />
            {readTime}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title and Subtitle */}
          <div className="mb-3">
            <h3 className="font-heading font-bold text-foreground text-lg mb-1 line-clamp-2">
              {title}
            </h3>
            {subtitle && (
              <p className="text-primary text-sm font-medium">
                {subtitle}
              </p>
            )}
          </div>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
              {excerpt}
            </p>
          )}

          {/* Tags */}
          {tags?.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-4">
              {tags?.slice(0, 3)?.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                >
                  #{tag}
                </span>
              ))}
              {tags?.length > 3 && (
                <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                  +{tags?.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Author and Date */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                <Icon name="User" size={12} color="white" />
              </div>
              <span>{author}</span>
            </div>
            
            <div className="flex items-center space-x-1">
              <Icon name="Calendar" size={14} />
              <span>{formatDate(publishedDate)}</span>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default StoryCard;