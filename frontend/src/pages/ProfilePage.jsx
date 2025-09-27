import React, { useState, useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore';
import { Camera, Mail, User, Shield, Calendar, CheckCircle, Sparkles, Code2, Code, Star, Trash2Icon, AlertTriangle } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import toast from 'react-hot-toast';
import { axiosInstance } from '../lib/axios';


const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [selectedImg, setSelectedImg] = useState(null);
  const { posts, getAllPosts, isPostsLoading } = usePostStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);

  const userPosts = authUser ? posts.filter(post => {
    if (!post.senderId) return false;
    if (typeof post.senderId === 'object') {
      return post.senderId._id === authUser._id;
    }
    return post.senderId === authUser._id;
  }) : [];

  // Fetch posts when component mounts
  useEffect(() => {
    const loadPosts = async () => {
      try {
        await getAllPosts();
      } catch (error) {
        console.error('Failed to fetch posts:', error);
      }
    };

    if (authUser && posts.length === 0) {
      loadPosts();
    }
  }, [authUser]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImg(base64Image);
      await updateProfile({ profilePic: base64Image });
    };
  };

  // Updated handleDeletePost function and related code for ProfilePage.jsx
const handleDeletePost = async (postId) => {
  try {
    // Try the user endpoint first, fallback to auth if needed
    await axiosInstance.delete(`/user/deletePosts/${postId}`);
    toast.success('Post deleted successfully');

    // Refresh posts after deletion
    await getAllPosts();

    setShowDeleteModal(false);
    setDeleteReason('');
    setSelectedPost(null);
  } catch (error) {
    console.error('Failed to delete post:', error);
    const errorMessage = error.response?.data?.message || 'Failed to delete post';
    toast.error(errorMessage);
  }
};

  // Also update the DeletePostModal component to remove the reason field since it's not needed for user posts:
  const DeletePostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Post</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Are you sure you want to delete the post "<strong>{selectedPost?.projectName}</strong>"? This action cannot be undone.
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteReason('');
                setSelectedPost(null);
              }}
              className="flex-1 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDeletePost(selectedPost._id)}
              className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 pt-20">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative max-w-4xl mx-auto p-6 py-8">
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-8 space-y-8 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          {/* Header Section */}
          <div className="text-center relative">
            <div className="flex justify-center mb-4">
              <Sparkles className="w-6 h-6 text-purple-500 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Profile
            </h1>
            <p className="mt-3 text-gray-600 dark:text-gray-300 text-sm">Manage your personal information</p>
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
          </div>

          {/* Avatar Upload Section */}
          <div className="flex flex-col items-center gap-6">
            <div className="relative group">
              {/* Animated ring around profile picture */}
              <div className="absolute -inset-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-spin-slow opacity-75 blur-sm group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50"></div>

              <img
                src={selectedImg || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="relative size-35 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-2xl group-hover:scale-105 transition-transform duration-300"
              />

              <label
                htmlFor="avatar-upload"
                className={`
                   absolute -bottom-2 -right-2
                   bg-gradient-to-r from-blue-500 to-purple-500 hover:from-purple-500 hover:to-pink-500
                   p-3 rounded-full cursor-pointer 
                   transition-all duration-300 shadow-lg hover:shadow-xl
                   transform hover:scale-110 active:scale-95
                   ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                 `}
              >
                <Camera className="w-4 h-4 text-white" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 justify-center">
                {isUpdatingProfile ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Camera className="w-4 h-4" />
                    Click the camera icon to update your photo
                  </>
                )}
              </p>
            </div>
          </div>

          {/* User Information Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Full Name Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-2xl p-3 border border-blue-200/50 dark:border-blue-700/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-500 rounded-xl">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Full Name</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white pl-2">
                  {authUser?.fullName}
                </p>
              </div>
            </div>

            {/* Email Card */}
            <div className="group">
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 rounded-2xl p-3 border border-purple-200/50 dark:border-purple-700/50 hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-500 rounded-xl">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Email Address</span>
                </div>
                <p className="text-lg font-semibold text-gray-900 dark:text-white pl-2 break-all">
                  {authUser?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Account Information Section */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-600/50 shadow-inner">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Account Information</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {/* Member Since Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Member Since</span>
                  </div>
                  <span className="font-bold text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-900/30 px-3 py-1 rounded-lg">
                    {authUser.createdAt?.split("T")[0]}
                  </span>
                </div>
              </div>

              {/* Account Status Card */}
              <div className="bg-white/80 dark:bg-gray-800/80 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50 hover:shadow-md transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-700 dark:text-gray-300">Account Status</span>
                  </div>
                  <span className="flex items-center gap-2 font-bold text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30 px-3 py-1 rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Contributions Section - Enhanced like LeftSideBar */}
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-700/50 rounded-3xl p-4 border border-gray-200/50 dark:border-gray-600/50 shadow-inner">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl">
                  <Code2 className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Contributions</h2>
              </div>
              <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                {isPostsLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  `${userPosts.length} Total`
                )}
              </div>
            </div>

            {/* Stats Cards - Similar to LeftSideBar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Code2 className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userPosts.length}</div>
                <div className="text-xs opacity-90">Projects</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Star className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userPosts.length * 10 + 50}</div>
                <div className="text-xs opacity-90">Points</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <CheckCircle className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.min(5, Math.floor(userPosts.length / 2))}</div>
                <div className="text-xs opacity-90">Rating</div>
              </div>
            </div>

            {/* Contributions List */}
            <div className="grid gap-4">
              {isPostsLoading ? (
                <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-8 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md text-center">
                  <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Loading contributions...</h3>
                  <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch your projects</p>
                </div>
              ) : userPosts.length > 0 ? (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {userPosts.map((post, index) => (
                    <div
                      key={post._id}
                      className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300 transform cursor-pointer group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg text-lg">
                          {post.projectName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors text-lg">
                            {post.projectName}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            <Calendar className="w-4 h-4" />
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric'
                            }) : 'Recently'}
                          </p>
                          {post.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                              {post.description}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            onClick={() => {
                              setSelectedPost(post);
                              setShowDeleteModal(true);
                            }}
                          >
                            <Trash2Icon className="w-5 h-5 text-red-500" />
                          </button>
                          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                            <Star className="w-5 h-5 text-yellow-500" />
                          </div>
                          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            #{index + 1}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm p-8 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md text-center">
                  <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No contributions yet</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">Start sharing your code to build your portfolio!</p>
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 rounded-full border border-indigo-200/50 dark:border-indigo-700/50">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ready to share your first project?</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showDeleteModal && <DeletePostModal />}
      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default ProfilePage;