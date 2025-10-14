// src/pages/farmer-dashboard/components/AddProductModal.jsx
import React, { useState, useEffect } from "react";
import { supabase } from "../../../supabaseClient";
import { useAuth } from "../../../context/AuthContext";
import Button from "../../../components/ui/Button";

const AddProductModal = ({ isOpen, onClose, onProductAdded }) => {
  const { user } = useAuth();
  const [farmerId, setFarmerId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    unit: "",
    stock: "",
    certifications: "",
    image_url: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchFarmerId = async () => {
      try {
        const stored = user || JSON.parse(localStorage.getItem("user") || "null");
        const userId = stored?.id || stored?.user_id || stored?.user?.id;
        if (!userId) return;

        const { data, error } = await supabase
          .from("farmers")
          .select("farmer_id")
          .eq("user_id", userId)
          .single();

        if (error) throw error;
        setFarmerId(data?.farmer_id);
      } catch (err) {
        console.error("Failed to fetch farmer ID:", err.message);
      }
    };

    if (isOpen) fetchFarmerId();
  }, [user, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.price) {
      alert("Please fill in product name and price");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.from("products").insert([
        {
          name: formData.name,
          price: parseFloat(formData.price),
          unit: formData.unit,
          stock: parseInt(formData.stock) || 0,
          certifications: formData.certifications,
          image_url: formData.image_url,
          farmer_id: farmerId,
        },
      ]);

      if (error) throw error;

      alert("Product added successfully!");
      onProductAdded(data[0]);
      setFormData({
        name: "",
        price: "",
        unit: "",
        stock: "",
        certifications: "",
        image_url: "",
      });
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-5 relative mt-18">
        {/* Header */}
        <h2 className="text-xl font-semibold mb-5 text-center">Add New Product</h2>

        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
          onClick={onClose}
        >
          ×
        </button>

        {/* Form */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="input w-full h-12 text-base px-3"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Price (₹)"
            className="input w-full h-12 text-base px-3"
          />
          <input
            type="text"
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            placeholder="Unit (e.g., 1 KG)"
            className="input w-full h-12 text-base px-3"
          />
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="input w-full h-12 text-base px-3"
          />
          <input
            type="text"
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            placeholder="Certifications (comma separated)"
            className="input w-full h-12 text-base px-3"
          />
          <input
            type="text"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            placeholder="Image URL"
            className="input w-full h-12 text-base px-3"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <Button size="sm" variant="destructive" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={handleSubmit} loading={loading}>
            Add Product
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
