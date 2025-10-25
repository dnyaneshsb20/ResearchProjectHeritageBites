import React, { useEffect, useState } from "react";
import { supabase } from "../../../supabaseClient";
import { MapPin, Mail, User, Phone } from "lucide-react";

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
        .eq("role", "user");

      if (error) throw error;

      // Format users and handle profile array
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
          createdAt: user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A",
          gender: profile?.gender || "N/A",
          ageGroup: profile?.age_group || "N/A",
          activityLevel: profile?.activity_level || "N/A",
          mobile: profile?.mobile_number || "N/A",
        };
      });

      // newest first
      setUsers(formattedUsers.reverse());
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-semibold mb-6 text-gray-800">Users</h1>

      {users.length === 0 ? (
        <div className="text-center text-gray-500 py-10">
          No users found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-h-[75vh] overflow-y-auto pr-2">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-xl shadow border border-gray-200 p-5 hover:shadow-lg transition"
            >
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">{user.name}</h2>
              </div>

              <p className="flex items-center text-gray-600 text-sm mb-2">
                <Mail className="w-4 h-4 mr-2 text-gray-500" />
                {user.email}
              </p>

              <p className="flex items-center text-gray-600 text-sm mb-2">
                <Phone className="w-4 h-4 mr-2 text-gray-500" />
                {user.mobile}
              </p>

              <p className="flex items-center text-gray-600 text-sm mb-2">
                <MapPin className="w-4 h-4 mr-2 text-gray-500" />
                {user.location}
              </p>

              <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mt-3">
                <p>
                  <span className="font-medium">Gender:</span> {user.gender}
                </p>
                <p>
                  <span className="font-medium">Age:</span> {user.ageGroup}
                </p>
                <p>
                  <span className="font-medium">Activity:</span> {user.activityLevel}
                </p>
                <p>
                  <span className="font-medium">Joined:</span> {user.createdAt}
                </p>
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
              {users.filter((u) => u.activityLevel.toLowerCase() === "active").length}
            </p>
            <p className="text-gray-500">Active Users</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-yellow-600">
              {users.filter((u) => u.activityLevel.toLowerCase() === "moderate").length}
            </p>
            <p className="text-gray-500">Moderate Activity Users</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
