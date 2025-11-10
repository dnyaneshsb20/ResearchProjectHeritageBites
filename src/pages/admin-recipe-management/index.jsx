import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';

import PendingSubmissionsTable from './components/PendingSubmissionsTable';
import RecipePreviewPanel from './components/RecipePreviewPanel';
import FilterControls from './components/FilterControls';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ContributorManagement from './components/ContributorManagement';
import Footer from '../dashboard/components/Footer';
import AdminRecipeView from './components/AdminRecipeView';

import { supabase } from "../../supabaseClient";
import toast from 'react-hot-toast';
import FeedbackTable from './components/FeedbackTable';
import FeedbackRatingsChart from './components/FeedbackRatingsChart';
import FeedbackSentimentChart from './components/FeedbackSentimentChart';
import CustomerOrdersTable from './components/CustomerOrdersTable';
import UserManagement from './components/UserManagement';
import FarmersManagement from './components/FarmersManagement';

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
  // Add these state variables
  const [pendingSubmissionsCount, setPendingSubmissionsCount] = useState(0);
  const [totalContributorsCount, setTotalContributorsCount] = useState(0);
  const [totalFeedbackCount, setTotalFeedbackCount] = useState(0);
  const [totalOrdersCount, setTotalOrdersCount] = useState(0);
  const [totalFarmersCount, setTotalFarmersCount] = useState(0);

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
    { id: 'contributors', label: 'Contributors', icon: 'Users', count: contributors?.length },
    { id: 'feedback', label: 'Feedback', icon: 'MessageSquare', count: null },
    { id: 'orders', label: 'Customer Orders', icon: 'ShoppingCart', count: null },
    { id: 'users', label: 'Users', icon: 'UserCircle', count: null },
    { id: 'farmers', label: 'Farmers', icon: 'Axe', count: null },
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

  const handlePreviewRecipe = async (submission) => {
    const { data, error } = await supabase
      .from('rec_contributions')
      .select('*')
      .eq('indg_recipe_id', submission.id)
      .single();

    if (error) {
      console.error(error);
      toast.error('Failed to load recipe.');
      return;
    }

    setPreviewRecipe(data); // pass full recipe to AdminRecipeView
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
  useEffect(() => {
    const fetchDashboardCounts = async () => {
      try {
        // Pending submissions
        const { count: pendingCount } = await supabase
          .from('rec_contributions')
          .select('*', { count: 'exact' })
          .eq('status', 'pending');
        setPendingSubmissionsCount(pendingCount || 0);

        // Total contributors (all non-admin users)
        const { data, error } = await supabase
          .from('rec_contributions')
          .select('created_by')
          .not('created_by', 'is', null);

        if (error) console.error(error);

        const uniqueContributors = new Set(data.map(d => d.created_by));
        setTotalContributorsCount(uniqueContributors.size);


        // Total feedback
        const { count: feedbackCount } = await supabase
          .from('website_feedback')
          .select('*', { count: 'exact' });
        setTotalFeedbackCount(feedbackCount || 0);

        // Total orders
        const { count: ordersCount } = await supabase
          .from('orders')
          .select('*', { count: 'exact' });
        setTotalOrdersCount(ordersCount || 0);

        // Total farmers
        const { count: farmersCount } = await supabase
          .from('farmers')
          .select('*', { count: 'exact' });
        setTotalFarmersCount(farmersCount || 0);
      } catch (error) {
        console.error('Error fetching dashboard counts:', error);
        toast.error('Failed to load dashboard stats');
      }
    };

    fetchDashboardCounts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Professional Header Section */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
            <div className="flex items-center gap-4 mb-4 lg:mb-0">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Icon name="Settings" size={24} className="text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{getGreeting()}! Admin</h1>
                <p className="text-muted-foreground mt-1">
                  Platform management and analytics dashboard
                </p>
              </div>
            </div>
          </div>

          {/* Professional Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                label: 'Submissions',
                count: pendingSubmissionsCount,
                icon: 'FileText',
                color: 'red',
                status: 'Pending'
              },
              {
                label: 'Contributors',
                count: totalContributorsCount,
                icon: 'Users',
                color: 'blue',
                status: 'Active'
              },
              {
                label: 'Feedback',
                count: totalFeedbackCount,
                icon: 'MessageSquare',
                color: 'green',
                status: 'Reviews'
              },
              {
                label: 'Orders',
                count: totalOrdersCount,
                icon: 'ShoppingCart',
                color: 'amber',
                status: 'Total'
              },
              {
                label: 'Farmers',
                count: totalFarmersCount,
                icon: 'Axe',
                color: 'purple',
                status: 'Registered'
              }
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="bg-white backdrop-blur-sm border border-border rounded-xl p-5 hover:bg-card hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-2 bg-${stat.color}-500/10 rounded-lg border border-${stat.color}-500/20`}>
                    <Icon name={stat.icon} size={18} className={`text-${stat.color}-600`} />
                  </div>
                  <span className="text-xs text-muted-foreground font-medium bg-muted/50 px-2 py-1 rounded-full">
                    {stat.status}
                  </span>
                </div>
                <p className="text-2xl font-bold text-foreground mb-1">{stat.count}</p>
                <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Tab Navigation */}
        <div className="bg-card border border-border rounded-xl p-1 mb-8">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex">
            {tabs?.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:text-black'
                  }`}
              >
                <Icon name={tab.icon} size={16} />
                <span>{tab.label}</span>
                {tab.count !== null && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${activeTab === tab.id
                      ? 'bg-primary-foreground/20 text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                    }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <div className="flex overflow-x-auto scrollbar-hide gap-1">
              {tabs?.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${activeTab === tab.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                >
                  <Icon name={tab.icon} size={14} />
                  <span>{tab.label}</span>
                  {tab.count !== null && (
                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${activeTab === tab.id
                        ? 'bg-primary-foreground/20 text-primary-foreground'
                        : 'bg-muted text-muted-foreground'
                      }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          {/* Tab Header */}
          <div className="px-6 py-4 border-b border-border bg-gradient-to-r from-card to-card/50">
            <h2 className="text-xl font-semibold text-foreground">
              {tabs.find(tab => tab.id === activeTab)?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Tab Content Area */}
          <div className="p-6">
            {activeTab === 'submissions' && (
              <div className="space-y-6">
                <FilterControls
                  filters={filters}
                  onFilterChange={handleFilterChange}
                  onClearFilters={handleClearFilters}
                  onBulkAction={handleBulkAction}
                  selectedCount={selectedSubmissions?.length}
                  states={states}
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
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                {/* Charts side by side */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FeedbackRatingsChart />
                  <FeedbackSentimentChart />
                </div>

                {/* Detailed feedback table */}
                <FeedbackTable />
              </div>
            )}
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <CustomerOrdersTable />
              </div>
            )}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <UserManagement />
              </div>
            )}
            {activeTab === 'farmers' && (
              <div className="space-y-6">
                <FarmersManagement />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recipe Preview Modal */}
      {previewRecipe ? (
        <AdminRecipeView
          recipe={previewRecipe}
          onClose={() => setPreviewRecipe(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestModification={handleRequestModification}
        />
      ) : (
        <Footer />
      )}
    </div>
  );
};

export default AdminRecipeManagement;