import React from "react";
import { Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";

// Pages
import Dashboard from "./pages/dashboard";
import RecipeSubmissionManagement from "./pages/recipe-submission-management";
import IngredientMarketplace from "./pages/ingredient-marketplace";
import UserProfileHealthGoals from "./pages/user-profile-health-goals";
import AdminRecipeManagement from "./pages/admin-recipe-management";
import RecipeDetailInstructions from "./pages/recipe-detail-instructions";
import RecipeDiscoveryDashboard from "./pages/recipe-discovery-dashboard";
import SignIn from "./pages/sign-in";
import AISuggestions from "./pages/ai-suggestions";
import FarmerDashboard from "./pages/farmer-dashboard/components/FarmerDashboard";
import FarmerProducts from "./pages/farmer-dashboard/components/FarmerProducts";
import FarmerOrders from "./pages/farmer-dashboard/components/FarmerOrders";
import FarmerProfileSection from "./pages/farmer-dashboard/components/FarmerProfileSection";
import Checkout from './pages/checkout/Checkout';
import Payment from "./pages/Payment/Payment";
import OrderConfirmation from "./pages/order-confirmation";
import OrderDetails from "./pages/order-confirmation/OrderDetails";

// New pages
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Support from "./pages/Support";
import Feedback from "./pages/Feedback";

const Routes = () => {
  return (
    <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Main routes */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/recipe-submission-management" element={<RecipeSubmissionManagement />} />
        <Route path="/ingredient-marketplace" element={<IngredientMarketplace />} />
        <Route path="/user-profile-health-goals" element={<UserProfileHealthGoals />} />
        <Route path="/admin-recipe-management" element={<AdminRecipeManagement />} />
        <Route path="/recipe-detail-instructions" element={<RecipeDetailInstructions />} />
        <Route path="/recipe-discovery-dashboard" element={<RecipeDiscoveryDashboard />} />
        <Route path="/ai-suggestions" element={<AISuggestions />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/order-details/:orderId" element={<OrderDetails />} />
        <Route path="/feedback" element={<Feedback/>}/>

        {/* Farmer dashboard routes */}
        <Route path="/farmer-dashboard" element={<FarmerDashboard />} />
        <Route path="/farmer-products" element={<FarmerProducts />} />
        <Route path="/farmer-orders" element={<FarmerOrders />} />
        <Route path="/farmer-profile" element={<FarmerProfileSection />} />

        {/* Legal & support pages */}
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/support" element={<Support />} />

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
    </ErrorBoundary>
  );
};

export default Routes;
