// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Icon from "../../components/AppIcon";
import heroFood from "../../assets/hero-food.jpg";
import { useAuth } from "../../context/AuthContext";
import { supabase } from "../../supabaseClient"; // adjust path if needed
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

const SignIn = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false); // toggle state

  // form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");

  const [error, setError] = useState("");
  const [showForgot, setShowForgot] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState(""); // store email for reset
  const [resetToken, setResetToken] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // --- SIGN UP ---
    if (isSignUp) {
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }

      try {
        // Sign up with Supabase
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) {
          setError(authError.message);
          return;
        }

        if (!authData.user) {
          setError("Sign up failed. No user returned.");
          return;
        }

        // Insert into users table
        const { data, error: insertError } = await supabase
          .from("users")
          .insert([
            {
              user_id: authData.user.id,
              name: fullName,
              email,
              role: role,
            },
          ])
          .select()
          .single();

        if (insertError) {
          setError(insertError.message);
          return;
        }

        // If farmer, insert into farmers table
        if (role === "farmer") {
          const { error: farmerError } = await supabase
            .from("farmers")
            .insert([
              {
                user_id: data.user_id,
                bio: "",
                certifications: "",
                contact_info: "",
              },
            ]);

          if (farmerError) {
            setError(farmerError.message);
            return;
          }
        }

        alert(
          "Account created! Please check your email to confirm your account before signing in."
        );
        setIsSignUp(false);
        return; // stop here to prevent automatic sign-in

      } catch (err) {
        console.error(err);
        setError("Something went wrong during sign-up. Please try again.");
        return;
      }
    }

    // --- SIGN IN ---
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return;
      }

      if (!data.user) {
        setError("Invalid email or password.");
        return;
      }

      // Fetch profile from users table
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", data.user.id)
        .single();

      if (profileError) {
        console.error(profileError);
      }

      login(profile || data.user);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("user", JSON.stringify(profile || data.user));

      // Role-based navigation
      if (profile?.role === "admin") {
        navigate("/admin-recipe-management");
      } else if (profile?.role === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/recipe-discovery-dashboard");
      }
      console.log("Fetched profile:", profile);
      console.log("Profile error:", profileError);
      console.log("User ID from auth:", data.user.id);

    } catch (err) {
      console.error(err);
      setError("Something went wrong during sign-in. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat filter blur-sm"
        style={{ backgroundImage: `url(${heroFood})` }}
      >
        <div className="absolute inset-0"></div>
      </div>

      {/* Auth Card */}
      <div className="relative z-10 w-full max-w-md p-6 rounded-lg shadow-md bg-popover border border-border">
        <h1 className="text-2xl font-heading font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name={isSignUp ? "UserPlus" : "LogIn"} size={20} />
          <span>{isSignUp ? "Sign Up" : "Sign In"}</span>
        </h1>

        {error && (
          <div className="mb-3 text-sm text-destructive font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <>
              {/* Full Name field */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Full Name
                </label>
                <Input
                  type="text"
                  placeholder="Enter Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>

              {/* Role selection */}
              <div>
                <label className="text-sm font-medium block mb-1">
                  Register As
                </label>
                <select
                  className="w-full border border-border rounded-md p-2 bg-background text-foreground"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="">Select Role</option>
                  <option value="user">User</option>
                  <option value="farmer">Farmer</option>
                </select>
              </div>
            </>
          )}

          {/* Email (always visible) */}
          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          {/* Password */}
          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-2 flex items-center text-muted-foreground hover:text-foreground"
              >
                <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
              </button>
            </div>
          </div>


          {/* Confirm Password (only in SignUp) */}
          {isSignUp && (
            <div>
              <label className="text-sm font-medium block mb-1">
                Confirm Password
              </label>
              <Input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          )}

          {!isSignUp && (
            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 text-sm">
                <input type="checkbox" className="accent-primary" />
                <span>Remember me</span>
              </label>
              <span
                className="text-sm cursor-pointer hover:underline"
                onClick={() => setShowForgot(true)}
              >
                Forgot Password?
              </span>
            </div>
          )}

          <Button
            type="submit"
            variant="default"
            size="sm"
            className="w-full bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-[#fdfbff]"
          >
            {isSignUp ? "Create Account" : "Sign In"}
          </Button>
        </form>

        {/* Toggle SignUp / SignIn */}
        <p className="text-sm text-muted-foreground text-center mt-4">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <span
                className="underline hover:no-underline cursor-pointer"
                onClick={() => setIsSignUp(false)}
              >
                Sign in
              </span>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <span
                className="underline hover:no-underline cursor-pointer"
                onClick={() => setIsSignUp(true)}
              >
                Create one
              </span>
            </>
          )}
        </p>

        {/* Back to Dashboard */}
        <p className="text-sm text-muted-foreground text-center mt-4">
          Back to{" "}
          <span
            className="underline hover:no-underline cursor-pointer"
            onClick={() => navigate("/recipe-discovery-dashboard")}
          >
            Dashboard
          </span>
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgot &&
        <ForgotPassword
          onClose={() => setShowForgot(false)}
          openResetPassword={(email, token) => {
            setResetEmail(email);
            setResetToken(token);
            setShowForgot(false);
            setShowResetPassword(true);
          }}
        />
      }
      {showResetPassword && (
        <ResetPassword
          email={resetEmail}
          resetToken={resetToken}
          onClose={() => setShowResetPassword(false)}
        />
      )}
    </div>
  );
};

export default SignIn;
