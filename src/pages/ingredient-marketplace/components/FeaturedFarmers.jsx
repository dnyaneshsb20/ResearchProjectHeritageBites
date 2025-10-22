import React, { useEffect, useState } from 'react'
import Icon from '../../../components/AppIcon'
import Image from '../../../components/AppImage'
import Button from '../../../components/ui/Button'
import { supabase } from "../../../supabaseClient";
import ViewProductModal from './ViewProductModal';

const FeaturedFarmers = ({ onFarmerClick }) => {
  const [farmers, setFarmers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedFarmerId, setSelectedFarmerId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchFarmers()
  }, [])

  const fetchFarmers = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from("farmers")
      .select(`
        farmer_id,
        bio,
        certifications,
        contact_info,
        location,
        users:user_id (
          name,
          email,
          role
        ),
        products:products!products_farmer_id_fkey (product_id)
      `);

    if (error) {
      console.error('Error fetching farmers:', error)
    } else {
      setFarmers(data)
    }
    setLoading(false)
  }

  if (loading) {
    return <p className="text-muted-foreground p-4">Loading farmers...</p>
  }

  const handleViewProducts = (farmerId) => {
    setSelectedFarmerId(farmerId);
    setIsModalOpen(true);
  };

  // ✅ Limit displayed farmers based on toggle
  const displayedFarmers = showAll ? farmers : farmers.slice(0, 3);

  // Generate initials from name
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
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-heading font-semibold text-foreground">Featured Farmers</h2>
          <p className="text-sm text-muted-foreground">
            Meet the guardians of indigenous ingredients
          </p>
        </div>

        {/* ✅ Show toggle button only if more than 3 farmers */}
        {farmers.length > 3 && (
          <Button
            variant="ghost2"
            size="sm"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "View Less" : "View All Farmers"}
          </Button>
        )}
      </div>

      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ${showAll ? "max-h-full" : "overflow-hidden"
          }`}
      >
        {displayedFarmers.map((farmer) => (
          <div
            key={farmer.farmer_id}
            className="bg-background border border-border rounded-lg p-4 hover:shadow-warm-md transition-all duration-200 cursor-pointer"
            onClick={() => onFarmerClick(farmer)}
          >
            <div className="flex items-center space-x-3 mb-3">
              <div className="relative">
                {farmer.image_url ? (
                  <Image
                    src={farmer.image_url}
                    alt={farmer.users?.name || "Unnamed Farmer"}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl"
                    style={{ backgroundColor: getColorFromName(farmer.users?.name) }}
                  >
                    {getInitials(farmer.users?.name)}
                  </div>
                )}
                {/* <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                  <Icon name="Check" size={8} color="white" />
                </div> */}
              </div>
              <div className="flex-1">
                <h3 className="font-body font-semibold text-foreground flex items-center gap-1">
                  {farmer.users?.name || "Unnamed Farmer"}
                  <div className="w-4 h-4 bg-success rounded-full border-2 border-background flex items-center justify-center">
                    <Icon name="Check" size={8} color="white" />
                  </div>
                </h3>
                <div className="flex items-center space-x-1">
                  <Icon name="MapPin" size={12} className="text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{farmer.location || "Unknown location"}</span>
                </div>
              </div>
            </div>

            <p className="text-sm text-foreground mb-2 font-medium">
              {farmer.bio || '—'}
            </p>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
              {farmer.story || 'No story available'}
            </p>

            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-1">
                <Icon name="Star" size={12} className="text-warning fill-current" />
                <span className="text-sm font-medium text-foreground">{farmer.rating || '—'}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {farmer.products?.length || 0} products
              </span>
            </div>

            {farmer.certifications && (
              <div className="flex flex-wrap gap-1 mb-3">
                {farmer.certifications.split(',').map((cert, index) => (
                  <span
                    key={index}
                    className="py-1 bg-success/10 text-success text-xs font-caption font-medium rounded"
                  >
                    <span className="text-sm font-semibold text-foreground">Farmer Certification: </span>
                    <Icon name="Shield" size={13} className="inline mb-1" />
                    {cert} Certified Farmer
                  </span>
                ))}
              </div>
            )}

            {farmer.seasonal_special && (
              <div className="bg-warning/10 border border-warning/20 rounded-lg p-2 mb-3">
                <div className="flex items-center space-x-1 mb-1">
                  <Icon name="Sparkles" size={12} className="text-warning" />
                  <span className="text-xs font-caption font-medium text-warning">
                    Seasonal Special
                  </span>
                </div>
                <p className="text-sm text-foreground">{farmer.seasonal_special}</p>
              </div>
            )}

            <Button
              variant="ghost2"
              size="sm"
              iconName="ArrowRight"
              iconPosition="right"
              className="w-full"
              onClick={(e) => {
                e.stopPropagation();
                handleViewProducts(farmer.farmer_id);
              }}
            >
              View Products
            </Button>
          </div>
        ))}
      </div>
      <ViewProductModal
        farmerId={selectedFarmerId}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}

export default FeaturedFarmers
