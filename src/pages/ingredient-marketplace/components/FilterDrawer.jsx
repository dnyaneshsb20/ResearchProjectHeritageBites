import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  filters, 
  onFilterChange, 
  onClearFilters 
}) => {
  const categories = [
    { id: 'grains', label: 'Ancient Grains', count: 45 },
    { id: 'spices', label: 'Traditional Spices', count: 78 },
    { id: 'oils', label: 'Cold-Pressed Oils', count: 23 },
    { id: 'pulses', label: 'Indigenous Pulses', count: 34 },
    { id: 'millets', label: 'Organic Millets', count: 28 },
    { id: 'herbs', label: 'Medicinal Herbs', count: 56 }
  ];

  const states = [
    { id: 'rajasthan', label: 'Rajasthan', count: 67 },
    { id: 'kerala', label: 'Kerala', count: 45 },
    { id: 'punjab', label: 'Punjab', count: 38 },
    { id: 'maharashtra', label: 'Maharashtra', count: 52 },
    { id: 'karnataka', label: 'Karnataka', count: 41 },
    { id: 'tamil-nadu', label: 'Tamil Nadu', count: 33 }
  ];

  const certifications = [
    { id: 'organic', label: 'Organic Certified', count: 89 },
    { id: 'traditional', label: 'Traditional Methods', count: 156 },
    { id: 'fair-trade', label: 'Fair Trade', count: 67 },
    { id: 'pesticide-free', label: 'Pesticide Free', count: 134 }
  ];

  const priceRanges = [
    { id: 'under-100', label: 'Under ₹100', min: 0, max: 100 },
    { id: '100-300', label: '₹100 - ₹300', min: 100, max: 300 },
    { id: '300-500', label: '₹300 - ₹500', min: 300, max: 500 },
    { id: '500-1000', label: '₹500 - ₹1000', min: 500, max: 1000 },
    { id: 'above-1000', label: 'Above ₹1000', min: 1000, max: null }
  ];

  const handleCategoryChange = (categoryId, checked) => {
    const updatedCategories = checked 
      ? [...filters?.categories, categoryId]
      : filters?.categories?.filter(id => id !== categoryId);
    onFilterChange({ ...filters, categories: updatedCategories });
  };

  const handleStateChange = (stateId, checked) => {
    const updatedStates = checked 
      ? [...filters?.states, stateId]
      : filters?.states?.filter(id => id !== stateId);
    onFilterChange({ ...filters, states: updatedStates });
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
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        onClick={onClose}
      />
      {/* Filter Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-background border-t border-border rounded-t-xl z-50 transform transition-transform duration-300 lg:relative lg:transform-none lg:border lg:rounded-lg lg:shadow-warm-md ${
        isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'
      }`}>
        {/* Header */}
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
          {/* Categories */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Categories</h4>
            <div className="space-y-2">
              {categories?.map((category) => (
                <div key={category?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={category?.label}
                    checked={filters?.categories?.includes(category?.id)}
                    onChange={(e) => handleCategoryChange(category?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-muted-foreground">({category?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Origin State */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Origin State</h4>
            <div className="space-y-2">
              {states?.map((state) => (
                <div key={state?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={state?.label}
                    checked={filters?.states?.includes(state?.id)}
                    onChange={(e) => handleStateChange(state?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-muted-foreground">({state?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Certifications</h4>
            <div className="space-y-2">
              {certifications?.map((cert) => (
                <div key={cert?.id} className="flex items-center justify-between">
                  <Checkbox
                    label={cert?.label}
                    checked={filters?.certifications?.includes(cert?.id)}
                    onChange={(e) => handleCertificationChange(cert?.id, e?.target?.checked)}
                  />
                  <span className="text-sm text-muted-foreground">({cert?.count})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <h4 className="font-body font-medium text-foreground mb-3">Price Range</h4>
            <div className="space-y-2">
              {priceRanges?.map((range) => (
                <Checkbox
                  key={range?.id}
                  label={range?.label}
                  checked={filters?.priceRanges?.includes(range?.id)}
                  onChange={(e) => handlePriceRangeChange(range?.id, e?.target?.checked)}
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