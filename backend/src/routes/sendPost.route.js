import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { 
  getUsersForSidebar, 
  sendPost, 
  getAllPosts, 
  likePost,
  addComment,
  deleteComment
} from "../controllers/sendPost.controller.js";

const router = express.Router();

// Get users for sidebar
router.get("/users", protectRoute, getUsersForSidebar);

// Get all posts
router.get("/", protectRoute, getAllPosts);

// Create a new post
router.post("/send", protectRoute, sendPost);

// Like/unlike a post
router.post("/:id/like", protectRoute, likePost);

// Add comment to a post
router.post("/:id/comments", protectRoute, addComment);

// Delete a comment
router.delete("/:postId/comments/:commentId", protectRoute, deleteComment);

export default router;