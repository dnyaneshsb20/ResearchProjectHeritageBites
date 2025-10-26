import React, { useState, useEffect } from "react";
import { X, Mail, Phone, MapPin, User, Calendar } from "lucide-react";
import Button from "components/ui/Button";
import { supabase } from "../../../supabaseClient";

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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white mt-16 max-h-[85vh] w-full max-w-6xl rounded-lg shadow-lg overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between mt-5 ml-3 items-center p-4 border-b">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-lg font-semibold"
              style={{
                backgroundColor:
                  typeof user?.name === "string"
                    ? `hsl(${
                        [...user.name].reduce(
                          (h, c) => h + c.charCodeAt(0),
                          0
                        ) % 360
                      },60%,55%)`
                    : "#9CA3AF",
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
              <h2 className="text-2xl font-semibold text-gray-800">
                {user?.name || "Unknown User"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {user?.role || "User"}
              </p>
            </div>
          </div>

          <Button
            onClick={onClose}
            className="text-gray-500 p-2 rounded transition -mt-10"
            aria-label="Close profile"
            variant="outline"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Top info section */}
        <div className="p-6">
          <div className="bg-gray-50 rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-800 font-medium break-words">
                      {user?.email || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Mobile</p>
                    <p className="text-gray-800 font-medium">
                      {user?.mobile || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="text-gray-800 font-medium">
                      {user?.location || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <User className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Age Group</p>
                    <p className="text-gray-800 font-medium">
                      {user?.ageGroup || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-sm text-sm font-medium bg-orange-100 text-orange-600 mt-1">
                    ⚡
                  </span>
                  <div>
                    <p className="text-sm text-gray-500">Activity Level</p>
                    <p className="text-gray-800 font-medium">
                      {user?.activityLevel || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-indigo-600 mt-1" />
                  <div>
                    <p className="text-sm text-gray-500">Joined</p>
                    <p className="text-gray-800 font-medium">
                      {user?.createdAt || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-t">
          <div className="flex">
            {["Contributions", "Orders"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 text-center font-medium ${
                  activeTab === tab
                    ? "border-b-2 border-orange-500 text-orange-600"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="p-6 min-h-[160px]">
            {activeTab === "Contributions" && (
              <>
                {loading ? (
                  <div className="text-gray-500 text-center">
                    Loading contributions...
                  </div>
                ) : contributions.length === 0 ? (
                  <div className="text-gray-500 text-center">
                    No contributions yet.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {contributions.map((c) => (
                      <div
                        key={c.indg_recipe_id}
                        className="p-4 border rounded-lg shadow-sm hover:shadow-md transition bg-white"
                      >
                        {c.image_url ? (
                          <img
                            src={c.image_url}
                            alt={c.name}
                            className="w-full h-40 object-cover rounded-md mb-3"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-100 rounded-md mb-3 flex items-center justify-center text-gray-400">
                            No Image
                          </div>
                        )}
                        <h4 className="text-lg font-semibold">{c.name}</h4>
                        <p className="text-sm text-gray-500 mt-1">
                          Status:{" "}
                          <span
                            className={`font-medium ${
                              c.status === "approved"
                                ? "text-green-600"
                                : c.status === "pending"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {c.status}
                          </span>
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(c.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeTab === "Orders" && (
              <div className="text-gray-500 text-center">No orders yet.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
