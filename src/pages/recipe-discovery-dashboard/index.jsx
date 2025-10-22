import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import HeroCarousel from './components/HeroCarousel';
import FilterChips from './components/FilterChips';
import RecipeSection from './components/RecipeSection';
import RegionalMap from './components/RegionalMap';
import FloatingActionButton from './components/FloatingActionButton';
import Icon from '../../components/AppIcon';
import Footer from '../dashboard/components/Footer';
import { supabase } from "../../supabaseClient";

const RecipeDiscoveryDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategories, setFilterCategories] = useState([]);

  // ✅ Fetch recipes and filters initially
  useEffect(() => {
    fetchRecipes();
    fetchAvailableFilters();
  }, []);

  // Fetch all recipes
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
        dietary_type,
        festival_tag,
        states ( state_name, region )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching recipes:", error);
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

    const uniqueRecipes = [...new Map(formatted.map(item => [item.id, item])).values()];
    setRecipes(uniqueRecipes);
    setLoading(false);
  };

  // Fetch unique filter options dynamically from database
  const fetchAvailableFilters = async () => {
    const { data, error } = await supabase
      .from('recipes')
      .select(`
        meal_type,
        dietary_type,
        festival_tag,
        difficulty_level,
        cooking_time
      `);

    if (error) return console.error("Error fetching filter options:", error);

    const mealOptions = [...new Set(data.map(d => d.meal_type).filter(Boolean))]
      .map(v => ({ id: v.toLowerCase(), label: v, icon: 'Utensils' }));
    const dietaryOptions = [...new Set(data.map(d => d.dietary_type).filter(Boolean))]
      .map(v => ({ id: v.toLowerCase().replace(' ', '-'), label: v, icon: 'Leaf' }));
    const festivalOptions = [...new Set(data.map(d => d.festival_tag).filter(Boolean))]
      .map(v => ({ id: v.toLowerCase(), label: v, icon: 'Calendar' }));
    const difficultyOptions = [...new Set(data.map(d => d.difficulty_level).filter(Boolean))]
      .map(v => ({ id: v.toLowerCase(), label: v, icon: 'BarChart3' }));
    const timeOptions = [
      { id: 'quick', label: '< 30 min', icon: 'Zap' },
      { id: 'medium_time', label: '30-60 min', icon: 'Clock' },
      { id: 'long', label: '> 1 hour', icon: 'Timer' }
    ];

    setFilterCategories([
      { id: 'meal', label: 'Meal Type', options: mealOptions },
      { id: 'dietary', label: 'Dietary', options: dietaryOptions },
      { id: 'festival', label: 'Festival', options: festivalOptions },
      { id: 'difficulty', label: 'Difficulty', options: difficultyOptions },
      { id: 'time', label: 'Time', options: timeOptions }
    ]);
  };

  // ✅ Handle filter changes (multi-select OR logic per category)
  const handleFilterChange = async (filters) => {
    setActiveFilters(filters);
    setLoading(true);

    if (!filters.length) {
      fetchRecipes();
      return;
    }

    const filterMapping = {
      breakfast: { column: 'meal_type', value: 'Breakfast', category: 'meal' },
      lunch: { column: 'meal_type', value: 'Lunch', category: 'meal' },
      dinner: { column: 'meal_type', value: 'Dinner', category: 'meal' },
      snacks: { column: 'meal_type', value: 'Snacks', category: 'meal' },
      vegetarian: { column: 'dietary_type', value: 'Vegetarian', category: 'dietary' },
      vegan: { column: 'dietary_type', value: 'Vegan', category: 'dietary' },
      'gluten-free': { column: 'dietary_type', value: 'Gluten Free', category: 'dietary' },
      'dairy-free': { column: 'dietary_type', value: 'Dairy Free', category: 'dietary' },
      easy: { column: 'difficulty_level', value: 'Easy', category: 'difficulty' },
      medium: { column: 'difficulty_level', value: 'Medium', category: 'difficulty' },
      hard: { column: 'difficulty_level', value: 'Hard', category: 'difficulty' },
      quick: { column: 'cooking_time', range: [0, 30], category: 'time' },
      medium_time: { column: 'cooking_time', range: [30, 60], category: 'time' },
      long: { column: 'cooking_time', range: [60, null], category: 'time' }
    };

    // Group filters by category
    const groupedFilters = {};
    filters.forEach((filterId) => {
      const map = filterMapping[filterId];
      if (!map) return;
      if (!groupedFilters[map.category]) groupedFilters[map.category] = [];
      groupedFilters[map.category].push(map);
    });

    let query = supabase
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
        dietary_type,
        festival_tag,
        states ( state_name, region )
      `)
      .order("created_at", { ascending: false });

    // Apply filters per category (OR within category)
    Object.values(groupedFilters).forEach((filterGroup) => {
      query = query.or(
        filterGroup
          .map((f) => {
            if (f.range) {
              const [min, max] = f.range;
              if (min != null && max != null) return `cooking_time.gte.${min},cooking_time.lte.${max}`;
              if (min != null) return `cooking_time.gte.${min}`;
              if (max != null) return `cooking_time.lte.${max}`;
            }
            return `${f.column}.ilike.%${f.value}%`;
          })
          .join(',')
      );
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

    const uniqueRecipes = [...new Map(formatted.map(item => [item.id, item])).values()];
    setRecipes(uniqueRecipes);
    setLoading(false);
  };

  // ✅ Handle region selection
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
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

      setRecipes(
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

        {/* Filters on mobile */}
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
              <FilterChips
                categories={filterCategories}
                onFilterChange={handleFilterChange}
              />
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">
                  Refine Your Search
                </h3>
                <FilterChips
                  categories={filterCategories}
                  onFilterChange={handleFilterChange}
                />
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
              <RecipeSection recipes={recipes} />
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
