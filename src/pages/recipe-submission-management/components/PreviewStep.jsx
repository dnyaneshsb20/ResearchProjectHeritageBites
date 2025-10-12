import React from 'react';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';

const PreviewStep = ({ formData, onPrevious, onSubmit, onSaveDraft }) => {
  const formatTime = (time) => {
    return time || 'Not specified';
  };

  const formatList = (list) => {
    return list && list?.length > 0 ? list?.join(', ') : 'None specified';
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            Recipe Preview
          </h2>
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Icon name="Eye" size={16} />
            <span>How others will see your recipe</span>
          </div>
        </div>
        
        {/* Hero Section */}
        <div className="mb-8">
          {formData?.heroImage && (
            <div className="relative mb-6">
              <Image
                src={formData?.heroImage}
                alt={formData?.dishName}
                className="w-full h-64 lg:h-80 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-lg" />
              <div className="absolute bottom-4 left-4 text-white">
                <h1 className="text-2xl lg:text-3xl font-heading font-bold mb-2">
                  {formData?.dishName || 'Recipe Name'}
                </h1>
                <p className="text-sm opacity-90">
                  {formData?.shortDescription || 'Recipe description'}
                </p>
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-muted rounded-lg">
              <Icon name="Clock" size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Prep Time</p>
              <p className="font-body font-medium">{formatTime(formData?.prepTime)}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Icon name="ChefHat" size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Cook Time</p>
              <p className="font-body font-medium">{formatTime(formData?.cookTime)}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Icon name="Users" size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Serves</p>
              <p className="font-body font-medium">{formData?.serves || 'Not specified'}</p>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <Icon name="BarChart" size={20} className="mx-auto mb-2 text-primary" />
              <p className="text-xs text-muted-foreground">Difficulty</p>
              <p className="font-body font-medium capitalize">{formData?.difficulty || 'Not specified'}</p>
            </div>
          </div>
          
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {formData?.region && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                {formData?.region?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
              </span>
            )}
            {formData?.category && (
              <span className="px-3 py-1 bg-secondary text-secondary-foreground text-xs font-medium rounded-full">
                {formData?.category?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
              </span>
            )}
            {(formData?.dietaryCategories || [])?.slice(0, 3)?.map((diet) => (
              <span key={diet} className="px-3 py-1 bg-success text-success-foreground text-xs font-medium rounded-full">
                {diet?.replace('-', ' ')?.replace(/\b\w/g, l => l?.toUpperCase())}
              </span>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Ingredients */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Ingredients ({(formData?.ingredients || [])?.length})
            </h3>
            {(formData?.ingredients || [])?.length > 0 ? (
              <div className="space-y-2">
                {formData?.ingredients?.map((ingredient, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 bg-muted rounded">
                    <div className="w-2 h-2 bg-primary rounded-full" />
                    <span className="font-body font-medium">{ingredient?.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {ingredient?.quantity} {ingredient?.unit}
                    </span>
                    {ingredient?.notes && (
                      <span className="text-xs text-muted-foreground italic">
                        ({ingredient?.notes})
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No ingredients added</p>
            )}
          </div>
          
          {/* Nutrition */}
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Nutrition (Per Serving)
            </h3>
            {formData?.calories || formData?.carbs || formData?.protein || formData?.fat ? (
              <div className="grid grid-cols-2 gap-3">
                {formData?.calories && (
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Calories</p>
                    <p className="font-body font-medium">{formData?.calories} kcal</p>
                  </div>
                )}
                {formData?.carbs && (
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Carbs</p>
                    <p className="font-body font-medium">{formData?.carbs}g</p>
                  </div>
                )}
                {formData?.protein && (
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Protein</p>
                    <p className="font-body font-medium">{formData?.protein}g</p>
                  </div>
                )}
                {formData?.fat && (
                  <div className="p-3 bg-muted rounded">
                    <p className="text-xs text-muted-foreground">Fat</p>
                    <p className="font-body font-medium">{formData?.fat}g</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">No nutrition information provided</p>
            )}
          </div>
        </div>
        
        {/* Instructions */}
        <div className="mt-8">
          <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
            Instructions ({(formData?.instructions || [])?.length} steps)
          </h3>
          {(formData?.instructions || [])?.length > 0 ? (
            <div className="space-y-4">
              {formData?.instructions?.map((instruction, index) => (
                <div key={index} className="flex space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-body font-medium text-foreground mb-2">
                      {instruction?.step}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {instruction?.description}
                    </p>
                    {instruction?.image && (
                      <Image
                        src={instruction?.image}
                        alt={`Step ${index + 1}`}
                        className="w-full max-w-md h-32 object-cover rounded mb-2"
                      />
                    )}
                    {instruction?.tips && (
                      <div className="p-2 bg-warning/10 rounded text-xs text-warning-foreground">
                        <Icon name="Lightbulb" size={12} className="inline mr-1" />
                        {instruction?.tips}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No instructions added</p>
          )}
        </div>
        
        {/* Cultural Context */}
        {(formData?.dishHistory || formData?.familyTraditions || formData?.culturalSignificance) && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Cultural Heritage
            </h3>
            <div className="space-y-4">
              {formData?.dishHistory && (
                <div>
                  <h4 className="font-body font-medium text-foreground mb-2">History & Origin</h4>
                  <p className="text-sm text-muted-foreground">{formData?.dishHistory}</p>
                </div>
              )}
              {formData?.familyTraditions && (
                <div>
                  <h4 className="font-body font-medium text-foreground mb-2">Family Traditions</h4>
                  <p className="text-sm text-muted-foreground">{formData?.familyTraditions}</p>
                </div>
              )}
              {formData?.culturalSignificance && (
                <div>
                  <h4 className="font-body font-medium text-foreground mb-2">Cultural Significance</h4>
                  <p className="text-sm text-muted-foreground">{formData?.culturalSignificance}</p>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Video Demo */}
        {formData?.videoDemo && (
          <div className="mt-8 pt-6 border-t border-border">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
              Video Demonstration
            </h3>
            <video
              src={formData?.videoDemo}
              controls
              className="w-full max-w-2xl h-64 rounded-lg"
            />
          </div>
        )}
      </div>
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            variant="secondary"
            onClick={onSaveDraft}
            iconName="Save"
            iconPosition="left"
          >
            Save as Draft
          </Button>
          
          <Button
            variant="default"
            onClick={onSubmit}
            iconName="Send"
            iconPosition="left"
          >
            Submit for Review
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreviewStep;