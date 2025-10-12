import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const FilterControls = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  onBulkAction,
  selectedCount 
}) => {
  const regionOptions = [
    { value: '', label: 'All Regions' },
    { value: 'north', label: 'North India' },
    { value: 'south', label: 'South India' },
    { value: 'east', label: 'East India' },
    { value: 'west', label: 'West India' },
    { value: 'northeast', label: 'Northeast India' },
    { value: 'central', label: 'Central India' }
  ];

  const categoryOptions = [
    { value: '', label: 'All Categories' },
    { value: 'main-course', label: 'Main Course' },
    { value: 'appetizer', label: 'Appetizer' },
    { value: 'dessert', label: 'Dessert' },
    { value: 'snack', label: 'Snack' },
    { value: 'beverage', label: 'Beverage' },
    { value: 'breakfast', label: 'Breakfast' }
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending Review' },
    { value: 'under-review', label: 'Under Review' },
    { value: 'needs-modification', label: 'Needs Changes' },
    { value: 'approved', label: 'Approved' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const contributorRatingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' },
    { value: '1', label: '1+ Stars' }
  ];

  const bulkActions = [
    { value: 'approve', label: 'Approve Selected', icon: 'Check', variant: 'default' },
    { value: 'reject', label: 'Reject Selected', icon: 'X', variant: 'destructive' },
    { value: 'request-changes', label: 'Request Changes', icon: 'Edit', variant: 'outline' },
    { value: 'feature', label: 'Feature Selected', icon: 'Star', variant: 'secondary' }
  ];

  const hasActiveFilters = Object.values(filters)?.some(value => value !== '');

  return (
    <div className="bg-card rounded-lg border border-border p-6 space-y-6">
      {/* Search and Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search recipes, contributors..."
              value={filters?.search}
              onChange={(e) => onFilterChange('search', e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={onClearFilters}
              iconName="X"
              iconPosition="left"
            >
              Clear Filters
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            iconName="Download"
            iconPosition="left"
          >
            Export
          </Button>
        </div>
      </div>
      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Region"
          options={regionOptions}
          value={filters?.region}
          onChange={(value) => onFilterChange('region', value)}
          placeholder="Select region"
        />

        <Select
          label="Category"
          options={categoryOptions}
          value={filters?.category}
          onChange={(value) => onFilterChange('category', value)}
          placeholder="Select category"
        />

        <Select
          label="Status"
          options={statusOptions}
          value={filters?.status}
          onChange={(value) => onFilterChange('status', value)}
          placeholder="Select status"
        />

        <Select
          label="Contributor Rating"
          options={contributorRatingOptions}
          value={filters?.contributorRating}
          onChange={(value) => onFilterChange('contributorRating', value)}
          placeholder="Select rating"
        />
      </div>
      {/* Date Range Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="From Date"
          type="date"
          value={filters?.fromDate}
          onChange={(e) => onFilterChange('fromDate', e?.target?.value)}
        />
        <Input
          label="To Date"
          type="date"
          value={filters?.toDate}
          onChange={(e) => onFilterChange('toDate', e?.target?.value)}
        />
      </div>
      {/* Bulk Actions */}
      {selectedCount > 0 && (
        <div className="border-t border-border pt-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <Icon name="CheckSquare" size={16} className="text-primary" />
              <span className="text-sm font-medium text-foreground">
                {selectedCount} recipe{selectedCount !== 1 ? 's' : ''} selected
              </span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {bulkActions?.map((action) => (
                <Button
                  key={action?.value}
                  variant={action?.variant}
                  size="sm"
                  onClick={() => onBulkAction(action?.value)}
                  iconName={action?.icon}
                  iconPosition="left"
                >
                  {action?.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterControls;