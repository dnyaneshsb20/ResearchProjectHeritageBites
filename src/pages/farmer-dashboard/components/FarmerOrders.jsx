// src/pages/farmer-dashboard/components/FarmerOrders.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import { useLocation } from "react-router-dom";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";

const FarmerOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const stored = user || JSON.parse(localStorage.getItem("user") || "null");
        const userId = stored?.id || stored?.user_id || stored?.user?.id;

        if (!userId) return;

        // Fetch orders where product.farmer_id = current user
        const { data, error } = await supabase
          .from("orders")
          .select(`
    order_id,
    status,
    created_at,
    total_amount,
    order_items (
      quantity,
      price,
      products (
      product_id,
        name,
        farmer_id
      )
    )
  `)
          .order("created_at", { ascending: false });


      if (error) {
          console.error("Supabase error:", error);
          return;
        }

         const farmerOrders = data.filter(order =>
          order.order_items.some(item => item.products?.farmer_id === userId)
        );

        setOrders(farmerOrders);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-semibold mb-4">Orders</h2>

          {loading ? (
            <div className="text-center py-10">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No orders yet.
            </div>
          ) : (
            <div className="overflow-x-auto bg-popover rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="text-left bg-border/20">
                  <tr>
                    <th className="p-3">Order ID</th>
                    <th className="p-3">Product</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-t hover:bg-border/10 transition-colors">
                      <td className="p-3">{o.id}</td>
                      <td className="p-3">{o.product?.name ?? "-"}</td>
                      <td className="p-3">{o.quantity ?? "-"}</td>
                      <td className="p-3">{o.status ?? "-"}</td>
                      <td className="p-3">{o.created_at ? new Date(o.created_at).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default FarmerOrders;
