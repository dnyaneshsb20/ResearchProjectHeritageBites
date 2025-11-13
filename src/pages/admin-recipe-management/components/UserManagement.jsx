import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, User, Mail, Phone, Calendar, Activity, Users, Search, Filter, Eye } from "lucide-react";
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
        .eq("role", "user")
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
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
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
            <div className="text-3xl font-bold text-primary mb-2">{users.length}</div>
            <div className="text-sm font-medium text-muted-foreground">Total Users</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">
              {users.filter(u => u.role === 'user').length}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Regular Users</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {users.filter(u => u.role === 'admin').length}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Admins</div>
          </div>
          <div className="bg-card border border-border rounded-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">
              {users.filter(u => u.role === 'farmer').length}
            </div>
            <div className="text-sm font-medium text-muted-foreground">Farmers</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card rounded-lg border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    User
                  </th>
                  {/* <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Role
                  </th> */}
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Contact
                  </th>
                  {/* <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-foreground uppercase tracking-wider">
                    Activity Level
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
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30 transition-colors duration-150">
                    {/* User Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                          style={{ backgroundColor: getColorFromName(user.name) }}
                        >
                          {getInitials(user.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-lg font-semibold text-foreground truncate">
                            {user.name}
                          </p>
                          <p className="text-sm text-muted-foreground truncate mt-1">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <User className="w-3 h-3" />
                            <span>{user.gender}</span>
                            <span>•</span>
                            <span>{user.ageGroup}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Role */}
                    {/* <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(user.role)}`}>
                        {user.role}
                      </span>
                    </td> */}

                    {/* Contact */}
                    {/* Contact */}
                    <td className="px-6 py-4">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-2 text-sm">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          {/* Removed truncate and max-width to show full email */}
                          <span className="text-foreground">{user.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          {/* Mobile number already shown fully */}
                          <span className="text-foreground">{user.mobile}</span>
                        </div>
                      </div>
                    </td>

                    {/* Location */}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.location}</span>
                      </div>
                    </td> */}

                    {/* Activity Level */}
                    {/* <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Activity className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.activityLevel}</span>
                      </div>
                    </td> */}

                    {/* Joined Date */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground" />
                        <span className="text-foreground">{user.createdAt}</span>
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setSelectedUser(user)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground"
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
          {filteredUsers.length === 0 && (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {searchTerm || filterRole !== "all" ? "No users found" : "No users yet"}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchTerm || filterRole !== "all"
                  ? "Try adjusting your search or filter criteria"
                  : "Users will appear here once they register on the platform"
                }
              </p>
            </div>
          )}
        </div>
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