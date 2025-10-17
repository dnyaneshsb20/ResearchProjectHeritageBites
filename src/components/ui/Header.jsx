import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import Input from './Input';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient";
import { useCart } from '../../context/CartContext';// make sure this points to your Supabase client

const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const isAuthenticated = !!user;
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  //const [cartItems, setCartItems] = useState([]); // stores all products added to cart
  //const [cartItemCount, setCartItemCount] = useState(0); // count of items in cart
  //const [isCartOpen, setIsCartOpen] = useState(false); // already exists, keep it
  const {
    cartItems,
    setCartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    increaseQty,
    decreaseQty,
  } = useCart();

  const cartItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const location = useLocation();
  const searchRef = useRef(null);
  const userMenuRef = useRef(null);
  const [showAuthPopup, setShowAuthPopup] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // fetched from Supabase

  // 👇 Add this just before defining navigationItems
  const userRole = userProfile?.role || "user";

  // 👇 Conditional navigation
  const navigationItems = React.useMemo(() => {
    if (userRole === "farmer") {
      return [
        { path: "/farmer-dashboard", label: "Dashboard", icon: "LayoutDashboard" },
        { path: "/farmer-products", label: "My Products", icon: "Package" },
        { path: "/farmer-orders", label: "Orders", icon: "ClipboardList" },
        { path: "/farmer-profile", label: "Profile", icon: "User" },
      ];
    }
    return [
      { path: "/recipe-discovery-dashboard", label: "Discover", icon: "Search" },
      { path: "/ingredient-marketplace", label: "Marketplace", icon: "ShoppingBag" },
      { path: "/user-profile-health-goals", label: "Profile", icon: "User", protected: true },
      { path: "/recipe-submission-management", label: "Contribute", icon: "Plus", protected: true },
    ];
  }, [userRole]);

  const isActiveRoute = (path) => location?.pathname === path;

  const handleProtectedNavigation = (path) => {
    setIsUserMenuOpen(false);
    if (!isAuthenticated) {
      setShowAuthPopup(true);
      return;
    }
    navigate(path);
  };

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) console.log('Searching for:', searchQuery);
  };

  const handleSearchExpand = () => {
    setIsSearchExpanded(true);
    setTimeout(() => searchRef?.current?.focus(), 100);
  };

  const handleSearchCollapse = () => {
    if (!searchQuery?.trim()) setIsSearchExpanded(false);
  };

  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef?.current && !userMenuRef?.current?.contains(event?.target)) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const handleAddToCart = (product) => { // removed ": ProductType"
    setCartItems(prev => {
      // Check if item is already in cart
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        // Increase quantity
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      } else {
        // Add new item
        return [...prev, { ...product, quantity: 1 }];
      }
    });

    setIsCartOpen(true); // Open the cart modal
  };


  useEffect(() => {
    const fetchUserProfile = async () => {
      // Get the current auth user
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser) {
        console.error("Error getting auth user:", authError);
        return;
      }

      console.log("Auth user id:", authUser.id, "email:", authUser.email);

      // Fetch user profile from your users table
      const { data, error } = await supabase
        .from("users")
        .select("user_id, name, email, role, location")
        .eq("user_id", authUser.id) // Match by user_id
        .single();

      if (error) {
        console.warn("No row found in users table, using Auth info");

        // Try fetching role separately from users table before fallback
        const { data: roleData } = await supabase
          .from("users")
          .select("role")
          .eq("email", authUser.email)
          .single();

        // fallback: use Auth info but include DB role if found
        setUserProfile({
          name: authUser.email.split("@")[0], // default name from email
          email: authUser.email,
          role: roleData?.role ? `${roleData.role}` : "user",
          user_id: authUser.id,
        });
      } else {
        setUserProfile(data);
      }
    };

    fetchUserProfile();
  }, []);

  return (
    <header className="sticky top-0 z-100 bg-background border-b border-border shadow-warm">
      <div className="flex items-center justify-between h-16 px-4 lg:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <span className="text-white text-sm font-bold">HB</span>
          </div>
          <span className="text-xl font-heading font-semibold text-foreground">
            HeritageBites
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-1">
          {navigationItems?.map((item) => (
            item.protected ? (
              <button
                key={item?.path}
                onClick={() => handleProtectedNavigation(item?.path)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </button>
            ) : (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-body font-medium transition-all duration-200 ${isActiveRoute(item?.path)
                  ? 'bg-primary text-primary-foreground shadow-warm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
              >
                <Icon name={item?.icon} size={16} />
                <span>{item?.label}</span>
              </Link>
            )
          ))}
        </nav>

        {/* Search, Cart, and User Menu */}
        <div className="flex items-center space-x-3">
          {/* Search */}
          <div className="relative">
            {!isSearchExpanded ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSearchExpand}
                className="lg:hidden"
              >
                <Icon name="Search" size={20} />
              </Button>
            ) : (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <div className="relative">
                  <Input
                    ref={searchRef}
                    type="search"
                    placeholder="Search recipes, ingredients..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e?.target?.value)}
                    onBlur={handleSearchCollapse}
                    className="w-64 lg:w-80 pl-10"
                  />
                  <Icon
                    name="Search"
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                  />
                </div>
              </form>
            )}

            {/* Desktop Search */}
            <form onSubmit={handleSearchSubmit} className="hidden lg:block">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search recipes, ingredients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="w-80 pl-10"
                />
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </form>
          </div>

          {/* Shopping Cart */}
          {isAuthenticated && userProfile?.role !== "farmer" && (
            <div className="relative">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCartOpen(true)} // ✅ open modal
              >
                <Icon name="ShoppingCart" size={20} />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs font-caption font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            </div>
          )}

          {/* User Menu */}
          <div className="relative" ref={userMenuRef}>
            {isAuthenticated ? (
              <>
                {/* Profile Button */}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleUserMenu}
                  className="rounded-full"
                >
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} color="white" />
                  </div>
                </Button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-warm-lg z-50">
                    <div className="p-3 border-b border-border">
                      <p className="font-body font-medium text-foreground">
                        {userProfile?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userProfile?.email}
                      </p>
                      {userProfile?.role && (
                        <p className="text-xs text-accent font-medium mt-1">
                          {userProfile?.role === "admin" ? "Administrator" : userProfile?.role}
                        </p>
                      )}
                    </div>

                    <div className="py-2">
                      <button
                        onClick={() => handleProtectedNavigation("/user-profile-health-goals")}
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-body hover:bg-muted transition-colors w-full text-left"
                      >
                        <Icon name="User" size={16} />
                        <span>Profile & Goals</span>
                      </button>

                      <button
                        onClick={() => handleProtectedNavigation("/recipe-submission-management")}
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-body hover:bg-muted transition-colors w-full text-left"
                      >
                        <Icon name="BookOpen" size={16} />
                        <span>My Recipes</span>
                      </button>
                      <Link
                        to="/ingredient-marketplace"
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-body hover:bg-muted transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Icon name="Package" size={16} />
                        <span>Order History</span>
                      </Link>
                      {userProfile?.role === "admin" && (
                        <Link
                          to="/admin-recipe-management"
                          className="flex items-center space-x-3 px-3 py-2 text-sm font-body hover:bg-muted transition-colors"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon name="Settings" size={16} />
                          <span>Admin Panel</span>
                        </Link>
                      )}
                    </div>

                    <div className="border-t border-border py-2">
                      <button
                        className="flex items-center space-x-3 px-3 py-2 text-sm font-body text-destructive hover:bg-muted transition-colors w-full text-left"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout(); // ✅ call from AuthContext
                          navigate("/"); // go back to sign in
                        }}
                      >
                        <Icon name="LogOut" size={16} />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/signin">
                  <Button variant="default" size="sm">
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <nav className="lg:hidden border-t border-border bg-background">
        <div className="flex items-center justify-around py-2">
          {navigationItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`flex flex-col items-center space-y-1 px-3 py-2 rounded-lg transition-all duration-200 ${isActiveRoute(item?.path)
                ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              <Icon name={item?.icon} size={20} />
              <span className="text-xs font-caption font-medium">{item?.label}</span>
            </Link>
          ))}
        </div>
      </nav>
      {showAuthPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-popover p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-lg font-semibold mb-3">You are not signed in</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Please sign in to access this section.
            </p>
            <div className="flex justify-center space-x-2">
              <button
                onClick={() => {
                  setShowAuthPopup(false);
                  navigate("/signin");
                }}
                className="bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white px-4 py-2 rounded"
              >
                Sign In
              </button>
              <button
                onClick={() => setShowAuthPopup(false)}
                className="border border-muted px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-popover p-6 rounded-lg shadow-lg w-[400px] max-h-[80vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              {cartItems.length === 0 ? (
                <p className="text-sm text-muted-foreground">Your cart is empty.</p>
              ) : (
                cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center border-b border-border pb-2"
                  >
                    <div className="flex items-center space-x-2">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded"
                      />

                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{item.name}</span>

                        <div className="flex items-center space-x-2 mt-1">
                          <button
                            onClick={() => decreaseQty(item.id)}
                            className="px-2 py-1 bg-muted rounded hover:bg-muted/80 text-lg font-medium"
                          >
                            −
                          </button>

                          <span className="text-sm font-medium">{item.quantity ?? 1}</span>

                          <button
                            onClick={() => increaseQty(item.id)}
                            className="px-2 py-1 bg-muted rounded hover:bg-muted/80 text-lg font-medium"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <span className="text-sm font-medium">
                      {new Intl.NumberFormat('en-IN', {
                        style: 'currency',
                        currency: 'INR',
                        minimumFractionDigits: 0,
                      }).format(item.price * (item.quantity ?? 1))}
                    </span>
                  </div>
                ))
              )}
            </div>


            {/* Footer */}
            <div className="mt-6 flex justify-between items-center">
              <span className="font-medium">
                Total: {new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(cartItems.reduce((acc, item) => acc + (item.price * (item.quantity || 1)), 0)
                )}
              </span>
              <button
                onClick={() => {
                  if (cartItemCount > 0) {
                    setIsCartOpen(false);
                    navigate("/checkout");
                  }
                }}
                disabled={cartItemCount === 0}
                className={`px-4 py-2 rounded transition-colors
    ${cartItemCount === 0
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white hover:opacity-90"
                  }`}
              >
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;