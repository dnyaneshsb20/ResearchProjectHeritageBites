import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";
import Button from "../../../components/ui/Button";
import AddProductModal from "./AddProductModal";

const FarmerProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editData, setEditData] = useState({ name: "", price: 0, stock: 0, unit: "" });
  const [editLoading, setEditLoading] = useState(false);

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
          .order("name", { ascending: true });

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

  const handleEditClick = (product) => {
    setEditingProductId(product.product_id);
    setEditData({
      name: product.name,
      price: product.price,
      stock: product.stock,
      unit: product.unit || "",
    });
  };

  const handleEditSave = async (productId) => {
    setEditLoading(true);
    try {
      const { error } = await supabase
        .from("products")
        .update({
          name: editData.name,
          price: editData.price,
          stock: editData.stock,
          unit: editData.unit,
        })
        .eq("product_id", productId);

      if (error) throw error;

      setProducts((prev) =>
        prev.map((p) => (p.product_id === productId ? { ...p, ...editData } : p))
      );

      setEditingProductId(null);
    } catch (err) {
      console.error(err);
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("product_id", productId);
      if (error) throw error;
      setProducts((prev) => prev.filter((p) => p.product_id !== productId));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen p-6 bg-background">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">My Products</h2>
            <Button size="sm" onClick={() => setIsModalOpen(true)}>
              Add Product
            </Button>
            <AddProductModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              onProductAdded={(newProduct) => setProducts(prev => [newProduct, ...prev])}
            />
          </div>

          {loading ? (
            <div className="text-center py-10">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="text-muted-foreground py-10 text-center">No products added yet.</div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-border bg-card shadow-sm">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-foreground font-medium">
                  <tr>
                    <th className="px-4 py-3 text-left">Product Name</th>
                    <th className="px-4 py-3 text-left">Price (₹)</th>
                    <th className="px-4 py-3 text-left">Stock</th>
                    <th className="px-4 py-3 text-left">Added On</th>
                    <th className="px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((p) => (
                    <tr
                      key={p.product_id}
                      className="border-t hover:bg-muted/20 transition-all duration-150"
                    >
                      {editingProductId === p.product_id ? (
                        <>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={editData.name}
                              onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                              className="input w-full h-12"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editData.price}
                              onChange={(e) =>
                                setEditData({ ...editData, price: parseFloat(e.target.value) })
                              }
                              className="input w-full h-12"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="number"
                              value={editData.stock}
                              onChange={(e) =>
                                setEditData({ ...editData, stock: parseInt(e.target.value) })
                              }
                              className="input w-full h-12"
                            />
                          </td>
                          <td className="px-4 py-3">
                            <input
                              type="text"
                              value={p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                              disabled
                              className="input w-full h-12 bg-gray-100 cursor-not-allowed"
                            />
                          </td>
                          <td className="px-4 py-3 flex justify-center gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleEditSave(p.product_id)}
                              loading={editLoading}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => setEditingProductId(null)}
                            >
                              Cancel
                            </Button>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-3 font-medium text-foreground">{p.name}</td>
                          <td className="px-4 py-3 text-muted-foreground">{p.price?.toFixed(2)}</td>
                          <td className="px-4 py-3">
                            {p.stock > 0 ? (
                              <span className="text-success font-medium">{p.stock}</span>
                            ) : (
                              <span className="text-destructive font-medium">Out of Stock</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {p.created_at ? new Date(p.created_at).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-3 flex justify-center items-center gap-2">
                            <Button size="sm" onClick={() => handleEditClick(p)}>
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(p.product_id)}
                            >
                              Delete
                            </Button>
                          </td>
                        </>
                      )}
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

export default FarmerProducts;
