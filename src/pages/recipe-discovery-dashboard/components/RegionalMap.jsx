import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import { supabase } from '../../../supabaseClient';

const RegionalMap = ({ onRegionSelect }) => {
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [hoveredRegion, setHoveredRegion] = useState(null);
  const [regions, setRegions] = useState([]);

  // Fetch region & recipe data
  useEffect(() => {
    const fetchRegions = async () => {
      const { data, error } = await supabase
        .from('states')
        .select(`
          state_id,
          state_name,
          region,
          recipes ( recipe_id, name )
        `);

      if (error) {
        console.error('Error fetching regions:', error);
        return;
      }

      // Group by region
      const grouped = data.reduce((acc, state) => {
        if (!acc[state.region]) {
          acc[state.region] = {
            id: state.region.toLowerCase().replace(/\s+/g, ''),
            name: state.region,
            states: [],
            recipes: []
          };
        }
        acc[state.region].states.push(state.state_name);
        acc[state.region].recipes.push(...(state.recipes || []));
        return acc;
      }, {});

      // Final mapped data
      setRegions(
        Object.values(grouped).map((r) => ({
          ...r,
          recipeCount: r.recipes.length,
          specialties: r.recipes.slice(0, 4).map((rec) => rec.name),
          color: getRegionColor(r.id),
          position: getRegionPosition(r.id)
        }))
      );
    };

    fetchRegions();
  }, []);

  // Region colors and map marker positions
  const getRegionColor = (id) => {
    const colors = {
      north: 'bg-red-500',
      south: 'bg-blue-500',
      east: 'bg-green-500',
      west: 'bg-orange-500',
      central: 'bg-yellow-500',
      northeast: 'bg-purple-500'
    };
    return colors[id] || 'bg-gray-400';
  };

 const getRegionPosition = (id) => {
  const positions = {
    north: "top-[12%] left-[30%]",      // Delhi, Punjab, Haryana
    south: "top-[82%] left-[32%]",      // Tamil Nadu, Kerala
    east: "top-[42%] left-[60%]",       // West Bengal, Odisha
    west: "top-[45%] left-[10%]",       // Gujarat, Rajasthan
    central: "top-[48%] left-[35%]",    // Madhya Pradesh, Chhattisgarh
    northeast: "top-[34%] left-[80%]", 
    northwest:  "top-[30%] left-[20%]",// Assam, Meghalaya
  };
  return positions[id] || "top-[50%] left-[50%]";
};



  const handleRegionClick = (region) => {
    setSelectedRegion(region?.id === selectedRegion ? null : region?.id);
    onRegionSelect?.(region);
  };

  const getRegionInfo = (id) => regions.find((r) => r.id === id);

  return (
    <div className="bg-card border border-border rounded-xl p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Icon name="Map" size={20} className="text-primary" />
          <h3 className="text-lg font-heading font-semibold text-foreground">
            Explore by Region
          </h3>
        </div>
        <span className="text-sm text-muted-foreground">
          {regions.reduce((sum, r) => sum + r.recipeCount, 0)} recipes
        </span>
      </div>

      {/* Dots Map */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-4 bg-muted/20 border border-dashed border-border">
        {/* India Map SVG (light gray, faded) */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/b/b4/India_outline.svg"
          alt="India Map"
          className="absolute inset-0 w-full h-full object-contain opacity-20"
        />

        {/* Region Dots */}
        {regions.map((region) => (
          <div
            key={region.id}
            className={`absolute ${region.position}`}
            onMouseEnter={() => setHoveredRegion(region.id)}
            onMouseLeave={() => setHoveredRegion(null)}
          >
            <button
              onClick={() => handleRegionClick(region)}
              className={`rounded-full transition-all duration-200 ${region.color
                } ${hoveredRegion === region.id
                  ? 'w-5 h-5 scale-125 shadow-lg'
                  : selectedRegion === region.id
                    ? 'w-5 h-5 scale-150 shadow-md'
                    : 'w-4 h-4 hover:scale-110'
                }`}
            />
          </div>
        ))}

        {/* Tooltip */}
        {hoveredRegion && (
          <div className="absolute left-1/2 top-2 transform -translate-x-1/2 bg-popover border border-border rounded-lg px-3 py-2 shadow-md text-xs z-10 animate-fade-in">
            <p className="font-medium text-foreground">
              {getRegionInfo(hoveredRegion)?.name}
            </p>
            <p className="text-muted-foreground">
              {getRegionInfo(hoveredRegion)?.recipeCount} recipes
            </p>
          </div>
        )}
      </div>


      {/* Region list below map */}
      <div className="grid grid-cols-2 gap-3">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => handleRegionClick(region)}
            className={`p-3 text-left rounded-lg border text-sm transition-all duration-200 ${selectedRegion === region.id
                ? 'border-primary bg-primary/5'
                : 'border-border hover:bg-muted/50'
              }`}
          >
            <div className="flex items-center space-x-2 mb-1">
              <span className={`w-3 h-3 rounded-full ${region.color}`} />
              <span className="font-medium">{region.name}</span>
            </div>
            <p className="text-muted-foreground text-xs">
              {region.recipeCount} recipes
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default RegionalMap;
