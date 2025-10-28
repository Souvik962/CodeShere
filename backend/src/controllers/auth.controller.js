import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import SendPost from "../models/sendPost.model.js";
import cloudinary from "../lib/cloudinary.js";
import emailService from "../middleware/email.config.js";

// In-memory OTP storage (in production, use Redis or database)
const otpStore = new Map();

export const signup = async (req, res) => {
  const { fullName, email, password, captchaToken } = req.body;
  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    // Note: CAPTCHA verification is already done in middleware
    // The captchaToken is included for completeness but verification happens before reaching this controller

    const user = await User.findOne({ email });

    if (user) return res.status(400).json({ message: "Email already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // generate jwt token here
      generateToken(newUser._id, res);
      await newUser.save();

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const sendOtpEmail = async (req, res) => {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Store OTP with expiration (10 minutes)
    const expirationTime = Date.now() + 10 * 60 * 1000; // 10 minutes
    otpStore.set(email, { otp: otp.toString(), expires: expirationTime });

    // Clean up expired OTPs
    for (const [key, value] of otpStore.entries()) {
      if (value.expires < Date.now()) {
        otpStore.delete(key);
      }
    }
    await emailService.sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
      email: email,
    });
  } catch (error) {
    console.error("SendOTP error:", error);
    res.status(500).json({
      message: "Failed to send OTP email",
      error: error.message
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP not found or expired" });
    }

    if (storedOtpData.expires < Date.now()) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP has expired" });
    }

    if (storedOtpData.otp !== otp.toString()) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // OTP is valid, remove from store
    otpStore.delete(email);

    res.status(200).json({
      message: "Email verified successfully",
      verified: true
    });
  } catch (error) {
    console.error("VerifyOTP error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const login = async (req, res) => {
  const { email, password, captchaToken } = req.body;
  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic } = req.body;
    const userId = req.user._id;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    const uploadResponse = await cloudinary.uploader.upload(profilePic);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("UpdateProfile error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error("CheckAuth error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Add this new function for users to delete their own posts
export const deleteUserPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    // Find the post and check if it belongs to the user
    const post = await SendPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the post belongs to the current user
    if (post.senderId.toString() !== userId.toString()) {
      return res.status(403).json({ message: "You can only delete your own posts" });
    }

    // Delete the post
    await SendPost.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("DeleteUserPost error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// backend/controllers/auth.controller.js (Add this method to your existing controller)

// Add this new social authentication method to your existing auth.controller.js file
export const socialAuth = async (req, res) => {
  const { firebaseUid, email, fullName, profilePic, provider } = req.body;

  try {
    if (!firebaseUid || !email || !fullName || !provider) {
      return res.status(400).json({ message: "Missing required social auth data" });
    }

    // Check if user already exists with this email
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update their info if needed
      const updateData = {};

      // Update profile pic if it's empty or from the same provider
      if (!user.profilePic || user.profilePic === profilePic) {
        updateData.profilePic = profilePic;
      }

      // Update Firebase UID if not set
      if (!user.firebaseUid) {
        updateData.firebaseUid = firebaseUid;
      }

      // Update provider info if not set
      if (!user.authProvider) {
        updateData.authProvider = provider;
      }

      // Update last login
      updateData.lastLogin = new Date();

      if (Object.keys(updateData).length > 0) {
        user = await User.findByIdAndUpdate(user._id, updateData, { new: true });
      }

      // Generate JWT token
      generateToken(user._id, res);

      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profilePic: user.profilePic,
        role: user.role,
        status: user.status
      });
    } else {
      // Create new user
      // Generate a random password for social auth users
      const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);

      const newUser = new User({
        email,
        fullName,
        password: hashedPassword, // Required field, but won't be used for social auth
        profilePic: profilePic || "",
        firebaseUid,
        authProvider: provider,
        lastLogin: new Date()
      });

      await newUser.save();

      // Generate JWT token
      generateToken(newUser._id, res);

      return res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
        role: newUser.role,
        status: newUser.status
      });
    }
  } catch (error) {
    console.error("Social auth error:", error);
    res.status(500).json({
      message: "Social authentication failed",
      error: error.message
    });
  }
};

// Backwards-compatible alias: some routes import `sendOtp`
export { sendOtpEmail as sendOtp };