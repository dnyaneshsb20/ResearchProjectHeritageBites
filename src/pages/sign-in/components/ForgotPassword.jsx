// src/pages/SignIn/components/ForgotPassword.jsx
import React, { useState } from "react";
import { supabase } from "../../../supabaseClient";
import Button from "../../../components/ui/Button";
import Input from "../../../components/ui/Input";

const ForgotPassword = ({ onClose, openResetPassword }) => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState(""); // for user input
  const [step, setStep] = useState(1); // 1 = enter email, 2 = enter OT
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      // Call server to generate and send OTP
      const response = await fetch("https://otp-reset-server.onrender.com/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      console.log("Response status:", response.status);
      console.log("Response text:", await response.text());

      const data = await response.json().catch(() => ({}));


      if (data.error) {
        setError(data.error);
        return;
      }

      setMessage("OTP sent to your email!");
      setStep(2); // move to OTP input step
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };


  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!otp.trim()) {
      setError("Please enter the OTP.");
      return;
    }

    try {
      // Call server-side OTP verification
      const response = await fetch("https://otp-reset-server.onrender.com/verifyOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();

      if (data.error) {
        setError(data.error); // server will return invalid/expired errors
        return;
      }

      // OTP verified successfully
      onClose(); // close ForgotPassword modal
      openResetPassword(email, data.resetToken); // pass resetToken if needed
      setMessage("OTP verified successfully!");
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="p-6 w-full max-w-sm bg-popover border border-border rounded-lg shadow-lg relative">
        <h2 className="text-lg font-semibold mb-4">Reset Password</h2>

        {message && <p className="text-green-600 mb-2">{message}</p>}
        {error && <p className="text-red-600 mb-2">{error}</p>}

        {step === 1 && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="flex gap-2">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white"
              >
                Send OTP
              </Button>
              <Button
                type="button"
                onClick={onClose} // close modal
                className="flex-1 bg-white text-black hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Enter OTP</label>
              <Input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />
            </div>
            <div className="flex space-x-3">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#f87d46] to-[#fa874f] text-white"
              >
                Verify OTP
              </Button>
              <Button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white text-black hover:bg-accent hover:text-accent-foreground"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
