// src/pages/FarmerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stored = user || JSON.parse(localStorage.getItem("user") || "null");
        const userId = stored?.id || stored?.user_id || stored?.user?.id;

        if (!userId) {
          navigate("/sign-in");
          return;
        }

        const { data: farmerData, error: fErr } = await supabase
          .from("farmers")
          .select("*")
          .eq("user_id", userId)
          .single();

        if (fErr && fErr.message) console.warn("Farmer profile fetch:", fErr.message);
        setFarmer(farmerData || null);

        const { data: productsData, error: pErr } = await supabase
          .from("products")
          .select("*")
          .eq("farmer_id", farmerData?.farmer_id)
          .order("name", { ascending: true });

        if (pErr) console.error(pErr);
        setProducts(productsData || []);

        const { data: ordersData, error: oErr } = await supabase
          .from("farmer_orders_view")
          .select("*")
          .eq("farmer_id", farmerData?.farmer_id)
          .order("created_at", { ascending: false });

        if (oErr) console.error(oErr);
        setOrders(ordersData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-3 text-muted-foreground">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
          Loading...
        </div>
      </div>
    );
  }

  // Check profile completeness
  const isProfileComplete =
    farmer &&
    farmer.bio &&
    farmer.certifications &&
    farmer.contact_info &&
    farmer.location;

  return (
    <>
      <Header />

      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-6">
          {/* Professional Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-foreground mb-1">Farmer Dashboard</h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {farmer?.name || 'Farmer'}
            </p>
          </div>

          {/* Compact Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Icon name="Package" size={25} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-md font-medium text-black">Products</p>
                  <p className="text-md font-semibold text-foreground">{products.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 rounded-lg">
                  <Icon name="ShoppingBag" size={25} className="text-green-600" />
                </div>
                <div>
                  <p className="text-md font-medium text-black">Orders</p>
                  <p className="text-md font-semibold text-foreground">{orders.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white border border-border rounded-lg p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  isProfileComplete ? 'bg-green-50' : 'bg-amber-50'
                }`}>
                  <Icon
                    name={isProfileComplete ? "CheckCircle" : "AlertCircle"}
                    size={25}
                    className={isProfileComplete ? "text-green-600" : "text-amber-600"}
                  />
                </div>
                <div>
                  <p className="text-md font-medium text-black">Profile</p>
                  <p className="text-md font-semibold text-foreground">
                    {isProfileComplete ? "Complete" : "Incomplete"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Products Section */}
          <div className="bg-white border border-border rounded-lg">
            <div className="px-5 py-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Products</h2>
                <span className="text-sm text-muted-foreground">
                  {products.length} items
                </span>
              </div>
            </div>

            <div className="p-5">
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="Package" size={32} className="text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground mb-4">No products listed</p>
                  <button 
                    onClick={() => navigate('/farmer/products/new')}
                    className="bg-primary text-primary-foreground px-4 py-2 rounded text-sm font-medium hover:bg-primary/90"
                  >
                    Add Product
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="group border border-border rounded-lg hover:border-primary/40 transition-all duration-200 bg-background hover:shadow-sm"
                    >
                      {/* Product Image */}
                      <div className="relative h-28 bg-muted rounded-t-lg overflow-hidden">
                        {product.image_url ? (
                          <Image
                            src={product.image_url}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon name="Image" size={20} className="text-muted-foreground" />
                          </div>
                        )}

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex justify-between items-start">
                          {product.discount && (
                            <span className="bg-primary text-primary-foreground text-xs px-1.5 py-0.5 rounded font-medium">
                              {product.discount}% OFF
                            </span>
                          )}
                          {product.isOrganic && (
                            <span className="bg-green-500 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                              Organic
                            </span>
                          )}
                        </div>

                        {/* Stock Status */}
                        <div className="absolute bottom-2 right-2">
                          <div className={`px-1.5 py-0.5 rounded text-xs font-medium ${
                            product.stock > 10 
                              ? 'bg-green-100 text-green-700' 
                              : product.stock > 0 
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {product.stock} left
                          </div>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="p-3">
                        <h3 className="font-medium text-foreground text-sm line-clamp-2 mb-1 leading-tight">
                          {product.name}
                        </h3>
                        
                        <p className="text-xs text-muted-foreground mb-2 line-clamp-1">
                          {product.category || "General"}
                        </p>

                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground text-sm">
                            ₹{product.price}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FarmerDashboard;