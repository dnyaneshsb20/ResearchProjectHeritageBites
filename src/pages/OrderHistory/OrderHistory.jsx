import React, { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import Header from "../../components/ui/Header";
import Button from "../../components/ui/Button";
import { useNavigate } from "react-router-dom";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndOrders = async () => {
      setLoading(true);
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError || !userData?.user) {
        console.error("User not found or not logged in:", userError);
        setLoading(false);
        return;
      }

      setUser(userData.user);

      // 1️⃣ Fetch all orders for this user
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("order_id, created_at, total_amount, status, payment_method")
        .eq("user_id", userData.user.id)
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch item counts for each order
      const ordersWithCounts = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { count, error: countError } = await supabase
            .from("order_items")
            .select("*", { count: "exact", head: true })
            .eq("order_id", order.order_id);

          if (countError) {
            console.error("Error fetching item count:", countError);
            return { ...order, itemsCount: 0 };
          }

          return { ...order, itemsCount: count || 0 };
        })
      );

      setOrders(ordersWithCounts);
      setLoading(false);
    };

    fetchUserAndOrders();
  }, []);

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  );

  const handleViewOrder = async (orderId) => {
    try {
      // Fetch the main order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("order_id", orderId)
        .single();

      if (orderError) throw orderError;

      // Fetch related order items with product names
      const { data: itemsData, error: itemsError } = await supabase
        .from("order_items")
        .select("order_item_id, quantity, price, products(name)")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      // Map items to include item name
      const formattedItems = (itemsData || []).map((item) => ({
        id: item.order_item_id,
        name: item.products?.name || "Unknown",
        quantity: item.quantity,
        price: item.price,
      }));

      setSelectedOrder({ ...orderData, items: formattedItems });
      setModalOpen(true);
    } catch (err) {
      console.error("Error fetching order details:", err);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Order History
        </h1>

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
          <p className="text-muted-foreground">Loading your orders...</p>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20 border rounded-lg bg-muted/20">
            <p className="text-lg font-medium text-muted-foreground mb-2">
              No orders to show.
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Book your first order now!
            </p>
            <Button onClick={() => navigate("/ingredient-marketplace")}>
              Book Now
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border border-border rounded-lg text-center">
              <thead className="bg-muted text-left text-center">
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
                  <tr
                    key={order.order_id}
                    className="border-t border-border hover:bg-muted/20"
                  >
                    <td className="px-4 py-2 font-medium">
                      {order.order_id.slice(0, 8)}
                    </td>
                    <td className="px-4 py-2">
                      {new Date(order.created_at).toLocaleString("en-IN", {
                        timeZone: "Asia/Kolkata",
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </td>
                    <td className="px-4 py-2">{order.itemsCount}</td>
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
                        onClick={() => handleViewOrder(order.order_id)}
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

      {/* Order Details Modal */}
      {modalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-background rounded-xl shadow-xl w-full max-w-3xl h-[400px] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-border">
              <h2 className="text-xl font-semibold">Order Details</h2>
              <button
                onClick={closeModal}
                className="text-muted-foreground hover:text-foreground text-xl"
              >
                ✕
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="overflow-y-auto px-6 py-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 text-sm">
                <p>
                  <span className="font-medium">Order ID:</span>{" "}
                  {selectedOrder.order_id}
                </p>
                <p>
                  <span className="font-medium">Date:</span>{" "}
                  {new Date(selectedOrder.created_at).toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
                <p>
                  <span className="font-medium">Status:</span>{" "}
                  <span className="capitalize">{selectedOrder.status}</span>
                </p>
                <p>
                  <span className="font-medium">Payment Method:</span>{" "}
                  {selectedOrder.payment_method || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Total Amount:</span>{" "}
                  {new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(selectedOrder.total_amount)}
                </p>
              </div>

              {/* Items Table */}
              <h3 className="text-base font-semibold mb-2">Ordered Items</h3>
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border border-border rounded-lg text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Item Name</th>
                        <th className="px-3 py-2 text-left">Quantity</th>
                        <th className="px-3 py-2 text-left">Price</th>
                        <th className="px-3 py-2 text-left">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item) => (
                        <tr
                          key={item.id}
                          className="border-t border-border hover:bg-muted/20"
                        >
                          <td className="px-3 py-2">{item.name}</td>
                          <td className="px-3 py-2">{item.quantity}</td>
                          <td className="px-3 py-2">₹{item.price.toFixed(2)}</td>
                          <td className="px-3 py-2">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground text-sm mt-2">
                  No items found for this order.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
