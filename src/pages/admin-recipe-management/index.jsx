import React, { useState } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

import PendingSubmissionsTable from './components/PendingSubmissionsTable';
import RecipePreviewPanel from './components/RecipePreviewPanel';
import FilterControls from './components/FilterControls';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContributorManagement from './components/ContributorManagement';
import Footer from '../dashboard/components/Footer';

const AdminRecipeManagement = () => {
  const [activeTab, setActiveTab] = useState('submissions');
  const [selectedSubmissions, setSelectedSubmissions] = useState([]);
  const [previewRecipe, setPreviewRecipe] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    region: '',
    category: '',
    status: '',
    contributorRating: '',
    fromDate: '',
    toDate: ''
  });

  // Mock states for filter dropdown
  const [states] = useState([
    { state_name: "Rajasthan" },
    { state_name: "Kerala" },
    { state_name: "West Bengal" },
    { state_name: "Maharashtra" },
    { state_name: "Punjab" }
  ]);

  // Mock submissions data
  const [submissions] = useState([
    {
      id: 1,
      title: "Authentic Rajasthani Dal Baati Churma",
      contributorName: "Priya Sharma",
      contributorRating: 4.8,
      region: "Rajasthan",
      category: "Main Course",
      submissionDate: "2025-01-10",
      status: "pending",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400"
    },
    {
      id: 2,
      title: "Kerala Fish Curry with Coconut",
      contributorName: "Ravi Menon",
      contributorRating: 4.6,
      region: "Kerala",
      category: "Main Course",
      submissionDate: "2025-01-08",
      status: "under-review",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400"
    },
    {
      id: 3,
      title: "Bengali Mishti Doi",
      contributorName: "Ananya Das",
      contributorRating: 4.9,
      region: "West Bengal",
      category: "Dessert",
      submissionDate: "2025-01-05",
      status: "needs-modification",
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400"
    }
  ]);

  // Mock contributors data
  const [contributors] = useState([
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      rating: 4.9,
      status: "verified"
    },
    {
      id: 2,
      name: "Ravi Menon",
      email: "ravi.menon@email.com",
      rating: 4.8,
      status: "active"
    },
    {
      id: 3,
      name: "Ananya Das",
      email: "ananya.das@email.com",
      rating: 4.7,
      status: "verified"
    }
  ]);

  const tabs = [
    { id: 'submissions', label: 'Submissions', icon: 'FileText', count: submissions?.length },
    { id: 'analytics', label: 'Analytics', icon: 'BarChart3', count: null },
    { id: 'contributors', label: 'Contributors', icon: 'Users', count: contributors?.length }
  ];

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      region: '',
      category: '',
      status: '',
      contributorRating: '',
      fromDate: '',
      toDate: ''
    });
  };

  const handleBulkAction = (action) => {
    console.log(`Performing bulk action: ${action} on submissions:`, selectedSubmissions);
    setSelectedSubmissions([]);
  };

  const handlePreviewRecipe = (recipe) => {
    setPreviewRecipe(recipe.indg_recipe_id); // pass only the ID
  };

  const handleApprove = (submissionId) => {
    console.log('Approving submission:', submissionId);
    setPreviewRecipe(null);
  };

  const handleReject = (submissionId) => {
    console.log('Rejecting submission:', submissionId);
    setPreviewRecipe(null);
  };

  const handleRequestModification = (submissionId) => {
    console.log('Requesting modification for submission:', submissionId);
    setPreviewRecipe(null);
  };

  const handleUpdateContributor = (contributorId, action) => {
    console.log(`Updating contributor ${contributorId} with action: ${action}`);
  };

  const handleViewContributor = (contributorId) => {
    console.log('Viewing contributor:', contributorId);
  };

  const filteredSubmissions = submissions?.filter(submission => {
    const matchesSearch = !filters?.search ||
      submission?.title?.toLowerCase()?.includes(filters?.search?.toLowerCase()) ||
      submission?.contributorName?.toLowerCase()?.includes(filters?.search?.toLowerCase());
    const matchesRegion = !filters?.region || submission?.region?.toLowerCase()?.includes(filters?.region?.toLowerCase());
    const matchesCategory = !filters?.category || submission?.category?.toLowerCase()?.includes(filters?.category?.toLowerCase());
    const matchesStatus = !filters?.status || submission?.status === filters?.status;
    const matchesRating = !filters?.contributorRating || submission?.contributorRating >= parseInt(filters?.contributorRating);
    const matchesDateRange = (!filters?.fromDate || new Date(submission.submissionDate) >= new Date(filters.fromDate)) &&
      (!filters?.toDate || new Date(submission.submissionDate) <= new Date(filters.toDate));
    return matchesSearch && matchesRegion && matchesCategory && matchesStatus && matchesRating && matchesDateRange;
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-1">{getGreeting()}! Admin</h1>
          <p className="text-muted-foreground mt-2">
            Review, approve, and curate community-submitted recipes while maintaining platform quality.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-8">
          {tabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted'
                }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
              {tab.count !== null && (
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'submissions' && (
          <div className="space-y-6">
            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onBulkAction={handleBulkAction}
              selectedCount={selectedSubmissions?.length}
              states={states} // ✅ now defined
            />

            <PendingSubmissionsTable
              submissions={filteredSubmissions}
              selectedSubmissions={selectedSubmissions}
              onSelectionChange={setSelectedSubmissions}
              onPreviewRecipe={handlePreviewRecipe}
              onApprove={handleApprove}
              onReject={handleReject}
              onRequestModification={handleRequestModification}
            />
          </div>
        )}

        {activeTab === 'analytics' && <AnalyticsDashboard analyticsData={{}} />}

        {activeTab === 'contributors' && (
          <ContributorManagement
            contributors={contributors}
            onUpdateContributor={handleUpdateContributor}
            onViewContributor={handleViewContributor}
          />
        )}
      </div>

      {/* Recipe Preview Modal */}
      {previewRecipe && (
        <RecipePreviewPanel
          recipeId={previewRecipe} // pass ID here
          onClose={() => setPreviewRecipe(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestModification={handleRequestModification}
        />
      )}
      <Footer />
    </div>
  );
};

export default AdminRecipeManagement;
