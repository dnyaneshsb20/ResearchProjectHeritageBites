import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Header from "../../components/ui/Header";

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrderAndItems = async () => {
      setLoading(true);

      // Fetch order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (orderError || !orderData) {
        console.error(orderError);
        setLoading(false);
        return;
      }

      setOrder(orderData);

      // Fetch order items with product info
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select(`
          order_item_id,
          quantity,
          price,
          product_id,
          products(name)
        `)
        .eq("order_id", orderId);

      if (itemsError) {
        console.error(itemsError);
      } else {
        setOrderItems(itemsData || []);
      }

      setLoading(false);
    };

    fetchOrderAndItems();
  }, [orderId]);

  const totalAmount = orderItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (!order) return <p className="text-center mt-8">Order not found.</p>;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6">Order Details</h1>

        <div className="bg-popover rounded-lg p-4 shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex justify-between mb-2">
            <span>Order ID:</span>
            <span>{order.order_id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Payment Method:</span>
            <span>{order.payment_method}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Status:</span>
            <span>{order.status}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span>Total Amount:</span>
            <span>₹{totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-popover rounded-lg p-4 shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Items</h2>
          {orderItems.map((item) => (
            <div key={item.order_item_id} className="flex justify-between mb-2">
              <span>{item.products?.name} × {item.quantity}</span>
              <span>₹{item.price * item.quantity}</span>
            </div>
          ))}
        </div>

        <button
          onClick={() => navigate("/recipe-discovery-dashboard")}
          className="px-6 py-3 bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white rounded-lg shadow hover:opacity-90 transition"
        >
          Back to Dashboard
        </button>
      </main>
    </div>
  );
};

export default OrderDetails;
