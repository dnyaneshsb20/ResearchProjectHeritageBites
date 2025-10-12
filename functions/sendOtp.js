// functions/sendOtp.js
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const { createClient } = require("@supabase/supabase-js");

// Initialize Supabase client
const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

const app = express();
app.use(cors());
app.use(express.json());

// Generate 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send email function
async function sendEmail(to, otp) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const mailOptions = {
    from: `"Heritage Bites" <${process.env.SMTP_USER}>`,
    to,
    subject: "Your OTP for Reset Password",
    html: `
      <div style="font-family: Helvetica, sans-serif; color: #000000ff;">
        <h1>Heritage Bites Password Reset</h1>
        <p>Dear User,</p>
        <p>Your OTP is:</p>
        <h2 style="color:#DC2626;">${otp}</h2>
        <p>This OTP is valid for <b>10 minutes</b>.</p>
        <p>Do not share it with anyone.</p>
      </div>
    `,
  };

transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        console.log("Error sending OTP:", error);
    } else {
        console.log("OTP sent:", info.response);
    }
});
}

app.post("/sendOtp", async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000).toISOString();
    console.log("Generated OTP:", otp, "Expiry (UTC):", otpExpiry);
    // Update OTP and expiry in Supabase
    const { error: updateError } = await supabase
      .from("users")
      .update({ otp, otp_expiry: otpExpiry })
      .eq("email", email);

    if (updateError) {
      console.error("Supabase update error:", updateError);
      return res.status(500).json({ error: "Failed to save OTP" });
    }

    // Send OTP via email
    await sendEmail(email, otp);

    res.json({ message: "OTP sent successfully" });
  } catch (error) {
    console.error("Error sending OTP:", error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
