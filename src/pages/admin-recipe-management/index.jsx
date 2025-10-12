import React, { useState, useEffect } from 'react';
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

  // Mock data for pending submissions
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
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
      description: `Traditional Rajasthani delicacy consisting of dal (lentil curry), baati (hard wheat rolls), and churma (sweet crumbled wheat). This recipe has been passed down through generations in my family and represents the authentic flavors of Rajasthan's royal cuisine.`,
      culturalBackground: `Dal Baati Churma is the signature dish of Rajasthan, traditionally prepared during festivals and special occasions. The dish symbolizes the resourcefulness of Rajasthani cuisine, designed to last long in the desert climate while providing complete nutrition.`,
      cookTime: "2 hours",
      servings: 6,
      difficulty: "Medium",
      rating: 4.9,
      ingredients: [
        { name: "Whole wheat flour", quantity: "2 cups", notes: "for baati" },
        { name: "Mixed dal", quantity: "1 cup", notes: "toor, chana, moong" },
        { name: "Ghee", quantity: "1/2 cup", notes: "pure cow ghee" },
        { name: "Jaggery", quantity: "1/4 cup", notes: "for churma" },
        { name: "Cardamom powder", quantity: "1 tsp", notes: "freshly ground" }
      ],
      instructions: [
        "Prepare the dal by pressure cooking mixed lentils with turmeric, salt, and water until soft and mushy.",
        "Make baati dough by mixing wheat flour, ghee, salt, and water. Knead into a firm dough.",
        "Shape the dough into small balls and bake in a traditional clay oven or modern oven at 180°C for 45 minutes.",
        "For churma, coarsely grind the baked baati and mix with ghee, jaggery, and cardamom powder.",
        "Serve hot dal with baati and sweet churma, garnished with fresh coriander and a dollop of ghee."
      ],
      nutrition: {
        calories: 450,
        protein: "18g",
        carbs: "65g",
        fat: "15g",
        fiber: "8g"
      },
      healthBenefits: [
        "Rich in plant-based protein from mixed lentils",
        "High fiber content aids digestion",
        "Ghee provides healthy fats and fat-soluble vitamins",
        "Complex carbohydrates provide sustained energy"
      ]
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
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
      description: `Authentic Kerala fish curry made with fresh coconut milk, curry leaves, and traditional spices. This recipe uses kingfish and represents the coastal flavors of God's Own Country.`,
      culturalBackground: `Fish curry is a staple in Kerala households, reflecting the state's rich coastal heritage. The use of coconut milk and curry leaves creates the distinctive flavor profile that Kerala cuisine is famous for.`,
      cookTime: "45 minutes",
      servings: 4,
      difficulty: "Easy",
      rating: 4.7,
      ingredients: [
        { name: "Kingfish", quantity: "500g", notes: "cut into steaks" },
        { name: "Fresh coconut", quantity: "1 medium", notes: "grated" },
        { name: "Curry leaves", quantity: "2 sprigs", notes: "fresh" },
        { name: "Kokum", quantity: "4-5 pieces", notes: "for tanginess" },
        { name: "Turmeric powder", quantity: "1 tsp", notes: "" }
      ],
      instructions: [
        "Extract thick coconut milk from grated coconut and set aside.",
        "Marinate fish pieces with turmeric and salt for 15 minutes.",
        "Heat coconut oil in a clay pot, add curry leaves and spices.",
        "Add thin coconut milk and bring to a gentle boil.",
        "Add fish pieces and cook for 10 minutes, then add thick coconut milk and simmer."
      ],
      nutrition: {
        calories: 320,
        protein: "28g",
        carbs: "8g",
        fat: "20g",
        fiber: "3g"
      },
      healthBenefits: [
        "High in omega-3 fatty acids from fish",
        "Coconut milk provides medium-chain triglycerides",
        "Rich in protein for muscle health",
        "Anti-inflammatory properties from turmeric"
      ]
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
      image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400",
      description: `Traditional Bengali sweet yogurt made with jaggery and cardamom. This dessert is a staple in Bengali households and is often served during festivals and special occasions.`,
      culturalBackground: `Mishti Doi is an integral part of Bengali cuisine and culture, often served as a welcome gesture to guests and during religious ceremonies. The sweetness comes from jaggery, making it healthier than regular sweetened yogurt.`,
      cookTime: "4 hours",
      servings: 8,
      difficulty: "Easy",
      rating: 4.8,
      ingredients: [
        { name: "Full-fat milk", quantity: "1 liter", notes: "preferably buffalo milk" },
        { name: "Jaggery", quantity: "150g", notes: "grated" },
        { name: "Yogurt starter", quantity: "2 tbsp", notes: "fresh curd" },
        { name: "Cardamom powder", quantity: "1/2 tsp", notes: "" }
      ],
      instructions: [
        "Boil milk and reduce to 3/4th of original quantity.",
        "Add grated jaggery and mix until dissolved.",
        "Cool the milk to lukewarm temperature.",
        "Add yogurt starter and cardamom powder, mix gently.",
        "Set in earthen pots and keep in a warm place for 4-6 hours."
      ],
      nutrition: {
        calories: 180,
        protein: "8g",
        carbs: "22g",
        fat: "6g",
        fiber: "0g"
      },
      healthBenefits: [
        "Rich in probiotics for gut health",
        "Natural sweetener from jaggery",
        "High in calcium and protein",
        "Aids in digestion"
      ]
    }
  ]);

  // Mock analytics data
  const analyticsData = {
    totalSubmissions: 1247,
    pendingReviews: 89,
    approvedThisMonth: 156,
    activeContributors: 342,
    submissionTrends: [
      { month: 'Jan', submissions: 120 },
      { month: 'Feb', submissions: 135 },
      { month: 'Mar', submissions: 148 },
      { month: 'Apr', submissions: 162 },
      { month: 'May', submissions: 178 },
      { month: 'Jun', submissions: 195 }
    ],
    statusDistribution: [
      { name: 'Approved', value: 65 },
      { name: 'Pending', value: 20 },
      { name: 'Under Review', value: 10 },
      { name: 'Rejected', value: 5 }
    ],
    regionalDistribution: [
      { region: 'North', count: 245 },
      { region: 'South', count: 312 },
      { region: 'East', count: 189 },
      { region: 'West', count: 267 },
      { region: 'Northeast', count: 98 },
      { region: 'Central', count: 136 }
    ],
    topContributors: [
      { id: 1, name: 'Priya Sharma', submissions: 45, rating: 4.9 },
      { id: 2, name: 'Ravi Menon', submissions: 38, rating: 4.8 },
      { id: 3, name: 'Ananya Das', submissions: 32, rating: 4.7 },
      { id: 4, name: 'Suresh Kumar', submissions: 28, rating: 4.6 },
      { id: 5, name: 'Meera Patel', submissions: 25, rating: 4.5 }
    ],
    recentActivity: [
      { type: 'approved', description: 'Approved "Hyderabadi Biryani" by Fatima Khan', timestamp: '2 hours ago' },
      { type: 'submitted', description: 'New submission "Goan Fish Curry" by Maria D\'Souza', timestamp: '4 hours ago' },
      { type: 'rejected', description: 'Rejected "Instant Maggi Recipe" - not traditional', timestamp: '6 hours ago' },
      { type: 'modification', description: 'Requested changes for "Punjabi Chole" by Harpreet Singh', timestamp: '8 hours ago' }
    ]
  };

  // Mock contributors data
  const contributors = [
    {
      id: 1,
      name: "Priya Sharma",
      email: "priya.sharma@email.com",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      location: "Jaipur, Rajasthan",
      totalSubmissions: 45,
      approvedSubmissions: 42,
      rating: 4.9,
      status: "verified",
      lastSubmission: "2025-01-10",
      specialties: ["Rajasthani", "North Indian", "Vegetarian", "Festival Foods"]
    },
    {
      id: 2,
      name: "Ravi Menon",
      email: "ravi.menon@email.com",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      location: "Kochi, Kerala",
      totalSubmissions: 38,
      approvedSubmissions: 35,
      rating: 4.8,
      status: "active",
      lastSubmission: "2025-01-08",
      specialties: ["Kerala", "Seafood", "Coconut-based", "South Indian"]
    },
    {
      id: 3,
      name: "Ananya Das",
      email: "ananya.das@email.com",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      location: "Kolkata, West Bengal",
      totalSubmissions: 32,
      approvedSubmissions: 30,
      rating: 4.7,
      status: "verified",
      lastSubmission: "2025-01-05",
      specialties: ["Bengali", "Sweets", "Fish", "Rice dishes"]
    }
  ];

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
    // Handle bulk actions here
    setSelectedSubmissions([]);
  };

  const handlePreviewRecipe = (recipe) => {
    setPreviewRecipe(recipe);
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

  // Filter submissions based on current filters
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 lg:px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
            <span>Admin</span>
            <Icon name="ChevronRight" size={16} />
            <span>Recipe Management</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">Recipe Management</h1>
          <p className="text-muted-foreground mt-2">
            Review, approve, and curate community-submitted recipes while maintaining platform quality and cultural authenticity.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-border mb-8">
          {tabs?.map((tab) => (
            <button
              key={tab?.id}
              onClick={() => setActiveTab(tab?.id)}
              className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === tab?.id
                  ? 'text-primary border-primary' :'text-muted-foreground border-transparent hover:text-foreground hover:border-muted'
              }`}
            >
              <Icon name={tab?.icon} size={16} />
              <span>{tab?.label}</span>
              {tab?.count !== null && (
                <span className="bg-muted text-muted-foreground px-2 py-1 rounded-full text-xs">
                  {tab?.count}
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

        {activeTab === 'analytics' && (
          <AnalyticsDashboard analyticsData={analyticsData} />
        )}

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
          recipe={previewRecipe}
          onClose={() => setPreviewRecipe(null)}
          onApprove={handleApprove}
          onReject={handleReject}
          onRequestModification={handleRequestModification}
        />
      )}
      <Footer/>
    </div>
  );
};

export default AdminRecipeManagement;