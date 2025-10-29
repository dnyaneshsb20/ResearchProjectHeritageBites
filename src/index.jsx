import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./styles/tailwind.css";
import "./styles/index.css";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext"; // ✅ import CartProvider

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <AuthProvider>
      <CartProvider> {/* ✅ Wrap App with CartProvider */}
       
          <App />
       
      </CartProvider>
       </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
