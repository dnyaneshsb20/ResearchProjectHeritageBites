import React, { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { supabase } from "../../../supabaseClient";
import Image from "../../../components/AppImage";
import Icon from "../../../components/AppIcon";
import Button from "../../../components/ui/Button";

const ContributorProfileModal = ({ contributorId, isOpen, onClose }) => {
    const [contributor, setContributor] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (contributorId && isOpen) {
            fetchContributor(contributorId);
        }
    }, [contributorId, isOpen]);

    const fetchContributor = async (id) => {
        setLoading(true);

        const { data, error } = await supabase
            .from("rec_contributions")
            .select(`
        created_by (
          user_id,
          name,
          email,
          location
        ),
        name,
        description,
        image_url,
        meal_type,
        status,
        created_at
      `)
            .eq("created_by", id);

        if (error) {
            console.error("Error fetching contributor details:", error);
            setContributor(null);
            setLoading(false);
            return;
        }

        if (!data || data.length === 0) {
            setContributor(null);
            setLoading(false);
            return;
        }

        const user = data[0].created_by;
        const specialties = [...new Set(data.map((d) => d.meal_type).filter(Boolean))];

        // Calculate stats
        const totalSubmissions = data.length;
        const approvedSubmissions = data.filter(d => d.status === 'approved').length;
        const pendingSubmissions = data.filter(d => d.status === 'pending').length;
        const approvalRate = totalSubmissions > 0 ? (approvedSubmissions / totalSubmissions * 100).toFixed(1) : 0;

        setContributor({
            id: user.user_id,
            name: user.name,
            email: user.email,
            location: user.location,
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            contributions: data,
            specialties,
            stats: {
                total: totalSubmissions,
                approved: approvedSubmissions,
                pending: pendingSubmissions,
                approvalRate: approvalRate
            }
        });

        setLoading(false);
    };

    if (!contributor && !loading) return null;

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0][0].toUpperCase();
        return (parts[0][0] + parts[1][0]).toUpperCase();
    };

    const getColorFromName = (name) => {
        if (!name) return "#999";
        let hash = 0;
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash);
        }
        const hue = Math.abs(hash % 360);
        return `hsl(${hue}, 70%, 60%)`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = {
            approved: { color: 'bg-green-500/10 text-green-700 border-green-200', icon: 'CheckCircle' },
            pending: { color: 'bg-amber-500/10 text-amber-700 border-amber-200', icon: 'Clock' },
            rejected: { color: 'bg-red-500/10 text-red-700 border-red-200', icon: 'XCircle' },
            draft: { color: 'bg-gray-500/10 text-gray-700 border-gray-200', icon: 'Edit' }
        };
        const config = statusConfig?.[status] || statusConfig?.pending;
        return (
            <span className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1 ${config.color}`}>
                <Icon name={config.icon} size={12} />
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const StatCard = ({ label, value, color = "blue" }) => {
        const colorClasses = {
            blue: "from-blue-50 to-blue-100/50 border-blue-200 text-blue-700",
            green: "from-green-50 to-green-100/50 border-green-200 text-green-700",
            amber: "from-amber-50 to-amber-100/50 border-amber-200 text-amber-700",
            purple: "from-purple-50 to-purple-100/50 border-purple-200 text-purple-700"
        };

        return (
            <div className={`bg-gradient-to-br rounded-lg border p-4 ${colorClasses[color]}`}>
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="text-sm font-medium opacity-80">{label}</div>
            </div>
        );
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
                <Dialog.Content className="fixed top-24 left-1/2 -translate-x-1/2 bg-background rounded-2xl shadow-2xl w-full max-w-4xl max-h-[85vh] overflow-hidden flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-background">
                        <div>
                            <Dialog.Title className="text-2xl font-bold text-gray-900">
                                Contributor Profile
                            </Dialog.Title>
                            <p className="text-gray-600 text-sm mt-1">
                                Detailed information and contributions
                            </p>
                        </div>
                        <Dialog.Close asChild>
                            <Button className="p-2 rounded-lg hover:text-white" variant="ghost2">
                                <Icon name="X" size={20} />
                            </Button>
                        </Dialog.Close>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center flex-1 py-16">
                            <div className="text-center">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                                <p className="text-gray-600">Loading contributor details...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-auto">
                            <div className="p-6">
                                {/* Profile Header */}
                                <div className="flex items-start gap-6 mb-8">
                                    <div
                                        className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg flex-shrink-0"
                                        style={{ backgroundColor: getColorFromName(contributor.name) }}
                                    >
                                        {getInitials(contributor.name)}
                                    </div>
                                    <div className="flex-1">
                                        <h2 className="text-3xl font-bold text-gray-900 mb-2">{contributor.name}</h2>
                                        <div className="flex flex-wrap gap-4 text-gray-600 mb-3">
                                            <div className="flex items-center gap-2">
                                                <Icon name="Mail" size={16} className="text-gray-400" />
                                                <span className="text-sm">{contributor.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Icon name="MapPin" size={16} className="text-gray-400" />
                                                <span className="text-sm">{contributor.location || "No location set"}</span>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {contributor.specialties.slice(0, 4).map((specialty, index) => (
                                                <span 
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded-full border border-gray-200"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                            {contributor.specialties.length > 4 && (
                                                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full">
                                                    +{contributor.specialties.length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                                    <StatCard label="Total Submissions" value={contributor.stats.total} color="blue" />
                                    <StatCard label="Approved" value={contributor.stats.approved} color="green" />
                                    <StatCard label="Pending Review" value={contributor.stats.pending} color="amber" />
                                    <StatCard label="Approval Rate" value={`${contributor.stats.approvalRate}%`} color="purple" />
                                </div>

                                {/* Contributions Section */}
                                <div>
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Recent Contributions ({contributor.contributions.length})
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm text-gray-500">
                                            <Icon name="Filter" size={16} />
                                            <span>Sorted by latest</span>
                                        </div>
                                    </div>

                                    <div className="space-y-4 max-h-96 overflow-y-auto">
                                        {contributor.contributions.map((contribution, index) => (
                                            <div key={index} className="bg-gray-50/50 rounded-xl p-4 border border-gray-200 hover:border-gray-300 transition-colors">
                                                <div className="flex items-start justify-between mb-3">
                                                    <div className="flex-1">
                                                        <h4 className="font-semibold text-gray-900 text-lg mb-2">
                                                            {contribution.name}
                                                        </h4>
                                                        <p className="text-gray-600 text-sm leading-relaxed">
                                                            {contribution.description || "No description provided for this recipe."}
                                                        </p>
                                                    </div>
                                                    {getStatusBadge(contribution.status)}
                                                </div>
                                                
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex items-center gap-1">
                                                            <Icon name="Calendar" size={14} />
                                                            <span>{new Date(contribution.created_at).toLocaleDateString('en-IN', { 
                                                                day: 'numeric', 
                                                                month: 'short', 
                                                                year: 'numeric' 
                                                            })}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Icon name="Clock" size={14} />
                                                            <span>{new Date(contribution.created_at).toLocaleTimeString('en-IN', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}</span>
                                                        </div>
                                                        {contribution.meal_type && (
                                                            <div className="flex items-center gap-1">
                                                                <Icon name="Utensils" size={14} />
                                                                <span className="font-medium text-gray-700">{contribution.meal_type}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {contributor.contributions.length === 0 && (
                                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
                                            <Icon name="FileText" size={48} className="text-gray-400 mx-auto mb-4" />
                                            <h4 className="text-lg font-semibold text-gray-900 mb-2">No Contributions Yet</h4>
                                            <p className="text-gray-600 max-w-md mx-auto">
                                                This contributor hasn't submitted any recipes to the platform yet.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Footer */}
                    <div className="border-t border-gray-200 bg-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Icon name="UserCheck" size={16} />
                                <span>Member since {contributor && new Date(contributor.contributions[0]?.created_at).getFullYear()}</span>
                            </div>
                        </div>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
};

export default ContributorProfileModal;