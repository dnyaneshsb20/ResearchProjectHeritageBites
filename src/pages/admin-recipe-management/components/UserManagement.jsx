import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, Mail, User, Phone } from "lucide-react";
import Button from "../../../components/ui/Button"; // assuming you have this like contributors
import Icon from "../../../components/AppIcon"; // for consistency if needed

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

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

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
        .order("name", { ascending: false });;

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
          location: user.location || "N/A",
          createdAt: user.created_at
            ? new Date(user.created_at).toLocaleDateString()
            : "N/A",
          gender: profile?.gender || "N/A",
          ageGroup: profile?.age_group || "N/A",
          activityLevel: profile?.activity_level || "N/A",
          mobile: profile?.mobile_number || "N/A",
        };
      });

      setUsers(formattedUsers.reverse());
    } catch (err) {
      console.error("Error fetching users:", err);
      setErrorMsg(
        "Failed to fetch users. Please check your database and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        Loading users...
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex justify-center items-center h-64 text-red-500">
        {errorMsg}
      </div>
    );
  }

  return (
    <div className="p-6 bg-orange-20 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Users</h1>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-10">No users found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-card bg-white rounded-lg border border-border p-6 hover:shadow-warm-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg"
                    style={{ backgroundColor: getColorFromName(user.name) }}
                  >
                    {getInitials(user.name)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {user.name}
                    </h3>
                    <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{user.location}</span>
                    </div>
                  </div>
                </div>
                {/* Optional status badge */}
              </div>

              {/* Stats */}
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="text-sm font-medium text-foreground">
                    {user.email}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Mobile</span>
                  <span className="text-sm font-medium text-success">
                    {user.mobile}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Gender</span>
                  <span className="text-sm font-medium text-foreground">
                    {user.gender}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Age Group</span>
                  <span className="text-sm font-medium text-foreground">
                    {user.ageGroup}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Activity Level
                  </span>
                  <span className="text-sm font-medium text-foreground">
                    {user.activityLevel}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Joined</span>
                  <span className="text-sm text-muted-foreground">
                    {user.createdAt}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost2"
                  size="sm"
                  className="flex-1"
                  onClick={() => alert(`View profile of ${user.name}`)}
                >
                  <User className="w-4 h-4" />
                  <span className="ml-1">View Profile</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Summary Section */}
      <div className="mt-10 bg-white p-6 rounded-xl shadow border border-gray-100">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
            <p className="text-gray-500">Total Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-green-600">
              {users.filter((u) => u.activityLevel.toLowerCase() === "active")
                .length}
            </p>
            <p className="text-gray-500">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-600">
              {users.filter((u) => u.activityLevel.toLowerCase() === "moderate")
                .length}
            </p>
            <p className="text-gray-500">Moderate Activity Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
