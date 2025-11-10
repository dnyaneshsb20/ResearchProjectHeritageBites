import React, { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, Calendar, Package, ShoppingCart, User, Award } from "lucide-react";
import Button from "../../../components/ui/Button";
import { supabase } from "../../../supabaseClient";
import CustomerOrdersTable from "./CustomerOrdersTable";

const FarmerProfileModal = ({ farmer, onClose }) => {
    const [activeTab, setActiveTab] = useState("Products");
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    // Helper functions for initials and color
    const getInitials = (name) => {
        if (!name) return "F";
        const names = name.split(" ");
        return names.length > 1
            ? `${names[0][0]}${names[1][0]}`
            : `${names[0][0]}`;
    };

    const getColorFromName = (name) => {
        if (!name) return "#10b981";
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const color = `hsl(${hash % 360}, 70%, 50%)`;
        return color;
    };

    // Fetch farmer products
    useEffect(() => {
        const fetchProducts = async () => {
            if (!farmer?.id) return;
            setLoading(true);
            try {
                const { data, error } = await supabase
                    .from("products")
                    .select("product_id, name, price, image_url, stock, created_at")
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

    const tabs = [
        { id: "Products", label: "Products", icon: Package, count: products.length },
        { id: "Orders", label: "Orders", icon: ShoppingCart, count: orders.length },
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pt-24">
            <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
                    <div className="flex items-center gap-4">
                        <div
                            className="w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground text-xl font-semibold border-4 border-green-200"
                            style={{
                                backgroundColor: getColorFromName(farmer?.name)
                            }}
                        >
                            {getInitials(farmer?.name)}
                        </div>

                        <div>
                            <h2 className="text-2xl font-bold text-foreground">
                                {farmer?.name || "Unknown Farmer"}
                            </h2>
                            <p className="text-muted-foreground flex items-center gap-1">
                                <User className="w-4 h-4" />
                                <span>Farmer</span>
                                {farmer?.createdAt && (
                                    <>
                                        <span>•</span>
                                        <span>Joined {farmer.createdAt}</span>
                                    </>
                                )}
                            </p>
                        </div>
                    </div>

                    <Button
                        onClick={onClose}
                        className="hover:bg-primary"
                        variant="ghost"
                        size="icon"
                    >
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Farmer Information Grid */}
                <div className="p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Contact Information */}
                        <div className="bg-background rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-primary" />
                                Contact Information
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Mail className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Email</p>
                                        <p className="text-foreground font-medium break-all">
                                            {farmer?.email || "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Phone className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Contact</p>
                                        <p className="text-foreground font-medium">
                                            {farmer?.contactInfo || "Not provided"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <MapPin className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Location</p>
                                        <p className="text-foreground font-medium">
                                            {farmer?.location || "Not specified"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Farmer Details */}
                        <div className="bg-background rounded-lg border border-border p-6">
                            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                                <Award className="w-5 h-5 text-primary" />
                                Farmer Details
                            </h3>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Calendar className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Member Since</p>
                                        <p className="text-foreground font-medium">
                                            {farmer?.createdAt || "Unknown"}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-primary/10 rounded-lg">
                                        <Award className="w-4 h-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm text-muted-foreground">Certifications</p>
                                        <p className="text-foreground font-medium">
                                            {farmer?.certifications || "Not certified"}
                                        </p>
                                    </div>
                                </div>

                                {/* Stats Summary */}
                                <div className="pt-4 border-t border-border/50">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{products.length}</p>
                                            <p className="text-xs text-muted-foreground">Products</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-2xl font-bold text-foreground">{orders.length}</p>
                                            <p className="text-xs text-muted-foreground">Orders</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs Navigation */}
                <div className="border-t border-border">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${
                                    activeTab === tab.id
                                        ? "border-primary text-primary bg-primary/5"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary hover:text-white"
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                {tab.label}
                                {tab.count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-full text-xs ${
                                        activeTab === tab.id 
                                            ? 'bg-primary text-primary-foreground' 
                                            : 'bg-muted text-muted-foreground'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Tab Content */}
                    <div className="p-6 bg-background min-h-[200px]">
                        {activeTab === "Products" && (
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Farm Products
                                </h3>
                                {loading ? (
                                    <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                                        Loading products...
                                    </div>
                                ) : products.length === 0 ? (
                                    <div className="text-center py-8 text-muted-foreground">
                                        <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                                        <p>No products listed yet.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {products.map((product) => (
                                            <div
                                                key={product.product_id}
                                                className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                                            >
                                                <div className="flex">
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-20 h-20 object-cover flex-shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-20 h-20 bg-muted flex items-center justify-center flex-shrink-0">
                                                            <Package className="w-6 h-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                    <div className="p-4 flex-1">
                                                        <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                                                            {product.name}
                                                        </h4>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="font-bold text-foreground">
                                                                ₹{product.price}
                                                            </span>
                                                            <span className={`text-xs px-2 py-1 rounded-full ${
                                                                product.stock > 0 
                                                                    ? 'bg-green-100 text-green-800' 
                                                                    : 'bg-red-100 text-red-800'
                                                            }`}>
                                                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                                            </span>
                                                        </div>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Added {new Date(product.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {activeTab === "Orders" && (
                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Order History
                                </h3>
                                <CustomerOrdersTable farmerId={farmer.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FarmerProfileModal;