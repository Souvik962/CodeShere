import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {
    sendNotification,
    getNotifications,
    deleteNotification,
    markAsRead,
    markAllAsRead
} from "../controllers/notification.controller.js";

const router = express.Router();

// Get notifications for current user
router.get("/:userId", protectRoute, getNotifications);

// Send notification (admin/moderator only)
router.post("/send/:userId", protectRoute, sendNotification);

// Mark single notification as read
router.patch("/:notificationId/read", protectRoute, markAsRead);

// Mark all notifications as read for current user
router.patch("/mark-all-read", protectRoute, markAllAsRead);

// Delete single notification
router.delete("/delete/:notificationId", protectRoute, deleteNotification);

export default router;