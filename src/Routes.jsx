import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import RecipeSubmissionManagement from './pages/recipe-submission-management';
import IngredientMarketplace from './pages/ingredient-marketplace';
import UserProfileHealthGoals from './pages/user-profile-health-goals';
import AdminRecipeManagement from './pages/admin-recipe-management';
import RecipeDetailInstructions from './pages/recipe-detail-instructions';
import RecipeDiscoveryDashboard from './pages/recipe-discovery-dashboard';
import Dashboard from './pages/dashboard';
import SignIn from "./pages/sign-in";
import AISuggestions from "./pages/ai-suggestions";
import FarmerDashboard from "./pages/farmer-dashboard/components/FarmerDashboard";
import FarmerProducts from './pages/farmer-dashboard/components/FarmerProducts';
import FarmerOrders from "pages/farmer-dashboard/components/FarmerOrders";
import aiuggestions from "pages/ai-suggestions/aisuggestions";
const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/recipe-submission-management" element={<RecipeSubmissionManagement />} />
        <Route path="/ingredient-marketplace" element={<IngredientMarketplace />} />
        <Route path="/user-profile-health-goals" element={<UserProfileHealthGoals />} />
        <Route path="/admin-recipe-management" element={<AdminRecipeManagement />} />
        <Route path="/recipe-detail-instructions" element={<RecipeDetailInstructions />} />
        <Route path="/recipe-discovery-dashboard" element={<RecipeDiscoveryDashboard />} />
        <Route path="/ai-suggestions" element={<AISuggestions />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/ai-suggestions" element={<aisuggestions />} />
        <Route path="/farmer-dashboard" element={<FarmerDashboard/>}></Route>
        <Route path='/farmer-products' element={<FarmerProducts/>}></Route>
        <Route path="/farmer-orders" element={<FarmerOrders/>}/>
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;