import React, { useState, useEffect } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { supabase } from '../../../supabaseClient';

const ProductDetailModal = ({ product, isOpen, onClose, onAddToCart }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [farmerInfo, setFarmerInfo] = useState(null);
  const [loadingFarmer, setLoadingFarmer] = useState(false);
  useEffect(() => {
    const fetchFarmerInfo = async () => {
      if (!product?.farmer_id) return;

      setLoadingFarmer(true);

      const { data, error } = await supabase
        .from('farmers')
        .select(`
        farmer_id,
        bio,
        certifications,
        location,
        contact_info,
       user:users!farmers_user_id_fkey (
          name,
          email
        )
      `)
        .eq('farmer_id', product.farmer_id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching farmer:', error);
        setFarmerInfo(null);
      } else {
        setFarmerInfo(data);
      }

      setLoadingFarmer(false);
    };

    if (isOpen) fetchFarmerInfo();
  }, [isOpen, product?.farmer_id]);


  if (!isOpen || !product) return null;

  // const handleAddToCart = async () => {
  //   setIsAddingToCart(true);
  //   await onAddToCart({
  //     ...product,
  //     quantity,
  //     selectedUnit
  //   });
  //   setIsAddingToCart(false);
  // };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0
    })?.format(price);
  };

  const calculateBulkPrice = (basePrice, qty) => {
    if (qty >= 10) return basePrice * 0.9; // 10% discount
    if (qty >= 5) return basePrice * 0.95; // 5% discount
    return basePrice;
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length === 1) return words[0][0].toUpperCase();
    return (words[0][0] + words[1][0]).toUpperCase();
  };

  const getColorFromName = (name) => {
    if (!name) return "#888";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash % 360);
    return `hsl(${hue}, 70%, 50%)`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 mt-18">
      <div className="bg-background rounded-lg max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background">
          <h2 className="text-xl font-heading font-semibold text-foreground">Product Details</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <Icon name="X" size={20} />
          </Button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="w-[415px] h-[435px] aspect-square mb-4 overflow-hidden rounded-lg border border-border">
                <Image
                  src={product?.images?.[selectedImageIndex] || product?.image}
                  alt={product?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {product?.images && product?.images?.length > 1 && (
                <div className="flex space-x-2 overflow-x-auto">
                  {product?.images?.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${selectedImageIndex === index ? 'border-primary' : 'border-border'
                        }`}
                    >
                      <Image
                        src={image}
                        alt={`${product?.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-heading font-bold text-foreground mb-1">
                {product?.name}
              </h1>
              {/* Stock Status */}
              <div className="flex items-center space-x-2 mb-1">
                <div className={`w-3 h-3 rounded-full ${product?.stock > 10 ? 'bg-success' :
                  product?.stock > 0 ? 'bg-warning' : 'bg-destructive'
                  }`} />
                <span className="text-sm text-muted-foreground">
                  {product?.stock > 10 ? 'In Stock' :
                    product?.stock > 0 ? `Only ${product?.stock} left` : 'Out of Stock'}
                </span>
              </div>

              {/* Rating */}
              <div className="flex items-center space-x-2 mb-2">
                <div className="flex items-center">
                  {[...Array(5)]?.map((_, i) => (
                    <Icon
                      key={i}
                      name="Star"
                      size={16}
                      className={i < Math.floor(product?.rating) ? "text-warning fill-current" : "text-muted-foreground"}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product?.rating} ({product?.reviewCount} reviews)
                </span>
              </div>

              {/* Certifications */}
              <div className="flex flex-wrap gap-2 mb-2">
                {product?.certifications?.map((cert, index) => (

                  <span
                    key={index}
                    className="px-0 py-1 bg-success/10 text-success text-sm font-caption font-medium rounded-full border border-success/20"
                  >
                    <span className="text-sm font-semibold text-foreground">Product Certification: </span>
                    <Icon name="Shield" size={13} className="inline mb-1" />
                    {cert} Certified Product
                  </span>
                ))}
              </div>

              {/* Price */}
              <div className="mb-2">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="text-3xl font-body font-bold text-foreground">
                    {formatPrice(product?.price)}
                  </span>
                  {product?.originalPrice && (
                    <span className="text-lg text-muted-foreground line-through">
                      {formatPrice(product?.originalPrice)}
                    </span>
                  )}
                </div>
              </div>


              <div className="bg-muted rounded-lg p-4 mb-2">
                {loadingFarmer ? (
                  <p className="text-sm text-muted-foreground">Loading farmer info...</p>
                ) : farmerInfo ? (
                  <>
                    {/* Farmer Basic Info */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div
                        className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white"
                        style={{
                          backgroundColor: getColorFromName(farmerInfo?.user?.name),
                        }}>
                        {getInitials(farmerInfo?.user?.name)}
                      </div>
                      <div>
                        <h3 className="font-body font-semibold text-foreground">
                          {farmerInfo?.user?.name || 'Unknown Farmer'}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Icon name="MapPin" size={12} className="text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {farmerInfo?.location || 'Location not available'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bio Section */}
                    <div className="mb-3 flex flex-wrap items-center -mt-2">
                      <span className="text-sm font-semibold text-foreground">Bio:</span>
                      <span className="text-sm text-muted-foreground">
                        {farmerInfo?.bio || 'No bio available'}
                      </span>
                    </div>

                    {/* Farmer Certifications Section */}
                    {farmerInfo?.certifications && (
                      <div className="flex flex-wrap items-center -mt-3">
                        <span className="text-sm font-semibold text-foreground">Farmer Certification:</span>
                        {farmerInfo.certifications.split(',').map((cert, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-success/10 text-success text-sm font-caption font-medium rounded-full border border-success/20"
                          >
                            <Icon name="Shield" size={13} className="inline mb-1" />
                            {cert.trim()} Certified Farmer
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">Farmer details not available.</p>
                )}
              </div>

              {/* Add to Cart */}
              {/*
              <Button
                onClick={() => {
                  handleAddToCart();
                }}
                disabled={product?.stock === 0 || isAddingToCart}
                loading={isAddingToCart}
                iconName="ShoppingCart"
                iconPosition="left"
                className="w-full mb-4"
                size="lg"
              >
                Add to Cart – {new Intl.NumberFormat('en-IN', {
                  style: 'currency',
                  currency: 'INR',
                  minimumFractionDigits: 0,
                }).format(product?.price)}
              </Button> */}

              {/* Delivery Info */}
              <div className="bg-muted rounded-lg p-4">
                <h4 className="font-body font-medium text-foreground mb-2">Delivery Information</h4>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center space-x-2">
                    <Icon name="Truck" size={14} />
                    <span>Free delivery on orders above ₹500</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={14} />
                    <span>Delivery in 3-5 business days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="RotateCcw" size={14} />
                    <span>7-day return policy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Product Details Tabs */}
          <div className="mt-8">
            <div className="border-b border-border">
              <nav className="flex space-x-8">
                <button className="py-2 px-1 border-b-2 border-primary text-primary font-body font-medium">
                  Description
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent text-muted-foreground hover:text-foreground">
                  Cultivation
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent text-muted-foreground hover:text-foreground">
                  Nutrition
                </button>
                <button className="py-2 px-1 border-b-2 border-transparent text-muted-foreground hover:text-foreground">
                  Reviews
                </button>
              </nav>
            </div>

            <div className="py-6">
              {/* Description */}
              <div className="prose max-w-none">
                <p className="text-muted-foreground mb-4">
                  {product?.description || `${product?.name} is a premium quality indigenous ingredient sourced directly from verified farmers. This traditional variety has been cultivated using time-tested methods that preserve its authentic flavor and nutritional value.`}
                </p>

                <h4 className="font-body font-semibold text-foreground mb-2">Key Features:</h4>
                <ul className="list-disc list-inside text-muted-foreground space-y-1">
                  <li>100% natural and chemical-free</li>
                  <li>Traditional cultivation methods</li>
                  <li>Direct from farmer to your kitchen</li>
                  <li>Rich in essential nutrients</li>
                  <li>Authentic regional variety</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Reviews Section */}
          {/* <div className="mt-8">
            <h3 className="text-lg font-heading font-semibold text-foreground mb-4">Customer Reviews</h3>
            <div className="space-y-4">
              {reviews?.map((review) => (
                <div key={review?.id} className="border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-body font-medium text-foreground">{review?.user}</span>
                      {review?.verified && (
                        <span className="px-2 py-1 bg-success/10 text-success text-xs font-caption rounded">
                          Verified Purchase
                        </span>
                      )}
                    </div>
                    <span className="text-sm text-muted-foreground">{review?.date}</span>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    {[...Array(5)]?.map((_, i) => (
                      <Icon
                        key={i}
                        name="Star"
                        size={14}
                        className={i < review?.rating ? "text-warning fill-current" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground">{review?.comment}</p>
                </div>
              ))}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;