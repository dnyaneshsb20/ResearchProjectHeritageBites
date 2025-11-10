import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, User, Mail, Phone, Award, Calendar, Search, Filter, Users, Sprout } from "lucide-react";
import Button from "../../../components/ui/Button";
import FarmerProfileModal from "../components/FarmerProfileModal";

// Helper functions for initials and color
const getInitials = (name) => {
    if (!name) return "F";
    const names = name.split(" ");
    return names.length > 1
        ? `${names[0][0]}${names[1][0]}`
        : `${names[0][0]}`;
};

const getColorFromName = (name) => {
    if (!name) return "#10b981";
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
        hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = `hsl(${hash % 360}, 70%, 50%)`;
    return color;
};

const FarmersManagement = () => {
    const [farmers, setFarmers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);
    const [selectedFarmer, setSelectedFarmer] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [filterCertified, setFilterCertified] = useState("all");

    const fetchFarmers = async () => {
        setLoading(true);
        setErrorMsg(null);

        try {
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

            const formattedFarmers = farmersData.map((farmer) => {
                const userData = farmer.users || {};
                const hasCertifications = farmer.certifications && farmer.certifications !== "N/A";
                
                return {
                    id: farmer.farmer_id,
                    name: userData.name || "Unknown Farmer",
                    email: userData.email || "Not provided",
                    location: farmer.location || "Not specified",
                    createdAt: userData.created_at
                        ? new Date(userData.created_at).toLocaleDateString()
                        : "Unknown",
                    bio: farmer.bio || "No bio provided",
                    certifications: farmer.certifications || "Not certified",
                    contactInfo: farmer.contact_info || "Not provided",
                    isCertified: hasCertifications
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

    // Filter farmers based on search and certification filter
    const filteredFarmers = farmers.filter(farmer => {
        const matchesSearch = farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            farmer.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCertification = filterCertified === "all" || 
                                   (filterCertified === "certified" && farmer.isCertified) ||
                                   (filterCertified === "uncertified" && !farmer.isCertified);
        return matchesSearch && matchesCertification;
    });

    const getCertificationColor = (isCertified) => {
        return isCertified 
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200";
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
                        <p className="text-muted-foreground">Loading farmers database...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="min-h-screen bg-background p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col items-center justify-center py-20 text-destructive">
                        <p className="text-lg font-medium mb-2">Error Loading Farmers</p>
                        <p className="text-muted-foreground text-center">{errorMsg}</p>
                        <Button onClick={fetchFarmers} className="mt-4">
                            Try Again
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header Section */}
                <div className="mb-8">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-2">Farmers Management</h1>
                            <p className="text-muted-foreground">
                                Manage and view all registered farmers ({farmers.length} total)
                            </p>
                        </div>
                        
                        {/* Search and Filter */}
                        <div className="flex flex-col sm:flex-row gap-3">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search farmers..."
                                    className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Total Farmers</p>
                                    <p className="text-2xl font-bold text-foreground">{farmers.length}</p>
                                </div>
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="w-5 h-5 text-green-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Certified Farmers</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {farmers.filter(f => f.isCertified).length}
                                    </p>
                                </div>
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Award className="w-5 h-5 text-blue-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Active Locations</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {new Set(farmers.map(f => f.location)).size}
                                    </p>
                                </div>
                                <div className="p-2 bg-amber-100 rounded-lg">
                                    <MapPin className="w-5 h-5 text-amber-600" />
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-card border border-border rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">New This Month</p>
                                    <p className="text-2xl font-bold text-foreground">
                                        {farmers.filter(f => {
                                            const monthAgo = new Date();
                                            monthAgo.setMonth(monthAgo.getMonth() - 1);
                                            return new Date(f.createdAt) > monthAgo;
                                        }).length}
                                    </p>
                                </div>
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Sprout className="w-5 h-5 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Farmers Grid */}
                {filteredFarmers.length === 0 ? (
                    <div className="text-center py-16 bg-card rounded-xl border border-border">
                        <Sprout className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                            {searchTerm || filterCertified !== "all" ? "No farmers found" : "No farmers registered yet"}
                        </h3>
                        <p className="text-muted-foreground">
                            {searchTerm || filterCertified !== "all" 
                                ? "Try adjusting your search or filter criteria"
                                : "Farmers will appear here once they register on the platform"
                            }
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        {filteredFarmers.map((farmer) => (
                            <div
                                key={farmer.id}
                                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
                            >
                                {/* Header with Avatar and Basic Info */}
                                <div className="p-6 border-b border-border bg-gradient-to-r from-card to-card/80">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold border-4 border-green-200 group-hover:border-green-300 transition-colors"
                                                style={{ backgroundColor: getColorFromName(farmer.name) }}
                                            >
                                                {getInitials(farmer.name)}
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-green-600 transition-colors">
                                                    {farmer.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getCertificationColor(farmer.isCertified)}`}>
                                                        {farmer.isCertified ? "Certified" : "Uncertified"}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <MapPin className="w-3 h-3" />
                                                        <span className="truncate">{farmer.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Farmer Details */}
                                <div className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Mail className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-muted-foreground">Email</p>
                                                <p className="text-sm font-medium text-foreground truncate">{farmer.email}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Phone className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-muted-foreground">Contact</p>
                                                <p className="text-sm font-medium text-foreground">{farmer.contactInfo}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Award className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-muted-foreground">Certifications</p>
                                                <p className="text-sm font-medium text-foreground line-clamp-2">
                                                    {farmer.certifications}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-green-100 rounded-lg">
                                                <Calendar className="w-4 h-4 text-green-600" />
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-sm text-muted-foreground">Joined</p>
                                                <p className="text-sm font-medium text-foreground">{farmer.createdAt}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bio Preview */}
                                    {farmer.bio && farmer.bio !== "No bio provided" && (
                                        <div className="mt-4 pt-4 border-t border-border">
                                            <p className="text-sm text-muted-foreground mb-2">About</p>
                                            <p className="text-sm text-foreground line-clamp-2">
                                                {farmer.bio}
                                            </p>
                                        </div>
                                    )}

                                    {/* Action Button */}
                                    <div className="mt-6 pt-4 border-t border-border">
                                        <Button
                                            variant="ghost2"
                                            className="w-full justify-center"
                                            onClick={() => setSelectedFarmer(farmer)}
                                        >
                                            <User className="w-4 h-4 mr-2" />
                                            View Farmer Profile
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Farmer Profile Modal */}
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