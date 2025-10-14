// src/pages/farmer-dashboard/components/FarmerProfileSection.jsx
import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import { supabase } from '../../../supabaseClient';
import { User } from 'lucide-react';

const FarmerProfileSection = ({ isExpanded, onToggle }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [dbUser, setDbUser] = useState(null);

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
        .from('users')
        .update({
          name: formData.name,
          email: formData.email,
          location: formData.location
        })
        .eq('user_id', userId);
      if (userError) throw userError;

      // Upsert farmers table
      const { error: farmerError } = await supabase
        .from('farmers')
        .upsert({
          user_id: userId,
          bio: formData.bio || null,
          certifications: formData.certifications || null,
          contact_info: formData.contactInfo || null
        }, { onConflict: 'user_id' });
      if (farmerError) throw farmerError;

      setIsEditing(false);
      setDbUser(formData);
    } catch (err) {
      console.error('Error saving farmer profile:', err);
    }
  };

  const handleCancel = () => {
    if (dbUser) setFormData(dbUser);
    setIsEditing(false);
  };

  useEffect(() => {
    let mounted = true;

    const fetchProfile = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        // Fetch users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, email, location, created_at')
          .eq('user_id', user.id)
          .single();
        if (userError) throw userError;

        // Fetch farmers table
        const { data: farmerData, error: farmerError } = await supabase
          .from('farmers')
          .select('bio, certifications, contact_info')
          .eq('user_id', user.id)
          .single();
        if (farmerError && farmerError.code !== 'PGRST116') throw farmerError;

        if (mounted) {
          const mergedData = {
            name: userData.name,
            email: userData.email,
            location: userData.location || '',
            joinDate: userData.created_at,
            bio: farmerData?.bio || '',
            certifications: farmerData?.certifications || '',
            contactInfo: farmerData?.contact_info || ''
          };
          setFormData(mergedData);
          setDbUser(mergedData);
        }
      } catch (err) {
        console.error('Error fetching farmer profile:', err);
      }
    };

    fetchProfile();

    return () => { mounted = false; };
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
              Profile Information
            </h3>
            <p className="text-sm text-muted-foreground">
              Basic details about your farmer profile
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
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Full Name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              disabled={!isEditing}
              required
            />
            <Input
              label="Location"
              type="text"
              value={formData.location}
              onChange={(e) => handleInputChange('location', e.target.value)}
              disabled={!isEditing}
              placeholder="City, State"
            />
            <Input
              label="Contact Info"
              type="text"
              value={formData.contactInfo}
              onChange={(e) => handleInputChange('contactInfo', e.target.value)}
              disabled={!isEditing}
              placeholder="Phone or email"
            />
            <Input
              label="Bio"
              type="text"
              value={formData.bio}
              onChange={(e) => handleInputChange('bio', e.target.value)}
              disabled={!isEditing}
              placeholder="Write something about yourself"
              className="md:col-span-2"
            />
            <Input
              label="Certifications"
              type="text"
              value={formData.certifications}
              onChange={(e) => handleInputChange('certifications', e.target.value)}
              disabled={!isEditing}
              placeholder="List your certifications"
              className="md:col-span-2"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                <Button variant="default" onClick={handleSave}>Save Changes</Button>
              </>
            ) : (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerProfileSection;
