import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import toast from "react-hot-toast";
import Button from "../../../components/ui/button";
import { MdSensorOccupied } from "react-icons/md"; // UPI
import { FaCreditCard } from "react-icons/fa";     // Card
import { BsCash } from "react-icons/bs";          // Cash / COD

const CustomerOrdersTable = ({ userId, farmerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch orders
        let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (userId) query = query.eq("user_id", userId);  // <-- add this filter

        const { data: ordersData, error: ordersError } = await query;

        if (ordersError) throw ordersError;

        // Fetch users
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("user_id, name, email");
        if (usersError) throw usersError;

        // Fetch order items with product info
        const { data: orderItemsData, error: orderItemsError } = await supabase
          .from("order_items")
          .select(`
            order_id,
            quantity,
            price,
            product_id,
            products (
              name,
              farmer_id
            )
          `);
        if (orderItemsError) throw orderItemsError;

        // Fetch farmers with user info
        const { data: farmersData, error: farmersError } = await supabase
          .from("farmers")
          .select(`
            farmer_id,
            user_id,
            users(name)
          `);
        if (farmersError) throw farmersError;
        const ordersWithNames = ordersData.map(order => {
          const user = usersData.find(u => u.user_id === order.user_id);

          // Filter items differently depending on farmerId
          const items = orderItemsData
            .filter(item => item.order_id === order.order_id)
            .filter(item => !farmerId || item.products.farmer_id === farmerId) // <- only filter if farmerId exists
            .map(item => ({
              ...item,
              productName: item.products.name,
              farmerName: farmersData.find(f => f.farmer_id === item.products.farmer_id)?.users?.name || "-"
            }));

          if (farmerId && items.length === 0) return null; // skip orders with no items for this farmer

          const farmerNames = [...new Set(items.map(i => i.farmerName).filter(Boolean))];

          return {
            ...order,
            user,
            items,
            farmerName: farmerNames.join(", ") || "-"
          };
        }).filter(Boolean);


        let filteredOrders = ordersWithNames;
        if (farmerId) {
          filteredOrders = ordersWithNames.filter(order =>
            order.items.some(item => item.products.farmer_id === farmerId)
          );
        }

        setOrders(filteredOrders);


        setOrders(ordersWithNames);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setModalOpen(false);
  };

  // Helper function to render payment
  const renderPayment = (method, isModal = false) => {
    if (!method) return "-";

    const lowerMethod = method.toLowerCase();

    switch (lowerMethod) {
      case "upi":
        return isModal ? (
          <div className="flex items-center gap-2">
            <MdSensorOccupied className="text-green-500" /> UPI Payment
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <MdSensorOccupied className="text-green-500" /> UPI
          </div>
        );
      case "card":
        return isModal ? (
          <div className="flex items-center gap-2">
            <FaCreditCard className="text-blue-500" /> Card Payment
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <FaCreditCard className="text-blue-500" /> Card
          </div>
        );
      case "cod":
      case "cash":
        return isModal ? (
          <div className="flex items-center gap-2">
            <BsCash className="text-yellow-500" /> Cash Payment
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <BsCash className="text-yellow-500" /> Cash
          </div>
        );
      default:
        return method;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        No orders found.
      </div>
    );

  return (
    <div className="overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200 p-4">
      {/* Orders Table */}
      <div className="max-h-[70vh] overflow-y-auto">
        <table className="min-w-full text-left border-collapse">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="p-3 border-b text-gray-700 font-medium">Order ID</th>
              <th className="p-3 border-b text-gray-700 font-medium">Customer</th>
              <th className="p-3 border-b text-gray-700 font-medium">Farmer</th>
              <th className="p-3 border-b text-gray-700 font-medium">Amount</th>
              <th className="p-3 border-b text-gray-700 font-medium">Payment</th>
              <th className="p-3 border-b text-gray-700 font-medium">Status</th>
              <th className="p-3 border-b text-gray-700 font-medium">Created At</th>
              <th className="p-3 border-b text-gray-700 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr
                key={order.order_id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="p-3 border-b font-mono">{order.order_id.slice(0, 8)}</td>
                <td className="p-3 border-b">{order.user?.name ?? "-"}</td>
                <td className="p-3 border-b">{order.farmerName}</td>
                <td className="p-3 border-b">Rs {order.total_amount?.toFixed(2)}</td>
                <td className="p-3 border-b">{renderPayment(order.payment_method)}</td>
                <td className="p-3 border-b capitalize">{order.status}</td>
                <td className="p-3 border-b">
                  {new Date(order.created_at).toLocaleString()}
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6 relative h-[85vh] overflow-y-auto mt-16">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              ×
            </button>
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Details</h2>

            {/* Order Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="font-semibold">Order ID:</p>
                <p className="text-gray-700 font-mono">{selectedOrder.order_id}</p>
              </div>
              <div>
                <p className="font-semibold">Customer Name:</p>
                <p className="text-gray-700">{selectedOrder.user?.name ?? "-"}</p>
              </div>
              <div>
                <p className="font-semibold">Farmer Name:</p>
                <p className="text-gray-700">{selectedOrder.farmerName}</p>
              </div>
              <div>
                <p className="font-semibold">Total Amount:</p>
                <p className="text-gray-700">Rs {selectedOrder.total_amount?.toFixed(2)}</p>
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
                <p className="text-gray-700">{new Date(selectedOrder.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Items Table */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="overflow-x-auto max-h-[50vh] overflow-y-auto border rounded-lg">
                <h3 className="text-xl font-semibold mb-2 border-b pb-1">Items</h3>
                <table className="min-w-full border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="p-2 border-b text-left">Item Name</th>
                      <th className="p-2 border-b text-left">Quantity</th>
                      <th className="p-2 border-b text-left">Price</th>
                      <th className="p-2 border-b text-left">Farmer</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.items.map((item, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                        <td className="p-2 border-b">{item.productName}</td>
                        <td className="p-2 border-b">{item.quantity}</td>
                        <td className="p-2 border-b">Rs {item.price?.toFixed(2)}</td>
                        <td className="p-2 border-b">{item.farmerName}</td>
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
  );
};

export default CustomerOrdersTable;
