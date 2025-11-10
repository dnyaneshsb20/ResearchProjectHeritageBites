import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import toast from "react-hot-toast";
import Button from "../../../components/ui/Button";
import { BsCash, BsBank2 } from "react-icons/bs";
import { MdSensorOccupied } from "react-icons/md";
import { FaCreditCard, FaWallet, FaUser, FaMapMarkerAlt, FaCalendar, FaReceipt } from "react-icons/fa";
import Icon from "../../../components/AppIcon";

const CustomerOrdersTable = ({ userId, farmerId }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query = supabase.from("orders").select("*").order("created_at", { ascending: false });
        if (userId) query = query.eq("user_id", userId);

        const { data: ordersData, error: ordersError } = await query;
        if (ordersError) throw ordersError;

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("user_id, name, email");
        if (usersError) throw usersError;

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
          const items = orderItemsData
            .filter(item => item.order_id === order.order_id)
            .filter(item => !farmerId || item.products.farmer_id === farmerId)
            .map(item => ({
              ...item,
              productName: item.products.name,
              farmerName: farmersData.find(f => f.farmer_id === item.products.farmer_id)?.users?.name || "-"
            }));

          if (farmerId && items.length === 0) return null;

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

  const getStatusColor = (status) => {
    const statusColors = {
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      completed: "bg-green-100 text-green-800 border-green-200",
      cancelled: "bg-red-100 text-red-800 border-red-200",
      processing: "bg-blue-100 text-blue-800 border-blue-200",
      shipped: "bg-purple-100 text-purple-800 border-purple-200",
      delivered: "bg-emerald-100 text-emerald-800 border-emerald-200"
    };
    return statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const renderPayment = (method, isModal = false) => {
    if (!method) return "-";

    const lowerMethod = method.toLowerCase();

    switch (lowerMethod) {
      case "upi":
        return isModal ? (
          <div className="flex items-center gap-2 text-green-700">
            <MdSensorOccupied className="text-green-600" size={18} />
            <span className="font-medium">UPI Payment</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <MdSensorOccupied className="text-green-600" size={16} />
            <span>UPI</span>
          </div>
        );

      case "card":
        return isModal ? (
          <div className="flex items-center gap-2 text-blue-700">
            <FaCreditCard className="text-blue-600" size={16} />
            <span className="font-medium">Card Payment</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <FaCreditCard className="text-blue-600" size={14} />
            <span>Card</span>
          </div>
        );

      case "netbanking":
      case "net banking":
        return isModal ? (
          <div className="flex items-center gap-2 text-indigo-700">
            <BsBank2 className="text-indigo-600" size={16} />
            <span className="font-medium">Net Banking</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <BsBank2 className="text-indigo-600" size={14} />
            <span>Net Banking</span>
          </div>
        );

      case "digitalwallet":
      case "digital wallet":
        return isModal ? (
          <div className="flex items-center gap-2 text-amber-700">
            <FaWallet className="text-amber-600" size={16} />
            <span className="font-medium">Digital Wallet</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <FaWallet className="text-amber-600" size={14} />
            <span>Wallet</span>
          </div>
        );

      case "cod":
      case "cash":
        return isModal ? (
          <div className="flex items-center gap-2 text-green-500">
            <BsCash className="text-green-500" size={16} />
            <span className="font-medium">Cash on Delivery</span>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <BsCash className="text-green-600" size={16} />
            <span>Cash</span>
          </div>
        );

      default:
        return <span className="capitalize">{method}</span>;
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
        Loading orders...
      </div>
    );

  if (!orders.length)
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <Icon name="Package" size={24} className="mr-2" />
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
                <td className="p-3 border-b font-mono text-sm">{order.order_id.slice(0, 8)}</td>
                <td className="p-3 border-b">
                  <div>
                    <div className="font-medium">{order.user?.name ?? "-"}</div>
                    <div className="text-xs text-gray-500">{order.user?.email}</div>
                  </div>
                </td>
                <td className="p-3 border-b">{order.farmerName}</td>
                <td className="p-3 border-b font-semibold">₹{order.total_amount?.toFixed(2)}</td>
                <td className="p-3 border-b">{renderPayment(order.payment_method)}</td>
                <td className="p-3 border-b">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="p-3 border-b text-sm">
                  {new Date(order.created_at).toLocaleString()}
                </td>
                <td className="p-3 border-b">
                  <Button
                    onClick={() => openModal(order)}
                    className="px-3 py-1 text-sm"
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
          <div className="bg-background rounded-xl shadow-2xl w-full max-w-4xl p-6 relative h-[85vh] overflow-y-auto">
            {/* Close Button */}
            <Button
              onClick={closeModal}
              variant="ghost2"
              className="absolute top-4 right-4 p-2 hover:text-white rounded-lg transition-colors"
            >
              <Icon name="X" size={20} />
            </Button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Order Details</h2>
              <p className="text-gray-600 mt-1">Complete order information and tracking</p>
            </div>

            {/* Two Sections Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Order Details Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FaReceipt className="text-blue-600" size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Order Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Order ID</span>
                    <span className="font-mono text-sm font-semibold text-gray-900">
                      {selectedOrder.order_id}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Total Amount</span>
                    <span className="text-lg font-bold text-gray-900">
                      ₹{selectedOrder.total_amount?.toFixed(2)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Payment Method</span>
                    <div>{renderPayment(selectedOrder.payment_method, true)}</div>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Status</span>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        selectedOrder.status
                      )}`}
                    >
                      {selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600">Order Date</span>
                    <div className="flex items-center gap-2 text-gray-900">
                      <FaCalendar className="text-gray-400" size={14} />
                      <span className="text-sm">
                        {new Date(selectedOrder.created_at).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details Section */}
              <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <FaUser className="text-green-600" size={18} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Customer Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Customer Name</span>
                    <span className="font-semibold text-gray-900">
                      {selectedOrder.user?.name ?? "-"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Email</span>
                    <span className="text-gray-900">{selectedOrder.user?.email ?? "-"}</span>
                  </div>

                  <div className="flex justify-between items-center pb-3 border-b border-gray-200">
                    <span className="text-sm font-medium text-gray-600">Farmer/Vendor</span>
                    <span className="font-semibold text-gray-900">{selectedOrder.farmerName}</span>
                  </div>

                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600">Delivery Info</span>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-gray-900 mb-1">
                        <FaMapMarkerAlt className="text-gray-400" size={12} />
                        <span className="text-sm">
                          {selectedOrder.delivery_address || "Address not specified"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {selectedOrder.city && `${selectedOrder.city}, `}
                        {selectedOrder.postal_code && `${selectedOrder.postal_code}`}
                        {!selectedOrder.city &&
                          !selectedOrder.postal_code &&
                          "Location details not available"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Items Table Section */}
            {selectedOrder.items && selectedOrder.items.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xl">
                <div className="bg-white px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Order Items ({selectedOrder.items.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full bg-white">
                    <thead className="bg-white border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Item Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Unit Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          Total Price
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-gray-900">{item.productName}</div>
                            {item.farmerName && (
                              <div className="text-sm text-gray-500 mt-1">
                                Farmer: {item.farmerName}
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4 text-gray-900">{item.quantity}</td>
                          <td className="px-6 py-4 text-gray-900">₹{item.price?.toFixed(2)}</td>
                          <td className="px-6 py-4 font-semibold text-gray-900">
                            ₹{(item.quantity * item.price)?.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default CustomerOrdersTable;