import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { validatePost, validateComment, sanitizeInput } from "../middleware/validation.middleware.js";
import { generalRateLimit } from "../middleware/rateLimit.middleware.js";
import {
  getUsersForSidebar,
  sendPost,
  getAllPosts,
  likePost,
  addComment,
  deleteComment
} from "../controllers/sendPost.controller.js";

const router = express.Router();

// Apply general rate limiting to all routes
router.use(generalRateLimit);

// Get users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get all posts
router.get("/", protectRoute, getAllPosts);

// Create a new post
router.post("/send", protectRoute, sanitizeInput, validatePost, sendPost);

// Like/unlike a post
router.post("/:id/like", protectRoute, likePost);

// Add comment to a post
router.post("/:id/comments", protectRoute, sanitizeInput, validateComment, addComment);

// Delete a comment
router.delete("/:postId/comments/:commentId", protectRoute, deleteComment);

export default router;