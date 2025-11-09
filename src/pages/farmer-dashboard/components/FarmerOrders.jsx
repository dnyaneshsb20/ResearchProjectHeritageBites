import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import {
  BsCash,
  BsBank2
} from "react-icons/bs";
import {
  MdSensorOccupied
} from "react-icons/md";
import {
  FaCreditCard,
  FaWallet
} from "react-icons/fa";
import { Loader2, Package } from "lucide-react";

const FarmerOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

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
    user_id,
    delivery_address,
    city,
    postal_code,
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

        // Fetch users for customer names
        const { data: usersData } = await supabase
          .from("users")
          .select("user_id, name");

        // Filter farmer's orders
        const farmerOrders = data
          .map((order) => {
            const farmerItems = order.order_items?.filter(
              (item) => item.products?.farmer_id === farmerId
            );

            if (!farmerItems || farmerItems.length === 0) return null;

            const customer = usersData?.find(
              (u) => u.user_id === order.user_id
            );

            return {
              ...order,
              customerName: customer?.name || "-",
              delivery_address: order.delivery_address,
              city: order.city,
              postal_code: order.postal_code,
              items: farmerItems.map((item) => ({
                ...item,
                productName: item.products?.name,
              })),
            };
          })
          .filter(Boolean);

        setOrders(farmerOrders || []);
      } catch (err) {
        console.error("❌ Error fetching farmer orders:", err);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const renderPayment = (method, isModal = false) => {
    if (!method) return "-";
    const lower = method.toLowerCase();

    const common = (icon, text, color) => (
      <div className={`flex items-center gap-1 ${isModal ? "gap-2" : ""}`}>
        {icon}
        <span className={color}>{text}</span>
      </div>
    );

    switch (lower) {
      case "upi":
        return common(<MdSensorOccupied className="text-green-500" />, isModal ? "UPI Payment" : "UPI");
      case "card":
        return common(<FaCreditCard className="text-blue-500" />, isModal ? "Card Payment" : "Card");
      case "netbanking":
      case "net banking":
        return common(<BsBank2 className="text-indigo-600" />, isModal ? "Net Banking" : "Net Banking");
      case "digitalwallet":
      case "digital wallet":
        return common(<FaWallet className="text-amber-800" />, isModal ? "Digital Wallet Payment" : "Wallet");
      case "cod":
      case "cash":
        return common(<BsCash className="text-green-500" />, isModal ? "Cash Payment" : "Cash");
      default:
        return method;
    }
  };

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
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
            <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200 p-4">
              <div className="max-h-[70vh] overflow-y-auto">
                <table className="min-w-full text-left border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-3 border-b text-gray-700 font-medium">Order ID</th>
                      <th className="p-3 border-b text-gray-700 font-medium">Customer</th>
                      <th className="p-3 border-b text-gray-700 font-medium">Amount</th>
                      <th className="p-3 border-b text-gray-700 font-medium">Payment</th>
                      <th className="p-3 border-b text-gray-700 font-medium">Status</th>
                      <th className="p-3 border-b text-gray-700 font-medium">Ordered On</th>
                      <th className="p-3 border-b text-gray-700 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order, idx) => (
                      <tr
                        key={order.order_id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="p-3 border-b font-mono">
                          #{order.order_id.slice(0, 8)}
                        </td>
                        <td className="p-3 border-b">{order.customerName}</td>
                        <td className="p-3 border-b">
                          ₹{order.total_amount?.toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 border-b">
                          {renderPayment(order.payment_method)}
                        </td>
                        <td className="p-3 border-b capitalize">{order.status}</td>
                        <td className="p-3 border-b">
                          {new Date(order.created_at).toLocaleString("en-IN")}
                        </td>
                        <td className="p-3 border-b">
                          <Button
                            onClick={() => openModal(order)}
                            className="px-3 py-1"
                            variant="default"
                          >
                            View Details
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Modal */}
              {modalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-start z-50 px-4 pt-20">
                  <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl p-6 relative h-[85vh] overflow-y-auto">
                    {/* Close Button */}
                    <button
                      onClick={closeModal}
                      className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                    >
                      ×
                    </button>

                    <h2 className="text-2xl font-bold mb-6 border-b pb-2">
                      Order Details
                    </h2>

                    {/* Two Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      {/* Order Details */}
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-3 border-b pb-1">Order Details</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="font-semibold">Order ID:</p>
                            <p className="text-gray-700 font-mono">{selectedOrder.order_id}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Total Amount:</p>
                            <p className="text-gray-700">₹{selectedOrder.total_amount?.toLocaleString("en-IN")}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Payment Method:</p>
                            <p className="text-gray-700">{renderPayment(selectedOrder.payment_method, true)}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Status:</p>
                            <p className="text-gray-700 capitalize">{selectedOrder.status}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Created At:</p>
                            <p className="text-gray-700">{new Date(selectedOrder.created_at).toLocaleString("en-IN")}</p>
                          </div>
                        </div>
                      </div>

                      {/* Customer Details */}
                      <div className="bg-gray-50 p-4 rounded-lg shadow-sm">
                        <h3 className="font-semibold text-lg mb-3 border-b pb-1">Customer Details</h3>
                        <div className="space-y-2">
                          <div>
                            <p className="font-semibold">Customer Name:</p>
                            <p className="text-gray-700">{selectedOrder.customerName}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Delivery Address:</p>
                            <p className="text-gray-700">{selectedOrder.delivery_address}</p>
                          </div>
                          <div>
                            <p className="font-semibold">City:</p>
                            <p className="text-gray-700">{selectedOrder.city}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Postal Code:</p>
                            <p className="text-gray-700">{selectedOrder.postal_code}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Items Table */}
                    {selectedOrder.items && selectedOrder.items.length > 0 && (
                      <div className="overflow-x-auto max-h-[50vh] overflow-y-auto border rounded-lg">
                        <h3 className="text-xl font-semibold mb-2 border-b pb-1">
                          Items
                        </h3>
                        <table className="min-w-full border-collapse">
                          <thead className="bg-gray-100 sticky top-0">
                            <tr>
                              <th className="p-2 border-b text-left">Item Name</th>
                              <th className="p-2 border-b text-left">Quantity</th>
                              <th className="p-2 border-b text-left">Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {selectedOrder.items.map((item, idx) => (
                              <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                <td className="p-2 border-b">{item.productName}</td>
                                <td className="p-2 border-b">{item.quantity}</td>
                                <td className="p-2 border-b">₹{item.price?.toLocaleString("en-IN")}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default FarmerOrders;
