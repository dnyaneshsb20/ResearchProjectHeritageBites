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
        const { count: contributorsCount } = await supabase
          .from('users')
          .select('*', { count: 'exact' })
          .in('role', ['user', 'contributor']); // include actual roles present
        setTotalContributorsCount(contributorsCount || 0);

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
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">{getGreeting()}! Admin</h1>
            {/* <p className="text-muted-foreground mt-2 sm:mt-0">
              Overview of the platform stats at a glance.
            </p> */}
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition-shadow">
              <div className="bg-red-100 text-red-600 p-3 rounded-full mb-3">
                <Icon name="FileText" size={20} />
              </div>
              <span className="text-2xl font-semibold text-gray-900">{pendingSubmissionsCount}</span>
              <span className="text-sm text-gray-500 mt-1">Pending Submissions</span>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-full mb-3">
                <Icon name="Users" size={20} />
              </div>
              <span className="text-2xl font-semibold text-gray-900">{totalContributorsCount}</span>
              <span className="text-sm text-gray-500 mt-1">Contributors</span>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition-shadow">
              <div className="bg-green-100 text-green-600 p-3 rounded-full mb-3">
                <Icon name="MessageSquare" size={20} />
              </div>
              <span className="text-2xl font-semibold text-gray-900">{totalFeedbackCount}</span>
              <span className="text-sm text-gray-500 mt-1">Feedback Entries</span>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition-shadow">
              <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full mb-3">
                <Icon name="ShoppingCart" size={20} />
              </div>
              <span className="text-2xl font-semibold text-gray-900">{totalOrdersCount}</span>
              <span className="text-sm text-gray-500 mt-1">Customer Orders</span>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-md flex flex-col items-center hover:shadow-lg transition-shadow">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-full mb-3">
                <Icon name="Axe" size={20} />
              </div>
              <span className="text-2xl font-semibold text-gray-900">{totalFarmersCount}</span>
              <span className="text-sm text-gray-500 mt-1">Farmers</span>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-8 max-w-7xl mx-auto">
          {tabs?.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center space-x-2 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab.id
                ? 'text-primary border-primary'
                : 'text-muted-foreground border-transparent hover:text-foreground hover:border-muted'
                }`}
            >
              <Icon name={tab.icon} size={16} />
              <span>{tab.label}</span>
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
            {/* You can place your CustomerOrdersTable component here */}
            <CustomerOrdersTable />
          </div>
        )}
        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* You can place your CustomerOrdersTable component here */}
            <UserManagement />
          </div>
        )}
        {activeTab === 'farmers' && (
          <div className="space-y-6">
            {/* You can place your CustomerOrdersTable component here */}
            <FarmersManagement />
          </div>
        )}
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
