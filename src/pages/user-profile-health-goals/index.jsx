import React, { useState, useEffect } from 'react';
import Header from '../../components/ui/Header';
import PersonalInfoSection from './components/PersonalInfoSection';
import HealthGoalsSection from './components/HealthGoalsSection';
import DietaryRestrictionsSection from './components/DietaryRestrictionsSection';
import HealthConditionsSection from './components/HealthConditionsSection'; // ✅ renamed component
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Footer from '../dashboard/components/Footer';
import { supabase } from '../../supabaseClient';
import { useNavigate } from "react-router-dom";
import OpenAI from "openai";


import jsPDF from "jspdf";

const UserProfileHealthGoals = () => {
  const [expandedSections, setExpandedSections] = useState({
    personalInfo: true,
    healthGoals: false,
    dietaryRestrictions: false,
    healthConditions: false, // ✅ renamed
  });

  const [userData, setUserData] = useState({});
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);



  const [healthGoals, setHealthGoals] = useState([
    'weight-loss',
    'diabetes-friendly',
    'heart-health'
  ]);

  const [dietaryRestrictions, setDietaryRestrictions] = useState([
    'vegetarian',
    'low-sodium'
  ]);

  const [healthConditions, setHealthConditions] = useState([ // ✅ renamed state
    'hypertension',
    'thyroid',
    'cholesterol'
  ]);

  const [profileCompleteness, setProfileCompleteness] = useState(0);

  const calculateProfileCompletion = (userData, profileData) => {
    const checks = [
      !!userData?.name,
      !!userData?.email,
      !!profileData?.age_group,
      !!profileData?.gender,
      !!profileData?.height_cm,
      !!profileData?.weight_kg,
      !!profileData?.activity_level,
      !!userData?.location,
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

      const { data: userData } = await supabase
        .from('users').select('*').eq('user_id', user.id).single();
      const { data: profileData } = await supabase
        .from('user_profile').select('*').eq('user_id', user.id).single();

      const newCompletion = calculateProfileCompletion(userData, profileData);
      setProfileCompleteness(newCompletion);
    } catch (err) {
      console.error('Error updating completion:', err);
    }
  };
  // 🔹 Generic function to update Supabase fields
  const updateUserProfileField = async (fieldName, value) => {
    try {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData?.user;
      if (!user) return;

      const { error } = await supabase
        .from('user_profile')
        .update({ [fieldName]: value })
        .eq('user_id', user.id);

      if (error) throw error;
      console.log(`${fieldName} updated successfully in Supabase`);
    } catch (err) {
      console.error(`Error updating ${fieldName}:`, err);
    }
  };


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: authData } = await supabase.auth.getUser();
        const user = authData?.user;
        if (!user) return;

        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('name, email, created_at, location')
          .eq('user_id', user.id)
          .single();

        if (userError) return console.error('Error fetching user:', userError);

        const { data: profileData, error: profileError } = await supabase
          .from('user_profile')
          .select(`
    age_group,
    gender,
    height_cm,
    weight_kg,
    activity_level,
    mobile_number,
    health_goals,
    dietary_restrictions,
    health_conditions
  `)
          .eq('user_id', user.id)
          .single();


        if (profileError) console.error('Error fetching profile:', profileError);

        setUserData({
          name: userData?.name || '',
          email: userData?.email || '',
          location: userData?.location || '',
          joinDate: userData?.created_at || '',
          contact: profileData?.mobile_number || '',
          ageGroup: profileData?.age_group || '',
          gender: profileData?.gender || '',
          height: profileData?.height_cm || '',
          weight: profileData?.weight_kg || '',
          activityLevel: profileData?.activity_level || '',
        });
        setHealthGoals(profileData?.health_goals || []);
        setDietaryRestrictions(profileData?.dietary_restrictions || []);
        setHealthConditions(profileData?.health_conditions || []);

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
    const newCompletion = calculateProfileCompletion(newData, currentProfileData);
    setProfileCompleteness(newCompletion);
  };

  const handleHealthGoalsUpdate = (newGoals) => {
    setHealthGoals(newGoals);
    updateUserProfileField("health_goals", newGoals);
    updateProfileCompletion();
  };

  const handleDietaryRestrictionsUpdate = (newRestrictions) => {
    setDietaryRestrictions(newRestrictions);
    updateUserProfileField("dietary_restrictions", newRestrictions);
    updateProfileCompletion();
  };

  const handleHealthConditionsUpdate = (newConditions) => {
    setHealthConditions(newConditions);
    updateUserProfileField("health_conditions", newConditions);
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
    // doc.text("🍽 HB", 170, 16);

    // === TITLE ===
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("User Profile Summary", 14, 40);

    const profileInfo = {
      "Name": userData?.name || "N/A",
      "Email": userData?.email || "N/A",
      "Contact Number": userData?.contact || "N/A",
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
      doc.text(`${key}: ${value}`, 14, y);
      y += 8;
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
const generateAIRecommendations = async () => {
  try {
    const openai = new OpenAI({
      apiKey: import.meta.env.VITE_OPENAI_API_KEY,
      dangerouslyAllowBrowser: true, // ✅ only for local dev
    });

    const prompt = `
    You are a culinary AI specializing in healthy Indian cuisine.
    Suggest **4 healthy, indigenous Indian recipes** tailored to this user's profile:

    - Age group: ${userData?.age_group || "N/A"}
    - Gender: ${userData?.gender || "N/A"}
    - Health goals: ${JSON.stringify(userData?.health_goals || [])}
    - Dietary restrictions: ${JSON.stringify(userData?.dietary_restrictions || [])}
    - Health conditions: ${JSON.stringify(userData?.health_conditions || [])}

    Each recipe must include:
    - title
    - description (2–3 line summary)
    - ingredients (list of 4–6 items)
    - instructions (list of 3–5 short cooking steps)
    - matchReason (1–2 lines explaining why it suits the user’s profile)
    - nutrition (object with Calories, Protein, Fiber, Carbs values)

    Output strictly valid JSON (no markdown, no extra text):
    [
      {
        "title": "Recipe Name",
        "description": "Short 2–3 line description",
        "ingredients": ["item1", "item2", "item3"],
        "instructions": ["step1", "step2", "step3"],
        "matchReason": "Short reason why this fits",
        "nutrition": {
          "Calories": "xxx kcal",
          "Protein": "xg",
          "Fiber": "xg",
          "Carbs": "xg"
        }
      }
    ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.8,
    });

    let aiText = response.choices[0].message.content.trim();
    aiText = aiText.replace(/```json|```/g, "").trim();

    try {
      const parsed = JSON.parse(aiText);
      return Array.isArray(parsed) ? parsed.slice(0, 4) : [];
    } catch (parseError) {
      console.error("❌ JSON parse failed, raw response:", aiText);
      return [];
    }
  } catch (err) {
    console.error("⚠️ AI generation failed:", err);
    return [];
  }
};


  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Header */}
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
              Complete your profile to get better recipe recommendations tailored to your health goals.
            </p>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {/* Profile Sections */}
          <PersonalInfoSection
            isExpanded={expandedSections?.personalInfo}
            onToggle={() => toggleSection('personalInfo')}
            userData={userData}
            onUpdate={handleUserDataUpdate}
            onUpdateCompletion={updateProfileCompletion}
          />



          <HealthGoalsSection
            isExpanded={expandedSections?.healthGoals}
            onToggle={() => toggleSection('healthGoals')}
            healthGoals={healthGoals}
            onUpdate={handleHealthGoalsUpdate}
          />

          <DietaryRestrictionsSection
            isExpanded={expandedSections?.dietaryRestrictions}
            onToggle={() => toggleSection('dietaryRestrictions')}
            restrictions={dietaryRestrictions}
            onUpdate={handleDietaryRestrictionsUpdate}
          />

          <HealthConditionsSection
            isExpanded={expandedSections?.healthConditions}
            onToggle={() => toggleSection('healthConditions')}
            conditions={healthConditions}
            onUpdate={handleHealthConditionsUpdate}
          />
        </div>

        {/* Buttons */}
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
            disabled={loading}
            onClick={async () => {
              setLoading(true);
              try {
                const recommendations = await generateAIRecommendations();
                navigate("/user-recommendations", { state: { recommendations } });
              } catch (err) {
                console.error("Error generating recommendations:", err);
                navigate("/user-recommendations");
              } finally {
                setLoading(false);
              }
            }}
          >
            {loading ? "Generating..." : "Explore Personalized Recommendations"}
          </Button>
        </div>

        {/* Privacy */}
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
