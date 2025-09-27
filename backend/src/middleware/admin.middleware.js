// backend/middleware/admin.middleware.js
import User from "../models/user.model.js";

export const requireAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

export const requireAdminOrModerator = async (req, res, next) => {
  try {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    if (!['admin', 'moderator'].includes(user.role)) {
      return res.status(403).json({ message: "Admin or moderator access required" });
    }

    next();
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};