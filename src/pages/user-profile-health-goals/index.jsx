import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PersonalInfoSection from './components/PersonalInfoSection';
import HealthGoalsSection from './components/HealthGoalsSection';
import DietaryRestrictionsSection from './components/DietaryRestrictionsSection';
import TastePreferencesSection from './components/TastePreferencesSection';
import RegionalFavoritesSection from './components/RegionalFavoritesSection';
import RecipeHistorySection from './components/RecipeHistorySection';
import AchievementBadgesSection from './components/AchievementBadgesSection';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Footer from '../dashboard/components/Footer';
import { supabase } from '../../supabaseClient';
import jsPDF from "jspdf";


const UserProfileHealthGoals = () => {
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    healthGoals: false,
    dietaryRestrictions: false,
    tastePreferences: false,
    regionalFavorites: false,
    recipeHistory: false,
    achievements: false
  });

  const [userData, setUserData] = useState({
  });

  const [healthGoals, setHealthGoals] = useState([
    'weight-loss',
    'diabetes-friendly',
    'heart-health'
  ]);

  const [dietaryRestrictions, setDietaryRestrictions] = useState([
    'vegetarian',
    'low-sodium'
  ]);

  const [tastePreferences, setTastePreferences] = useState({
    'heat-level': 3,
    'sweetness': 2,
    'sourness': 3,
    'saltiness': 2,
    favoriteIngredients: ['ginger', 'turmeric', 'cumin', 'coriander', 'coconut']
  });

  const [regionalFavorites, setRegionalFavorites] = useState([
    'maharashtra',
    'gujarat',
    'punjab'
  ]);

  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const calculateProfileCompletion = (userData, profileData) => {
    // Each Boolean check corresponds to one field
    const checks = [
      !!userData?.name,
      !!userData?.email,
      !!profileData?.age_group,
      !!profileData?.gender,
      !!profileData?.height_cm,
      !!profileData?.weight_kg,
      !!profileData?.activity_level,
      !!userData?.location,          // Optional: include location
    ];

    const completed = checks.filter(Boolean).length;
    const total = checks.length;

    return Math.round((completed / total) * 100);
  };


  const updateProfileCompletion = async () => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      // Fetch latest user and profile data
      const { data: userData } = await supabase.from('users').select('*').eq('user_id', user.id).single();
      const { data: profileData } = await supabase.from('user_profile').select('*').eq('user_id', user.id).single();

      const newCompletion = calculateProfileCompletion(userData, profileData);
      setProfileCompleteness(newCompletion);

    } catch (err) {
      console.error('Error updating completion:', err);
    }
  };

  // Fetch user data and calculate initial profile completeness
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        // Fetch from users table
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, email, created_at, location')
          .eq('user_id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user:', userError);
          return;
        }

        // Fetch from user_profile table
        const { data: profileData, error: profileError } = await supabase
          .from('user_profile')
          .select('age_group, gender, height_cm, weight_kg, activity_level')
          .eq('user_id', user.id)
          .single();

        if (profileError) {
          console.error('Error fetching profile:', profileError);
        }

        // Combine both into one object
        setUserData({
          name: userData?.name || '',
          email: userData?.email || '',
          location: userData?.location || '',
          joinDate: userData?.created_at || '',
          ageGroup: profileData?.age_group || '',
          gender: profileData?.gender || '',
          height: profileData?.height_cm || '',
          weight: profileData?.weight_kg || '',
          activityLevel: profileData?.activity_level || '',
        });

        // Calculate profile completion AFTER fetching both tables
        const initialCompletion = calculateProfileCompletion(userData, profileData);
        setProfileCompleteness(initialCompletion);

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchUserData();
  }, []);

  const toggleSection = (sectionKey) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionKey]: !prev?.[sectionKey]
    }));
  };

  const handleUserDataUpdate = (newData) => {
    setUserData(newData);

    // instantly calculate completion without re-fetching
    const newCompletion = calculateProfileCompletion(newData, currentProfileData);
    setProfileCompleteness(newCompletion);
  };

  const handleHealthGoalsUpdate = (newGoals) => {
    setHealthGoals(newGoals);
    updateProfileCompletion();
  };

  const handleDietaryRestrictionsUpdate = (newRestrictions) => {
    setDietaryRestrictions(newRestrictions);
    updateProfileCompletion();
  };

  const handleTastePreferencesUpdate = (newPreferences) => {
    setTastePreferences(newPreferences);
    updateProfileCompletion();
  };

  const handleRegionalFavoritesUpdate = (newFavorites) => {
    setRegionalFavorites(newFavorites);
    updateProfileCompletion();
  };

  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 60) return 'text-warning';
    return 'text-accent';
  };
  const handleExportProfileData = () => {
    const doc = new jsPDF();

    // === HEADER SECTION ===
    doc.setFillColor(255, 184, 77); // warm saffron accent
    doc.rect(0, 0, 210, 25, "F"); // top banner (A4 width)
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Heritage Bites", 14, 16);

    // Small HB logo (optional simple text logo)
    // doc.setFontSize(14);
    // doc.text("🍽️ HB", 170, 16);

    // === TITLE ===
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("User Profile Summary", 14, 40);

    // === PROFILE INFORMATION ===
    const profileInfo = {
      "Name": userData?.name || "N/A",
      "Email": userData?.email || "N/A",
      "Location": userData?.location || "N/A",
      "Join Date": userData?.joinDate
        ? new Date(userData.joinDate).toLocaleDateString("en-GB")
        : "N/A",
      "Age Group": userData?.ageGroup || "N/A",
      "Gender": userData?.gender || "N/A",
      "Height (cm)": userData?.height || "N/A",
      "Weight (kg)": userData?.weight || "N/A",
      "Activity Level": userData?.activityLevel || "N/A",
    };

    let y = 55;

    // Draw a subtle background box for content
    doc.setDrawColor(200, 200, 200);
    doc.roundedRect(10, 47, 190, 125, 3, 3, "S");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    Object.entries(profileInfo).forEach(([key, value]) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${key}:`, 16, y);
      doc.setFont("helvetica", "normal");
      doc.text(`${value}`, 70, y);
      y += 10;
      doc.setDrawColor(240, 240, 240);
      doc.line(15, y - 6, 190, y - 6);
    });

    // === FOOTER SECTION ===
    const pageHeight = doc.internal.pageSize.height;
    doc.setFillColor(255, 184, 77);
    doc.rect(0, pageHeight - 20, 210, 20, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text("© Heritage Bites | Empowering Traditional Wellness", 14, pageHeight - 8);
    doc.text(`Exported on: ${new Date().toLocaleDateString("en-GB")}`, 150, pageHeight - 8);

    // === SAVE ===
    doc.save("HeritageBites_Profile.pdf");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
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
        </div>

        {/* Profile Sections */}
        <div className="space-y-6">
          {/* Personal Information */}
          <PersonalInfoSection
            isExpanded={expandedSections?.personalInfo}
            onToggle={() => toggleSection('personalInfo')}
            userData={userData}
            onUpdate={handleUserDataUpdate}
            onUpdateCompletion={updateProfileCompletion}
          />

          {/* Health Goals */}
          {/*<HealthGoalsSection
            isExpanded={expandedSections?.healthGoals}
            onToggle={() => toggleSection('healthGoals')}
            healthGoals={healthGoals}
            onUpdate={handleHealthGoalsUpdate}
          />*/}

          {/* Dietary Restrictions */}
          {/*<DietaryRestrictionsSection
            isExpanded={expandedSections?.dietaryRestrictions}
            onToggle={() => toggleSection('dietaryRestrictions')}
            restrictions={dietaryRestrictions}
            onUpdate={handleDietaryRestrictionsUpdate}
          />*/}

          {/* Taste Preferences */}
          {/*<TastePreferencesSection
            isExpanded={expandedSections?.tastePreferences}
            onToggle={() => toggleSection('tastePreferences')}
            preferences={tastePreferences}
            onUpdate={handleTastePreferencesUpdate}
          />*/}

          {/* Regional Favorites */}
          {/*<RegionalFavoritesSection
            isExpanded={expandedSections?.regionalFavorites}
            onToggle={() => toggleSection('regionalFavorites')}
            favorites={regionalFavorites}
            onUpdate={handleRegionalFavoritesUpdate}
          />*/}

          {/* Recipe History */}
          {/*<RecipeHistorySection
            isExpanded={expandedSections?.recipeHistory}
            onToggle={() => toggleSection('recipeHistory')}
          />*/}

          {/* Achievement Badges */}
          {/*<AchievementBadgesSection
            isExpanded={expandedSections?.achievements}
            onToggle={() => toggleSection('achievements')}
          />*/}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
          <Button
            variant="outline"
            size="lg"
            iconName="Download"
            iconPosition="left"
            className="w-full sm:w-auto"
            onClick={handleExportProfileData}
          >
            Export Profile Data
          </Button>
          <Button
            variant="default"
            size="lg"
            iconName="Sparkles"
            iconPosition="left"
            className="w-full sm:w-auto"
          >
            Get Personalized Recommendations
          </Button>
        </div>

        {/* Privacy Notice */}
        <div className="mt-8 p-4 bg-muted/30 rounded-lg border border-border">
          <div className="flex items-start space-x-3">
            <Icon name="Shield" size={16} className="text-primary mt-0.5" />
            <div>
              <h4 className="font-body font-medium text-foreground mb-1">
                Privacy & Data Security
              </h4>
              <p className="text-sm text-muted-foreground">
                Your personal information and preferences are securely stored and used only to enhance your
                recipe discovery experience. We never share your data with third parties without your consent.
                You can export or delete your data at any time.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default UserProfileHealthGoals;
