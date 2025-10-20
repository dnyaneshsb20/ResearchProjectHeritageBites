import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import toast from "react-hot-toast";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "",
    stock: "",
    certifications: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);
  const [farmerId, setFarmerId] = useState(null);

  // ✅ Fetch farmer_id from Supabase session
  useEffect(() => {
    const fetchFarmerId = async () => {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        toast.success("Farmer not logged in. Please log in again.");
        return;
      }

      const user = session.user;

      const { data: farmer, error } = await supabase
        .from("farmers")
        .select("farmer_id")
        .eq("user_id", user.id)
        .single();

      if (error || !farmer) {
        console.error("Error fetching farmer_id:", error);
        toast.error("Farmer ID not found. Please log in again.");
      } else {
        setFarmerId(farmer.farmer_id);
      }
    };

    if (isOpen) fetchFarmerId();
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!farmerId) {
      toast.error("Farmer ID not found. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      // ✅ Step 1: Insert new ingredient (if not already exists)
      const { data: ingredient, error: ingredientError } = await supabase
        .from("ingredients")
        .insert([{ name: formData.name }])
        .select("ingredient_id")
        .single();

      if (ingredientError) {
        // Check if duplicate ingredient name (due to unique constraint)
        if (ingredientError.code === "23505") {
          // Fetch existing ingredient_id if name already exists
          const { data: existing, error: fetchError } = await supabase
            .from("ingredients")
            .select("ingredient_id")
            .eq("name", formData.name)
            .single();

          if (fetchError || !existing) throw fetchError;
          ingredient = existing;
        } else {
          throw ingredientError;
        }
      }

      // ✅ Step 2: Insert product with the new ingredient_id
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: formData.name,
            price: formData.price,
            unit: formData.unit,
            stock: formData.stock,
            certifications: formData.certifications,
            image_url: formData.image_url,
            ingredient_id: ingredient.ingredient_id,
            farmer_id: farmerId,
          },
        ])
        .select()
        .single();

      if (error) throw error;

      toast.success("Product added successfully!");
      onProductAdded(data);
      onClose();

      setFormData({
        name: "",
        price: "",
        unit: "",
        stock: "",
        certifications: "",
        image_url: "",
      });
    } catch (err) {
      console.error("Error adding product:", err);
      toast.error("Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-start justify-center bg-black bg-opacity-40 z-50 overflow-y-auto pt-20 mt-5">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-fadeIn overflow-hidden"
        style={{ maxHeight: "80vh" }}
      >
        <div className="p-6 max-h-[80vh] overflow-y-auto pr-4">
          <h2 className="text-xl font-semibold mb-4 text-center">Add New Product</h2>

          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              label="Product Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Indian Rice"
              required
            />
            <Input
              label="Price"
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="₹"
              required
            />
            <Input
              label="Unit"
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              placeholder="e.g. 1kg, 500g, etc."
              required
            />
            <Input
              label="Stock"
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="e.g. 25"
              required
            />
            <Input
              label="Certifications"
              name="certifications"
              value={formData.certifications}
              onChange={handleChange}
              placeholder="e.g. Organic, FSSAI Certified"
              required
            />
            <Input
              label="Image URL"
              name="image_url"
              value={formData.image_url}
              onChange={handleChange}
              placeholder="Paste image URL here"
              required
            />

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                onClick={onClose}
                variant="secondary"
                className="bg-gray-200 text-black hover:bg-gray-300"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Product"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
