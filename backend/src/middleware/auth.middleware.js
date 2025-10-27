import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET environment variable is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if user account is active
    if (user.status === 'suspended' || user.status === 'banned') {
      return res.status(403).json({
        message: "Account is suspended or banned",
        reason: user.statusReason || "No reason provided"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Unauthorized - Token Expired" });
    }
    res.status(500).json({ message: "Internal server error" });
  }
};
