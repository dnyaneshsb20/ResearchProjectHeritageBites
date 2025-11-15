import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, User, Mail, Phone, Award, Calendar, Search, Filter, Users, Sprout, Eye } from "lucide-react";
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
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header Section */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
                                className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary w-full max-w-xs"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-green-600 mb-2">{farmers.length}</div>
                        <div className="text-sm font-medium text-muted-foreground">Total Farmers</div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                            {farmers.filter(f => f.isCertified).length}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Certified Farmers</div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-amber-600 mb-2">
                            {new Set(farmers.map(f => f.location)).size}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">Active Locations</div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 text-center">
                        <div className="text-3xl font-bold text-purple-600 mb-2">
                            {farmers.filter(f => {
                                const monthAgo = new Date();
                                monthAgo.setMonth(monthAgo.getMonth() - 1);
                                return new Date(f.createdAt) > monthAgo;
                            }).length}
                        </div>
                        <div className="text-sm font-medium text-muted-foreground">New This Month</div>
                    </div>
                </div>

                {/* Farmers Table */}
                <div className="bg-card rounded-lg border border-border overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-muted/50 border-b border-border">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Farmer
                                    </th>
                                    {/* <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Certification
                                    </th> */}
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Location
                                    </th>
                                    {/* <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Bio
                                    </th> */}
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Joined Date
                                    </th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-foreground uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {filteredFarmers.map((farmer) => (
                                    <tr key={farmer.id} className="hover:bg-muted/30 transition-colors duration-150">
                                        {/* Farmer Info */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-4">
                                                <div
                                                    className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                                                    style={{ backgroundColor: getColorFromName(farmer.name) }}
                                                >
                                                    {getInitials(farmer.name)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-lg font-semibold text-foreground truncate">
                                                        {farmer.name}
                                                    </p>
                                                    {/* <p className="text-sm text-muted-foreground truncate mt-1">
                                                        {farmer.email}
                                                    </p> */}
                                                    <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                                                        <Award className="w-3 h-3" />
                                                        <span>{farmer.isCertified ? "Certified" : "Uncertified"}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Certification */}
                                        {/* <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getCertificationColor(farmer.isCertified)}`}>
                                                {farmer.isCertified ? "Certified" : "Uncertified"}
                                            </span>
                                        </td> */}

                                        {/* Contact */}
                                        {/* Contact */}
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Mail className="w-4 h-4 text-muted-foreground" />
                                                    {/* Removed truncate and max-width to show full email */}
                                                    <span className="text-foreground">{farmer.email}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm">
                                                    <Phone className="w-4 h-4 text-muted-foreground" />
                                                    {/* Mobile/contact info is already fully visible */}
                                                    <span className="text-foreground">{farmer.contactInfo}</span>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Location */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <MapPin className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{farmer.location}</span>
                                            </div>
                                        </td>

                                        {/* Bio */}
                                        {/* <td className="px-6 py-4">
                                            <div className="max-w-xs">
                                                <p className="text-sm text-foreground line-clamp-2">
                                                    {farmer.bio}
                                                </p>
                                            </div>
                                        </td> */}

                                        {/* Joined Date */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Calendar className="w-4 h-4 text-muted-foreground" />
                                                <span className="text-foreground">{farmer.createdAt}</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-4 text-right">
                                            <Button
                                                variant="default"
                                                size="sm"
                                                onClick={() => setSelectedFarmer(farmer)}
                                                className="bg-green-600 hover:bg-green-700 text-primary-foreground"
                                            >
                                                <Eye className="w-4 h-4 mr-2" />
                                                View Profile
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredFarmers.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                                <Sprout className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-xl font-semibold text-foreground mb-2">
                                {searchTerm || filterCertified !== "all" ? "No farmers found" : "No farmers registered yet"}
                            </h3>
                            <p className="text-muted-foreground max-w-md mx-auto">
                                {searchTerm || filterCertified !== "all"
                                    ? "Try adjusting your search or filter criteria"
                                    : "Farmers will appear here once they register on the platform"
                                }
                            </p>
                        </div>
                    )}
                </div>
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