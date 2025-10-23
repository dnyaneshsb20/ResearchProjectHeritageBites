import React from "react";
import Header from "../../components/ui/Header";
import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-grow flex flex-col items-center justify-center px-4 py-12 text-center">
        {/* Success Icon */}
        <div className="flex items-center justify-center w-24 h-24 bg-green-100 rounded-full mb-6">
          <CheckCircle2 size={64} className="text-green-600" />
        </div>

        {/* Confirmation Text */}
        <h1 className="text-3xl font-bold text-foreground mb-3">
          Order Placed Successfully 🎉
        </h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Thank you for your purchase! Your order is being processed. You’ll
          receive a confirmation message shortly.
        </p>

        {/* Order Summary Card (optional placeholder) */}
        <div className="bg-popover rounded-lg shadow-md p-6 w-full max-w-md text-left mb-8">
          <h2 className="font-semibold text-lg mb-3">Order Summary</h2>
          <div className="flex justify-between text-sm mb-2">
            <span>Order ID:</span>
            <span>#HB{Math.floor(Math.random() * 100000)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Payment Method:</span>
            <span>Online Payment</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Estimated Delivery:</span>
            <span>3 - 5 business days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/ingredient-marketplace")}
            className="px-6 py-3 bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white rounded-lg shadow hover:opacity-90 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/recipe-discovery-dashboard")}
            className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition"
          >
            Explore More Recipes
          </button>
        </div>
      </main>

      {/* Footer note */}
      <footer className="py-4 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} Heritage Bites. All rights reserved.
      </footer>
    </div>
  );
};

export default OrderConfirmation;
