import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RegionalFavoritesSection = ({ isExpanded, onToggle, favorites, onUpdate }) => {
  const [selectedRegions, setSelectedRegions] = useState(favorites);

  const indianStates = [
    { id: 'punjab', name: 'Punjab', specialties: ['Butter Chicken', 'Makki di Roti', 'Sarson da Saag'], color: 'bg-orange-100 text-orange-800' },
    { id: 'gujarat', name: 'Gujarat', specialties: ['Dhokla', 'Thepla', 'Gujarati Dal'], color: 'bg-green-100 text-green-800' },
    { id: 'rajasthan', name: 'Rajasthan', specialties: ['Dal Baati Churma', 'Laal Maas', 'Ghevar'], color: 'bg-red-100 text-red-800' },
    { id: 'maharashtra', name: 'Maharashtra', specialties: ['Vada Pav', 'Puran Poli', 'Misal Pav'], color: 'bg-blue-100 text-blue-800' },
    { id: 'tamil-nadu', name: 'Tamil Nadu', specialties: ['Dosa', 'Sambar', 'Rasam'], color: 'bg-purple-100 text-purple-800' },
    { id: 'kerala', name: 'Kerala', specialties: ['Fish Curry', 'Appam', 'Payasam'], color: 'bg-teal-100 text-teal-800' },
    { id: 'west-bengal', name: 'West Bengal', specialties: ['Fish Curry', 'Rosogolla', 'Mishti Doi'], color: 'bg-yellow-100 text-yellow-800' },
    { id: 'karnataka', name: 'Karnataka', specialties: ['Bisi Bele Bath', 'Mysore Pak', 'Ragi Mudde'], color: 'bg-indigo-100 text-indigo-800' },
    { id: 'andhra-pradesh', name: 'Andhra Pradesh', specialties: ['Biryani', 'Gongura Pickle', 'Pesarattu'], color: 'bg-pink-100 text-pink-800' },
    { id: 'uttar-pradesh', name: 'Uttar Pradesh', specialties: ['Lucknowi Biryani', 'Petha', 'Bedmi Puri'], color: 'bg-gray-100 text-gray-800' },
    { id: 'bihar', name: 'Bihar', specialties: ['Litti Chokha', 'Sattu Paratha', 'Khaja'], color: 'bg-amber-100 text-amber-800' },
    { id: 'odisha', name: 'Odisha', specialties: ['Pakhala Bhata', 'Rasgulla', 'Chhena Poda'], color: 'bg-lime-100 text-lime-800' }
  ];

  const cuisineTypes = [
    { id: 'north-indian', name: 'North Indian', description: 'Rich gravies, wheat-based breads', icon: 'Mountain' },
    { id: 'south-indian', name: 'South Indian', description: 'Rice-based, coconut, curry leaves', icon: 'Palmtree' },
    { id: 'coastal', name: 'Coastal', description: 'Seafood, coconut, tropical flavors', icon: 'Waves' },
    { id: 'street-food', name: 'Street Food', description: 'Quick bites, chaat, snacks', icon: 'Truck' },
    { id: 'festival-special', name: 'Festival Special', description: 'Traditional celebration dishes', icon: 'Sparkles' },
    { id: 'ayurvedic', name: 'Ayurvedic', description: 'Health-focused, medicinal herbs', icon: 'Leaf' }
  ];

  const handleRegionToggle = (regionId) => {
    const updatedRegions = selectedRegions?.includes(regionId)
      ? selectedRegions?.filter(id => id !== regionId)
      : [...selectedRegions, regionId];
    
    setSelectedRegions(updatedRegions);
    onUpdate(updatedRegions);
  };

  const getSelectedRegionNames = () => {
    return indianStates?.filter(state => selectedRegions?.includes(state?.id))?.map(state => state?.name)?.join(', ');
  };

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
            <Icon name="MapPin" size={20} className="text-secondary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Regional Favorites
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedRegions?.length} regions selected for authentic recipes
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
            {/* Interactive Map Placeholder */}
            <div className="mb-6">
              <h4 className="font-body font-medium text-foreground mb-3">
                Explore Indian Cuisines
              </h4>
              <div className="bg-muted/30 rounded-lg p-6 text-center border-2 border-dashed border-border">
                <Icon name="Map" size={48} className="text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">
                  Interactive map of Indian states and their signature dishes
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Click on states below to explore regional cuisines
                </p>
              </div>
            </div>

            {/* State Selection Grid */}
            <div className="mb-6">
              <h4 className="font-body font-medium text-foreground mb-3">
                Select Your Favorite Regions
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {indianStates?.map((state) => {
                  const isSelected = selectedRegions?.includes(state?.id);
                  return (
                    <div
                      key={state?.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        isSelected
                          ? 'border-primary bg-primary/5' :'border-border bg-background hover:border-primary/30'
                      }`}
                      onClick={() => handleRegionToggle(state?.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h5 className="font-body font-medium text-foreground">
                          {state?.name}
                        </h5>
                        {isSelected && (
                          <Icon name="Check" size={16} className="text-primary" />
                        )}
                      </div>
                      <div className="space-y-1">
                        {state?.specialties?.slice(0, 2)?.map((specialty, index) => (
                          <span
                            key={index}
                            className={`inline-block px-2 py-1 rounded-full text-xs font-caption mr-1 ${state?.color}`}
                          >
                            {specialty}
                          </span>
                        ))}
                        {state?.specialties?.length > 2 && (
                          <span className="text-xs text-muted-foreground">
                            +{state?.specialties?.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Cuisine Types */}
            <div className="mb-6">
              <h4 className="font-body font-medium text-foreground mb-3">
                Cuisine Preferences
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {cuisineTypes?.map((cuisine) => (
                  <div
                    key={cuisine?.id}
                    className="p-3 rounded-lg border border-border bg-background hover:border-primary/30 transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <Icon name={cuisine?.icon} size={18} className="text-primary" />
                      <div>
                        <h5 className="font-body font-medium text-foreground text-sm">
                          {cuisine?.name}
                        </h5>
                        <p className="text-xs text-muted-foreground">
                          {cuisine?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Regions Summary */}
            {selectedRegions?.length > 0 && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start space-x-3">
                  <Icon name="Heart" size={16} className="text-primary mt-0.5" />
                  <div>
                    <h4 className="font-body font-medium text-foreground mb-1">
                      Your Regional Preferences
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      You've selected cuisines from: <strong>{getSelectedRegionNames()}</strong>
                    </p>
                    <p className="text-sm text-muted-foreground">
                      We'll prioritize authentic recipes from these regions in your recommendations, 
                      featuring traditional cooking methods and indigenous ingredients.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Cultural Context */}
            <div className="mt-6 p-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg">
              <div className="flex items-start space-x-3">
                <Icon name="BookOpen" size={16} className="text-primary mt-0.5" />
                <div>
                  <h4 className="font-body font-medium text-foreground mb-1">
                    Cultural Heritage
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Each region's cuisine tells a story of local ingredients, climate, traditions, and history. 
                    Our recipes include cultural context and the significance of dishes in local celebrations and daily life.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
              <Button variant="outline" size="sm">
                Explore All Regions
              </Button>
              <Button variant="default" size="sm">
                Get Regional Recipes
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalFavoritesSection;