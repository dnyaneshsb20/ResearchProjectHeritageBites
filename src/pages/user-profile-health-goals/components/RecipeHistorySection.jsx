import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const RecipeHistorySection = ({ isExpanded, onToggle }) => {
  const [activeTab, setActiveTab] = useState('recent');

  const recentlyViewed = [
    {
      id: 1,
      name: "Hyderabadi Biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=300&h=200&fit=crop",
      region: "Andhra Pradesh",
      viewedAt: "2 hours ago",
      cookingTime: "2 hours",
      difficulty: "Advanced",
      rating: 4.8
    },
    {
      id: 2,
      name: "Gujarati Dhokla",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop",
      region: "Gujarat",
      viewedAt: "1 day ago",
      cookingTime: "45 mins",
      difficulty: "Medium",
      rating: 4.6
    },
    {
      id: 3,
      name: "Kerala Fish Curry",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=300&h=200&fit=crop",
      region: "Kerala",
      viewedAt: "2 days ago",
      cookingTime: "1 hour",
      difficulty: "Medium",
      rating: 4.7
    },
    {
      id: 4,
      name: "Rajasthani Dal Baati",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop",
      region: "Rajasthan",
      viewedAt: "3 days ago",
      cookingTime: "1.5 hours",
      difficulty: "Medium",
      rating: 4.5
    }
  ];

  const bookmarkedRecipes = [
    {
      id: 5,
      name: "Masala Dosa",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
      region: "Tamil Nadu",
      bookmarkedAt: "1 week ago",
      cookingTime: "1 hour",
      difficulty: "Medium",
      rating: 4.9,
      notes: "Perfect for weekend breakfast"
    },
    {
      id: 6,
      name: "Butter Chicken",
      image: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?w=300&h=200&fit=crop",
      region: "Punjab",
      bookmarkedAt: "2 weeks ago",
      cookingTime: "1.5 hours",
      difficulty: "Medium",
      rating: 4.8,
      notes: "Family favorite recipe"
    },
    {
      id: 7,
      name: "Pani Puri",
      image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=300&h=200&fit=crop",
      region: "Maharashtra",
      bookmarkedAt: "1 month ago",
      cookingTime: "30 mins",
      difficulty: "Easy",
      rating: 4.7,
      notes: "Great for parties"
    }
  ];

  const cookedRecipes = [
    {
      id: 8,
      name: "Chole Bhature",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=300&h=200&fit=crop",
      region: "Punjab",
      cookedAt: "Last Sunday",
      cookingTime: "2 hours",
      difficulty: "Medium",
      rating: 4.6,
      myRating: 5,
      feedback: "Turned out amazing! Family loved it."
    },
    {
      id: 9,
      name: "Sambar Rice",
      image: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=300&h=200&fit=crop",
      region: "Tamil Nadu",
      cookedAt: "3 days ago",
      cookingTime: "45 mins",
      difficulty: "Easy",
      rating: 4.5,
      myRating: 4,
      feedback: "Good comfort food"
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'text-green-600 bg-green-50';
      case 'Medium': return 'text-yellow-600 bg-yellow-50';
      case 'Advanced': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Icon
        key={i}
        name="Star"
        size={12}
        className={i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
      />
    ));
  };

  const RecipeCard = ({ recipe, type }) => (
    <div className="bg-background border border-border rounded-lg overflow-hidden hover:shadow-warm-md transition-all duration-200">
      <div className="relative h-32 overflow-hidden">
        <Image
          src={recipe?.image}
          alt={recipe?.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Button variant="ghost" size="icon" className="w-8 h-8 bg-background/80 backdrop-blur-sm">
            <Icon name={type === 'bookmarked' ? 'BookmarkCheck' : 'Bookmark'} size={14} />
          </Button>
        </div>
      </div>
      
      <div className="p-3">
        <h4 className="font-body font-medium text-foreground mb-1 line-clamp-1">
          {recipe?.name}
        </h4>
        
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs text-muted-foreground">{recipe?.region}</span>
          <span className="text-xs text-muted-foreground">•</span>
          <div className="flex items-center space-x-1">
            {renderStars(recipe?.rating)}
            <span className="text-xs text-muted-foreground">({recipe?.rating})</span>
          </div>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{recipe?.cookingTime}</span>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(recipe?.difficulty)}`}>
            {recipe?.difficulty}
          </span>
        </div>
        
        <div className="text-xs text-muted-foreground mb-3">
          {type === 'recent' && `Viewed ${recipe?.viewedAt}`}
          {type === 'bookmarked' && `Saved ${recipe?.bookmarkedAt}`}
          {type === 'cooked' && `Cooked ${recipe?.cookedAt}`}
        </div>
        
        {recipe?.notes && (
          <p className="text-xs text-muted-foreground italic mb-2">
            "{recipe?.notes}"
          </p>
        )}
        
        {recipe?.myRating && (
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-xs text-muted-foreground">My rating:</span>
            <div className="flex items-center space-x-1">
              {renderStars(recipe?.myRating)}
            </div>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" className="flex-1 text-xs">
            View Recipe
          </Button>
          {type === 'cooked' ? (
            <Button variant="default" size="sm" className="flex-1 text-xs">
              Cook Again
            </Button>
          ) : (
            <Button variant="default" size="sm" className="flex-1 text-xs">
              Start Cooking
            </Button>
          )}
        </div>
      </div>
    </div>
  );

  const tabs = [
    { id: 'recent', label: 'Recently Viewed', count: recentlyViewed?.length },
    { id: 'bookmarked', label: 'Bookmarked', count: bookmarkedRecipes?.length },
    { id: 'cooked', label: 'Cooked', count: cookedRecipes?.length }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'recent': return recentlyViewed;
      case 'bookmarked': return bookmarkedRecipes;
      case 'cooked': return cookedRecipes;
      default: return [];
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="History" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Recipe History
            </h3>
            <p className="text-sm text-muted-foreground">
              Your cooking journey and saved recipes
            </p>
          </div>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={20} 
          className="text-muted-foreground" 
        />
      </div>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6">
            {/* Tabs */}
            <div className="flex space-x-1 mb-6 bg-muted p-1 rounded-lg">
              {tabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex-1 px-3 py-2 text-sm font-body font-medium rounded-md transition-all duration-200 ${
                    activeTab === tab?.id
                      ? 'bg-background text-foreground shadow-warm'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab?.label}
                  <span className="ml-2 text-xs bg-muted-foreground/20 px-1.5 py-0.5 rounded-full">
                    {tab?.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Recipe Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {getCurrentData()?.map((recipe) => (
                <RecipeCard 
                  key={recipe?.id} 
                  recipe={recipe} 
                  type={activeTab}
                />
              ))}
            </div>

            {/* Empty State */}
            {getCurrentData()?.length === 0 && (
              <div className="text-center py-12">
                <Icon name="BookOpen" size={48} className="text-muted-foreground mx-auto mb-4" />
                <h4 className="font-body font-medium text-foreground mb-2">
                  No recipes yet
                </h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Start exploring recipes to build your cooking history
                </p>
                <Button variant="default">
                  Discover Recipes
                </Button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                Export History
              </Button>
              <Button variant="default" size="sm">
                Discover More Recipes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecipeHistorySection;