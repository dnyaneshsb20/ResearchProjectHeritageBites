import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, onRecipeSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRecipeMode, setIsRecipeMode] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const ingredientSuggestions = [
    'Organic Turmeric', 'Basmati Rice', 'Mustard Oil', 'Red Chili Powder',
    'Cumin Seeds', 'Coriander Seeds', 'Garam Masala', 'Cardamom',
    'Black Pepper', 'Fenugreek Seeds', 'Asafoetida', 'Bay Leaves'
  ];

  const recipeSuggestions = [
    'Butter Chicken ingredients', 'Biryani spices', 'Dal Tadka essentials',
    'Rajma curry needs', 'Chole masala ingredients', 'Sambar spices',
    'Rasam powder ingredients', 'Palak paneer essentials'
  ];

  useEffect(() => {
    const currentSuggestions = isRecipeMode ? recipeSuggestions : ingredientSuggestions;
    if (searchQuery?.length > 0) {
      const filtered = currentSuggestions?.filter(item =>
        item?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      );
      setSuggestions(filtered?.slice(0, 6));
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, isRecipeMode]);

  const handleSearch = (query = searchQuery) => {
    if (query?.trim()) {
      if (isRecipeMode) {
        onRecipeSearch(query);
      } else {
        onSearch(query);
      }
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchQuery(suggestion);
    handleSearch(suggestion);
  };

  const handleKeyPress = (e) => {
    if (e?.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleSearchMode = () => {
    setIsRecipeMode(!isRecipeMode);
    setSearchQuery('');
    setSuggestions([]);
    setShowSuggestions(false);
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 mb-4">
        {/* Search Mode Toggle */}
        <div className="flex bg-muted rounded-lg p-1">
          <button
            onClick={() => !isRecipeMode || toggleSearchMode()}
            className={`px-3 py-1 rounded text-sm font-body font-medium transition-all ${
              !isRecipeMode 
                ? 'bg-background text-foreground shadow-warm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="Search" size={14} className="inline mr-1" />
            Ingredients
          </button>
          <button
            onClick={() => isRecipeMode || toggleSearchMode()}
            className={`px-3 py-1 rounded text-sm font-body font-medium transition-all ${
              isRecipeMode 
                ? 'bg-background text-foreground shadow-warm' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon name="ChefHat" size={14} className="inline mr-1" />
            By Recipe
          </button>
        </div>
      </div>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
          <Input
            ref={searchRef}
            type="search"
            placeholder={isRecipeMode 
              ? "Search by recipe name (e.g., 'Butter Chicken')" 
              : "Search ingredients, spices, grains..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e?.target?.value)}
            onKeyPress={handleKeyPress}
            className="w-full pl-10 pr-12"
          />
          <Icon 
            name={isRecipeMode ? "ChefHat" : "Search"} 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                setShowSuggestions(false);
              }}
              className="absolute right-10 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <Icon name="X" size={16} />
            </button>
          )}
        </div>
        
        <Button
          onClick={() => handleSearch()}
          className="absolute right-1 top-1/2 transform -translate-y-1/2"
          size="sm"
        >
          <Icon name="Search" size={16} />
        </Button>

        {/* Search Suggestions */}
        {showSuggestions && suggestions?.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-warm-lg z-50">
            <div className="p-2">
              <div className="text-xs text-muted-foreground mb-2 px-2">
                {isRecipeMode ? 'Recipe suggestions:' : 'Popular ingredients:'}
              </div>
              {suggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-2 py-2 text-sm text-foreground hover:bg-muted rounded transition-colors"
                >
                  <Icon 
                    name={isRecipeMode ? "ChefHat" : "Search"} 
                    size={14} 
                    className="inline mr-2 text-muted-foreground" 
                  />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Search Mode Description */}
      <p className="text-sm text-muted-foreground mt-2">
        {isRecipeMode 
          ? "Find all ingredients needed for your favorite recipes in one search"
          : "Discover authentic ingredients from verified farmers across India"
        }
      </p>
    </div>
  );
};

export default SearchBar;