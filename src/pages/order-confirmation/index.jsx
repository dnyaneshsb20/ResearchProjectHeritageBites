import React from "react";
import Header from "../../components/ui/Header";
import { CheckCircle2 } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "pages/dashboard/components/Footer";
import Button from "components/ui/Button";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { order } = location.state || {};
  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Order not found.</p>
      </div>
    );
  }

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
          Order Placed Successfully !
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
            <span>#{order.order_id}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Payment Method:</span>
            <span>{order.payment_method}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span>Estimated Delivery:</span>
            <span>3 - 5 business days</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => navigate(`/order-details/${order.order_id}`, { state: { order } })}
            className="px-6 py-3"
            variant="ghost2"
          >
            View Order Details
          </Button>
          <Button
            onClick={() => navigate("/ingredient-marketplace")}
            className="px-6 py-3 "
            variant="ghost2"
          >
            Continue Shopping
          </Button>
          <Button
            onClick={() => navigate("/recipe-discovery-dashboard")}
            className="px-6 py-3"
            variant="ghost2"
          >
            Explore More Recipes
          </Button>
        </div>
      </main>
      <Footer/>
    </div>
  );
};

export default OrderConfirmation;
