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

  // Fetch all recipes initially
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

    // Map Supabase fields to RecipeCard props
    const formatted = data.map((item) => ({
      id: item.recipe_id,
      title: item.name,
      description: item.description,
      image: item.image_url,
      region: item.states?.state_name || "Unknown Region",
      cookingTime: `${item.cooking_time} min`,
      difficulty: item.difficulty_level,
      rating: item.rating || Math.random() * 2 + 3, // temporary mock rating if rating is null
      reviewCount: item.review_count || Math.floor(Math.random() * 200), // mock review count
      tags: [item.meal_type, item.dietary_type].filter(Boolean),
    }));

    // ✅ Instead of slicing, show all recipes
    setHealthGoalRecipes(formatted);
    setRegionalRecipes(formatted);
    setTrendingRecipes(formatted);

    setLoading(false);
  };

  const handleFilterChange = async (filters) => {
    setActiveFilters(filters);
    setLoading(true);

    if (!filters.length) {
      // fetch all recipes if no filter selected
      fetchRecipes();
      return;
    }

    const filterMapping = {
      breakfast: { column: 'meal_type', value: 'Breakfast' },
      lunch: { column: 'meal_type', value: 'Lunch' },
      dinner: { column: 'meal_type', value: 'Dinner' },
      snacks: { column: 'meal_type', value: 'Snacks' },
      vegetarian: { column: 'dietary_type', value: 'Vegetarian' },
      vegan: { column: 'dietary_type', value: 'Vegan' },
      'gluten-free': { column: 'dietary_type', value: 'Gluten Free' },
      'dairy-free': { column: 'dietary_type', value: 'Dairy Free' },
      diwali: { column: 'festival_tag', value: 'Diwali' },
      holi: { column: 'festival_tag', value: 'Holi' },
      eid: { column: 'festival_tag', value: 'Eid' },
      navratri: { column: 'festival_tag', value: 'Navratri' },
      easy: { column: 'difficulty_level', value: 'Easy' },
      medium: { column: 'difficulty_level', value: 'Medium' },
      hard: { column: 'difficulty_level', value: 'Hard' },
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

    // Apply filters
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

    const formatted = data.map((item) => ({
      id: item.recipe_id,
      title: item.name,
      description: item.description,
      image: item.image_url,
      region: item.states?.state_name || "Unknown Region",
      cookingTime: `${item.cooking_time} min`,
      difficulty: item.difficulty_level,
      rating: item.rating || Math.random() * 2 + 3,
      reviewCount: item.review_count || Math.floor(Math.random() * 200),
      tags: [item.meal_type, item.dietary_type].filter(Boolean),
    }));

    setHealthGoalRecipes(formatted);
    setRegionalRecipes(formatted);
    setTrendingRecipes(formatted);

    setLoading(false);
  };

  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    console.log('Selected region:', region);
  };

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
        .in('state_id', selectedRegion.stateIds);

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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 lg:px-6 py-6 space-y-8">
        <HeroCarousel />

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

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
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

          <div className="lg:col-span-9 space-y-8">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">
                Loading recipes...
              </p>
            ) : (
              <>
                <RecipeSection recipes={healthGoalRecipes} />
                <div className="lg:hidden">
                  <RegionalMap onRegionSelect={handleRegionSelect} />
                </div>
                <RecipeSection recipes={regionalRecipes} />
                <section className="space-y-4">
                  {/* Cultural Stories can remain commented as before */}
                </section>
                <RecipeSection recipes={trendingRecipes} />
              </>
            )}
          </div>
        </div>
      </main>
      <FloatingActionButton />
      <Footer />
    </div>
  );
};

export default RecipeDiscoveryDashboard;
