// backend/routes/auth.route.js (Updated with social auth route)
import express from "express";
import { checkAuth, login, logout, signup, updateProfile, deleteUserPost, sendOtp, verifyOtp, socialAuth } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";
import { verifyCaptcha } from "../middleware/captcha.middleware.js";
import { authRateLimit } from "../middleware/rateLimit.middleware.js";

const router = express.Router();

// Apply CAPTCHA verification and rate limiting to authentication routes
router.post("/signup", authRateLimit, verifyCaptcha, signup);
router.post("/login", authRateLimit, verifyCaptcha, login);

// Social authentication route (no CAPTCHA required as Firebase handles security)
router.post("/social-auth", authRateLimit, socialAuth);

// OTP routes
router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Other auth routes
router.post("/logout", logout);
router.put("/update-profile", protectRoute, updateProfile);
router.get("/check", protectRoute, checkAuth);

// Route for users to delete their own posts
router.delete("/deletePosts/:postId", protectRoute, deleteUserPost);

export default router;