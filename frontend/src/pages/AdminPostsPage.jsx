import React, { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Filter,
  Eye,
  Trash2,
  Code,
  Calendar,
  User,
  Globe,
  Lock,
  Heart,
  MessageCircle,
  AlertTriangle,
  X,
  MoreVertical,
  PanelLeft
} from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminPostsPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedPrivacy, setSelectedPrivacy] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReason, setDeleteReason] = useState('');

  const languages = [
    'javascript', 'python', 'java', 'c', 'cpp', 'csharp', 'php', 'ruby',
    'go', 'rust', 'swift', 'kotlin', 'typescript', 'html', 'css', 'sql'
  ];

  useEffect(() => {
    fetchPosts();
  }, [currentPage, searchQuery, selectedLanguage, selectedPrivacy]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '20',
        ...(searchQuery && { search: searchQuery }),
        ...(selectedLanguage && { language: selectedLanguage }),
        ...(selectedPrivacy && { privacy: selectedPrivacy })
      });

      const response = await axiosInstance.get(`/admin/posts?${params}`);
      setPosts(response.data.posts);
      setTotalPages(response.data.totalPages);
      setTotalPosts(response.data.totalPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axiosInstance.delete(`/admin/posts/${postId}`, {
        data: { reason: deleteReason }
      });
      toast.success('Post deleted successfully');
      fetchPosts();
      setShowDeleteModal(false);
      setDeleteReason('');
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast.error('Failed to delete post');
    }
  };

  const truncateCode = (code, maxLength = 200) => {
    if (code.length <= maxLength) return code;
    return code.substring(0, maxLength) + '...';
  };

  const ViewPostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Modal Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{selectedPost?.projectName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              by {selectedPost?.senderId?.fullName} • {new Date(selectedPost?.createdAt).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => setShowViewModal(false)}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Post Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Programming Language
                </label>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                  <Code className="w-4 h-4 mr-1" />
                  {selectedPost?.programmingLanguage}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Privacy
                </label>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${selectedPost?.privacy === 'public'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                  }`}>
                  {selectedPost?.privacy === 'public' ? <Globe className="w-4 h-4 mr-1" /> : <Lock className="w-4 h-4 mr-1" />}
                  {selectedPost?.privacy}
                </span>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Engagement
                </label>
                <div className="flex items-center gap-4">
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <Heart className="w-4 h-4 mr-1 text-red-500" />
                    {selectedPost?.likes || 0} likes
                  </span>
                  <span className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                    <MessageCircle className="w-4 h-4 mr-1 text-blue-500" />
                    {selectedPost?.comments?.length || 0} comments
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Author
                </label>
                <div className="flex items-center gap-2">
                  <img
                    src={selectedPost?.senderId?.profilePic || '/avatar.png'}
                    alt={selectedPost?.senderId?.fullName}
                    className="w-6 h-6 rounded-full object-cover"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedPost?.senderId?.fullName}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Code Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Code Content
            </label>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-green-400 text-sm font-mono whitespace-pre-wrap">
                {selectedPost?.projectCode}
              </pre>
            </div>
          </div>

          {/* Comments */}
          {selectedPost?.comments && selectedPost.comments.length > 0 && (
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Comments ({selectedPost.comments.length})
              </label>
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {selectedPost.comments.map((comment, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <img
                        src={comment.author?.profilePic || '/avatar.png'}
                        alt={comment.author?.fullName}
                        className="w-6 h-6 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {comment.author?.fullName}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {new Date(comment.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {comment.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3">
          <button
            onClick={() => setShowViewModal(false)}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              setShowViewModal(false);
              setShowDeleteModal(true);
            }}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Delete Post
          </button>
        </div>
      </div>
    </div>
  );

  const DeletePostModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Delete Post</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Are you sure you want to delete the post "<strong>{selectedPost?.projectName}</strong>"? This action cannot be undone.
          </p>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-left">
              Reason for deletion (Optional)
            </label>
            <textarea
              value={deleteReason}
              onChange={(e) => setDeleteReason(e.target.value)}
              placeholder="Enter reason for deleting this post..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none"
              rows="3"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowDeleteModal(false);
                setDeleteReason('');
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-green-600 to-blue-600 rounded-xl">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Posts Management</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Review and manage all code posts</p>
              </div>
            </div>
            <div className="flex justify-center items-center gap-3">
              <Link className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" to="/admin/dashboard" title='Go to Dashboard'>
                <PanelLeft className="w-5 h-5" />
              </Link>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {totalPosts} total posts
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative md:col-span-2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Language Filter */}
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Languages</option>
              {languages.map((lang) => (
                <option key={lang} value={lang} className="capitalize">
                  {lang}
                </option>
              ))}
            </select>

            {/* Privacy Filter */}
            <select
              value={selectedPrivacy}
              onChange={(e) => setSelectedPrivacy(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Privacy</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>

            {/* Clear Filters */}
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedLanguage('');
                setSelectedPrivacy('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg animate-pulse">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                </div>
              </div>
            ))
          ) : posts.length > 0 ? (
            posts.map((post) => (
              <div key={post._id} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.senderId?.profilePic || '/avatar.png'}
                      alt={post.senderId?.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">
                        {post.projectName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {post.senderId?.fullName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${post.privacy === 'public'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400'
                      }`}>
                      {post.privacy === 'public' ? <Globe className="w-3 h-3 mr-1" /> : <Lock className="w-3 h-3 mr-1" />}
                      {post.privacy}
                    </span>
                  </div>
                </div>

                {/* Language Badge */}
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400 capitalize">
                    <Code className="w-4 h-4 mr-1" />
                    {post.programmingLanguage}
                  </span>
                </div>

                {/* Code Preview */}
                <div className="bg-gray-900 rounded-lg p-3 mb-4 overflow-hidden">
                  <pre className="text-green-400 text-xs font-mono whitespace-pre-wrap">
                    {truncateCode(post.projectCode)}
                  </pre>
                </div>

                {/* Post Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Heart className="w-4 h-4 text-red-500" />
                      {post.likes || 0}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageCircle className="w-4 h-4 text-blue-500" />
                      {post.comments?.length || 0}
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowViewModal(true);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPost(post);
                      setShowDeleteModal(true);
                    }}
                    className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts found</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg ${pageNum === currentPage
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Modals */}
      {showViewModal && <ViewPostModal />}
      {showDeleteModal && <DeletePostModal />}
    </div>
  );
};

export default AdminPostsPage;