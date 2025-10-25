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

const groupByMealType = (recipes) => {
  const groups = {};
  recipes.forEach(recipe => {
    const meal = recipe.tags?.[0] || recipe.meal_type || 'Other';
    if (!groups[meal]) groups[meal] = [];
    groups[meal].push(recipe);
  });
  return groups;
};


const RecipeDiscoveryDashboard = () => {
  const [activeFilters, setActiveFilters] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [recipes, setRecipes] = useState([]);

  const [groupedRecipes, setGroupedRecipes] = useState({});

  const [loading, setLoading] = useState(true);
  const [filterCategories, setFilterCategories] = useState([]);
  const mealOrder = ["Breakfast", "Lunch", "Dinner", "Snacks", "Dessert"];



  useEffect(() => {
    fetchRecipes();
    fetchAvailableFilters();
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
        dietary_type,
        festival_tag,
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
      tags: [item.meal_type, item.dietary_type, item.festival_tag].filter(Boolean),
    }));

    const uniqueRecipes = [...new Map(formatted.map(item => [item.id, item])).values()];
    setRecipes(uniqueRecipes);
    const groupedRecipes = groupByMealType(uniqueRecipes);
    setGroupedRecipes(groupedRecipes);
    setLoading(false);
  };

  // Fetch dynamic filters from database
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
      .map(v => ({ id: `meal_${v.toLowerCase()}`, label: v, icon: 'Utensils' }));

    const dietaryOptions = [...new Set(data.map(d => d.dietary_type).filter(Boolean))]
      .map(v => ({ id: `dietary_${v.toLowerCase().replace(' ', '-')}`, label: v, icon: 'Leaf' }));

    //const festivalOptions = [...new Set(data.map(d => d.festival_tag).filter(Boolean))]
      //.map(v => ({ id: `festival_${v.toLowerCase()}`, label: v, icon: 'Calendar' }));

    const difficultyOptions = [...new Set(data.map(d => d.difficulty_level).filter(Boolean))]
      .map(v => ({ id: `difficulty_${v.toLowerCase()}`, label: v, icon: 'BarChart3' }));

    const timeOptions = [
      { id: 'time_quick', label: '< 30 min', icon: 'Zap' },
      { id: 'time_medium', label: '30-60 min', icon: 'Clock' },
      { id: 'time_long', label: '> 1 hour', icon: 'Timer' }
    ];

    setFilterCategories([
      // { id: 'meal', label: 'Meal Type', options: mealOptions },
      { id: 'dietary', label: 'Dietary', options: dietaryOptions },
      //{ id: 'festival', label: 'Festival', options: festivalOptions },
      { id: 'difficulty', label: 'Difficulty', options: difficultyOptions },
      { id: 'time', label: 'Time', options: timeOptions }
    ]);
  };

  // Fully functional filter logic
  const handleFilterChange = async (filters) => {
    setActiveFilters(filters);
    setLoading(true);

    if (!filters.length) {
      fetchRecipes();
      return;
    }

    // Map filter IDs to database queries
    const filterMapping = {};

    filterCategories.forEach(category => {
      category.options.forEach(option => {
        if (category.id === 'time') {
          if (option.id === 'time_quick') filterMapping[option.id] = { column: 'cooking_time', range: [0, 30], category: 'time' };
          else if (option.id === 'time_medium') filterMapping[option.id] = { column: 'cooking_time', range: [30, 60], category: 'time' };
          else filterMapping[option.id] = { column: 'cooking_time', range: [60, null], category: 'time' };
        } else {
          const dbColumn = category.id === 'meal' ? 'meal_type' :
            category.id === 'dietary' ? 'dietary_type' :
              category.id === 'festival' ? 'festival_tag' :
                'difficulty_level';
          filterMapping[option.id] = { column: dbColumn, value: option.label, category: category.id };
        }
      });
    });

    // Group filters by category
    const groupedFilters = {};
    filters.forEach(id => {
      const map = filterMapping[id];
      if (!map) return;
      if (!groupedFilters[map.category]) groupedFilters[map.category] = [];
      groupedFilters[map.category].push(map);
    });

    // Start Supabase query
    let query = supabase
      .from("recipes")
      .select(`
      recipe_id,
      name,
      description,
      image_url,
      meal_type,
      dietary_type,
      festival_tag,
      difficulty_level,
      cooking_time,
      prep_time,
      created_at,
      states ( state_name, region )
    `)
      .order("created_at", { ascending: false });

    // Apply filters: OR within category, AND across categories
    Object.values(groupedFilters).forEach(filterGroup => {
      const timeFilters = filterGroup.filter(f => f.range);          // Time filters
      const normalFilters = filterGroup.filter(f => !f.range);       // Other filters

      // Apply time filters using .gte() and .lte()
      timeFilters.forEach(f => {
        const [min, max] = f.range;
        if (min != null) query = query.gte('cooking_time', min);
        if (max != null) query = query.lte('cooking_time', max);
      });

      // Apply normal filters using OR within category
      if (normalFilters.length) {
        query = query.or(
          normalFilters.map(f => {
            if (f.category === 'difficulty') return `${f.column}.eq.${f.value}`;
            return `${f.column}.ilike.%${f.value}%`;
          }).join(',')
        );
      }
    });

    // Fetch filtered recipes
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching filtered recipes:", error);
      setLoading(false);
      return;
    }

    const formatted = data.map(item => ({
      id: item.recipe_id,
      title: item.name,
      description: item.description,
      image: item.image_url,
      region: item.states?.state_name || "Unknown Region",
      cookingTime: `${item.cooking_time} min`,
      difficulty: item.difficulty_level,
      rating: item.rating || Math.random() * 2 + 3,
      reviewCount: item.review_count || Math.floor(Math.random() * 200),
      tags: [item.meal_type, item.dietary_type, item.festival_tag].filter(Boolean),
    }));

    const uniqueRecipes = [...new Map(formatted.map(item => [item.id, item])).values()];
    setRecipes(uniqueRecipes);
    const grouped = groupByMealType(uniqueRecipes);
    setGroupedRecipes(grouped);
    setLoading(false);
  };

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
          dietary_type,
          festival_tag,
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
          difficulty: item.difficulty_level,
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
            <h3 className="text-lg font-heading font-semibold text-foreground">Discover Recipes</h3>
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
              <FilterChips categories={filterCategories} onFilterChange={handleFilterChange} />
            </div>
          )}
        </div>

        {/* Desktop layout */}
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div className="bg-card border border-border rounded-xl p-6">
                <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Refine Your Search</h3>
                <FilterChips categories={filterCategories} onFilterChange={handleFilterChange} />
              </div>
              <RegionalMap onRegionSelect={handleRegionSelect} />
            </div>
          </aside>

          <div className="lg:col-span-9 space-y-8">
            {loading ? (
              <p className="text-center text-muted-foreground py-12">Loading recipes...</p>
            ) : (
              <>
                {Object.entries(groupedRecipes)
                  // Sort by our preferred meal order
                  .sort(([a], [b]) => mealOrder.indexOf(a) - mealOrder.indexOf(b))
                  .map(([mealType, mealRecipes]) => (
                    <RecipeSection
                      key={mealType}
                      title={`${mealType} Recipes`}
                      subtitle={`Explore delicious ${mealType.toLowerCase()} ideas`}
                      icon={
                        mealType.toLowerCase().includes("breakfast") ? "Coffee" :
                          mealType.toLowerCase().includes("lunch") ? "Utensils" :
                            mealType.toLowerCase().includes("dinner") ? "Moon" :
                              mealType.toLowerCase().includes("snack") ? "Cookie" :
                                "ChefHat"
                      }
                      recipes={mealRecipes}
                    />
                  ))}

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
