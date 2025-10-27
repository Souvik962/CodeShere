// src/store/useAuthStore.js (Updated with Social Auth)
import { create } from "zustand";
import { axiosInstance } from "../lib/axios.js";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isSendingOtp: false,
  isVerifyingOtp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log("Error in checkAuth:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
      throw error;
    } finally {
      set({ isSigningUp: false });
    }
  },

  sendOtp: async (data) => {
    set({ isSendingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/send-otp", { email: data.email });
      toast.success(`OTP sent successfully to ${data.email}`);
      return res.data;
    } catch (error) {
      console.error("SendOTP error:", error);
      toast.error(error.response?.data?.message || "Failed to send OTP");
      throw error;
    } finally {
      set({ isSendingOtp: false });
    }
  },

  verifyOtp: async (data) => {
    set({ isVerifyingOtp: true });
    try {
      const res = await axiosInstance.post("/auth/verify-otp", {
        email: data.email,
        otp: data.otp
      });
      toast.success("Email verified successfully!");
      return res.data;
    } catch (error) {
      console.error("VerifyOTP error:", error);
      toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
      throw error;
    } finally {
      set({ isVerifyingOtp: false });
    }
  },

  login: async (data) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ authUser: res.data });
      toast.success("Logged in successfully");
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  // New social authentication method
  socialAuth: async (userData) => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post("/auth/social-auth", userData);
      set({ authUser: res.data });
      get().connectSocket();
      return res.data;
    } catch (error) {
      console.error("Social auth error:", error);
      toast.error(error.response?.data?.message || "Social authentication failed");
      throw error;
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isCheckingAuth: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ authUser: null });
      toast.success("Logged out successfully");
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  updateProfile: async (data) => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put("/auth/update-profile", data);
      set({ authUser: res.data });
      toast.success("Profile updated successfully");
    } catch (error) {
      console.log("error in update profile:", error);
      toast.error(error.response?.data?.message || "Profile update failed");
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: {
        userId: authUser._id,
      },
    });
    socket.connect();

    set({ socket: socket });

    socket.on("getOnlineUsers", (userIds) => {
      set({ onlineUsers: userIds });
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },
}));