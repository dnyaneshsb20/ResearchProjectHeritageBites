import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";
import { Loader2, Package, IndianRupee, CalendarDays } from "lucide-react";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();
        if (authError) throw authError;
        if (!user) return;

        const { data: farmerData, error: farmerError } = await supabase
          .from("farmers")
          .select("farmer_id")
          .eq("user_id", user.id)
          .single();

        if (farmerError) throw farmerError;
        const farmerId = farmerData?.farmer_id;
        if (!farmerId) return;

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

        const farmerOrders = data.filter((order) =>
          order.order_items?.some((item) => item.products?.farmer_id === farmerId)
        );

        setOrders(farmerOrders || []);
      } catch (err) {
        console.error("❌ Error fetching farmer orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-100 text-green-700 border-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-blue-100 text-blue-700 border-blue-300";
    }
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-b from-background to-muted/40 py-10 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-foreground mb-8 flex items-center gap-2">
            <Package className="w-7 h-7 text-primary" />
            Farmer Orders
          </h2>

          {loading ? (
            <div className="flex justify-center items-center py-24">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">
              <Package className="mx-auto mb-3 w-10 h-10 opacity-60" />
              <p className="text-lg font-medium">No orders found yet.</p>
              <p className="text-sm opacity-70">
                Once you receive orders, they’ll appear here.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border shadow-md bg-muted/30 backdrop-blur">
              <table className="w-full border-collapse text-sm text-left">
                <thead className="sticky top-0 bg-muted/50 text-foreground uppercase text-xs tracking-wider shadow-sm">
                  <tr>
                    <th className="p-4 font-semibold">Order ID</th>
                    <th className="p-4 font-semibold">Product</th>
                    <th className="p-4 font-semibold">Quantity</th>
                    <th className="p-4 font-semibold">Price</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold">Date</th>
                    <th className="p-4 text-right font-semibold">Total</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-border">
                  {orders.map((order, orderIndex) => {
                    const farmerItems = order.order_items.filter(
                      (item) => item.products?.farmer_id
                    );

                    // Alternating colors: one row bg-background, one light orange
                    const rowBg =
                      orderIndex % 2 !== 0 ? "bg-background" : "bg-orange-100";

                    return (
                      <React.Fragment key={order.order_id}>
                        {farmerItems.map((item, i) => (
                          <tr key={i} className={`${rowBg}`}>
                            {i === 0 ? (
                              <td
                                className="p-4 font-semibold text-gray-800 border-t border-border align-top"
                                rowSpan={farmerItems.length}
                              >
                                <span className="font-mono text-sm text-gray-700 bg-muted/40 px-2 py-1 rounded-md">
                                  #{order.order_id.slice(0, 8)}
                                </span>
                              </td>
                            ) : null}

                            <td className="p-4 text-gray-800 font-medium border-t border-border">
                              {item.products?.name}
                            </td>
                            <td className="p-4 text-gray-600 border-t border-border">
                              {item.quantity}
                            </td>
                            <td className="p-4 text-gray-600 border-t border-border">
                              ₹{item.price?.toLocaleString("en-IN")}
                            </td>

                            {i === 0 ? (
                              <>
                                <td
                                  className="p-4 align-top border-t border-border"
                                  rowSpan={farmerItems.length}
                                >
                                  <span
                                    className={`px-3 py-1 text-xs font-medium rounded-full border shadow-sm ${getStatusColor(
                                      order.status
                                    )}`}
                                  >
                                    {order.status}
                                  </span>
                                </td>
                                <td
                                  className="p-4 text-gray-600 align-top border-t border-border"
                                  rowSpan={farmerItems.length}
                                >
                                  <div className="flex items-center gap-1">
                                    <CalendarDays className="w-4 h-4 opacity-70" />
                                    {new Date(order.created_at).toLocaleDateString(
                                      "en-IN",
                                      {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                      }
                                    )}
                                  </div>
                                </td>
                                <td
                                  className="p-4 text-right font-semibold text-gray-800 align-top border-t border-border"
                                  rowSpan={farmerItems.length}
                                >
                                  <div className="flex justify-end items-center gap-1">
                                    <IndianRupee className="w-4 h-4 opacity-70" />
                                    {order.total_amount?.toLocaleString("en-IN") ||
                                      "-"}
                                  </div>
                                </td>
                              </>
                            ) : null}
                          </tr>
                        ))}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FarmerOrders;
