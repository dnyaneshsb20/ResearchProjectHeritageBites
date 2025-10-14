// src/pages/farmer-dashboard/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import FarmerDashboard from "./components/FarmerDashboard";
import FarmerProducts from "./components/FarmerProducts";
import FarmerOrders from "./components/FarmerOrders";
import FarmerProfileSection from "./components/FarmerProfileSection";

const FarmerDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<FarmerDashboard />} />
      <Route path="products" element={<FarmerProducts />} />
      <Route path="orders" element={<FarmerOrders/>}></Route>
      <Route path="profile" element={<FarmerProfileSection/>}/>
      {/* Add more routes here like /add-product if needed */}
    </Routes>
  );
};

export default FarmerDashboardRoutes;
