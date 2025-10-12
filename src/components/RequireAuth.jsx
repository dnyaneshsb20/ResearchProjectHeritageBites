// src/components/RequireAuth.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RequireAuth = ({ children }) => {
  const { user } = useAuth();
  // if your auth context uses different name, adapt accordingly
  if (!user) {
    return <Navigate to="/sign-in" replace />;
  }
  return children;
};

export default RequireAuth;
