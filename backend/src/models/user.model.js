// backend/models/user.model.js (Updated with social auth fields)
import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    profilePic: {
      type: String,
      default: "",
    },
    // Social authentication fields
    firebaseUid: {
      type: String,
      default: null,
      // sparse index is defined below, not here
    },
    authProvider: {
      type: String,
      enum: ['email', 'google', 'facebook'],
      default: 'email',
    },
    // Admin and user management fields
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    statusReason: {
      type: String,
      default: '',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    loginAttempts: {
      type: Number,
      default: 0,
    },
    lockUntil: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Indexes for better query performance
userSchema.index({ role: 1 });
userSchema.index({ status: 1 });
userSchema.index({ firebaseUid: 1 }, { sparse: true });
userSchema.index({ authProvider: 1 });

// Virtual to check if account is locked
userSchema.virtual('isLocked').get(function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Virtual to check if user is social auth user
userSchema.virtual('isSocialAuth').get(function () {
  return this.authProvider !== 'email';
});

const User = mongoose.model("User", userSchema);

export default User;