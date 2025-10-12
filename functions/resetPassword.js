const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Supabase with service role key (required for admin actions)
const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
);
app.post("/resetPassword", async (req, res) => {
    console.log("---- Incoming Reset Request ----");
    console.log("Headers:", req.headers["content-type"]);
    console.log("Body:", req.body);
    try {
        const { resetToken, newPassword } = req.body;
        console.log("Received reset request:", req.body);

        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: "Missing reset token or password" });
        }

        // 1. Find user by reset token
        const { data: user, error: fetchError } = await supabase
            .from("users")
            .select("*")
            .eq("reset_token", resetToken)
            .single();

        console.log("Fetched user:", user);
        console.log("User reset_token_expiry:", user?.reset_token_expiry);

        if (fetchError || !user) {
            return res.status(404).json({ error: "Invalid reset token" });
        }

        // 2. Optional: check expiry
        if (user.reset_token_expiry) {
            // Add 'Z' at the end to indicate UTC
            const expiryDate = new Date(user.reset_token_expiry + 'Z');
            console.log("Expiry Date (UTC):", expiryDate.toISOString());

            if (expiryDate < new Date()) {
                return res.status(400).json({ error: "Reset token expired" });
            }
        }

        // 3. Update password using Supabase admin
        const { error: updateError } = await supabase.auth.admin.updateUserById(
            user.user_id,
            { password: newPassword }
        );

        if (updateError) {
            return res.status(500).json({ error: updateError.message });
        }

        // 4. Clear the reset token
        await supabase
            .from("users")
            .update({ reset_token: null, reset_token_expiry: null })
            .eq("user_id", user.user_id);

        res.json({ message: "Password updated successfully" });

    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ error: "Something went wrong" });
    }
});


const PORT = 5002; // choose a free port
app.listen(PORT, () => console.log(`Reset password server running on port ${PORT}`));

module.exports = app;
