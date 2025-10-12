import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AchievementBadgesSection = ({ isExpanded, onToggle }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const achievements = [
    {
      id: 1,
      title: "First Recipe",
      description: "Cooked your first traditional recipe",
      icon: "ChefHat",
      category: "cooking",
      earned: true,
      earnedDate: "2024-07-15",
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200"
    },
    {
      id: 2,
      title: "Regional Explorer",
      description: "Tried recipes from 5 different states",
      icon: "Map",
      category: "exploration",
      earned: true,
      earnedDate: "2024-07-28",
      color: "text-blue-600",
      bgColor: "bg-blue-100",
      borderColor: "border-blue-200"
    },
    {
      id: 3,
      title: "Health Conscious",
      description: "Completed 10 diabetes-friendly recipes",
      icon: "Heart",
      category: "health",
      earned: true,
      earnedDate: "2024-08-05",
      color: "text-red-600",
      bgColor: "bg-red-100",
      borderColor: "border-red-200"
    },
    {
      id: 4,
      title: "Spice Master",
      description: "Mastered 15 different spice combinations",
      icon: "Flame",
      category: "cooking",
      earned: true,
      earnedDate: "2024-08-10",
      color: "text-orange-600",
      bgColor: "bg-orange-100",
      borderColor: "border-orange-200"
    },
    {
      id: 5,
      title: "Community Helper",
      description: "Shared 5 family recipes with the community",
      icon: "Users",
      category: "community",
      earned: true,
      earnedDate: "2024-08-12",
      color: "text-purple-600",
      bgColor: "bg-purple-100",
      borderColor: "border-purple-200"
    },
    {
      id: 6,
      title: "Festival Chef",
      description: "Cook traditional dishes for 3 festivals",
      icon: "Sparkles",
      category: "cultural",
      earned: false,
      progress: 2,
      total: 3,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
      borderColor: "border-yellow-200"
    },
    {
      id: 7,
      title: "Ingredient Expert",
      description: "Learn about 50 indigenous ingredients",
      icon: "Leaf",
      category: "knowledge",
      earned: false,
      progress: 32,
      total: 50,
      color: "text-green-600",
      bgColor: "bg-green-100",
      borderColor: "border-green-200"
    },
    {
      id: 8,
      title: "Master Chef",
      description: "Successfully cook 100 recipes",
      icon: "Award",
      category: "cooking",
      earned: false,
      progress: 67,
      total: 100,
      color: "text-gold-600",
      bgColor: "bg-gold-100",
      borderColor: "border-gold-200"
    }
  ];

  const categories = [
    { id: 'all', label: 'All Badges', count: achievements?.length },
    { id: 'cooking', label: 'Cooking', count: achievements?.filter(a => a?.category === 'cooking')?.length },
    { id: 'exploration', label: 'Exploration', count: achievements?.filter(a => a?.category === 'exploration')?.length },
    { id: 'health', label: 'Health', count: achievements?.filter(a => a?.category === 'health')?.length },
    { id: 'community', label: 'Community', count: achievements?.filter(a => a?.category === 'community')?.length },
    { id: 'cultural', label: 'Cultural', count: achievements?.filter(a => a?.category === 'cultural')?.length },
    { id: 'knowledge', label: 'Knowledge', count: achievements?.filter(a => a?.category === 'knowledge')?.length }
  ];

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements?.filter(a => a?.category === selectedCategory);

  const earnedCount = achievements?.filter(a => a?.earned)?.length;
  const totalCount = achievements?.length;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date?.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const AchievementCard = ({ achievement }) => (
    <div className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${
      achievement?.earned 
        ? `${achievement?.bgColor} ${achievement?.borderColor}` 
        : 'bg-muted/30 border-muted'
    }`}>
      {/* Achievement Icon */}
      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${
        achievement?.earned ? achievement?.bgColor : 'bg-muted'
      }`}>
        <Icon 
          name={achievement?.icon} 
          size={24} 
          className={achievement?.earned ? achievement?.color : 'text-muted-foreground'} 
        />
      </div>

      {/* Achievement Info */}
      <h4 className={`font-body font-semibold mb-1 ${
        achievement?.earned ? 'text-foreground' : 'text-muted-foreground'
      }`}>
        {achievement?.title}
      </h4>
      
      <p className={`text-sm mb-3 ${
        achievement?.earned ? 'text-foreground/80' : 'text-muted-foreground'
      }`}>
        {achievement?.description}
      </p>

      {/* Progress or Earned Date */}
      {achievement?.earned ? (
        <div className="flex items-center space-x-2">
          <Icon name="Check" size={14} className="text-success" />
          <span className="text-xs text-muted-foreground">
            Earned {formatDate(achievement?.earnedDate)}
          </span>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress</span>
            <span>{achievement?.progress}/{achievement?.total}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${(achievement?.progress / achievement?.total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Earned Badge */}
      {achievement?.earned && (
        <div className="absolute top-2 right-2">
          <div className="w-6 h-6 bg-success rounded-full flex items-center justify-center">
            <Icon name="Check" size={12} className="text-white" />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Award" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Achievement Badges
            </h3>
            <p className="text-sm text-muted-foreground">
              {earnedCount} of {totalCount} badges earned
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
            {/* Progress Overview */}
            <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-body font-medium text-foreground">
                  Overall Progress
                </h4>
                <span className="text-sm font-body font-medium text-foreground">
                  {Math.round((earnedCount / totalCount) * 100)}%
                </span>
              </div>
              <div className="w-full bg-muted rounded-full h-3 mb-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-3 rounded-full transition-all duration-500"
                  style={{ width: `${(earnedCount / totalCount) * 100}%` }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Keep cooking and exploring to unlock more achievements!
              </p>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                {categories?.map((category) => (
                  <button
                    key={category?.id}
                    onClick={() => setSelectedCategory(category?.id)}
                    className={`px-3 py-1.5 text-sm font-body font-medium rounded-full transition-all duration-200 ${
                      selectedCategory === category?.id
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {category?.label}
                    <span className="ml-1.5 text-xs opacity-75">
                      {category?.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Achievements Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAchievements?.map((achievement) => (
                <AchievementCard key={achievement?.id} achievement={achievement} />
              ))}
            </div>

            {/* Motivation Section */}
            <div className="mt-6 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="Target" size={16} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-foreground mb-1">
                    Next Milestone
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    You're close to earning the "Festival Chef" badge! Cook one more traditional festival dish to unlock it.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                Share Achievements
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

export default AchievementBadgesSection;