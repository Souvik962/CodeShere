import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";

export const usePostStore = create((set, get) => ({
  posts: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isPostsLoading: false,
  
  setPosts: (posts) => set({ posts }),

  // Get all users for sidebar
  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/posts/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  // Get all posts
  getAllPosts: async () => {
    set({ isPostsLoading: true });
    try {
      const res = await axiosInstance.get("/posts");
      set({ posts: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load posts");
    } finally {
      set({ isPostsLoading: false });
    }
  },

  // Send a new post
  sendPost: async (postData) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.post("/posts/send", postData);
      set({ posts: [res.data, ...posts] });
      toast.success("Post created successfully!");
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create post");
      throw error;
    }
  },

  // Like/unlike a post
  likePost: async (postId) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.post(`/posts/${postId}/like`);
      
      // Update the post in the store
      const updatedPosts = posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              likes: res.data.likes, 
              likedBy: res.data.likedBy 
            }
          : post
      );
      
      set({ posts: updatedPosts });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update like");
      throw error;
    }
  },

  // Add comment to a post
  addComment: async (postId, text) => {
    const { posts } = get();
    try {
      const res = await axiosInstance.post(`/posts/${postId}/comments`, { text });
      
      // Update the post's comments in the store
      const updatedPosts = posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              comments: [...(post.comments || []), res.data] 
            }
          : post
      );
      
      set({ posts: updatedPosts });
      return res.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add comment");
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (postId, commentId) => {
    const { posts } = get();
    try {
      await axiosInstance.delete(`/posts/${postId}/comments/${commentId}`);
      
      // Update the post's comments in the store
      const updatedPosts = posts.map(post => 
        post._id === postId 
          ? { 
              ...post, 
              comments: (post.comments || []).filter(comment => comment._id !== commentId) 
            }
          : post
      );
      
      set({ posts: updatedPosts });
      toast.success("Comment deleted");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
      throw error;
    }
  }
}));