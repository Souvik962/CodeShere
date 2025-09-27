// backend/routes/admin.route.js
import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { requireAdmin, requireAdminOrModerator } from "../middleware/admin.middleware.js";
import {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getAllPostsAdmin,
  deletePost,
  getSystemSettings,
} from "../controllers/admin.controller.js";

import { sendNotification, getNotifications } from "../controllers/notification.controller.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", protectRoute, requireAdmin, getDashboardStats);

// User Management
router.get("/users", protectRoute, requireAdminOrModerator, getAllUsers);
router.put("/users/:userId", protectRoute, requireAdmin, updateUserStatus);
router.delete("/users/:userId", protectRoute, requireAdmin, deleteUser);

// Post Management
router.get("/posts", protectRoute, requireAdminOrModerator, getAllPostsAdmin);
router.delete("/posts/:postId", protectRoute, requireAdminOrModerator, deletePost);

// System Settings
router.get("/settings", protectRoute, requireAdmin, getSystemSettings);

// Notification Management
router.post("/send-notification", protectRoute, requireAdminOrModerator, sendNotification);
router.get("/notifications", protectRoute, requireAdminOrModerator, getNotifications);



export default router;