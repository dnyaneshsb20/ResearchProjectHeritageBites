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
          .order("created_at", { ascending: false });

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
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
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

      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-semibold">Farmer Dashboard</h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            {/* Products */}
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-warm">
              <Icon name="Package" size={28} className="text-accent mb-2" />
              <h3 className="text-sm text-muted-foreground">Products</h3>
              <p className="text-2xl font-bold">{products.length}</p>
            </div>

            {/* Orders */}
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-warm">
              <Icon name="ShoppingBag" size={28} className="text-success mb-2" />
              <h3 className="text-sm text-muted-foreground">Orders</h3>
              <p className="text-2xl font-bold">{orders.length}</p>
            </div>

            {/* Profile Completion */}
            <div className="bg-card border border-border rounded-lg p-6 flex flex-col items-center justify-center text-center shadow-warm">
              <Icon
                name={isProfileComplete ? "CheckCircle" : "AlertCircle"}
                size={28}
                className={isProfileComplete ? "text-success mb-2" : "text-warning mb-2"}
              />
              <h3 className="text-sm text-muted-foreground">Profile Complete</h3>
              <p className="text-2xl font-bold">{isProfileComplete ? "Yes" : "No"}</p>
            </div>
          </div>

          {/* Products Section */}
          <div className="bg-popover rounded-lg border border-border p-6 shadow-warm">
            <h3 className="text-lg font-medium mb-4">Your Products</h3>

            {products.length === 0 ? (
              <div className="text-sm text-muted-foreground">No products yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="bg-card border border-border rounded-lg overflow-hidden shadow-warm hover:shadow-warm-md transition-all duration-200 cursor-pointer group"
                  >
                    {/* Product Image */}
                    <div className="relative aspect-square overflow-hidden flex items-center justify-center bg-muted">
                      {product.image_url ? (
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      ) : (
                        <Icon name="Image" size={48} className="text-muted-foreground opacity-70" />
                      )}

                      {product.discount && (
                        <span className="absolute top-2 left-2 px-2 py-1 bg-accent text-accent-foreground text-xs font-medium rounded">
                          {product.discount}% OFF
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-1 line-clamp-2">{product.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {product.category || "Uncategorized"}
                      </p>

                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-foreground">₹{product.price}</span>
                        <span className="text-xs text-muted-foreground">
                          {product.stock > 0
                            ? `${product.stock} in stock`
                            : "Out of Stock"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                          Added:{" "}
                          {product.created_at
                            ? new Date(product.created_at).toLocaleDateString()
                            : "-"}
                        </span>
                        {product.isOrganic && (
                          <span className="text-success font-medium">Organic</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FarmerDashboard;
