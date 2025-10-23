import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Header from "../../components/ui/Header";
import  Button from "../../components/ui/Button";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, delivered, cancelled
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("orders")
        .select("order_id, created_at, total_amount, status, items")
        .order("created_at", { ascending: false });
      
      if (error) {
        console.error("Error fetching orders:", error);
      } else {
        setOrders(data || []);
      }
      setLoading(false);
    };

    fetchOrders();
  }, []);

  const filteredOrders = orders.filter(order => filter === "all" ? true : order.status === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold text-foreground mb-4">Order History</h1>

        {/* Filters */}
        <div className="flex space-x-2 mb-6">
          {["all", "pending", "delivered", "cancelled"].map((status) => (
            <Button
              key={status}
              variant={filter === status ? "default" : "outline"}
              onClick={() => setFilter(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>

        {/* Orders Table */}
        {loading ? (
          <p className="text-muted-foreground">Loading orders...</p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-muted-foreground">No orders found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg">
              <thead className="bg-muted text-left">
                <tr>
                  <th className="px-4 py-2">Order ID</th>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Items</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.order_id} className="border-t border-border hover:bg-muted/20">
                    <td className="px-4 py-2 font-medium">{order.order_id.slice(0, 8)}</td>
                    <td className="px-4 py-2">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-2">{order.items?.length || 0}</td>
                    <td className="px-4 py-2">
                      {new Intl.NumberFormat("en-IN", {
                        style: "currency",
                        currency: "INR",
                      }).format(order.total_amount)}
                    </td>
                    <td className="px-4 py-2 capitalize">{order.status}</td>
                    <td className="px-4 py-2">
                      <Button
                        size="sm"
                        onClick={() => alert(`Viewing details for order ${order.order_id}`)}
                      >
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
