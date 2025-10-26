import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, User } from "lucide-react";
import Button from "../../../components/ui/Button";
import FarmerProfileModal from "../components/FarmerProfileModal"; // 👈 create similar modal for farmers

// Helper functions for initials and color
const getInitials = (name) => {
    const names = name.split(" ");
    return names.length > 1
        ? `${names[0][0]}${names[1][0]}`
        : `${names[0][0]}`;
};

const getColorFromName = (name) => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 60%, 60%)`;
    return color;
};

const FarmersManagement = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedFarmer, setSelectedFarmer] = useState(null);

    const fetchFarmers = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
            // ✅ Try fetching with relation first
            const { data, error } = await supabase
                .from("farmers")
                .select(`
        farmer_id,
        bio,
        certifications,
        contact_info,
        location,
        users:user_id (
          user_id,
          name,
          email,
          created_at
        )
      `)
                .order("created_at", { ascending: false, foreignTable: "users" });

            console.log("Raw farmers data:", data);
            console.log("Supabase error:", error);

            // ✅ If relation query fails, fallback to farmers only
            let farmersData = data;
            if (!data && error) {
                console.warn("Relation query failed — fetching farmers directly");
                const { data: fallbackData, error: fallbackError } = await supabase
                    .from("farmers")
                    .select("*")
                    .order("farmer_id", { ascending: false });
                farmersData = fallbackData;
                if (fallbackError) throw fallbackError;
            }

            if (!farmersData || farmersData.length === 0) {
                setFarmers([]);
                setLoading(false);
                return;
            }

            // ✅ Normalize farmers data
            const formattedFarmers = farmersData.map((farmer) => {
                const userData = farmer.users || {};
                return {
                    id: farmer.farmer_id,
                    name: userData.name || "Unknown Farmer",
                    email: userData.email || "N/A",
                    location: farmer.location || "N/A",
                    createdAt: userData.created_at
                        ? new Date(userData.created_at).toLocaleDateString()
                        : "N/A",
                    bio: farmer.bio || "N/A",
                    certifications: farmer.certifications || "N/A",
                    contactInfo: farmer.contact_info || "N/A",
                };
            });

            setFarmers(formattedFarmers);
        } catch (err) {
            console.error("Error fetching farmers:", err);
            setErrorMsg("Failed to fetch farmers. Please check your database and try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFarmers();
    }, []);

    if (loading) {
        return <div className="flex justify-center items-center h-64 text-gray-500">Loading farmers...</div>;
    }

    if (errorMsg) {
        return <div className="flex justify-center items-center h-64 text-red-500">{errorMsg}</div>;
    }

    return (
        <div className="p-6 bg-orange-20 min-h-screen">
            <h1 className="text-3xl font-semibold mb-6 text-gray-800">Farmers</h1>

            {farmers.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No farmers found.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-2">
                    {farmers.map((farmer) => (
                        <div
                            key={farmer.id}
                            className="bg-card bg-white rounded-lg border border-border p-6 hover:shadow-warm-md transition-shadow"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                                        style={{ backgroundColor: getColorFromName(farmer.name) }}
                                    >
                                        {getInitials(farmer.name)}
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-foreground">{farmer.name}</h3>
                                        <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                                            <MapPin className="w-3 h-3 text-muted-foreground" />
                                            <span>{farmer.location}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="space-y-3 mb-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Email</span>
                                    <span className="text-sm font-medium text-foreground">{farmer.email}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Contact</span>
                                    <span className="text-sm font-medium text-success">{farmer.contactInfo}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Certifications</span>
                                    <span className="text-sm font-medium text-foreground">{farmer.certifications} Certified Farmer</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-muted-foreground">Joined</span>
                                    <span className="text-sm text-muted-foreground">{farmer.createdAt}</span>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                                <Button
                                    variant="ghost2"
                                    size="sm"
                                    className="flex-1"
                                    onClick={() => setSelectedFarmer(farmer)}
                                >
                                    <User className="w-4 h-4" />
                                    <span className="ml-1">View Profile</span>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {selectedFarmer && (
                <FarmerProfileModal
                    farmer={selectedFarmer}
                    onClose={() => setSelectedFarmer(null)}
                />
            )}
        </div>
    );
};

export default FarmersManagement;
