import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import FilterDrawer from './components/FilterDrawer';
import CategoryTabs from './components/CategoryTabs';
import ProductCard from './components/ProductCard';
import FeaturedFarmers from './components/FeaturedFarmers';
import ProductDetailModal from './components/ProductDetailModal';
import SearchBar from './components/SearchBar';
import Footer from '../dashboard/components/Footer';
import { supabase } from "../../supabaseClient";

const IngredientMarketplace = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('popularity');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [filters, setFilters] = useState({
    categories: [],
    states: [],
    certifications: [],
    priceRanges: []
  });
const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const productsPerPage = 12;
useEffect(() => {
  const fetchProducts = async () => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('products')
      .select(`
        product_id,
        name,
        price,
        unit,
        stock,
        certifications,
        image_url,
        ingredients (
          ingredient_id,
          name,
          nutritional_info,
          category_id
        )
      `);

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      const products = data.map((item) => ({
        id: item.product_id,
        name: item.name || item.ingredients?.name || 'Unnamed Product',
        image: item.image_url || 'https://placehold.co/400x400?text=Product',
        price: Number(item.price) || 0,
        unit: item.unit || '1kg',
        stock: item.stock || 0,
        rating: 4.5, // placeholder, can later come from reviews table
        reviewCount: Math.floor(Math.random() * 200), // mock count
        category: item.ingredients?.category_id || 'general',
        isOrganic: item.certifications?.toLowerCase()?.includes('organic'),
        farmer: {
          name: 'Farmer',
          location: 'India',
        },
        certifications: item.certifications
          ? item.certifications.split(',').map((c) => c.trim())
          : [],
        description: item.ingredients?.nutritional_info || '',
      }));

      setAllProducts(products);
      setFilteredProducts(products);
    }

    setIsLoading(false);
  };

  fetchProducts();
}, []);


  // Filter and search logic
  useEffect(() => {
    let filtered = [...allProducts];

    // Category filter
    if (activeCategory !== 'all') {
      filtered = filtered?.filter(product => product?.category === activeCategory);
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered?.filter(product =>
        product?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.farmer?.name?.toLowerCase()?.includes(searchQuery?.toLowerCase()) ||
        product?.farmer?.location?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
    }

    // Apply filters
    if (filters?.categories?.length > 0) {
      filtered = filtered?.filter(product => filters?.categories?.includes(product?.category));
    }

    if (filters?.certifications?.length > 0) {
      filtered = filtered?.filter(product =>
        product?.certifications?.some(cert => 
          filters?.certifications?.some(filterCert => 
            cert?.toLowerCase()?.includes(filterCert?.toLowerCase())
          )
        )
      );
    }

    // Sort products
    switch (sortBy) {
      case 'price-low':
        filtered?.sort((a, b) => a?.price - b?.price);
        break;
      case 'price-high':
        filtered?.sort((a, b) => b?.price - a?.price);
        break;
      case 'rating':
        filtered?.sort((a, b) => b?.rating - a?.rating);
        break;
      case 'newest':
        filtered?.sort((a, b) => b?.id - a?.id);
        break;
      default: // popularity
        filtered?.sort((a, b) => b?.reviewCount - a?.reviewCount);
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [activeCategory, searchQuery, filters, sortBy]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleRecipeSearch = (recipeName) => {
    // Mock recipe-based ingredient search
    const recipeIngredients = {
      'butter chicken': ['turmeric', 'garam masala', 'cream', 'tomato'],
      'biryani': ['basmati rice', 'saffron', 'cardamom', 'bay leaves'],
      'dal tadka': ['urad dal', 'turmeric', 'cumin', 'mustard oil']
    };

    const ingredients = recipeIngredients?.[recipeName?.toLowerCase()] || [];
    if (ingredients?.length > 0) {
      const searchTerm = ingredients?.join(' ');
      setSearchQuery(searchTerm);
    }
  };

  const handleAddToCart = async (product) => {
    setCartItems(prev => {
      const existingItem = prev?.find(item => item?.id === product?.id);
      if (existingItem) {
        return prev?.map(item =>
          item?.id === product?.id
            ? { ...item, quantity: item?.quantity + (product?.quantity || 1) }
            : item
        );
      }
      return [...prev, { ...product, quantity: product?.quantity || 1 }];
    });

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
  };

  const handleToggleWishlist = (productId, isWishlisted) => {
    if (isWishlisted) {
      setWishlistItems(prev => [...prev, productId]);
    } else {
      setWishlistItems(prev => prev?.filter(id => id !== productId));
    }
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsProductModalOpen(true);
  };

  const handleFarmerClick = (farmer) => {
    console.log('Farmer clicked:', farmer);
    // Navigate to farmer profile or show farmer details
  };

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      states: [],
      certifications: [],
      priceRanges: []
    });
  };

  // Pagination
  const totalPages = Math.ceil(filteredProducts?.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = filteredProducts?.slice(startIndex, startIndex + productsPerPage);

  return (
    <>
      <Helmet>
        <title>Ingredient Marketplace - DishCover | Authentic Indian Ingredients</title>
        <meta name="description" content="Discover authentic indigenous ingredients directly from verified farmers. Shop organic spices, grains, oils, and traditional ingredients for your Indian recipes." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <Header />

        {/* Category Navigation */}
        <CategoryTabs 
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Desktop Sidebar Filters */}
            <div className="hidden lg:block w-80 flex-shrink-0">
              <div className="sticky top-32">
                <FilterDrawer
                  isOpen={true}
                  onClose={() => {}}
                  filters={filters}
                  onFilterChange={setFilters}
                  onClearFilters={handleClearFilters}
                />
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Search Bar */}
              <div className="mb-6">
                <SearchBar 
                  onSearch={handleSearch}
                  onRecipeSearch={handleRecipeSearch}
                />
              </div>

              {/* Featured Farmers */}
              <FeaturedFarmers onFarmerClick={handleFarmerClick} />

              {/* Toolbar */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                  {/* Mobile Filter Button */}
                  <Button
                    variant="outline"
                    onClick={() => setIsFilterOpen(true)}
                    iconName="Filter"
                    iconPosition="left"
                    className="lg:hidden"
                  >
                    Filters
                  </Button>

                  <div className="text-sm text-muted-foreground">
                    {filteredProducts?.length} products found
                    {searchQuery && (
                      <span> for "{searchQuery}"</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {/* Sort Dropdown */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e?.target?.value)}
                    className="px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm"
                  >
                    <option value="popularity">Most Popular</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>

                  {/* View Mode Toggle */}
                  <div className="hidden sm:flex border border-border rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                    >
                      <Icon name="Grid3X3" size={16} />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-background text-muted-foreground hover:text-foreground'}`}
                    >
                      <Icon name="List" size={16} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Products Grid */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : currentProducts?.length > 0 ? (
                <div className={`grid gap-6 mb-8 ${
                  viewMode === 'grid' ?'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' :'grid-cols-1'
                }`}>
                  {currentProducts?.map((product) => (
                    <ProductCard
                      key={product?.id}
                      product={{
                        ...product,
                        isWishlisted: wishlistItems?.includes(product?.id)
                      }}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      onProductClick={handleProductClick}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Icon name="Search" size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    No products found
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filters to find what you're looking for.
                  </p>
                  <Button variant="outline" onClick={handleClearFilters}>
                    Clear Filters
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    iconName="ChevronLeft"
                    iconPosition="left"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center space-x-1">
                    {[...Array(Math.min(5, totalPages))]?.map((_, i) => {
                      const pageNum = i + 1;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          onClick={() => setCurrentPage(pageNum)}
                          size="sm"
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    iconName="ChevronRight"
                    iconPosition="right"
                  >
                    Next
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          filters={filters}
          onFilterChange={setFilters}
          onClearFilters={handleClearFilters}
        />

        {/* Product Detail Modal */}
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isProductModalOpen}
          onClose={() => setIsProductModalOpen(false)}
          onAddToCart={handleAddToCart}
        />
        <Footer/>
      </div>
    </>
  );
};

export default IngredientMarketplace;