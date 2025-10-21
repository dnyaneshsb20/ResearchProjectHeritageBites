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
import { supabase } from "../../supabaseClient";

const RecipeDiscoveryDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);

  const [showFilters, setShowFilters] = useState(false);
  const [healthGoalRecipes, setHealthGoalRecipes] = useState([]);
  const [regionalRecipes, setRegionalRecipes] = useState([]);
  const [trendingRecipes, setTrendingRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [culturalStories, setCulturalStories] = useState([]);

useEffect(() => {
  if (!selectedRegion) return;

  const fetchRegionalRecipes = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        recipe_id,
        name,
        image_url,
        meal_type,
        difficulty_level,
        cooking_time,
        prep_time,
        state_id
      `)
      // Adjust this depending on how you want to filter by region
     .in('state_id', selectedRegion.stateIds) 

    if (error) return console.error(error);

    setRegionalRecipes(
      data.map(item => ({
        id: item.recipe_id,
        title: item.name,
        image: item.image_url,
        cookingTime: `${item.cooking_time} min`,
        difficulty: item.difficulty_level
      }))
    );
  };

  fetchRegionalRecipes();
}, [selectedRegion]);

  // Mock data for personalized recommendations

  const handleFilterChange = async (filters) => {
  setActiveFilters(filters);
  setLoading(true);

  if (!filters.length) {
    // fetch all recipes if no filter selected
    fetchRecipes();
    return;
  }

  // Map filter IDs to DB columns & values
  const filterMapping = {
    // Meal Type
    breakfast: { column: 'meal_type', value: 'Breakfast' },
    lunch: { column: 'meal_type', value: 'Lunch' },
    dinner: { column: 'meal_type', value: 'Dinner' },
    snacks: { column: 'meal_type', value: 'Snacks' },

    // Dietary
    vegetarian: { column: 'dietary_type', value: 'Vegetarian' },
    vegan: { column: 'dietary_type', value: 'Vegan' },
    'gluten-free': { column: 'dietary_type', value: 'Gluten Free' },
    'dairy-free': { column: 'dietary_type', value: 'Dairy Free' },

    // Festival
    diwali: { column: 'festival_tag', value: 'Diwali' },
    holi: { column: 'festival_tag', value: 'Holi' },
    eid: { column: 'festival_tag', value: 'Eid' },
    navratri: { column: 'festival_tag', value: 'Navratri' },

    // Difficulty
    easy: { column: 'difficulty_level', value: 'Easy' },
    medium: { column: 'difficulty_level', value: 'Medium' },
    hard: { column: 'difficulty_level', value: 'Hard' },

    // Cooking Time (total_time in minutes)
    quick: { column: 'total_time', range: [0, 30] },
    medium: { column: 'total_time', range: [30, 60] },
    long: { column: 'total_time', range: [60, null] },
  };

  let query = supabase.from("recipes").select(`
    recipe_id,
    name,
    description,
    image_url,
    meal_type,
    difficulty_level,
    cooking_time,
    prep_time,
    created_at,
    states ( state_name, region )
  `).order("created_at", { ascending: false });

  // Apply all filters
  filters.forEach((filterId) => {
    const map = filterMapping[filterId];
    if (!map) return;

    if (map.range) {
      const [min, max] = map.range;
      if (min != null) query = query.gte(map.column, min);
      if (max != null) query = query.lte(map.column, max);
    } else {
      query = query.ilike(map.column, `%${map.value}%`);
    }
  });

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching filtered recipes:", error);
    setLoading(false);
    return;
  }

  // Map data for UI sections
  const formatted = data.map((item) => ({
    id: item.recipe_id,
    title: item.name,
    description: item.description,
    image: item.image_url,
    region: item.states?.state_name || "Unknown Region",
    cookingTime: `${item.cooking_time} min`,
    difficulty: item.difficulty_level,
    rating: Math.random() * 2 + 3, // Temporary mock rating
    reviewCount: Math.floor(Math.random() * 200), // Mock reviews
    tags: [item.meal_type, item.dietary_type].filter(Boolean),
  }));

  // Update sections (you can adjust slices for different UI sections)
  setHealthGoalRecipes(formatted.slice(0, 4));
  setRegionalRecipes(formatted.slice(4, 8));
  setTrendingRecipes(formatted.slice(8, 12));

  setLoading(false);
};


  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
  };

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("recipes")
      .select(`
      recipe_id,
      name,
      description,
      image_url,
      meal_type,
      difficulty_level,
      cooking_time,
      prep_time,
      created_at,
      states ( state_name, region )
    `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching recipes:", error);
      setLoading(false);
      return;
    }

    // 🟢 Map Supabase fields to RecipeCard props
    const formatted = data.map((item) => ({
      id: item.recipe_id,
      title: item.name,
      description: item.description,
      image: item.image_url,
      region: item.states?.state_name || "Unknown Region",
      cookingTime: `${item.cooking_time} min`,
      difficulty: item.difficulty_level,
      rating: Math.random() * 2 + 3, // Temporary mock rating
      reviewCount: Math.floor(Math.random() * 200), // Mock reviews
      tags: [item.meal_type, item.dietary_type].filter(Boolean),
    }));

    // 🟡 Categorize for UI sections
    setHealthGoalRecipes(formatted.slice(0, 4));
    setRegionalRecipes(formatted.slice(4, 8));
    setTrendingRecipes(formatted.slice(8, 12));

    setLoading(false);
  };


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
            {loading ? (
              <p className="text-center text-muted-foreground py-12">
                Loading recipes...
              </p>
            ) : (
              <>
                {/* Personalized Recommendations */}
                <RecipeSection
                  // title="For Your Health Goals"
                  // subtitle="Recipes tailored to your dietary preferences and wellness objectives"
                  // icon="Heart"
                  recipes={healthGoalRecipes}
                />

                {/* Regional Exploration - Mobile */}
                <div className="lg:hidden">
                  <RegionalMap onRegionSelect={handleRegionSelect} />
                </div>

                {/* Regional Recipes */}
                <RecipeSection
                  // title="From Your Region"
                  // subtitle={
                  //   selectedRegion
                  //     ? `Authentic dishes from ${selectedRegion?.name}`
                  //     : "Discover authentic flavors from across India"
                  // }
                  // icon="MapPin"
                  //recipes={regionalRecipes}
                />

                {/* Cultural Stories Section */}
                <section className="space-y-4">
                  <div className="flex items-center space-x-3">
                    {/* <Icon name="BookOpen" size={24} className="text-primary" />
                    <div>
                      <h2 className="text-xl lg:text-2xl font-heading font-bold text-foreground">
                        Stories & Heritage
                      </h2>
                      <p className="text-muted-foreground text-sm mt-1">
                        Discover the culture and people behind our food traditions
                      </p>
                    </div> */}
                  </div>

                  {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {culturalStories?.map((story) => (
                      <StoryCard key={story?.id} story={story} />
                    ))}
                  </div> */}
                </section>

                {/* Trending Recipes */}
                <RecipeSection
                  // title="Trending This Week"
                  // subtitle="Popular recipes that food lovers are trying right now"
                  // icon="TrendingUp"
                  //recipes={trendingRecipes}
                />
              </>
            )}

            {/* Quick Stats */}
            {/* <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-6">
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
            </div> */}
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