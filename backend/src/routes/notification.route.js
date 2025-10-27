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

// Specific routes FIRST
router.patch("/mark-all-read", protectRoute, markAllAsRead);

// Parameterized routes
router.get("/", protectRoute, getNotifications);
router.post("/send", protectRoute, sendNotification);
router.patch("/:notificationId/read", protectRoute, markAsRead);
router.delete("/:notificationId", protectRoute, deleteNotification);

export default router;