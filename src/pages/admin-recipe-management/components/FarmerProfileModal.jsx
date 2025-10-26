import React, { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, Calendar } from "lucide-react";
import Button from "../../../components/ui/Button";
import { supabase } from "../../../supabaseClient";
import { PiCertificate } from "react-icons/pi";
import CustomerOrdersTable from "./CustomerOrdersTable";

const FarmerProfileModal = ({ farmer, onClose }) => {
    const [activeTab, setActiveTab] = useState("Products");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch farmer products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!farmer?.id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("product_id, name, price, image_url, created_at")
                    .eq("farmer_id", farmer.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setProducts(data || []);
            } catch (err) {
                console.error("Error fetching farmer products:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [farmer]);

    // Fetch farmer orders
    useEffect(() => {
        const fetchOrders = async () => {
            if (!farmer?.id) return;
            try {
                const { data, error } = await supabase
                    .from("orders")
                    .select("order_id, total_amount, status, created_at")
                    .eq("farmer_id", farmer.id)
                    .order("created_at", { ascending: false });

                if (error) throw error;
                setOrders(data || []);
            } catch (err) {
                console.error("Error fetching farmer orders:", err);
            }
        };

        fetchOrders();
    }, [farmer]);

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white mt-16 max-h-[85vh] w-full max-w-6xl rounded-lg shadow-lg overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between mt-5 ml-3 items-center p-4 border-b">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold"
                            style={{
                                backgroundColor:
                                    typeof farmer?.name === "string"
                                        ? `hsl(${[...farmer.name].reduce(
                                            (h, c) => h + c.charCodeAt(0),
                                            0
                                        ) % 360
                                        },60%,55%)`
                                        : "#f97316",
                            }}
                        >
                            {farmer?.name
                                ? farmer.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .slice(0, 2)
                                    .join("")
                                    .toUpperCase()
                                : "F"}
                        </div>

                        <div>
                            <h2 className="text-2xl font-semibold text-gray-800">
                                {farmer?.name || "Unknown Farmer"}
                            </h2>
                            <p className="text-sm text-muted-foreground">Farmer</p>
                        </div>
                    </div>

                    <Button
                        onClick={onClose}
                        className="text-gray-500 p-2 rounded transition -mt-10"
                        aria-label="Close profile"
                        variant="outline"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Info Section */}
                <div className="p-6">
                    <div className="bg-white rounded-xl p-6 border border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Mail className="w-5 h-5 text-blue-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="text-gray-800 font-medium break-words">
                                            {farmer?.email || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <Phone className="w-5 h-5 text-green-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Contact</p>
                                        <p className="text-gray-800 font-medium">
                                            {farmer?.contactInfo || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <MapPin className="w-5 h-5 text-red-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Location</p>
                                        <p className="text-gray-800 font-medium">
                                            {farmer?.location || "N/A"}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                                    <div>
                                        <p className="text-sm text-gray-500">Joined</p>
                                        <p className="text-gray-800 font-medium">
                                            {farmer?.createdAt || "N/A"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-md text-md font-medium bg-orange-100 text-orange-600 mt-1">
                                        <PiCertificate />
                                    </span>
                                    <div>
                                        <p className="text-sm text-gray-500">Certifications</p>
                                        <p className="text-gray-800 font-medium">
                                            {farmer?.certifications || "N/A"} Certified Farmer
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Section */}
                <div className="border-t">
                    <div className="flex">
                        {["Products", "Orders"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`flex-1 py-3 text-center font-medium ${activeTab === tab
                                    ? "border-b-2 border-orange-500 text-orange-600"
                                    : "text-gray-600 hover:text-gray-800"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <div className="p-6 min-h-[160px]">
                        {/* Products Tab */}
                        {activeTab === "Products" && (
                            <>
                                {loading ? (
                                    <div className="text-gray-500 text-center">
                                        Loading products...
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-gray-500 text-center">
                                        No products found.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                                        {products.map((p) => (
                                            <div
                                                key={p.product_id}
                                                className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
                                            >
                                                {p.image_url ? (
                                                    <img
                                                        src={p.image_url}
                                                        alt={p.name}
                                                        className="w-full h-40 object-cover rounded-md mb-3"
                                                    />
                                                ) : (
                                                    <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">
                                                        No Image
                                                    </div>
                                                )}
                                                <h4 className="text-lg font-semibold">{p.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Price: ₹{p.price}
                                                </p>
                                                <p className="text-sm mt-1">
                                                    Status: <span className="text-gray-500">N/A</span>
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {new Date(p.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}

                        {/* Orders Tab */}
                        {activeTab === "Orders" && (
                            <CustomerOrdersTable farmerId={farmer.id} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfileModal;
