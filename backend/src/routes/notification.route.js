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

router.patch("/mark-all-read", protectRoute, markAllAsRead);
router.get("/:userId", protectRoute, getNotifications);
router.post("/send/:userId", protectRoute, sendNotification);
router.patch("/:notificationId/read", protectRoute, markAsRead);
router.delete("/delete/:notificationId", protectRoute, deleteNotification);

export default router;