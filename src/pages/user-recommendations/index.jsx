import React, { useState, useEffect } from "react";
import Header from "../../components/ui/Header";
import Footer from "../dashboard/components/Footer";
import Icon from "../../components/AppIcon";
import Button from "../../components/ui/Button";
import { supabase } from "../../supabaseClient";
import { useLocation } from "react-router-dom";
import RecipeDetailModal from "./RecipeDetailModal";


const UserRecommendations = () => {
    const [userData, setUserData] = useState(null);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    const [selectedRecipe, setSelectedRecipe] = useState(null);
    const [showModal, setShowModal] = useState(false);


    useEffect(() => {
        if (location.state?.recommendations) {
            setRecommendations(location.state.recommendations);
        }
        setLoading(false);
    }, [location.state]);
    // 🔹 Fetch user profile details (for context)
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data: authData } = await supabase.auth.getUser();
                const user = authData?.user;
                if (!user) return;

                const { data: profile } = await supabase
                    .from("user_profile")
                    .select("age_group, gender, health_goals, dietary_restrictions, health_conditions")
                    .eq("user_id", user.id)
                    .single();

                setUserData(profile);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    // (We’ll add AI recommendation fetch logic later here)

    return (
        <div className="min-h-screen bg-background">
            <Header />

            <div className="max-w-5xl mx-auto px-4 py-10">
                {/* Header */}
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Icon name="Sparkles" size={24} className="text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-heading font-bold text-foreground">
                            Personalized Recommendations
                        </h1>
                        <p className="text-muted-foreground">
                            Discover AI-curated recipes and insights tailored to your health profile.
                        </p>
                    </div>
                </div>

                {/* Loading / Empty / Recommendations */}
                {loading ? (
                    <div className="text-center py-20 text-muted-foreground">
                        <Icon name="Loader" className="animate-spin mx-auto mb-4" size={28} />
                        <p>Loading your recommendations...</p>
                    </div>
                ) : !recommendations.length ? (
                    <div className="bg-card border border-border rounded-xl p-8 text-center">
                        <Icon name="Search" size={36} className="text-muted-foreground mb-3 mx-auto" />
                        <h2 className="text-xl font-semibold text-foreground mb-2">
                            No recommendations yet
                        </h2>


                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        {recommendations.map((rec, index) => (
                            <div
                                key={index}
                                className="bg-card border border-border rounded-xl shadow-sm p-5 hover:shadow-md transition-shadow"
                            >
                                <h3 className="text-lg font-semibold text-foreground mb-2">
                                    {rec.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-3">{rec.description}</p>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    iconName="ExternalLink"
                                    onClick={() => {
                                        setSelectedRecipe(rec);
                                        setShowModal(true);
                                    }}
                                >
                                    View Recipe
                                </Button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
            {showModal && selectedRecipe && (
                <RecipeDetailModal
                    recipe={selectedRecipe}
                    onClose={() => setShowModal(false)}
                />
            )}

            <Footer />
        </div>
    );
};

export default UserRecommendations;
