// src/context/AuthContext.jsx
import React, { createContext, useContext, useState } from "react";
import { supabase } from "../supabaseClient";

// Create context
const AuthContext = createContext();

// Provider component
export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState("guest"); 

  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = async () => {
    await supabase.auth.signOut();  // 🧼 clears session
    setUser(null);                  // 🧼 clear context user
  };

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      login, 
       role,        // current role
    setUser,     // expose setter
    setRole,     // expose setter
      logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use context
export const useAuth = () => useContext(AuthContext);
