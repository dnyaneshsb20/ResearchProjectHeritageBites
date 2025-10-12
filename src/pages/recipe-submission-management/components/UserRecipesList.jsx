import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const UserRecipesList = ({ onNewRecipe }) => {
  const [activeTab, setActiveTab] = useState('published');
  
  const userRecipes = {
    published: [
      {
        id: 1,
        title: "Authentic Rajasthani Dal Baati Churma",
        image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
        status: "published",
        publishedDate: "2024-08-10",
        views: 1247,
        likes: 89,
        rating: 4.8,
        category: "Main Course",
        region: "North India"
      },
      {
        id: 2,
        title: "Traditional Kerala Fish Curry",
        image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400",
        status: "published",
        publishedDate: "2024-08-05",
        views: 892,
        likes: 67,
        rating: 4.6,
        category: "Main Course",
        region: "South India"
      },
      {
        id: 3,
        title: "Bengali Mishti Doi",
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
        status: "published",
        publishedDate: "2024-07-28",
        views: 634,
        likes: 45,
        rating: 4.7,
        category: "Dessert",
        region: "East India"
      }
    ],
    pending: [
      {
        id: 4,
        title: "Gujarati Dhokla with Green Chutney",
        image: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400",
        status: "pending",
        submittedDate: "2024-08-12",
        feedback: "Please add more details about the fermentation process.",
        category: "Snacks",
        region: "West India"
      }
    ],
    drafts: [
      {
        id: 5,
        title: "Assamese Pitha Recipe",
        image: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400",
        status: "draft",
        lastModified: "2024-08-11",
        completionPercentage: 75,
        category: "Dessert",
        region: "Northeast India"
      },
      {
        id: 6,
        title: "Maharashtrian Puran Poli",
        image: null,
        status: "draft",
        lastModified: "2024-08-09",
        completionPercentage: 40,
        category: "Dessert",
        region: "West India"
      }
    ]
  };

  const tabs = [
    { id: 'published', label: 'Published', count: userRecipes?.published?.length, icon: 'CheckCircle' },
    { id: 'pending', label: 'Under Review', count: userRecipes?.pending?.length, icon: 'Clock' },
    { id: 'drafts', label: 'Drafts', count: userRecipes?.drafts?.length, icon: 'Edit' }
  ];

  const getStatusBadge = (status) => {
    const statusConfig = {
      published: { color: 'bg-success text-success-foreground', label: 'Published' },
      pending: { color: 'bg-warning text-warning-foreground', label: 'Under Review' },
      draft: { color: 'bg-muted text-muted-foreground', label: 'Draft' }
    };
    
    const config = statusConfig?.[status] || statusConfig?.draft;
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString)?.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const renderRecipeCard = (recipe) => (
    <div key={recipe?.id} className="bg-card rounded-lg overflow-hidden shadow-warm hover:shadow-warm-md transition-all duration-200">
      <div className="relative">
        {recipe?.image ? (
          <Image
            src={recipe?.image}
            alt={recipe?.title}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-muted flex items-center justify-center">
            <Icon name="ImageOff" size={48} className="text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          {getStatusBadge(recipe?.status)}
        </div>
        {recipe?.completionPercentage && (
          <div className="absolute bottom-3 left-3 right-3">
            <div className="bg-black/50 rounded-full p-2">
              <div className="flex items-center justify-between text-white text-xs mb-1">
                <span>Progress</span>
                <span>{recipe?.completionPercentage}%</span>
              </div>
              <div className="w-full bg-white/20 rounded-full h-1">
                <div 
                  className="bg-primary h-1 rounded-full transition-all duration-300"
                  style={{ width: `${recipe?.completionPercentage}%` }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="font-heading font-semibold text-foreground line-clamp-2">
            {recipe?.title}
          </h3>
          <Button variant="ghost" size="icon" className="flex-shrink-0">
            <Icon name="MoreVertical" size={16} />
          </Button>
        </div>
        
        <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
          <span className="flex items-center space-x-1">
            <Icon name="MapPin" size={14} />
            <span>{recipe?.region}</span>
          </span>
          <span className="flex items-center space-x-1">
            <Icon name="Tag" size={14} />
            <span>{recipe?.category}</span>
          </span>
        </div>
        
        {recipe?.status === 'published' && (
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <Icon name="Eye" size={14} />
                <span>{recipe?.views?.toLocaleString()}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Heart" size={14} />
                <span>{recipe?.likes}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Icon name="Star" size={14} />
                <span>{recipe?.rating}</span>
              </span>
            </div>
            <span>Published {formatDate(recipe?.publishedDate)}</span>
          </div>
        )}
        
        {recipe?.status === 'pending' && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground mb-2">
              Submitted {formatDate(recipe?.submittedDate)}
            </p>
            {recipe?.feedback && (
              <div className="p-2 bg-warning/10 rounded text-xs text-warning-foreground">
                <Icon name="MessageCircle" size={12} className="inline mr-1" />
                {recipe?.feedback}
              </div>
            )}
          </div>
        )}
        
        {recipe?.status === 'draft' && (
          <div className="mb-3">
            <p className="text-sm text-muted-foreground">
              Last modified {formatDate(recipe?.lastModified)}
            </p>
          </div>
        )}
        
        <div className="flex items-center space-x-2">
          {recipe?.status === 'draft' ? (
            <Button variant="default" size="sm" fullWidth>
              <Icon name="Edit" size={14} className="mr-2" />
              Continue Editing
            </Button>
          ) : (
            <>
              <Button variant="outline" size="sm" className="flex-1">
                <Icon name="Eye" size={14} className="mr-2" />
                View
              </Button>
              <Button variant="ghost" size="sm" className="flex-1">
                <Icon name="Edit2" size={14} className="mr-2" />
                Edit
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            My Recipe Contributions
          </h1>
          <p className="text-muted-foreground">
            Manage your recipe submissions and track their status
          </p>
        </div>
        
        <Button variant="default" onClick={onNewRecipe} iconName="Plus" iconPosition="left">
          Submit New Recipe
        </Button>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
              <Icon name="CheckCircle" size={20} className="text-success" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {userRecipes?.published?.length}
              </p>
              <p className="text-sm text-muted-foreground">Published Recipes</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <Icon name="Eye" size={20} className="text-primary" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {userRecipes?.published?.reduce((sum, recipe) => sum + recipe?.views, 0)?.toLocaleString()}
              </p>
              <p className="text-sm text-muted-foreground">Total Views</p>
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg p-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
              <Icon name="Heart" size={20} className="text-secondary" />
            </div>
            <div>
              <p className="text-2xl font-heading font-bold text-foreground">
                {userRecipes?.published?.reduce((sum, recipe) => sum + recipe?.likes, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Likes</p>
            </div>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="bg-card rounded-lg">
        <div className="border-b border-border">
          <nav className="flex space-x-8 px-6">
            {tabs?.map((tab) => (
              <button
                key={tab?.id}
                onClick={() => setActiveTab(tab?.id)}
                className={`flex items-center space-x-2 py-4 border-b-2 font-body font-medium text-sm transition-colors ${
                  activeTab === tab?.id
                    ? 'border-primary text-primary' :'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={tab?.icon} size={16} />
                <span>{tab?.label}</span>
                <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">
                  {tab?.count}
                </span>
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6">
          {userRecipes?.[activeTab]?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userRecipes?.[activeTab]?.map(renderRecipeCard)}
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon name="BookOpen" size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                No {tabs?.find(t => t?.id === activeTab)?.label?.toLowerCase()} recipes
              </h3>
              <p className="text-muted-foreground mb-6">
                {activeTab === 'published' && "You haven't published any recipes yet."}
                {activeTab === 'pending' && "No recipes are currently under review."}
                {activeTab === 'drafts' && "You don't have any draft recipes."}
              </p>
              <Button variant="default" onClick={onNewRecipe} iconName="Plus" iconPosition="left">
                Submit Your First Recipe
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserRecipesList;