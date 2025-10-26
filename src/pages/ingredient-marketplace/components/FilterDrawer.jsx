import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';
import { supabase } from '../../../supabaseClient';

const FilterDrawer = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
  onIngredientsUpdate
}) => {
  const [regions, setRegions] = useState([]);
  const [certifications, setCertifications] = useState([]);

  // ✅ Static price ranges
  const priceRanges = [
    { id: 'under-100', label: 'Under ₹100', min: 0, max: 100 },
    { id: '100-300', label: '₹100 - ₹300', min: 100, max: 300 },
    { id: '300-500', label: '₹300 - ₹500', min: 300, max: 500 },
    { id: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
    { id: 'above-1000', label: 'Above ₹1000', min: 1000, max: null }
  ];

  // ✅ Fetch regions and certifications dynamically
  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        // 🌍 Fetch distinct regions from states
        const { data: regionData, error: regionError } = await supabase
          .from('states')
          .select('region')
          .neq('region', '');

        if (regionError) throw regionError;

        const uniqueRegions = [...new Set(regionData.map(r => r.region))]
          .map(region => ({
            id: region, // use the actual name
            label: region
          }));


        setRegions(uniqueRegions);

        // 🧾 Fetch distinct certifications from products
        const { data: certData, error: certError } = await supabase
          .from('products')
          .select('certifications')
          .not('certifications', 'is', null);

        if (certError) throw certError;

        // Some products may have comma-separated certifications
        const allCerts = certData
          .map(p => p.certifications)
          .flatMap(cert => cert.split(',').map(c => c.trim()))
          .filter(Boolean);

        const uniqueCerts = [...new Set(allCerts)].map(cert => ({
          id: cert.toLowerCase().replace(/\s+/g, '-'),
          label: cert
        }));

        setCertifications(uniqueCerts);
      } catch (error) {
        console.error('Error fetching filter data:', error);
      }
    };

    fetchFilterData();
  }, []);
const fetchFilteredIngredients = async (selectedRegions) => {
  if (!selectedRegions?.length) {
    onIngredientsUpdate([]); // No region selected
    return;
  }
  try {
    // 1. Get states in selected regions
    const { data: statesData, error: statesError } = await supabase
      .from('states')
      .select('state_id')
      .in('region', selectedRegions);
    if (statesError) throw statesError;

    const stateIds = statesData.map(s => s.state_id);

    // 2. Get ingredient IDs for those states
    const { data: ingredientStatesData, error: ingStateError } = await supabase
      .from('ingredient_states')
      .select('ingredient_id')
      .in('state_id', stateIds);
    if (ingStateError) throw ingStateError;

    const ingredientIds = ingredientStatesData.map(i => i.ingredient_id);

    // 3. Fetch ingredients
    const { data: ingredients, error: ingredientsError } = await supabase
      .from('ingredients')
      .select('*')
      .in('ingredient_id', ingredientIds);
    if (ingredientsError) throw ingredientsError;

    onIngredientsUpdate(ingredients); // send filtered ingredients to parent
  } catch (err) {
    console.error('Error fetching filtered ingredients:', err);
  }
};

  // ✅ Handlers
  const handleRegionChange = (regionId, checked) => {
  const updatedRegions = checked
    ? [...filters?.regions, regionId]
    : filters?.regions?.filter(id => id !== regionId);

  onFilterChange({ ...filters, regions: updatedRegions });

  fetchFilteredIngredients(updatedRegions); // 🔥 Fetch ingredients
};


  const handleCertificationChange = (certId, checked) => {
    const updatedCertifications = checked
      ? [...filters?.certifications, certId]
      : filters?.certifications?.filter(id => id !== certId);
    onFilterChange({ ...filters, certifications: updatedCertifications });
  };

  const handlePriceRangeChange = (rangeId, checked) => {
    const updatedPriceRanges = checked
      ? [...filters?.priceRanges, rangeId]
      : filters?.priceRanges?.filter(id => id !== rangeId);
    onFilterChange({ ...filters, priceRanges: updatedPriceRanges });
  };
  

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay for mobile */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />

      {/* Drawer container */}
      <div
        className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-xl z-50 transform transition-transform duration-300 lg:relative lg:transform-none lg:border lg:rounded-lg lg:shadow-warm-md ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
          }`}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-border lg:hidden">
          <h3 className="text-lg font-heading font-semibold text-foreground">Filters</h3>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-heading font-semibold text-foreground">Filter Products</h3>
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Clear All
          </Button>
        </div>

        {/* Filter Content */}
        <div className="max-h-96 lg:max-h-none overflow-y-auto p-4 space-y-6">

          {/* 🌍 Regions */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Regions</h4>
            <div className="space-y-2">
              {regions.map((region) => (
                <Checkbox
                  key={region.id}
                  label={region.label}
                  checked={filters?.regions?.includes(region.id)}
                  onChange={(e) => handleRegionChange(region.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* 🧾 Certifications */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Certifications</h4>
            <div className="space-y-2">
              {certifications.map((cert) => (
                <Checkbox
                  key={cert.id}
                  label={cert.label}
                  checked={filters?.certifications?.includes(cert.id)}
                  onChange={(e) => handleCertificationChange(cert.id, e.target.checked)}
                />
              ))}
            </div>
          </div>

          {/* 💰 Price Range */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceRanges.map((range) => (
                <Checkbox
                  key={range.id}
                  label={range.label}
                  checked={filters?.priceRanges?.includes(range.id)}
                  onChange={(e) => handlePriceRangeChange(range.id, e.target.checked)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Mobile Footer */}
        <div className="flex gap-3 p-4 border-t border-border lg:hidden">
          <Button variant="outline" onClick={onClearFilters} className="flex-1">
            Clear All
          </Button>
          <Button onClick={onClose} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterDrawer;
