import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // ✅ Get currently logged-in user from Supabase Auth
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError) throw authError;

        console.log("👤 Supabase Auth User:", user);

        if (!user) {
          console.warn("⚠️ No authenticated user found.");
          return;
        }

        // ✅ Fetch farmer record to get farmer_id linked to that user_id
        const { data: farmerData, error: farmerError } = await supabase
          .from("farmers")
          .select("farmer_id")
          .eq("user_id", user.id)
          .single();

        if (farmerError) throw farmerError;

        const farmerId = farmerData?.farmer_id;
        console.log("👨‍🌾 Logged-in Farmer ID:", farmerId);

        if (!farmerId) {
          console.warn("⚠️ No farmer_id found for this user.");
          return;
        }

        // ✅ Fetch all orders + nested order_items + products
        const { data, error } = await supabase
          .from("orders")
          .select(`
            order_id,
            status,
            created_at,
            total_amount,
            payment_method,
            order_items (
              quantity,
              price,
              product_id,
              products (
                name,
                farmer_id
              )
            )
          `)
          .order("created_at", { ascending: false });

        if (error) throw error;

        console.log("🧾 Raw Orders from Supabase:", data);

        // ✅ Filter orders containing products of this farmer
        const farmerOrders = data.filter(order =>
          order.order_items?.some(
            item => item.products?.farmer_id === farmerId
          )
        );

        console.log("✅ Filtered Orders for this Farmer:", farmerOrders);
        setOrders(farmerOrders || []);
      } catch (err) {
        console.error("❌ Error fetching farmer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

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
                    <th className="p-3">Products</th>
                    <th className="p-3">Quantity</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    const farmerItems = order.order_items.filter(
                      item => item.products?.farmer_id === order.order_items[0].products?.farmer_id
                    );

                    return (
                      <tr key={order.order_id} className="border-t hover:bg-border/10 transition-colors">
                        <td className="p-3">{order.order_id.slice(0, 8)}</td>
                        <td className="p-3">
                          {farmerItems.map(item => item.products?.name).join(", ")}
                        </td>
                        <td className="p-3">
                          {farmerItems.map(item => item.quantity).join(", ")}
                        </td>
                        <td className="p-3">{order.status}</td>
                        <td className="p-3">
                          {order.created_at
                            ? new Date(order.created_at).toLocaleString("en-IN", {
                                timeZone: "Asia/Kolkata",
                                dateStyle: "medium",
                                timeStyle: "short",
                              })
                            : "-"}
                        </td>
                      </tr>
                    );
                  })}
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
