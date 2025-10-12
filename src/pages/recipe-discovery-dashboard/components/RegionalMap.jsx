import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const RegionalMap = ({ onRegionSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);

  const regions = [
    {
      id: 'north',
      name: 'North India',
      states: ['Punjab', 'Haryana', 'Delhi', 'Uttar Pradesh', 'Himachal Pradesh', 'Uttarakhand'],
      specialties: ['Butter Chicken', 'Rajma Chawal', 'Chole Bhature', 'Makki di Roti'],
      recipeCount: 245,
      color: 'bg-red-500',
      position: 'top-20 left-1/2 transform -translate-x-1/2'
    },
    {
      id: 'west',
      name: 'West India',
      states: ['Maharashtra', 'Gujarat', 'Rajasthan', 'Goa'],
      specialties: ['Vada Pav', 'Dhokla', 'Dal Baati Churma', 'Fish Curry'],
      recipeCount: 198,
      color: 'bg-orange-500',
      position: 'top-32 left-20'
    },
    {
      id: 'east',
      name: 'East India',
      states: ['West Bengal', 'Odisha', 'Jharkhand', 'Bihar'],
      specialties: ['Fish Curry', 'Rasgulla', 'Litti Chokha', 'Pakhala'],
      recipeCount: 167,
      color: 'bg-green-500',
      position: 'top-32 right-20'
    },
    {
      id: 'south',
      name: 'South India',
      states: ['Tamil Nadu', 'Kerala', 'Karnataka', 'Andhra Pradesh', 'Telangana'],
      specialties: ['Dosa', 'Sambar', 'Biryani', 'Appam', 'Rasam'],
      recipeCount: 312,
      color: 'bg-blue-500',
      position: 'bottom-20 left-1/2 transform -translate-x-1/2'
    },
    {
      id: 'northeast',
      name: 'Northeast India',
      states: ['Assam', 'Meghalaya', 'Manipur', 'Mizoram', 'Nagaland', 'Tripura', 'Arunachal Pradesh'],
      specialties: ['Momos', 'Bamboo Shoot Curry', 'Fish Tenga', 'Jadoh'],
      recipeCount: 89,
      color: 'bg-purple-500',
      position: 'top-16 right-16'
    },
    {
      id: 'central',
      name: 'Central India',
      states: ['Madhya Pradesh', 'Chhattisgarh'],
      specialties: ['Poha', 'Bhutte ka Kees', 'Sabudana Khichdi'],
      recipeCount: 134,
      color: 'bg-yellow-500',
      position: 'top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'
    }
  ];

  const handleRegionClick = (region) => {
    setSelectedRegion(region?.id === selectedRegion ? null : region?.id);
    onRegionSelect?.(region);
  };

  const getRegionInfo = (regionId) => {
    return regions?.find(r => r?.id === regionId);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Explore by Region
          </h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {regions?.reduce((sum, region) => sum + region?.recipeCount, 0)} recipes
        </span>
      </div>
      {/* Interactive Map */}
      <div className="relative w-full h-80 bg-muted/30 rounded-lg overflow-hidden mb-4">
        {/* India Map Outline (Simplified) */}
        <div className="absolute inset-0 bg-gradient-to-br from-muted/20 to-muted/40 rounded-lg">
          <div className="absolute inset-4 border-2 border-dashed border-muted-foreground/20 rounded-lg">
            {/* Region Markers */}
            {regions?.map((region) => (
              <button
                key={region?.id}
                onClick={() => handleRegionClick(region)}
                onMouseEnter={() => setHoveredRegion(region?.id)}
                onMouseLeave={() => setHoveredRegion(null)}
                className={`absolute w-4 h-4 rounded-full transition-all duration-200 ${region?.position} ${
                  selectedRegion === region?.id
                    ? `${region?.color} scale-150 shadow-lg`
                    : hoveredRegion === region?.id
                    ? `${region?.color} scale-125`
                    : `${region?.color} hover:scale-110`
                }`}
                aria-label={`Select ${region?.name}`}
              >
                <span className="sr-only">{region?.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Hover Tooltip */}
        {hoveredRegion && (
          <div className="absolute top-2 left-2 bg-popover border border-border rounded-lg p-3 shadow-warm-lg z-10">
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {getRegionInfo(hoveredRegion)?.name}
              </p>
              <p className="text-muted-foreground">
                {getRegionInfo(hoveredRegion)?.recipeCount} recipes
              </p>
            </div>
          </div>
        )}
      </div>
      {/* Region List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {regions?.map((region) => (
          <button
            key={region?.id}
            onClick={() => handleRegionClick(region)}
            className={`text-left p-3 rounded-lg border transition-all duration-200 ${
              selectedRegion === region?.id
                ? 'border-primary bg-primary/5 shadow-warm'
                : 'border-border hover:border-primary/20 hover:bg-muted/50'
            }`}
          >
            <div className="flex items-center space-x-2 mb-2">
              <div className={`w-3 h-3 rounded-full ${region?.color}`} />
              <span className="font-medium text-foreground text-sm">
                {region?.name}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mb-1">
              {region?.recipeCount} recipes
            </p>
            <p className="text-xs text-muted-foreground line-clamp-1">
              {region?.specialties?.slice(0, 2)?.join(', ')}
              {region?.specialties?.length > 2 && '...'}
            </p>
          </button>
        ))}
      </div>
      {/* Selected Region Details */}
      {selectedRegion && (
        <div className="mt-4 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-foreground">
              {getRegionInfo(selectedRegion)?.name}
            </h4>
            <span className="text-sm text-muted-foreground">
              {getRegionInfo(selectedRegion)?.recipeCount} recipes
            </span>
          </div>
          
          <div className="space-y-2">
            <div>
              <p className="text-xs text-muted-foreground mb-1">States:</p>
              <p className="text-sm text-foreground">
                {getRegionInfo(selectedRegion)?.states?.join(', ')}
              </p>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Popular Dishes:</p>
              <div className="flex flex-wrap gap-1">
                {getRegionInfo(selectedRegion)?.specialties?.map((dish, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                  >
                    {dish}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegionalMap;