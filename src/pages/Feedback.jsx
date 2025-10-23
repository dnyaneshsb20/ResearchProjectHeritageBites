import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Upload, X } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import Footer from "../pages/dashboard/components/Footer";
import Header from "components/ui/Header";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    title: "",
    message: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      toast.error("Please enter your name.");
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return false;
    }
    if (formData.rating === 0) {
      toast.error("Please select a rating.");
      return false;
    }
    if (!formData.title.trim()) {
      toast.error("Please enter a title for your feedback.");
      return false;
    }
    if (!formData.message.trim()) {
      toast.error("Please enter your feedback message.");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      toast.success("Feedback submitted successfully! 🎉 Thank you!");
      setFormData({ name: "", email: "", rating: 0, title: "", message: "" });
      setImageFile(null);
      setImagePreview(null);
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <header className="bg-gradient-to-br from-primary via-secondary to-accent py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          We Value Your Feedback
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          Share your thoughts, suggestions, or experiences with HeritageBites.
        </p>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12 flex-1">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card shadow-[var(--shadow-card)] rounded-xl p-8 space-y-6"
        >
          {/* Name and Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-foreground font-medium">Name *</label>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                className="bg-background/50 border-border focus:ring-2 focus:ring-golden rounded"
              />
            </div>
            <div className="space-y-2">
              <label className="text-foreground font-medium">Email *</label>
              <Input
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="bg-background/50 border-border focus:ring-2 focus:ring-golden rounded"
              />
            </div>
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <label className="text-foreground font-medium">Rating *</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                  key={star}
                  type="button"
                  onClick={() => handleRatingClick(star)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  className="transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full"
                  aria-label={`Rate ${star} stars`}
                >
                  <Star
                    className={`w-8 h-8 transition-colors ${
                      star <= formData.rating
                        ? "fill-primary text-primary"
                        : "fill-muted text-muted-foreground"
                    }`}
                  />
                </motion.button>
              ))}
            </div>
          </div>

          {/* Feedback Title */}
          <div className="space-y-2">
            <label className="text-foreground font-medium">Title *</label>
            <Input
              placeholder="Briefly describe your feedback"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className="bg-background/50 border-border focus:ring-2 focus:ring-golden rounded"
            />
          </div>

          {/* Feedback Message */}
          <div className="space-y-2">
            <label className="text-foreground font-medium">Message *</label>
            <textarea
              placeholder="Share your detailed feedback..."
              value={formData.message}
              onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
              className="w-full min-h-[150px] px-3 py-2 border border-border rounded resize-none bg-background/50 focus:outline-none focus:ring-2 focus:ring-golden"
            />
          </div>

          {/* Optional Image Upload */}
          <div className="space-y-2">
            <label className="text-foreground font-medium">Image (Optional)</label>
            {!imagePreview ? (
              <label
                htmlFor="image"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer bg-background/50 hover:bg-accent/50 transition-colors"
              >
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  Click to upload image
                </span>
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="relative rounded-lg overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-1.5 bg-destructive text-destructive-foreground rounded-full hover:bg-destructive/90 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-10 py-3 rounded-xl shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-all duration-300"
            >
              {isSubmitting ? "Submitting..." : "Submit Feedback"}
            </Button>
          </div>
        </motion.form>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;
