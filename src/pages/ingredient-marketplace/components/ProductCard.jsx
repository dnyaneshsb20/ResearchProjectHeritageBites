import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from "react-router-dom";
import { useCart } from '../../../context/CartContext';

const ProductCard = ({ product, onAddToCart, onToggleWishlist, onProductClick }) => {
  const [isWishlisted, setIsWishlisted] = useState(product?.isWishlisted || false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();


  const handleWishlistToggle = (e) => {
    e?.stopPropagation();
    setIsWishlisted(!isWishlisted);
    onToggleWishlist(product?.id, !isWishlisted);
  };

  const handleAddToCart = async (e) => {
    e?.stopPropagation();

    if (!user) {
      navigate("/signin");
      return;
    }

    setIsAddingToCart(true);

    // Add to cart context to open modal
    addToCart(product);

    // Optional: if you still have parent handler
    if (onAddToCart) {
      await onAddToCart(product);
    }

    setIsAddingToCart(false);
  };


  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const getInitials = (name) => {
    if (!name) return "F";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  // Generate consistent color from name
  const getColorFromName = (name) => {
    if (!name) return "#ccc";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 65%)`; // pastel tone
  };

  return (
    <div
      className="bg-card border border-border rounded-lg overflow-hidden shadow-warm hover:shadow-warm-md transition-all duration-200 cursor-pointer group"
      onClick={() => onProductClick(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={product?.image}
          alt={product?.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 right-2 p-2 bg-background/80 backdrop-blur-sm rounded-full hover:bg-background transition-colors"
        >
          <Icon
            name={isWishlisted ? "Heart" : "Heart"}
            size={16}
            className={isWishlisted ? "text-accent fill-current" : "text-muted-foreground"}
          />
        </button>

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product?.isOrganic && (
            <span className="px-2 py-1 bg-success text-success-foreground text-xs font-caption font-medium rounded">
              Organic
            </span>
          )}
          {product?.isFeatured && (
            <span className="px-2 py-1 bg-warning text-warning-foreground text-xs font-caption font-medium rounded">
              Featured
            </span>
          )}
          {product?.discount && (
            <span className="px-2 py-1 bg-accent text-accent-foreground text-xs font-caption font-medium rounded">
              {product?.discount}% OFF
            </span>
          )}
        </div>
      </div>
      {/* Product Info */}
      <div className="p-4">
        {/* Product Name */}
        <h3 className="font-body font-semibold text-foreground mb-1 line-clamp-2">
          {product?.name}
        </h3>

        {/* Farmer Info */}
        <div className="flex items-center space-x-2 mb-2">
          {(() => {
            const farmerName = product?.farmer?.name;
            const initials = getInitials(farmerName);
            const bgColor = getColorFromName(farmerName);

            return (
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white"
                style={{ backgroundColor: bgColor }}
              >
                {initials}
              </div>
            );
          })()}
          <span className="text-sm text-muted-foreground">{product?.farmer?.name}</span>
          <div className="flex items-center space-x-1">
            <Icon name="MapPin" size={12} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground">{product?.farmer?.location}</span>
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center space-x-1 mb-2">
          <div className="flex items-center">
            {[...Array(5)]?.map((_, i) => (
              <Icon
                key={i}
                name="Star"
                size={12}
                className={i < Math.floor(product?.rating) ? "text-warning fill-current" : "text-muted-foreground"}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product?.rating} ({product?.reviewCount})
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-body font-semibold text-foreground">
              {formatPrice(product?.price)}
            </span>
            {product?.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {formatPrice(product?.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            per {product?.unit}
          </span>
        </div>

        {/* Certifications */}
        <div className="flex items-center space-x-2 mb-3">
          {product?.certifications?.map((cert, index) => (
            <div key={index} className="flex items-center space-x-1">
              <Icon name="Shield" size={12} className="text-success" />
              <span className="text-xs text-muted-foreground">{cert}</span>
            </div>
          ))}
        </div>

        {/* Stock Status */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-1">
            <div className={`w-2 h-2 rounded-full ${product?.stock > 10 ? 'bg-success' :
              product?.stock > 0 ? 'bg-warning' : 'bg-destructive'
              }`} />
            <span className="text-sm text-muted-foreground">
              {product?.stock > 10 ? 'In Stock' :
                product?.stock > 0 ? `Only ${product?.stock} left` : 'Out of Stock'}
            </span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={product?.stock === 0 || isAddingToCart}
          loading={isAddingToCart}
          iconName="ShoppingCart"
          iconPosition="left"
          className="w-full"
        >
          {product?.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;