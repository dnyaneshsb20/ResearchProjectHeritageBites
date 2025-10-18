import React from 'react';
import Input from '../../../components/ui/Input';

import { Checkbox } from '../../../components/ui/Checkbox';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const CulturalContextStep = ({ formData, updateFormData, onNext, onPrevious }) => {
  const festivalOptions = [
    { value: 'diwali', label: 'Diwali' },
    { value: 'holi', label: 'Holi' },
    { value: 'dussehra', label: 'Dussehra' },
    { value: 'eid', label: 'Eid' },
    { value: 'christmas', label: 'Christmas' },
    { value: 'pongal', label: 'Pongal' },
    { value: 'onam', label: 'Onam' },
    { value: 'karva-chauth', label: 'Karva Chauth' },
    { value: 'raksha-bandhan', label: 'Raksha Bandhan' },
    { value: 'navratri', label: 'Navratri' },
    { value: 'ganesh-chaturthi', label: 'Ganesh Chaturthi' },
    { value: 'baisakhi', label: 'Baisakhi' }
  ];

  const occasionOptions = [
    { value: 'wedding', label: 'Wedding Ceremony' },
    { value: 'birthday', label: 'Birthday Celebration' },
    { value: 'religious', label: 'Religious Ceremony' },
    { value: 'harvest', label: 'Harvest Festival' },
    { value: 'seasonal', label: 'Seasonal Special' },
    { value: 'family-gathering', label: 'Family Gathering' },
    { value: 'mourning', label: 'Mourning Period' },
    { value: 'fasting', label: 'Fasting Period' }
  ];

  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const handleMultiSelectChange = (field, value) => {
    const currentValues = formData?.[field] || [];
    const updatedValues = currentValues?.includes(value)
      ? currentValues?.filter(v => v !== value)
      : [...currentValues, value];
    updateFormData({ [field]: updatedValues });
  };

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-lg p-6">
        <h2 className="text-xl font-heading font-semibold text-foreground mb-6">
          Cultural Context & Heritage
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Dish History & Origin
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={4}
                placeholder="Share the historical background and origin story of this dish..."
                value={formData?.origin_story || ''}
                onChange={(e) => handleInputChange('dishHistory', e?.target?.value)}
              />
            </div>
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Family Traditions
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="How is this dish prepared in your family? Any special traditions or memories?"
                value={formData?.familyTraditions || ''}
                onChange={(e) => handleInputChange('familyTraditions', e?.target?.value)}
              />
            </div>
            
            <Input
              label="Recipe Source"
              type="text"
              placeholder="e.g., Grandmother's recipe, Family cookbook"
              value={formData?.recipeSource || ''}
              onChange={(e) => handleInputChange('recipeSource', e?.target?.value)}
            />
            
            <Input
              label="Regional Variations"
              type="text"
              placeholder="How does this dish vary across different regions?"
              value={formData?.regionalVariations || ''}
              onChange={(e) => handleInputChange('regionalVariations', e?.target?.value)}
            />
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-3">
                Associated Festivals
              </label>
              <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                {festivalOptions?.map((festival) => (
                  <Checkbox
                    key={festival?.value}
                    label={festival?.label}
                    checked={(formData?.festivals || [])?.includes(festival?.value)}
                    onChange={() => handleMultiSelectChange('festivals', festival?.value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-3">
                Special Occasions
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-48 overflow-y-auto">
                {occasionOptions?.map((occasion) => (
                  <Checkbox
                    key={occasion?.value}
                    label={occasion?.label}
                    checked={(formData?.occasions || [])?.includes(occasion?.value)}
                    onChange={() => handleMultiSelectChange('occasions', occasion?.value)}
                  />
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-body font-medium text-foreground mb-2">
                Cultural Significance
              </label>
              <textarea
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
                rows={3}
                placeholder="What makes this dish culturally significant? Any symbolic meanings?"
                value={formData?.culturalSignificance || ''}
                onChange={(e) => handleInputChange('culturalSignificance', e?.target?.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-6 border-t border-border">
          <h3 className="text-lg font-heading font-medium text-foreground mb-4">
            Additional Information
          </h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Input
                label="Best Season to Prepare"
                type="text"
                placeholder="e.g., Winter, Monsoon, Summer"
                value={formData?.bestSeason || ''}
                onChange={(e) => handleInputChange('bestSeason', e?.target?.value)}
              />
              
              <Input
                label="Cooking Equipment"
                type="text"
                placeholder="Traditional equipment used (e.g., Clay pot, Tandoor)"
                value={formData?.cookingEquipment || ''}
                onChange={(e) => handleInputChange('cookingEquipment', e?.target?.value)}
              />
            </div>
            
            <div className="space-y-4">
              <Input
                label="Serving Suggestions"
                type="text"
                placeholder="What to serve this dish with?"
                value={formData?.servingSuggestions || ''}
                onChange={(e) => handleInputChange('servingSuggestions', e?.target?.value)}
              />
              
              <Input
                label="Storage Tips"
                type="text"
                placeholder="How to store and preserve this dish?"
                value={formData?.storageTips || ''}
                onChange={(e) => handleInputChange('storageTips', e?.target?.value)}
              />
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start space-x-3">
            <Icon name="Info" size={20} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-body font-medium text-foreground mb-2">
                Why Cultural Context Matters
              </h4>
              <p className="text-sm text-muted-foreground">
                Adding cultural context helps preserve the rich heritage of Indian cuisine. 
                It educates users about the traditions behind each dish and ensures authentic 
                preparation methods are passed down to future generations.
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={onPrevious}
          iconName="ArrowLeft"
          iconPosition="left"
        >
          Previous
        </Button>
        
        <Button
          variant="default"
          onClick={onNext}
          iconName="ArrowRight"
          iconPosition="right"
        >
          Next: Nutrition Info
        </Button>
      </div>
    </div>
  );
};

export default CulturalContextStep;