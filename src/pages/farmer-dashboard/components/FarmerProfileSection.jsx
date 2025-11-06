import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import Header from "../../../components/ui/Header";
import Footer from "../../dashboard/components/Footer";
import toast from "react-hot-toast";

const FarmerProfileSection = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [dbUser, setDbUser] = useState(null);
  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const getCompletionColor = (percent) => {
    if (percent < 40) return "text-red-500";
    if (percent < 70) return "text-yellow-500";
    return "text-green-500";
  };

  const handleSave = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const userId = user.id;

      // ✅ Check if farmer already exists
      const { data: existingFarmer } = await supabase
        .from("farmers")
        .select("farmer_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (existingFarmer) {
        // ✅ Update existing record
        const { error } = await supabase
          .from("farmers")
          .update({
            bio: formData.bio || null,
            certifications: formData.certifications || null,
            contact_info: formData.contactInfo || null,
            location: formData.location || null,
          })
          .eq("user_id", userId);
        if (error) throw error;
      } else {
        // ✅ Insert new record
        const { error } = await supabase.from("farmers").insert({
          user_id: userId,
          bio: formData.bio || null,
          certifications: formData.certifications || null,
          contact_info: formData.contactInfo || null,
          location: formData.location || null,
        });
        if (error) throw error;
      }

      setIsEditing(false);
      setDbUser(formData);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving farmer profile:", error);
      toast.error("Error saving profile. Please try again.");
    }
  };

  const handleCancel = () => {
    if (dbUser) setFormData(dbUser);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchFarmerProfile = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const userId = user.id;

        // ✅ Fetch name & email from users table
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, email, created_at")
          .eq("user_id", userId)
          .single();

        if (userError) console.warn("User fetch warning:", userError);

        // ✅ Fetch farmer details (including location)
        const { data: farmerData, error: farmerError } = await supabase
          .from("farmers")
          .select("bio, certifications, contact_info, location")
          .eq("user_id", userId)
          .maybeSingle();

        if (farmerError) console.warn("Farmer fetch warning:", farmerError);

        // ✅ Merge both
        const mergedData = {
          name: userData?.name || "",
          email: userData?.email || "",
          bio: farmerData?.bio || "",
          created_at: userData?.created_at || null,
          certifications: farmerData?.certifications || "",
          contactInfo: farmerData?.contact_info || "",
          location: farmerData?.location || "",
        };

        setFormData(mergedData);
        setDbUser(mergedData);
      } catch (error) {
        console.error("Error fetching farmer profile:", error);
      }
    };

    fetchFarmerProfile();
  }, []);

  useEffect(() => {
    const fields = [
      "name",
      "email",
      "location",
      "bio",
      "certifications",
      "contactInfo",
    ];
    const filled = fields.filter((f) => formData[f]?.trim()).length;
    setProfileCompleteness(Math.round((filled / fields.length) * 100));
  }, [formData]);

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
    return `hsl(${hue}, 70%, 60%)`; // pastel color tone
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={24} className="text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-heading font-bold text-foreground">
              Profile & Health Goals
            </h1>
            <p className="text-muted-foreground">
              Manage your farm profile and connect with food enthusiasts across India
            </p>
          </div>
        </div>

        {/* Profile Completion */}
        <div className="bg-card rounded-lg border border-border p-4 shadow-warm">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-body font-medium text-foreground">
              Profile Completion
            </h3>
            <span
              className={`font-body font-semibold ${getCompletionColor(
                profileCompleteness
              )}`}
            >
              {profileCompleteness}%
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-2">
            <div
              className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-500"
              style={{ width: `${profileCompleteness}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Complete your profile to get better recipe recommendations tailored
            to your taste and health goals.
          </p>
        </div>

        {/* Profile Card */}
        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>

          {/* Avatar and Member Info */}
          <div className="flex items-center gap-4 mb-6">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-muted">
              {formData?.profilePicture ? (
                <Image
                  src={formData.profilePicture}
                  alt="Profile Picture"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-semibold shadow-md"
                  style={{
                    backgroundColor: getColorFromName(formData.name),
                    border: "3px solid #fff",
                  }}
                >
                  {getInitials(formData.name)}
                </div>
              )}
            </div>
            <div>
              <h4 className="font-medium text-foreground">{formData?.name}</h4>
              <p className="text-sm text-muted-foreground">
                Member since{" "}
                {formData?.created_at
                  ? new Date(formData.created_at).toLocaleDateString()
                  : "N/A"}
              </p>
            </div>
          </div>

          {/* Two-Column Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              value={formData.name}
              disabled
              required
            />
            <Input
              label="Email Address"
              value={formData.email}
              disabled
              required
            />
            <Input
              label="Contact Info"
              value={formData.contactInfo}
              onChange={(e) =>
                handleInputChange("contactInfo", e.target.value)
              }
              disabled={!isEditing}
            />
            <Input
              label="Location"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              disabled={!isEditing}
            />
            <Input
              label="Bio"
              value={formData.bio}
              onChange={(e) => handleInputChange("bio", e.target.value)}
              disabled={!isEditing}
              className="md:col-span-2"
            />
            <Input
              label="Certifications"
              value={formData.certifications}
              onChange={(e) =>
                handleInputChange("certifications", e.target.value)
              }
              disabled={!isEditing}
              className="md:col-span-2"
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  Cancel
                </Button>
                <Button onClick={handleSave}>Update</Button>
              </>
            ) : (
              <Button
                variant="outline"
                iconName="Edit"
                iconPosition="left"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FarmerProfileSection;
