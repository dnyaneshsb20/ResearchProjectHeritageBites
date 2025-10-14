// src/pages/farmer-dashboard/index.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import FarmerDashboard from "./components/FarmerDashboard";
import FarmerProducts from "./components/FarmerProducts";
import FarmerOrders from "./components/FarmerOrders";

const FarmerDashboardRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<FarmerDashboard />} />
      <Route path="products" element={<FarmerProducts />} />
      <Route path="orders" element={<FarmerOrders/>}></Route>
      {/* Add more routes here like /add-product if needed */}
    </Routes>
  );
};

export default FarmerDashboardRoutes;
