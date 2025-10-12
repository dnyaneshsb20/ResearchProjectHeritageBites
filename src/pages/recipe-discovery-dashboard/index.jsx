import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroCarousel from './components/HeroCarousel';
import FilterChips from './components/FilterChips';
import RecipeSection from './components/RecipeSection';
import RegionalMap from './components/RegionalMap';
import StoryCard from './components/StoryCard';
import FloatingActionButton from './components/FloatingActionButton';
import Icon from '../../components/AppIcon';
import Footer from '../dashboard/components/Footer';

const RecipeDiscoveryDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Mock data for personalized recommendations
  const healthGoalRecipes = [
    {
      id: 1,
      title: "Quinoa Khichdi with Mixed Vegetables",
      image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400&h=300&fit=crop",
      region: "Modern Fusion",
      cookingTime: "25 mins",
      difficulty: "Easy",
      rating: 4.5,
      reviewCount: 128,
      tags: ["High Protein", "Gluten Free"],
      chef: "Dr. Priya Sharma",
      description: "A nutritious twist on traditional khichdi using quinoa and seasonal vegetables, perfect for weight management."
    },
    {
      id: 2,
      title: "Ragi Dosa with Coconut Chutney",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      region: "Karnataka",
      cookingTime: "30 mins",
      difficulty: "Medium",
      rating: 4.7,
      reviewCount: 89,
      tags: ["High Fiber", "Diabetic Friendly"],
      chef: "Kamala Devi",
      description: "Traditional finger millet crepes packed with calcium and iron, ideal for bone health."
    },
    {
      id: 3,
      title: "Amaranth Paratha with Mint Yogurt",
      image: "https://images.unsplash.com/photo-1574653853027-5d3ac9b9e7c8?w=400&h=300&fit=crop",
      region: "Rajasthan",
      cookingTime: "20 mins",
      difficulty: "Easy",
      rating: 4.3,
      reviewCount: 156,
      tags: ["Protein Rich", "Heart Healthy"],
      chef: "Meera Joshi",
      description: "Nutrient-dense flatbread made with amaranth flour, perfect for maintaining cholesterol levels."
    },
    {
      id: 4,
      title: "Moringa Sambar with Brown Rice",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
      region: "Tamil Nadu",
      cookingTime: "40 mins",
      difficulty: "Medium",
      rating: 4.6,
      reviewCount: 203,
      tags: ["Antioxidant Rich", "Immunity Boost"],
      chef: "Lakshmi Iyer",
      description: "Traditional South Indian lentil curry enhanced with drumstick leaves for extra nutrition."
    }
  ];

  const regionalRecipes = [
    {
      id: 5,
      title: "Authentic Hyderabadi Biryani",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
      region: "Telangana",
      cookingTime: "2 hours",
      difficulty: "Hard",
      rating: 4.9,
      reviewCount: 342,
      tags: ["Festival Special", "Non-Veg"],
      isBookmarked: true,
      chef: "Ustad Mahmood",
      description: "Royal recipe from the Nizams' kitchen, featuring aromatic basmati rice and tender mutton."
    },
    {
      id: 6,
      title: "Bengali Fish Curry (Macher Jhol)",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      region: "West Bengal",
      cookingTime: "35 mins",
      difficulty: "Medium",
      rating: 4.4,
      reviewCount: 187,
      tags: ["Traditional", "Spicy"],
      chef: "Ruma Chatterjee",
      description: "Light and flavorful fish curry with potatoes, a staple in every Bengali household."
    },
    {
      id: 7,
      title: "Gujarati Dhokla with Green Chutney",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
      region: "Gujarat",
      cookingTime: "45 mins",
      difficulty: "Medium",
      rating: 4.5,
      reviewCount: 298,
      tags: ["Steamed", "Healthy"],
      chef: "Kiran Patel",
      description: "Soft and spongy steamed cake made from fermented gram flour, perfect for breakfast."
    },
    {
      id: 8,
      title: "Kashmiri Rogan Josh",
      image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400&h=300&fit=crop",
      region: "Kashmir",
      cookingTime: "1.5 hours",
      difficulty: "Hard",
      rating: 4.8,
      reviewCount: 156,
      tags: ["Rich", "Aromatic"],
      chef: "Abdul Rashid",
      description: "Aromatic lamb curry cooked in traditional Kashmiri spices and yogurt."
    }
  ];

  const trendingRecipes = [
    {
      id: 9,
      title: "Millet Pizza with Indigenous Toppings",
      image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop",
      region: "Modern Fusion",
      cookingTime: "30 mins",
      difficulty: "Easy",
      rating: 4.2,
      reviewCount: 89,
      tags: ["Fusion", "Healthy"],
      chef: "Chef Ranveer",
      description: "Innovative pizza base made from millet flour topped with paneer and local vegetables."
    },
    {
      id: 10,
      title: "Jackfruit Biryani (Kathal Biryani)",
      image: "https://images.unsplash.com/photo-1563379091339-03246963d96c?w=400&h=300&fit=crop",
      region: "Uttar Pradesh",
      cookingTime: "1 hour",
      difficulty: "Medium",
      rating: 4.6,
      reviewCount: 234,
      tags: ["Vegan", "Seasonal"],
      chef: "Sunita Devi",
      description: "Fragrant biryani made with tender jackfruit pieces, a perfect vegetarian alternative."
    },
    {
      id: 11,
      title: "Bamboo Shoot Curry",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
      region: "Assam",
      cookingTime: "50 mins",
      difficulty: "Medium",
      rating: 4.3,
      reviewCount: 67,
      tags: ["Tribal", "Unique"],
      chef: "Bina Gogoi",
      description: "Traditional Assamese curry featuring tender bamboo shoots with indigenous spices."
    },
    {
      id: 12,
      title: "Foxtail Millet Upma",
      image: "https://images.unsplash.com/photo-1574653853027-5d3ac9b9e7c8?w=400&h=300&fit=crop",
      region: "Andhra Pradesh",
      cookingTime: "20 mins",
      difficulty: "Easy",
      rating: 4.4,
      reviewCount: 145,
      tags: ["Breakfast", "Nutritious"],
      chef: "Padma Reddy",
      description: "Healthy breakfast option made with foxtail millet, vegetables, and aromatic tempering."
    }
  ];

  const culturalStories = [
    {
      id: 1,
      title: "The Ancient Grains Revival: How Millets Are Making a Comeback",
      subtitle: "Cultural Heritage",
      image: "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&h=300&fit=crop",
      author: "Dr. Vandana Shiva",
      readTime: "8 min read",
      category: "Cultural Heritage",
      publishedDate: "2025-01-10",
      excerpt: "Explore how traditional millets, once the staple food of our ancestors, are being rediscovered by modern nutritionists and chefs for their incredible health benefits and climate resilience.",
      tags: ["millets", "sustainability", "nutrition", "tradition"]
    },
    {
      id: 2,
      title: "From Farm to Table: Meet the Organic Spice Farmers of Kerala",
      subtitle: "Farmer Story",
      image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=300&fit=crop",
      author: "Ravi Menon",
      readTime: "12 min read",
      category: "Farmer Story",
      publishedDate: "2025-01-08",
      excerpt: "Journey through the spice gardens of Kerala with third-generation farmers who are preserving traditional cultivation methods while embracing organic practices.",
      tags: ["spices", "organic", "kerala", "farming"]
    },
    {
      id: 3,
      title: "The Science Behind Fermentation in Indian Cuisine",
      subtitle: "Chef Interview",
      image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
      author: "Chef Manish Mehrotra",
      readTime: "10 min read",
      category: "Chef Interview",
      publishedDate: "2025-01-05",
      excerpt: "Renowned chef Manish Mehrotra explains the ancient art of fermentation in Indian cooking and how it enhances both flavor and nutritional value.",
      tags: ["fermentation", "probiotics", "health", "technique"]
    }
  ];

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
    console.log('Active filters:', filters);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
  };

  useEffect(() => {
    // Simulate personalization based on user preferences
    console.log('Loading personalized recommendations...');
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-6 space-y-8">
        {/* Hero Carousel */}
        <HeroCarousel />

        {/* Filter Section */}
        <div className="lg:hidden">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Discover Recipes
            </h3>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-3 py-2 bg-muted rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Icon name="Filter" size={16} />
              <span>Filters</span>
              <Icon name={showFilters ? 'ChevronUp' : 'ChevronDown'} size={16} />
            </button>
          </div>
          
          {showFilters && (
            <div className="bg-card border border-border rounded-xl p-4 mb-6">
              <FilterChips onFilterChange={handleFilterChange} />
            </div>
          )}
        </div>

        {/* Desktop Layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Sidebar Filters - Desktop Only */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Refine Your Search
                </h3>
                <FilterChips onFilterChange={handleFilterChange} />
              </div>
              
              <RegionalMap onRegionSelect={handleRegionSelect} />
            </div>
          </aside>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-8">
            {/* Personalized Recommendations */}
            <RecipeSection
              title="For Your Health Goals"
              subtitle="Recipes tailored to your dietary preferences and wellness objectives"
              icon="Heart"
              recipes={healthGoalRecipes}
            />

            {/* Regional Exploration - Mobile */}
            <div className="lg:hidden">
              <RegionalMap onRegionSelect={handleRegionSelect} />
            </div>

            {/* Regional Recipes */}
            <RecipeSection
              title="From Your Region"
              subtitle={selectedRegion ? `Authentic dishes from ${selectedRegion?.name}` : "Discover authentic flavors from across India"}
              icon="MapPin"
              recipes={regionalRecipes}
            />

            {/* Cultural Stories Section */}
            <section className="space-y-4">
              <div className="flex items-center space-x-3">
                <Icon name="BookOpen" size={24} className="text-primary" />
                <div>
                  <h2 className="text-xl lg:text-2xl font-heading font-bold text-foreground">
                    Stories & Heritage
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    Discover the culture and people behind our food traditions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {culturalStories?.map((story) => (
                  <StoryCard key={story?.id} story={story} />
                ))}
              </div>
            </section>

            {/* Trending Recipes */}
            <RecipeSection
              title="Trending This Week"
              subtitle="Popular recipes that food lovers are trying right now"
              icon="TrendingUp"
              recipes={trendingRecipes}
            />

            {/* Quick Stats */}
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-primary mb-1">1,200+</div>
                  <div className="text-sm text-muted-foreground">Authentic Recipes</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-secondary mb-1">500+</div>
                  <div className="text-sm text-muted-foreground">Local Farmers</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-warning mb-1">28</div>
                  <div className="text-sm text-muted-foreground">Indian States</div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold text-success mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Happy Cooks</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Floating Action Button */}
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default RecipeDiscoveryDashboard;