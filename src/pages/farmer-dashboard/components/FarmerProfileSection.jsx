import React, { useState, useEffect } from "react";
import { User } from "lucide-react";
import { supabase } from "../../../supabaseClient";
import Input from "../../../components/ui/Input";
import Button from "../../../components/ui/Button";
import Icon from "../../../components/AppIcon";
import Header from '../../../components/ui/Header';
import Footer from '../../dashboard/components/Footer';

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

      // Update users table
      await supabase.from("users").update({
        name: formData.name,
        email: formData.email,
        location: formData.location,
      }).eq("user_id", userId);

      // Upsert farmers table
      await supabase.from("farmers").upsert({
        user_id: userId,
        bio: formData.bio || null,
        certifications: formData.certifications || null,
        contact_info: formData.contactInfo || null,
      }, { onConflict: "user_id" });

      setIsEditing(false);
      setDbUser(formData);
    } catch (error) {
      console.error("Error saving farmer profile:", error);
    }
  };

  const handleCancel = () => {
    if (dbUser) setFormData(dbUser);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const { data: userData } = await supabase
          .from("users")
          .select("name, email, location, created_at")
          .eq("user_id", user.id)
          .single();

        const { data: farmerData } = await supabase
          .from("farmers")
          .select("bio, certifications, contact_info")
          .eq("user_id", user.id)
          .single();

        const mergedData = {
          name: userData?.name || "",
          email: userData?.email || "",
          location: userData?.location || "",
          joinDate: userData?.created_at,
          bio: farmerData?.bio || "",
          certifications: farmerData?.certifications || "",
          contactInfo: farmerData?.contact_info || "",
        };
        setFormData(mergedData);
        setDbUser(mergedData);
      } catch (error) {
        console.error("Error fetching farmer profile:", error);
      }
    };

    fetchProfile();
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
                Personalize your culinary journey with traditional Indian recipes
              </p>
            </div>
          </div>
      {/* Profile Completion */}
      <div className="bg-card rounded-lg border border-border p-4 shadow-warm">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-body font-medium text-foreground">
            Profile Completion
          </h3>
          <span className={`font-body font-semibold ${getCompletionColor(profileCompleteness)}`}>
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
          Complete your profile to get better recipe recommendations tailored to your taste and health goals.
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
                    <div className="w-full h-full flex items-center justify-center bg-gray-200 rounded-full">
                      <User className="w-10 h-10 text-gray-500" />
                    </div>
                  )}
                </div>
          <div>
            <h4 className="font-medium text-foreground">{formData?.name}</h4>
            <p className="text-sm text-muted-foreground">
              Member since{" "}
              {formData?.joinDate
                ? new Date(formData.joinDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
        </div>

        {/* Two-Column Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            value={formData.name}
            onChange={(e) => handleInputChange("name", e.target.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Email Address"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            disabled={!isEditing}
            required
          />
          <Input
            label="Contact Info"
            value={formData.contactInfo}
            onChange={(e) => handleInputChange("contactInfo", e.target.value)}
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
            onChange={(e) => handleInputChange("certifications", e.target.value)}
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
              <Button onClick={handleSave}>Save Changes</Button>
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
