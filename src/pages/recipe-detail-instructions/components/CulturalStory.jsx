import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const CulturalStory = ({ story, chef, region }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
          <Icon name="BookOpen" size={20} className="text-primary" />
        </div>
        <h2 className="text-xl font-heading font-semibold text-foreground">
          Cultural Story
        </h2>
      </div>
      {/* Story Content */}
      <div className="mb-6">
        <p className={`text-sm font-body text-foreground leading-relaxed ${
          !isExpanded ? 'line-clamp-4' : ''
        }`}>
          {story?.content}
        </p>
        
        {story?.content?.length > 200 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-2 text-sm font-body font-medium text-primary hover:text-primary-foreground hover:bg-primary px-2 py-1 rounded transition-all"
          >
            {isExpanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
      {/* Historical Context */}
      {story?.history && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg">
          <div className="flex items-start space-x-3">
            <Icon name="Clock" size={16} className="text-warning mt-1" />
            <div>
              <h3 className="font-body font-medium text-foreground mb-2">
                Historical Context
              </h3>
              <p className="text-sm text-muted-foreground">
                {story?.history}
              </p>
            </div>
          </div>
        </div>
      )}
      {/* Regional Information */}
      <div className="mb-6 p-4 bg-secondary/10 border border-secondary/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <Icon name="MapPin" size={16} className="text-secondary mt-1" />
          <div>
            <h3 className="font-body font-medium text-foreground mb-2">
              Regional Significance
            </h3>
            <p className="text-sm text-muted-foreground mb-3">
              {region?.significance}
            </p>
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <span>Origin: {region?.origin}</span>
              <span>•</span>
              <span>Popular in: {region?.popularIn}</span>
            </div>
          </div>
        </div>
      </div>
      {/* Chef/Contributor Profile */}
      {chef && (
        <div className="border-t border-border pt-6">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Recipe Contributor
          </h3>
          <div className="flex items-start space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-muted flex-shrink-0">
              <Image
                src={chef?.avatar}
                alt={chef?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-body font-medium text-foreground">
                {chef?.name}
              </h4>
              <p className="text-sm text-muted-foreground mb-2">
                {chef?.title}
              </p>
              <p className="text-sm text-foreground mb-3">
                {chef?.bio}
              </p>
              
              {/* Chef Stats */}
              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Icon name="BookOpen" size={12} />
                  <span>{chef?.recipesCount} recipes</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} />
                  <span>{chef?.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={12} />
                  <span>{chef?.rating} rating</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Cultural Tags */}
      <div className="mt-6 pt-6 border-t border-border">
        <h3 className="font-heading font-semibold text-foreground mb-3">
          Cultural Tags
        </h3>
        <div className="flex flex-wrap gap-2">
          {story?.tags?.map((tag, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-primary/10 text-primary text-xs font-body font-medium rounded-full border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
      {/* Fun Facts */}
      {story?.funFacts && story?.funFacts?.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <h3 className="font-heading font-semibold text-foreground mb-4">
            Did You Know?
          </h3>
          <div className="space-y-3">
            {story?.funFacts?.map((fact, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon name="Lightbulb" size={12} className="text-warning" />
                </div>
                <p className="text-sm text-foreground">{fact}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CulturalStory;