import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, User, Mail, Phone, Calendar, Activity, Users, Search, Filter } from "lucide-react";
import Button from "../../../components/ui/Button";
import UserProfileModal from "./UserProfileModal";

// Helper functions for initials and color
const getInitials = (name) => {
  if (!name) return "U";
  const names = name.split(" ");
  return names.length > 1
    ? `${names[0][0]}${names[1][0]}`
    : `${names[0][0]}`;
};

const getColorFromName = (name) => {
  if (!name) return "#6b7280";
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 70%, 50%)`;
  return color;
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  const fetchUsers = async () => {
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
          user_id,
          name,
          email,
          role,
          location,
          created_at,
          user_profile: user_profile(
            age_group,
            gender,
            activity_level,
            mobile_number
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedUsers = data.map((user) => {
        const profile = Array.isArray(user.user_profile)
          ? user.user_profile[0]
          : user.user_profile;

        return {
          id: user.user_id,
          name: user.name,
          email: user.email,
          role: user.role,
          location: user.location || "Not specified",
          createdAt: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "N/A",
          gender: profile?.gender || "Not specified",
          ageGroup: profile?.age_group || "Not specified",
          activityLevel: profile?.activity_level || "Not specified",
          mobile: profile?.mobile_number || "Not provided",
        };
      });

      setUsers(formattedUsers);
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMsg("Failed to fetch users. Please check your database and try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === "all" || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-purple-100 text-purple-800 border-purple-200",
      user: "bg-blue-100 text-blue-800 border-blue-200",
      farmer: "bg-green-100 text-green-800 border-green-200",
      moderator: "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[role] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <p className="text-muted-foreground">Loading user database...</p>
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
            <p className="text-lg font-medium mb-2">Error Loading Users</p>
            <p className="text-muted-foreground text-center">{errorMsg}</p>
            <Button onClick={fetchUsers} className="mt-4">
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
              <h1 className="text-3xl font-bold text-foreground mb-2">User Management</h1>
              <p className="text-muted-foreground">
                Manage and view all platform users ({users.length} total)
              </p>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search users..."
                  className="pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:border-primary focus:ring-1 focus:ring-primary"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="flex gap-4 mb-6 w-full">
            <div className="flex-1 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                  <p className="text-2xl font-bold text-foreground">{users.length}</p>
                </div>
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="flex-1 bg-card border border-border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Regular Users</p>
                  <p className="text-2xl font-bold text-foreground">
                    {users.filter(u => u.role === 'user').length}
                  </p>
                </div>
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Grid */}
        {filteredUsers.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-xl border border-border">
            <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {searchTerm || filterRole !== "all" ? "No users found" : "No users yet"}
            </h3>
            <p className="text-muted-foreground">
              {searchTerm || filterRole !== "all"
                ? "Try adjusting your search or filter criteria"
                : "Users will appear here once they register on the platform"
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                {/* Header with Avatar and Basic Info */}
                <div className="p-6 border-b border-border bg-gradient-to-r from-card to-card/80">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                        style={{ backgroundColor: getColorFromName(user.name) }}
                      >
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                          {user.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(user.role)}`}>
                            {user.role}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            <span className="truncate">{user.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* User Details */}
                <div className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">Email</p>
                        <p className="text-sm font-medium text-foreground truncate">{user.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">Mobile</p>
                        <p className="text-sm font-medium text-foreground">{user.mobile}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Activity className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">Activity Level</p>
                        <p className="text-sm font-medium text-foreground">{user.activityLevel}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Calendar className="w-4 h-4 text-primary" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">Joined</p>
                        <p className="text-sm font-medium text-foreground">{user.createdAt}</p>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-border">
                    <Button
                      variant="ghost2"
                      className="w-full justify-centers"
                      onClick={() => setSelectedUser(user)}
                    >
                      <User className="w-4 h-4 mr-2" />
                      View Full Profile
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* User Profile Modal */}
      {selectedUser && (
        <UserProfileModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
        />
      )}
    </div>
  );
};

export default UserManagement;