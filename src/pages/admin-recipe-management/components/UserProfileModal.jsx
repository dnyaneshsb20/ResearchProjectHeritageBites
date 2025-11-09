import React, { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, User, Calendar, ChefHat, Package } from "lucide-react";
import Button from "components/ui/Button";
import { supabase } from "../../../supabaseClient";
import CustomerOrdersTable from "./CustomerOrdersTable";

const UserProfileModal = ({ user, onClose }) => {
  const [activeTab, setActiveTab] = useState("Contributions");
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchContributions = async () => {
      if (!user?.id && !user?.user_id) return;
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("rec_contributions")
          .select("indg_recipe_id, name, status, created_at, image_url")
          .eq("created_by", user.id || user.user_id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setContributions(data || []);
      } catch (err) {
        console.error("Error fetching user contributions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [user]);

  const getStatusColor = (status) => {
    const colors = {
      approved: "bg-green-100 text-green-800 border-green-200",
      pending: "bg-amber-100 text-amber-800 border-amber-200",
      rejected: "bg-red-100 text-red-800 border-red-200",
      "changes requested": "bg-blue-100 text-blue-800 border-blue-200"
    };
    return colors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 pt-24">
      <div className="bg-card border border-border rounded-xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border bg-card/50">
          <div className="flex items-center gap-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-primary-foreground text-xl font-semibold border-4 border-primary/20"
              style={{
                backgroundColor:
                  typeof user?.name === "string"
                    ? `hsl(${[...user.name].reduce(
                      (h, c) => h + c.charCodeAt(0),
                      0
                    ) % 360
                    },70%,50%)`
                    : "#6b7280",
              }}
            >
              {user?.name
                ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()
                : "U"}
            </div>

            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {user?.name || "Unknown User"}
              </h2>
              <p className="text-muted-foreground flex items-center gap-1">
                <span className="capitalize">{user?.role || "User"}</span>
                {user?.createdAt && (
                  <>
                    <span>•</span>
                    <span>Joined {user.createdAt}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="hover:bg-accent"
            variant="ghost"
            size="icon"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* User Info Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Information */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="text-foreground font-medium break-all">
                      {user?.email || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Phone className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Mobile</p>
                    <p className="text-foreground font-medium">
                      {user?.mobile || "Not provided"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="text-foreground font-medium">
                      {user?.location || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Details */}
            <div className="bg-background rounded-lg border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                User Details
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium text-primary">AG</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Age Group</p>
                    <p className="text-foreground font-medium">
                      {user?.ageGroup || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <span className="text-sm font-medium text-primary">AL</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Activity Level</p>
                    <p className="text-foreground font-medium">
                      {user?.activityLevel || "Not specified"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Calendar className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Member Since</p>
                    <p className="text-foreground font-medium">
                      {user?.createdAt || "Unknown"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-t border-border">
          <div className="flex">
            {[
              { id: "Contributions", icon: ChefHat },
              { id: "Orders", icon: Package }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary bg-primary/5"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:bg-primary hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.id}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 bg-background min-h-[200px]">
            {activeTab === "Contributions" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Recipe Contributions
                </h3>
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                    Loading contributions...
                  </div>
                ) : contributions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No recipe contributions yet.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {contributions.map((contribution) => (
                      <div
                        key={contribution.indg_recipe_id}
                        className="bg-card border border-border rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
                      >
                        <div className="flex">
                          {contribution.image_url ? (
                            <img
                              src={contribution.image_url}
                              alt={contribution.name}
                              className="w-24 h-24 object-cover flex-shrink-0"
                            />
                          ) : (
                            <div className="w-24 h-24 bg-muted flex items-center justify-center flex-shrink-0">
                              <ChefHat className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                          <div className="p-4 flex-1">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                              {contribution.name}
                            </h4>
                            <div className="flex items-center justify-between mt-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(contribution.status)}`}>
                                {contribution.status}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(contribution.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "Orders" && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Order History
                </h3>
                <CustomerOrdersTable userId={user?.id || user?.user_id} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;