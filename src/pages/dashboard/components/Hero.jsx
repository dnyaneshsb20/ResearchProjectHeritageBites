import { useEffect, useState } from "react";
import Button from '../../../components/ui/Button';
import { Search, Sparkles } from "lucide-react";
import heroFood from "../../../assets/hero-food.jpg";
import { MdExplore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../../supabaseClient"; // ✅ Added

const Hero = () => {
  const navigate = useNavigate();

  // ✅ Add states for counts
  const [stats, setStats] = useState({
    recipes: 0,
    states: 0,
    farmers: 0,
  });

  // ✅ Fetch counts from Supabase
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const { count: recipeCount } = await supabase
          .from("recipes")
          .select("*", { count: "exact", head: true });

        const { count: stateCount } = await supabase
          .from("states")
          .select("*", { count: "exact", head: true });

        const { count: farmerCount } = await supabase
          .from("farmers")
          .select("*", { count: "exact", head: true });

        setStats({
          recipes: recipeCount || 0,
          states: stateCount || 0,
          farmers: farmerCount || 0,
        });
      } catch (err) {
        console.error("❌ Error fetching stats:", err);
      }
    };

    fetchCounts();
  }, []);

  // ✅ Existing animated placeholder logic
  useEffect(() => {
    const PLACEHOLDER_WORDS = [
      "Discover authentic Indian sweets from every region",
      "Explore regional traditional dishes made with care",
      "Find local spices and ingredients for your recipes",
      "Search for heritage recipes and flavors passed down generations",
    ];

    const placeholderText = document.getElementById("placeholder-text");
    const input = document.getElementById("search-input");
    const placeholderWrapper = document.getElementById("search-placeholder");

    let wordIndex = 0;
    let charIndex = 0;

    const typeWord = () => {
      const word = PLACEHOLDER_WORDS[wordIndex];
      placeholderText.textContent = word.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex < word.length) {
        setTimeout(typeWord, 100);
      } else {
        setTimeout(() => {
          charIndex = 0;
          wordIndex = (wordIndex + 1) % PLACEHOLDER_WORDS.length;
          typeWord();
        }, 2000);
      }
    };

    typeWord();

    input.addEventListener("input", (e) => {
      placeholderWrapper.style.display = e.target.value ? "none" : "block";
    });
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroFood})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-deep-red/80 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Discover India's
            <span className="block bg-gradient-to-r from-golden to-warm-cream bg-clip-text text-transparent">
              Indigenous Flavors
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            Explore authentic regional recipes, connect with local farmers,
            and nourish your body with traditional wisdom
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative w-full">
              <span
                id="search-placeholder"
                className="absolute left-12 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none opacity-50 z-20"
              >
                <span id="placeholder-text"></span>
              </span>

              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5 z-20" />

              <input
                type="text"
                id="search-input"
                className="w-full pl-12 pr-4 py-4 rounded-full bg-white/95 backdrop-blur-sm text-foreground placeholder:text-transparent border-0 text-lg shadow-warm focus:ring-2 focus:ring-golden focus:outline-none relative z-10"
              />

              <Button
                variant="hero"
                size="lg"
                className="bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-[#fdfbff] absolute right-2 top-1/2 transform -translate-y-1/2 rounded-full z-20"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              variant="hero"
              size="lg"
              className="min-w-48 bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-[#fdfbff] group relative"
              onClick={() => navigate("/ai-suggestions")}
            >
              <span className="relative inline-flex items-center">
                <Sparkles className="mr-2 h-5 w-5 group-hover:animate-spin-gemini drop-shadow-[0_0_6px_rgba(255,200,100,0.7)]" />
                Suggest a Dish for Me
              </span>
            </Button>

            <Button
              variant="golden"
              size="lg"
              className="min-w-48 bg-[#F9BC06]"
              onClick={() => navigate("/recipe-discovery-dashboard")}
            >
              <MdExplore className="mr-3 h-6 w-6" />
              Explore More
            </Button>
          </div>

          {/* ✅ Real-time Stats (same design) */}
          <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-golden">
                {stats.recipes || 0}+
              </div>
              <div className="text-white/80">Indigenous Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-golden">
                {stats.states || 0}
              </div>
              <div className="text-white/80">Indian States</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-golden">
                {stats.farmers || 0}+
              </div>
              <div className="text-white/80">Local Farmers</div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Hero;
