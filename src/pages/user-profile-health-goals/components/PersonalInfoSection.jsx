import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { supabase } from '../../../supabaseClient';
import {User} from 'lucide-react'

const PersonalInfoSection = ({ isExpanded, onToggle, userData, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userData || {});
  const [dbUser, setDbUser] = useState(null);

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  const ageGroupOptions = [
    { value: '18-25', label: '18-25 years' },
    { value: '26-35', label: '26-35 years' },
    { value: '36-45', label: '36-45 years' },
    { value: '46-55', label: '46-55 years' },
    { value: '56-65', label: '56-65 years' },
    { value: '65+', label: '65+ years' }
  ];

  const activityLevelOptions = [
    { value: 'sedentary', label: 'Sedentary (Little to no exercise)' },
    { value: 'lightly-active', label: 'Lightly Active (Light exercise 1-3 days/week)' },
    { value: 'moderately-active', label: 'Moderately Active (Moderate exercise 3-5 days/week)' },
    { value: 'very-active', label: 'Very Active (Hard exercise 6-7 days/week)' },
    { value: 'extremely-active', label: 'Extremely Active (Very hard exercise, physical job)' }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError || !authData?.user) return;

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
      if (userError) return;

      // Upsert user_profile table
      const { error: profileError } = await supabase
        .from("user_profile")
        .upsert({
          user_id: userId,
          age_group: formData.ageGroup || null,
          gender: formData.gender || null,
          height_cm: formData.height || null,
          weight_kg: formData.weight || null,
          activity_level: formData.activityLevel || null,
          preferences: formData.preferences || null,
          health_goals: formData.healthGoals || null,
        }, { onConflict: "user_id" });
      if (profileError) return;

      // Call parent update
      onUpdate(formData);

      // ✅ Update profile completion after saving
      if (typeof onUpdateCompletion === "function") {
        onUpdateCompletion(); // call a function in parent to recalc completion
      }

      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCancel = () => {
    // revert to the latest fetched DB data (name + email) merged with original userData
    if (dbUser) {
      setFormData(prev => ({
        ...userData,
        // override name/email from dbUser
        name: dbUser.name,
        email: dbUser.email
      }));
    } else {
      setFormData(userData);
    }
    setIsEditing(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchSignedInUser = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;

        if (!user) return;

        // Fetch from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, email, location, created_at')
          .eq('user_id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          return;
        }

        // Fetch from user_profile table
        const { data: profileData, error: profileError } = await supabase
          .from('user_profile')
          .select('age_group, gender, height_cm, weight_kg, activity_level, preferences, health_goals')
          .eq('user_id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 = no row found
          console.error('Error fetching user_profile data:', profileError);
          return;
        }

        if (mounted) {
          setDbUser(userData);
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            location: userData.location || '',
            joinDate: userData.created_at,
            ageGroup: profileData?.age_group || '',
            gender: profileData?.gender || '',
            height: profileData?.height_cm || '',
            weight: profileData?.weight_kg || '',
            activityLevel: profileData?.activity_level || '',
            preferences: profileData?.preferences || null,
            healthGoals: profileData?.health_goals || null,
          });
        }

      } catch (err) {
        console.error('Unexpected error fetching data:', err);
      }
    };

    fetchSignedInUser();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="bg-card rounded-lg border border-border shadow-warm">
      <div
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={onToggle}
      >
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
        <Icon
          name={isExpanded ? "ChevronUp" : "ChevronDown"}
          size={20}
          className="text-muted-foreground"
        />
      </div>
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-border">
          <div className="mt-6">
            {/* Profile Picture */}
            <div className="flex items-center space-x-4 mb-6">
              <div className="relative">
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
                {isEditing && (
                  <Button
                    variant="outline"
                    size="icon"
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-background"
                  >
                    <Icon name="Camera" size={14} />
                  </Button>
                )}
              </div>
              <div>
                <h4 className="font-body font-medium text-foreground">
                  {formData?.name}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Member since {formData?.joinDate ? new Date(formData.joinDate).toLocaleDateString() : ''}
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Full Name"
                type="text"
                value={formData?.name}
                onChange={(e) => handleInputChange('name', e?.target?.value)}
                disabled={!isEditing}
                required
              />

              <Input
                label="Email Address"
                type="email"
                value={formData?.email}
                onChange={(e) => handleInputChange('email', e?.target?.value)}
                disabled={!isEditing}
                required
              />

              <Input
                label="Phone Number"
                type="tel"
                value={formData?.phone}
                onChange={(e) => handleInputChange('phone', e?.target?.value)}
                disabled={!isEditing}
                placeholder="+91 XXXXX XXXXX"
              />

              <Select
                label="Gender"
                options={genderOptions}
                value={formData?.gender}
                onChange={(value) => handleInputChange('gender', value)}
                disabled={!isEditing}
              />

              <Select
                label="Age Group"
                options={ageGroupOptions}
                value={formData?.ageGroup}
                onChange={(value) => handleInputChange('ageGroup', value)}
                disabled={!isEditing}
                required
              />

              <Input
                label="Location"
                type="text"
                value={formData?.location}
                onChange={(e) => handleInputChange('location', e?.target?.value)}
                disabled={!isEditing}
                placeholder="City, State"
              />

              <Input
                label="Height (cm)"
                type="number"
                value={formData?.height}
                onChange={(e) => handleInputChange('height', e?.target?.value)}
                disabled={!isEditing}
                min="100"
                max="250"
              />

              <Input
                label="Weight (kg)"
                type="number"
                value={formData?.weight}
                onChange={(e) => handleInputChange('weight', e?.target?.value)}
                disabled={!isEditing}
                min="30"
                max="200"
              />

              <div className="md:col-span-2">
                <Select
                  label="Activity Level"
                  options={activityLevelOptions}
                  value={formData?.activityLevel}
                  onChange={(value) => handleInputChange('activityLevel', value)}
                  disabled={!isEditing}
                  description="This helps us calculate your daily calorie needs"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
              {isEditing ? (
                <>
                  <Button variant="outline" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button variant="default" onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => setIsEditing(true)}
                  iconName="Edit"
                  iconPosition="left"
                >
                  Edit Profile
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalInfoSection;