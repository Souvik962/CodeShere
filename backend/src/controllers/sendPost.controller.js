import User from "../models/user.model.js";
import SendPost from "../models/sendPost.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const loggedInUserId = req.user?._id; // Get the logged-in user ID

    let posts = await SendPost.find()
      .populate('senderId', '-password')
      .populate('comments.author', 'fullName profilePic')
      .sort({ createdAt: -1 }); // Most recent posts first

    // Filter private code for unauthorized users
    posts = posts.map(post => {
      const postObj = post.toObject(); // Convert mongoose document to plain object

      // Check if post is private AND user is not the owner
      if (postObj.privacy === 'private') {
        const isOwner = loggedInUserId && postObj.senderId._id.toString() === loggedInUserId.toString();

        if (!isOwner) {
          postObj.projectCode = "This post is private | You don't have access to view the code. | Don't try to access it.";
        }
      }

      return postObj;
    });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendPost = async (req, res) => {
  try {
    const { projectName, programmingLanguage, projectCode, privacy } = req.body;
    const senderId = req.user._id;

    // Validate required fields
    if (!projectName || !programmingLanguage || !projectCode || !privacy) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newPost = new SendPost({
      senderId,
      projectName,
      programmingLanguage,
      projectCode,
      privacy,
      likes: 0, // Initialize likes to 0
      likedBy: [], // Initialize empty array
      comments: [] // Initialize empty comments array
    });

    await newPost.save();

    // Populate the post with sender information before sending response
    const populatedPost = await SendPost.findById(newPost._id).populate('senderId', '-password');

    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Like or unlike a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await SendPost.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Ensure arrays exist
    if (!post.likedBy) post.likedBy = [];
    if (!post.likes) post.likes = 0;

    const alreadyLiked = post.likedBy.some(id => id.toString() === userId.toString());

    if (alreadyLiked) {
      // Unlike the post
      post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
      post.likes = Math.max(0, post.likes - 1);
    } else {
      // Like the post
      post.likedBy.push(userId);
      post.likes += 1;
    }

    await post.save();

    res.status(200).json({
      likes: post.likes,
      likedBy: post.likedBy,
      isLiked: !alreadyLiked
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// Add a comment to a post
export const addComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Comment text is required" });
    }

    const post = await SendPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      text: text.trim(),
      author: userId,
      createdAt: new Date()
    };

    post.comments.push(newComment);
    await post.save();

    // Populate the comment with author info before sending response
    const updatedPost = await SendPost.findById(postId)
      .populate('comments.author', 'fullName profilePic');

    const addedComment = updatedPost.comments[updatedPost.comments.length - 1];

    res.status(201).json(addedComment);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const userId = req.user._id;

    const post = await SendPost.findById(postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentIndex = post.comments.findIndex(
      comment => comment._id.toString() === commentId
    );

    if (commentIndex === -1) {
      return res.status(404).json({ error: "Comment not found" });
    }

    // Check if user is the author of the comment
    if (post.comments[commentIndex].author.toString() !== userId.toString()) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
};