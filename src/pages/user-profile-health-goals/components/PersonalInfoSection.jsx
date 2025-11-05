import React, { useState, useEffect } from "react";
import Icon from "../../../components/AppIcon";
import Image from "../../../components/AppImage";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";
import Select from "../../../components/ui/Select";
import { supabase } from "../../../supabaseClient";
import { User } from "lucide-react";
import { toast } from "react-hot-toast";

const PersonalInfoSection = ({ isExpanded, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
 const [formData, setFormData] = useState({
  name: "",
  email: "",
  phone: "",
  location: "",
  height: "",
  weight: "",
  ageGroup: "",
  gender: "",
  activityLevel: "",
  address: "",
  city: "",
  pincode: "",
  state_id: "",
});

  const [dbUser, setDbUser] = useState({});
  // ADD near top of component
  const [states, setStates] = useState([]);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer-not-to-say", label: "Prefer not to say" },
  ];

  const ageGroupOptions = [
    { value: "18-25", label: "18-25 years" },
    { value: "26-35", label: "26-35 years" },
    { value: "36-45", label: "36-45 years" },
    { value: "46-55", label: "46-55 years" },
    { value: "56-65", label: "56-65 years" },
    { value: "65+", label: "65+ years" },
  ];

  const activityLevelOptions = [
    { value: "sedentary", label: "Sedentary (Little to no exercise)" },
    { value: "lightly-active", label: "Lightly Active (1–3 days/week)" },
    { value: "moderately-active", label: "Moderately Active (3–5 days/week)" },
    { value: "very-active", label: "Very Active (6–7 days/week)" },
    { value: "extremely-active", label: "Extremely Active (hard exercise/physical job)" },
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);

      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) throw authError;

      const userId = authData.user.id;

      // Update users table
      const { error: userError } = await supabase
        .from("users")
        .update({
          name: formData.name,
          email: formData.email,
          location: formData.location,
        })
        .eq("user_id", userId);

      if (userError) throw userError;

      // Upsert user_profile table
      const { error: profileError } = await supabase
        .from("user_profile")
        .upsert(
          {
            user_id: userId,
            age_group: formData.ageGroup || null,
            gender: formData.gender || null,
            height_cm: formData.height || null,
            weight_kg: formData.weight || null,
            activity_level: formData.activityLevel || null,
            mobile_number: formData.phone || null, // ✅ mobile number
            address_line: formData.address || null,
            city: formData.city || null,
            pincode: formData.pincode || null,
            state_id: formData.state_id || null,
          },
          { onConflict: "user_id" }
        );

      if (profileError) throw profileError;

      // ✅ Update local state and reset editing
      setDbUser({ ...formData });
      setIsEditing(false);
      toast.success("Profile updated successfully!", { duration: 3000 }); // ✅ success popup
    } catch (err) {
      console.error("Error saving profile:", err);
      toast.error("Failed to update profile. Please try again.", { duration: 3000 });
    } finally {
      setIsSaving(false); // ✅ reset button
    }
  };

  const handleCancel = () => {
    setFormData(dbUser);
    setIsEditing(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user) return;

        const userId = authData.user.id;

        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("name, email, location, created_at")
          .eq("user_id", userId)
          .single();

        if (userError) throw userError;

        const { data: profileData, error: profileError } = await supabase
          .from("user_profile")
          .select("age_group, gender, height_cm, weight_kg, activity_level, mobile_number, address_line, city, pincode, state_id")
          .eq("user_id", userId)
          .single();

        if (profileError && profileError.code !== "PGRST116") throw profileError;

        const combinedData = {
          name: userData.name ?? "",
          email: userData.email ?? "",
          location: userData.location ?? "",
          joinDate: userData.created_at ?? "",
          ageGroup: profileData?.age_group ?? "",
          gender: profileData?.gender ?? "",
          height: profileData?.height_cm ?? "",
          weight: profileData?.weight_kg ?? "",
          activityLevel: profileData?.activity_level ?? "",
          phone: profileData?.mobile_number ?? "", // ✅ mobile number
          address: profileData?.address_line ?? "",
          city: profileData?.city ?? "",
          pincode: profileData?.pincode ?? "",
          state_id: profileData?.state_id ?? "",
        };

        setDbUser(combinedData);
        setFormData(combinedData);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUserData();
  }, []);
  // ✅ Fetch list of states once
  useEffect(() => {
    const fetchStates = async () => {
      const { data, error } = await supabase
        .from('states')
        .select('state_id, state_name')
        .order('state_name', { ascending: true });

      if (error) console.error('Error fetching states:', error);
      else setStates(data);
    };
    fetchStates();
  }, []);
  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div className="flex items-center justify-between p-6 cursor-pointer" onClick={onToggle}>
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-foreground">
              Personal Information
            </h3>
            <p className="text-sm text-muted-foreground">
              Basic details for personalized recommendations
            </p>
          </div>
        </div>
        <Icon name={isExpanded ? "ChevronUp" : "ChevronDown"} size={20} className="text-muted-foreground" />
      </div>

      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" type="text" value={formData.name|| ""} onChange={(e) => handleInputChange("name", e.target.value)} disabled required />
              <Input label="Email Address" type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} disabled required />
              <Input label="Phone Number" type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} disabled={!isEditing} placeholder="+91 XXXXX XXXXX" />
              <Select label="Gender" options={genderOptions} value={formData.gender} onChange={(val) => handleInputChange("gender", val)} disabled={!isEditing} />
              <Select label="Age Group" options={ageGroupOptions} value={formData.ageGroup} onChange={(val) => handleInputChange("ageGroup", val)} disabled={!isEditing} />
              <Input label="Location" type="text" value={formData.location} onChange={(e) => handleInputChange("location", e.target.value)} disabled={!isEditing} />
              <Input label="Height (cm)" type="number" value={formData.height} onChange={(e) => handleInputChange("height", e.target.value)} disabled={!isEditing} />
              <Input label="Weight (kg)" type="number" value={formData.weight} onChange={(e) => handleInputChange("weight", e.target.value)} disabled={!isEditing} />
              <div className="md:col-span-2">
                <Select label="Activity Level" options={activityLevelOptions} value={formData.activityLevel} onChange={(val) => handleInputChange("activityLevel", val)} disabled={!isEditing} />
              </div>
              <Input label="Address Line" type="text" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} disabled={!isEditing} />
              <Input label="City" type="text" value={formData.city} onChange={(e) => handleInputChange("city", e.target.value)} disabled={!isEditing} />
              <Input label="Pincode" type="text" value={formData.pincode} onChange={(e) => handleInputChange("pincode", e.target.value)} disabled={!isEditing} />
              <Select
                label="State"
                options={states.map((state) => ({
                  value: state.state_id,
                  label: state.state_name,
                }))}
                value={formData.state_id}
                onChange={(val) => handleInputChange("state_id", val)}
                disabled={!isEditing}
              />

            </div>

            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                  <Button variant="default" onClick={handleSave} disabled={isSaving}>{isSaving ? "Saving..." : "Save Changes"}</Button>
                </>
              ) : (
                <Button variant="ghost2" onClick={() => setIsEditing(true)}>Edit Profile</Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;
