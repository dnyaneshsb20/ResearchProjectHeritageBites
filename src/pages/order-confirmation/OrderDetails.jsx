import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Header from "../../components/ui/Header";
import Footer from "../dashboard/components/Footer";
import Button from "components/ui/Button";

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

  if (loading)
    return <p className="text-center mt-16 text-muted-foreground">Loading...</p>;
  if (!order)
    return (
      <p className="text-center mt-16 text-destructive">Order not found.</p>
    );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-10 max-w-4xl">
        {/* Page Title */}
        <h1 className="text-3xl font-bold mb-10 text-foreground">
          Order Details
        </h1>

        {/* Order Summary */}
        <div className="bg-popover border border-border rounded-2xl p-6 shadow-md mb-10 transition-all">
          <h2 className="text-2xl font-semibold mb-6">
            Order Summary
          </h2>

          <div className="space-y-4 text-sm">
            {/* Order ID */}
            <div className="flex justify-between border-b border-border pb-3">
              <span className="font-medium text-muted-foreground">Order ID:</span>
              <span className="font-semibold text-foreground tracking-wide">
                {order.order_id}
              </span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between border-b border-border pb-3">
              <span className="font-medium text-muted-foreground">Payment Method:</span>
              <span className="capitalize font-semibold">{order.payment_method}</span>
            </div>

            {/* Status */}
            <div className="flex justify-between border-b border-border pb-3">
              <span className="font-medium text-muted-foreground">Status:</span>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide
          ${order.status === "Delivered"
                    ? "bg-green-100 text-green-700"
                    : order.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                {order.status}
              </span>
            </div>

            {/* Total Amount */}
            <div className="flex justify-between border-b border-border pb-3">
              <span className="font-medium text-muted-foreground">Total Amount:</span>
              <span className="font-bold text-lg">
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-popover border border-border rounded-xl p-6 shadow-md mb-10">
          <h2 className="text-xl font-semibold mb-4">Items</h2>
          {orderItems.length === 0 ? (
            <p className="text-center text-muted-foreground">No items found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead className="bg-muted">
                  <tr className="text-left text-muted-foreground">
                    <th className="p-3 font-medium">Item Name</th>
                    <th className="p-3 font-medium text-center">Quantity</th>
                    <th className="p-3 font-medium text-right">Price (₹)</th>
                    <th className="p-3 font-medium text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => (
                    <tr
                      key={item.order_item_id}
                      className="border-b border-border hover:bg-muted/40 transition"
                    >
                      <td className="p-3">{item.products?.name}</td>
                      <td className="p-3 text-center">{item.quantity}</td>
                      <td className="p-3 text-right">{item.price.toFixed(2)}</td>
                      <td className="p-3 text-right">
                        {(item.price * item.quantity).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="flex ">
          <Button
            onClick={() => navigate("/recipe-discovery-dashboard")}
            className="px-6 py-3"
            variant="default"
          >
            Back to Dashboard
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrderDetails;
