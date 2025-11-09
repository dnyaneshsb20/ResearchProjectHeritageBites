import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Send, ThumbsUp, ThumbsDown, MessageCircle, ShoppingCart, ChefHat, Bot, Users, Globe, User } from "lucide-react";
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
  const [currentSection, setCurrentSection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

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
      // Pre-fill user data if available
      if (profile) {
        setFormData(prev => ({
          ...prev,
          name: profile.name || "",
          email: profile.email || ""
        }));
      }
    };

    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    fetchUser();

    return () => window.removeEventListener('resize', checkMobile);
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
      return;
    }

    const combinedReview = `
      E-Market: ${formData.eMarketReview || ""}.
      Recipe: ${formData.recipeReview || ""}.
      Chatbot: ${formData.chatbotReview || ""}.
      Contribution: ${formData.contributionReview || ""}.
      Overall: ${formData.overallReview || ""}.
    `;

    let sentiment;
    try {
      const sentimentResponse = await fetch(
        "https://fastapi-sentiment-app.onrender.com/predict-sentiment",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: combinedReview }),
        }
      );
      if (!sentimentResponse.ok) throw new Error(`ML API error: ${sentimentResponse.status}`);
      sentiment = await sentimentResponse.json();
    } catch (err) {
      console.error("Error calling ML API:", err);
      toast.error("ML analysis failed. Submitting feedback anyway.");
      sentiment = { sentiment_label: "neutral", sentiment_score: 0 };
    }

    const allowedTypes = ["User", "Admin", "Farmer"];
    const userType = allowedTypes.includes(userProfile.role) ? userProfile.role : "User";

    const { error } = await supabase.from("website_feedback").insert([
      {
        user_id: userProfile.user_id,
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
    setCurrentSection(0);
  } catch (err) {
    console.error("Submission error:", err);
    toast.error("Failed to submit feedback. Please try again.");
  } finally {
    setIsSubmitting(false); // release button
  }
};

  const sections = [
    { 
      key: "user", 
      label: "User Details", 
      icon: User,
      description: "How was your shopping experience?" 
    },
    { 
      key: "eMarket", 
      label: "E-Market", 
      icon: ShoppingCart,
      description: "How was your shopping experience?" 
    },
    { 
      key: "recipe", 
      label: "Recipe Section", 
      icon: ChefHat,
      description: "Share your thoughts on our recipes" 
    },
    { 
      key: "chatbot", 
      label: "Chatbot", 
      icon: Bot,
      description: "How helpful was our AI assistant?" 
    },
    { 
      key: "contribution", 
      label: "Contribution Section", 
      icon: Users,
      description: "Your experience contributing content" 
    },
    { 
      key: "overall", 
      label: "Overall Website", 
      icon: Globe,
      description: "Your overall impression of HeritageBites" 
    },
  ];

  const nextSection = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(prev => prev + 1);
    }
  };

  const prevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const SectionIcon = sections[currentSection]?.icon || Globe;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <header className="relative bg-gradient-to-br from-primary via-secondary to-accent py-16 lg:py-24 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Share Your
              <span className="block bg-gradient-to-r from-amber-300 to-yellow-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
              Your feedback shapes the future of HeritageBites. Help us create a better experience for everyone.
            </p>
          </motion.div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-5xl px-4">
          <div className="flex items-center justify-between py-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 md:gap-4">
                {sections.map((section, index) => (
                  <button
                    key={section.key}
                    onClick={() => setCurrentSection(index)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      index === currentSection
                        ? 'bg-primary text-white'
                        : 'text-black hover:text-gray-700'
                    } ${isMobile ? 'text-sm' : ''}`}
                  >
                    <section.icon className="w-4 h-4" />
                    {!isMobile && (
                      <span className="font-medium">{section.label}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8 lg:py-12">
        <div className="container mx-auto max-w-4xl px-4">
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-xl overflow-hidden"
          >
            {/* Personal Information Section */}
            {currentSection === 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 lg:p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    Let's Get Started
                  </h2>
                  <p className="text-gray-600 text-lg">
                    Please provide your basic information
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                  <div>
                    <Input
                      label="Full Name *"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                  <div>
                    <Input
                      label="Email Address *"
                      type="email"
                      placeholder="your.email@example.com"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="bg-gray-50 border-gray-200 focus:border-blue-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-8">
                  <Button
                    type="button"
                    onClick={nextSection}
                    disabled={!formData.name.trim() || !formData.email.trim()}
                    className="bg-primary hover: text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  >
                    Continue to Feedback
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Rating Sections */}
          {currentSection >= 0 && currentSection < sections.length && currentSection !== 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-6 lg:p-8"
              >
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <SectionIcon className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                    {sections[currentSection].label}
                  </h2>
                  <p className="text-gray-600 text-lg">
                    {sections[currentSection].description}
                  </p>
                </div>

                <div className="max-w-2xl mx-auto space-y-8">
                  {/* Star Rating */}
                  <div className="text-center">
                    <label className="block text-lg font-semibold text-gray-700 mb-4">
                      How would you rate this section?
                    </label>
                    <div className="flex justify-center gap-2 lg:gap-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <motion.button
                          key={star}
                          type="button"
                          onClick={() => handleRating(`${sections[currentSection].key}Rating`, star)}
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                          className="transform transition-all duration-200"
                        >
                          <Star
                            className={`w-12 h-12 lg:w-14 lg:h-14 transition-all duration-300 ${
                              star <= formData[`${sections[currentSection].key}Rating`]
                                ? "fill-yellow-400 text-yellow-400 drop-shadow-lg"
                                : "fill-gray-200 text-gray-300 hover:fill-yellow-200 hover:text-yellow-300"
                            }`}
                          />
                        </motion.button>
                      ))}
                    </div>
                    <div className="flex justify-between text-sm text-gray-500 mt-2 px-4">
                      <span>Poor</span>
                      <span>Excellent</span>
                    </div>
                  </div>

                  {/* Text Review */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-700 mb-3">
                      Additional Comments
                    </label>
                    <textarea
                      placeholder={`Tell us more about your experience with ${sections[currentSection].label.toLowerCase()}...`}
                      value={formData[`${sections[currentSection].key}Review`]}
                      onChange={(e) => handleChange(`${sections[currentSection].key}Review`, e.target.value)}
                      rows={4}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 resize-none transition-all duration-300 placeholder-gray-400"
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-12 max-w-2xl mx-auto">
                  <Button
                      type="button"
                      onClick={prevSection}
                      className="bg-primary hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                     Back
                    </Button>

                  {currentSection < sections.length - 1  ? (
                    <Button
                      type="button"
                      onClick={nextSection}
                      className="bg-primary hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                      Next Section
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting || formData.overallRating === 0}
                      className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Submitting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Send className="w-4 h-4" />
                          Submit All Feedback
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            )}
          </motion.form>

          {/* Quick Stats */}
          {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <ThumbsUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">95%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">1.2K+</div>
              <div className="text-sm text-gray-600">Reviews</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">500+</div>
              <div className="text-sm text-gray-600">Contributors</div>
            </div>
            <div className="bg-white rounded-xl p-4 text-center shadow-md">
              <Bot className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-900">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
          </div> */}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Feedback;