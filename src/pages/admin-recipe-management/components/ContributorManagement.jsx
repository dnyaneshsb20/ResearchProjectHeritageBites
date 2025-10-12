import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ContributorManagement = ({ contributors, onUpdateContributor, onViewContributor }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('submissions');
  const [filterRating, setFilterRating] = useState('');

  const sortOptions = [
    { value: 'submissions', label: 'Most Submissions' },
    { value: 'rating', label: 'Highest Rating' },
    { value: 'recent', label: 'Most Recent' },
    { value: 'name', label: 'Name A-Z' }
  ];

  const ratingOptions = [
    { value: '', label: 'All Ratings' },
    { value: '5', label: '5 Stars' },
    { value: '4', label: '4+ Stars' },
    { value: '3', label: '3+ Stars' },
    { value: '2', label: '2+ Stars' }
  ];

  const filteredContributors = contributors?.filter(contributor => {
      const matchesSearch = contributor?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
                           contributor?.email?.toLowerCase()?.includes(searchQuery?.toLowerCase());
      const matchesRating = !filterRating || contributor?.rating >= parseInt(filterRating);
      return matchesSearch && matchesRating;
    })?.sort((a, b) => {
      switch (sortBy) {
        case 'submissions':
          return b?.totalSubmissions - a?.totalSubmissions;
        case 'rating':
          return b?.rating - a?.rating;
        case 'recent':
          return new Date(b.lastSubmission) - new Date(a.lastSubmission);
        case 'name':
          return a?.name?.localeCompare(b?.name);
        default:
          return 0;
      }
    });

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { color: 'bg-success text-success-foreground', label: 'Active' },
      inactive: { color: 'bg-muted text-muted-foreground', label: 'Inactive' },
      suspended: { color: 'bg-destructive text-destructive-foreground', label: 'Suspended' },
      verified: { color: 'bg-primary text-primary-foreground', label: 'Verified' }
    };

    const config = statusConfig?.[status] || statusConfig?.active;
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config?.color}`}>
        {config?.label}
      </span>
    );
  };

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5]?.map((star) => (
          <Icon
            key={star}
            name="Star"
            size={14}
            className={star <= rating ? "text-warning fill-current" : "text-muted-foreground"}
          />
        ))}
        <span className="text-sm text-muted-foreground ml-1">({rating})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Contributor Management</h2>
          <p className="text-muted-foreground">Manage and monitor recipe contributors</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" iconName="Download" iconPosition="left">
            Export Data
          </Button>
          <Button variant="default" iconName="UserPlus" iconPosition="left">
            Invite Contributor
          </Button>
        </div>
      </div>
      {/* Filters */}
      <div className="bg-card rounded-lg border border-border p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Input
              type="search"
              placeholder="Search contributors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e?.target?.value)}
              className="pl-10"
            />
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
            />
          </div>
          
          <Select
            options={sortOptions}
            value={sortBy}
            onChange={setSortBy}
            placeholder="Sort by"
          />
          
          <Select
            options={ratingOptions}
            value={filterRating}
            onChange={setFilterRating}
            placeholder="Filter by rating"
          />
        </div>
      </div>
      {/* Contributors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContributors?.map((contributor) => (
          <div key={contributor?.id} className="bg-card rounded-lg border border-border p-6 hover:shadow-warm-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                  <Image
                    src={contributor?.avatar}
                    alt={contributor?.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground">{contributor?.name}</h3>
                  <p className="text-sm text-muted-foreground">{contributor?.location}</p>
                </div>
              </div>
              {getStatusBadge(contributor?.status)}
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Submissions</span>
                <span className="text-sm font-medium text-foreground">{contributor?.totalSubmissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Approved</span>
                <span className="text-sm font-medium text-success">{contributor?.approvedSubmissions}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Rating</span>
                {renderStars(contributor?.rating)}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Last Submission</span>
                <span className="text-sm text-muted-foreground">
                  {new Date(contributor.lastSubmission)?.toLocaleDateString('en-IN')}
                </span>
              </div>
            </div>

            {/* Specialties */}
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-2">Specialties</p>
              <div className="flex flex-wrap gap-1">
                {contributor?.specialties?.slice(0, 3)?.map((specialty, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                  >
                    {specialty}
                  </span>
                ))}
                {contributor?.specialties?.length > 3 && (
                  <span className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full">
                    +{contributor?.specialties?.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewContributor(contributor?.id)}
                className="flex-1"
              >
                <Icon name="Eye" size={14} />
                <span className="ml-1">View Profile</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateContributor(contributor?.id, 'message')}
              >
                <Icon name="MessageCircle" size={16} />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onUpdateContributor(contributor?.id, 'settings')}
              >
                <Icon name="Settings" size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>
      {filteredContributors?.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Users" size={48} className="text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">No contributors found</h3>
          <p className="text-muted-foreground">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      {/* Summary Stats */}
      <div className="bg-card rounded-lg border border-border p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Contributor Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-primary">{contributors?.length}</p>
            <p className="text-sm text-muted-foreground">Total Contributors</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-success">
              {contributors?.filter(c => c?.status === 'active')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Active</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-warning">
              {contributors?.filter(c => c?.status === 'verified')?.length}
            </p>
            <p className="text-sm text-muted-foreground">Verified</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-foreground">
              {(contributors?.reduce((sum, c) => sum + c?.rating, 0) / contributors?.length)?.toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground">Avg Rating</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContributorManagement;