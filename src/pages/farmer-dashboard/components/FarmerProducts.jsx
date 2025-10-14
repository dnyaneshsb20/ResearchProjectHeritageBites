// src/pages/farmer-dashboard/components/Products.jsx
import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";

const Products = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const stored = user || JSON.parse(localStorage.getItem("user") || "null");
        const userId = stored?.id || stored?.user_id || stored?.user?.id;

        if (!userId) return;
         const { data: farmerData, error: fErr } = await supabase
          .from("farmers")
          .select("farmer_id")
          .eq("user_id", userId)
          .single();

        if (fErr || !farmerData) {
          console.warn("Farmer not found:", fErr?.message);
          setProducts([]);
          return;
        }


        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("farmer_id", farmerData?.farmer_id)

          .order("created_at", { ascending: false });

        if (error) console.error(error);
        else setProducts(data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user]);

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Products</h2>
            <Button size="sm" onClick={() => window.location.href = "/farmer/add-product"}>
              Add Product
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">
              No products added yet.
            </div>
          ) : (
            <div className="overflow-x-auto bg-popover rounded-lg border border-border">
              <table className="w-full text-sm">
                <thead className="text-left bg-border/20">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Price</th>
                    <th className="p-3">Stock</th>
                    <th className="p-3">Added</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr key={p.id} className="border-t hover:bg-border/10 transition-colors">
                      <td className="p-3">{p.name}</td>
                      <td className="p-3">{p.price}</td>
                      <td className="p-3">{p.stock ?? "-"}</td>
                      <td className="p-3">{p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}</td>
                    </tr>
                  ))}
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

export default Products;
