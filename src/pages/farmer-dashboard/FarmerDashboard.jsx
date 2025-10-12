// src/pages/FarmerDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/ui/Button";
import Header from "../../components/ui/Header";
import Footer from "../dashboard/components/Footer";

const FarmerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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
          .eq("farmer_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);

        if (pErr) console.error(pErr);
        setProducts(productsData || []);

        const { data: ordersData, error: oErr } = await supabase
          .from("orders")
          .select("*")
          .eq("farmer_id", userId)
          .order("created_at", { ascending: false })
          .limit(10);

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

  return (
    <>
      <Header />

      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar */}
          <aside className="col-span-1 bg-popover p-4 rounded-lg border border-border">
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center text-xl font-medium">
                {(farmer?.name || user?.name || "Farmer").charAt(0).toUpperCase()}
              </div>
              <div className="font-semibold">{farmer?.name || user?.name || "Farmer"}</div>
              <div className="text-sm text-muted-foreground">{user?.email}</div>
            </div>

            <nav className="mt-6 space-y-2">
              <button className="w-full text-left p-2 rounded hover:bg-muted" onClick={() => navigate("/farmer-dashboard")}>Dashboard</button>
              <button className="w-full text-left p-2 rounded hover:bg-muted" onClick={() => navigate("/farmer/products")}>My Products</button>
              <button className="w-full text-left p-2 rounded hover:bg-muted" onClick={() => navigate("/farmer/orders")}>Orders</button>
              <button className="w-full text-left p-2 rounded hover:bg-muted" onClick={() => navigate("/farmer/profile")}>Profile</button>
              <button className="w-full text-left p-2 rounded hover:bg-muted" onClick={() => { logout?.(); navigate("/sign-in"); }}>Logout</button>
            </nav>
          </aside>

          {/* Main */}
          <main className="md:col-span-3">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Farmer Dashboard</h2>
              <div>
                <Button size="sm" onClick={() => navigate("/farmer/add-product")}>Add Product</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-popover border border-border">
                <div className="text-sm text-muted-foreground">Products</div>
                <div className="text-2xl font-semibold">{products.length}</div>
              </div>
              <div className="p-4 rounded-lg bg-popover border border-border">
                <div className="text-sm text-muted-foreground">Orders</div>
                <div className="text-2xl font-semibold">{orders.length}</div>
              </div>
              <div className="p-4 rounded-lg bg-popover border border-border">
                <div className="text-sm text-muted-foreground">Profile Complete</div>
                <div className="text-2xl font-semibold">{farmer ? "Yes" : "No"}</div>
              </div>
            </div>

            <div className="bg-popover p-4 rounded-lg border border-border">
              <h3 className="font-medium mb-3">Recent Products</h3>

              {products.length === 0 ? (
                <div className="text-sm text-muted-foreground">No products yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead className="text-left">
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Stock</th>
                      <th>Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((p) => (
                      <tr key={p.id} className="border-t">
                        <td>{p.name}</td>
                        <td>{p.price}</td>
                        <td>{p.stock ?? "-"}</td>
                        <td>{p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </main>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default FarmerDashboard;
