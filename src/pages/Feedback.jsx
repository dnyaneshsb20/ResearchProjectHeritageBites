import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import toast from "react-hot-toast";
import Footer from "../pages/dashboard/components/Footer";
import Header from "components/ui/Header";
import { supabase } from "../supabaseClient";

const Feedback = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    eMarketRating: 0,
    eMarketReview: "",
    recipeRating: 0,
    recipeReview: "",
    chatbotRating: 0,
    chatbotReview: "",
    contributionRating: 0,
    contributionReview: "",
    overallRating: 0,
    overallReview: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user.id)
        .single();

      setUserProfile(profile);
    };

    fetchUser();
  }, []);

  const handleRating = (field, rating) => {
    setFormData((prev) => ({ ...prev, [field]: rating }));
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      toast.error("Please enter your name and valid email.");
      return false;
    }
    if (formData.overallRating === 0) {
      toast.error("Please provide at least an overall rating.");
      return false;
    }
    return true;
  };
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;

  setIsSubmitting(true);

  try {
    if (!userProfile) {
      toast.error("You must be logged in to submit feedback.");
      setIsSubmitting(false);
      return;
    }

    // Combine all review texts
    const combinedReview = `
      E-Market: ${formData.eMarketReview || ""}.
      Recipe: ${formData.recipeReview || ""}.
      Chatbot: ${formData.chatbotReview || ""}.
      Contribution: ${formData.contributionReview || ""}.
      Overall: ${formData.overallReview || ""}.
    `;

    // Call ML API
    const sentimentResponse = await fetch("https://fastapi-sentiment-app.onrender.com/predict-sentiment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: combinedReview }),
    });
    const sentiment = await sentimentResponse.json();

    // Format user type correctly
    const userType = userProfile.role
      ? userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1).toLowerCase()
      : "User";

    // Insert into Supabase with user_id and numeric fields
    const { error } = await supabase
      .from("website_feedback")
      .insert([
        {
          user_id: userProfile.user_id,           // ✅ include user_id
          name: userProfile.name,
          email: userProfile.email,
          user_type: userType,
          e_market_rating: Number(formData.eMarketRating),
          e_market_review: formData.eMarketReview,
          recipe_rating: Number(formData.recipeRating),
          recipe_review: formData.recipeReview,
          chatbot_rating: Number(formData.chatbotRating),
          chatbot_review: formData.chatbotReview,
          contribution_rating: Number(formData.contributionRating),
          contribution_review: formData.contributionReview,
          overall_rating: Number(formData.overallRating),
          overall_review: formData.overallReview,
          sentiment_label: sentiment.sentiment_label,
          sentiment_score: parseFloat(sentiment.sentiment_score),
          page_visited: window.location.href,
        },
      ]);

    if (error) throw error;

    toast.success("Feedback submitted successfully! 🎉");

    // Reset form
    setFormData({
      name: "",
      email: "",
      eMarketRating: 0,
      eMarketReview: "",
      recipeRating: 0,
      recipeReview: "",
      chatbotRating: 0,
      chatbotReview: "",
      contributionRating: 0,
      contributionReview: "",
      overallRating: 0,
      overallReview: "",
    });
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit feedback. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
;

  const sections = [
    { key: "eMarket", label: "E-Market" },
    { key: "recipe", label: "Recipe Section" },
    { key: "chatbot", label: "Chatbot" },
    { key: "contribution", label: "Contribution Section" },
    { key: "overall", label: "Overall Website" },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <header className="bg-gradient-to-br from-primary via-secondary to-accent py-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Share Your Website Experience
        </h1>
        <p className="text-white/90 max-w-2xl mx-auto">
          Your feedback helps us improve every part of HeritageBites.
        </p>
      </header>

      <main className="container mx-auto max-w-3xl px-4 py-12 flex-1">
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-card shadow-md rounded-xl p-8 space-y-8"
        >
          {/* Basic Info */}
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Name *"
              placeholder="Your Name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
            <Input
              label="Email *"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          {/* Section Ratings + Reviews */}
          {sections.map(({ key, label }) => (
            <div key={key} className="space-y-3 border-b border-border pb-4">
              <label className="text-lg font-semibold text-foreground">{label}</label>

              {/* Star Ratings */}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRating(`${key}Rating`, star)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${star <= formData[`${key}Rating`]
                        ? "fill-yellow-500 text-yellow-500"
                        : "fill-muted text-muted-foreground"
                        }`}
                    />
                  </motion.button>
                ))}
              </div>

              {/* Text Review */}
              <textarea
                placeholder={`Share your thoughts on the ${label.toLowerCase()}...`}
                value={formData[`${key}Review`]}
                onChange={(e) => handleChange(`${key}Review`, e.target.value)}
                className="w-full min-h-[80px] px-3 py-2 border border-border rounded-md bg-background/50 focus:ring-2 focus:ring-primary resize-none"
              />
            </div>
          ))}

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-gradient-to-r from-primary to-secondary text-white font-semibold px-10 py-3 rounded-xl shadow hover:shadow-lg transition-all duration-300"
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
