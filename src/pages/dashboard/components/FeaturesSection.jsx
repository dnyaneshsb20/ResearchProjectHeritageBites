import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";

import Button from '../../../components/ui/Button';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Users, 
  MapPin, 
  Utensils,
  Leaf,
  Star
} from "lucide-react";
import spicesImage from "../../../assets/spices.jpg";
import farmerImage from "../../../assets/farmer.jpg";

const FeaturesSection = () => {
  const features = [
    {
      icon: <Search className="h-8 w-8 text-saffron" />,
      title: "Smart Recipe Discovery",
      description: "Find authentic recipes by ingredients, region, or dietary needs with AI-powered recommendations"
    },
    {
      icon: <ShoppingCart className="h-8 w-8 text-deep-red" />,
      title: "Indigenous Marketplace",
      description: "Buy directly from local farmers - native grains, spices, and traditional ingredients"
    },
    {
      icon: <Heart className="h-8 w-8 text-saffron" />,
      title: "Personalized Nutrition",
      description: "Get meal plans tailored to your health goals using traditional Indian superfoods"
    },
    {
      icon: <Users className="h-8 w-8 text-deep-red" />,
      title: "Community Stories",
      description: "Share and discover family recipes with cultural stories behind each dish"
    },
    {
      icon: <MapPin className="h-8 w-8 text-saffron" />,
      title: "Regional Explorer",
      description: "Journey through India's diverse culinary landscape with interactive maps"
    },
    {
      icon: <Leaf className="h-8 w-8 text-deep-red" />,
      title: "Sustainable Living",
      description: "Support eco-friendly farming practices and preserve traditional food culture"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-background to-warm-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Rediscover Your
            <span className="bg-gradient-to-r from-saffron to-deep-red bg-clip-text text-transparent"> Heritage</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            From ancient grains to forgotten recipes, explore the rich tapestry of Indian cuisine 
            that has nourished generations
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {features.map((feature, index) => (
            <Card key={index} className="group hover:shadow-warm transition-all duration-300 hover:-translate-y-2 border-border/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 rounded-full bg-warm-cream group-hover:bg-saffron/10 transition-colors">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl font-semibold text-foreground">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Content */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-4">
                From Farm to Table
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                Connect directly with farmers preserving India's agricultural heritage. 
                Each purchase supports sustainable farming and keeps traditional varieties alive.
              </p>
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="px-4 py-2 bg-saffron/10 text-saffron rounded-full text-sm font-medium">
                  Organic Millets
                </span>
                <span className="px-4 py-2 bg-deep-red/10 text-deep-red rounded-full text-sm font-medium">
                  Heirloom Spices
                </span>
                <span className="px-4 py-2 bg-golden/10 text-earth-brown rounded-full text-sm font-medium">
                  Cold-Pressed Oils
                </span>
              </div>
              <Button variant="spice" size="lg">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Explore Marketplace
              </Button>
            </div>
          </div>

          {/* Right Content */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img 
                src={spicesImage} 
                alt="Traditional Indian spices" 
                className="w-full h-48 object-cover rounded-lg shadow-spice"
              />
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Star className="h-4 w-4 text-golden fill-current" />
                  <span className="text-sm font-medium">4.9 Rating</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Premium Kashmiri Saffron
                </p>
              </Card>
            </div>
            <div className="space-y-4 mt-8">
              <img 
                src={farmerImage} 
                alt="Local farmer" 
                className="w-full h-48 object-cover rounded-lg shadow-warm"
              />
              <Card className="p-4">
                <div className="flex items-center space-x-2 mb-2">
                  <Utensils className="h-4 w-4 text-saffron" />
                  <span className="text-sm font-medium">Farm Fresh</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Directly from 1000+ farmers
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;