import React, { useState, useEffect } from 'react';
import { Copy, Ellipsis, Globe, Maximize2, MessageCircle, Share2, ThumbsUp, Heart, Send, X, Lock, Users } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const Post = ({ post, currentUser }) => {
  const { _id, senderId, projectName, programmingLanguage, projectCode, privacy, createdAt } = post;
  const user = senderId && typeof senderId === 'object' ? senderId : {};
  const { authUser } = useAuthStore();

  // Get functions from store
  const { likePost, addComment, deleteComment } = usePostStore();

  // State
  const [likes, setLikes] = useState(post.likes || 0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState(post.comments || []);
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isCodeExpanded, setIsCodeExpanded] = useState(false);
  const [isLikeLoading, setIsLikeLoading] = useState(false);

  // Check if current user has liked this post
  useEffect(() => {
    if (post.likedBy && currentUser) {
      setLiked(post.likedBy.includes(currentUser._id));
    }
    setLikes(post.likes || 0);
    setComments(post.comments || []);
  }, [post.likedBy, post.likes, post.comments, currentUser]);

  // Like handler using store
  const handleLike = async () => {
    if (!currentUser || isLikeLoading) return;

    setIsLikeLoading(true);

    try {
      const response = await likePost(_id);
      setLikes(response.likes);
      setLiked(response.isLiked);

      if (response.isLiked) {
        toast.success("❤️ You liked this post!");
      } else {
        toast("Like removed", { icon: "ℹ️" });
      }
    } catch (error) {
      console.error("Failed to update like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // Comment handler using store
  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim() || !currentUser) return;

    try {
      const newComment = await addComment(_id, commentText);
      setComments(prev => [...prev, newComment]);
      setCommentText("");
      toast.success("💬 Comment added!");
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  // Delete comment handler using store
  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(_id, commentId);
      setComments(prev => prev.filter(c => c._id !== commentId));
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  // Share functionality
  const handleShare = (type) => {
    const postUrl = window.location.href;
    const postTitle = `Check out this ${programmingLanguage} project: ${projectName}`;

    switch (type) {
      case 'copy':
        navigator.clipboard.writeText(postUrl);
        toast.success("🔗 Link copied to clipboard!");
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(postTitle)}&url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(postTitle + ' ' + postUrl)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(postUrl);
        toast.success("🔗 Link copied!");
    }
    setShowShareModal(false);
  };

  // Copy code functionality
  const handleCopyCode = () => {
    navigator.clipboard.writeText(projectCode);
    toast.success("📋 Code copied to clipboard!");
  };

  return (
    <div className="relative group">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-300"></div>

      <div className="relative flex flex-col w-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 dark:border-gray-700/50 p-6 mb-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.01]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={user.profilePic || "/avatar.png"}
                alt="avatar"
                className="rounded-full w-14 h-14 border-3 border-gradient-to-r from-blue-400 to-purple-500 object-cover shadow-lg"
              />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"></div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg text-gray-900 dark:text-white bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text">
                {user.fullName || "Anonymous User"}
              </h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span className="font-medium">{createdAt ? new Date(createdAt).toLocaleDateString() : "Today"}</span>
                <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                {privacy === "public" ? (
                  <div className="flex items-center gap-1 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full">
                    <Globe size={12} />
                    <span className="text-xs font-medium">Public</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 rounded-full">
                    <Lock size={12} />
                    <span className="text-xs font-medium">Private</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 hover:scale-110">
              <Ellipsis size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
          </div>
        </div>

        {/* Post content */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 dark:from-gray-200 dark:via-gray-300 dark:to-gray-400 bg-clip-text">
            {projectName}
          </h2>

          <div className="mb-6 flex items-center gap-3">
            <h3 className='text-lg font-semibold text-gray-600 dark:text-gray-400'>Language:</h3>
            <div className="relative">
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                {programmingLanguage}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur opacity-30"></div>
            </div>
          </div>

          <div className="relative border border-gray-300/50 dark:border-gray-600/50 rounded-2xl overflow-hidden shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"></div>
            <pre className={`relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-green-400 p-6 overflow-x-auto text-sm transition-all duration-500 ${isCodeExpanded ? 'max-h-none' : 'max-h-80 overflow-y-hidden'
              }`}>
              {projectCode === '[PRIVATE]' || (privacy === "private" && authUser?._id !== user._id) ? (
                <div className="flex flex-col items-center justify-center h-full min-h-[200px] gap-4">
                  <div className="relative">
                    <Lock size={64} className="text-red-500/80 animate-pulse" />
                    <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full"></div>
                  </div>
                  <div className="text-center space-y-2">
                    <code className="block font-mono text-xl font-bold leading-relaxed text-red-500">
                      🔒 Private Code
                    </code>
                    <code className="block font-mono text-sm leading-relaxed text-red-400/80">
                      This content is only visible to the contributor
                    </code>
                    <code className="block font-mono text-sm leading-relaxed text-red-400/80">
                      if You want to see this code, please contact the contributor.
                    </code>
                  </div>
                  <div className="px-6 py-2 bg-red-500/10 border border-red-500/30 rounded-full">
                    <span className="text-xs font-semibold text-red-400">RESTRICTED ACCESS</span>
                  </div>
                </div>
              ) : (
                <code className="font-mono leading-relaxed">{projectCode}</code>
              )}
              {!isCodeExpanded && (
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent"></div>
              )}
            </pre>
            <div className="absolute top-4 right-4 flex gap-2">
              <button
                onClick={handleCopyCode}
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 border border-white/20"
                title="Copy code"
              >
                <Copy size={16} />
              </button>
              <button
                onClick={() => setIsCodeExpanded(!isCodeExpanded)}
                className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-200 hover:scale-110 border border-white/20"
                title={isCodeExpanded ? "Collapse" : "Expand"}
              >
                <Maximize2 size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Stats */}
        {(likes > 0 || comments.length > 0) && (
          <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-4 px-2">
            <div className="flex items-center gap-3">
              {likes > 0 && (
                <span className="flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 rounded-full">
                  <Heart size={16} className="text-red-500" />
                  <span className="font-medium text-red-600 dark:text-red-400">{likes} {likes === 1 ? 'like' : 'likes'}</span>
                </span>
              )}
            </div>
            {comments.length > 0 && (
              <button
                onClick={() => setShowComments(!showComments)}
                className="hover:underline font-medium px-3 py-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {comments.length} {comments.length === 1 ? 'comment' : 'comments'}
              </button>
            )}
          </div>
        )}

        {/* Interaction buttons */}
        <div className="flex gap-2 border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
          <button
            onClick={handleLike}
            disabled={isLikeLoading || !currentUser}
            className={`flex-1 flex justify-center items-center gap-2 p-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed ${liked
              ? "text-blue-600 bg-blue-50 dark:bg-blue-900/20 shadow-lg"
              : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
              }`}
          >
            <ThumbsUp size={20} className={`${liked ? "fill-current" : ""} transition-transform duration-200`} />
            <span>{liked ? "Liked" : "Like"}</span>
          </button>

          <button
            onClick={() => {
              setShowComments(!showComments);
              if (!showComments) {
                setTimeout(() => document.getElementById(`comment-box-${_id}`)?.focus(), 100);
              }
            }}
            className="flex-1 flex justify-center items-center gap-2 p-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
          >
            <MessageCircle size={20} />
            <span>Comment</span>
          </button>

          <button
            onClick={() => setShowShareModal(true)}
            className="flex-1 flex justify-center items-center gap-2 p-3 rounded-xl font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105"
          >
            <Share2 size={20} />
            <span>Share</span>
          </button>
        </div>

        {/* Comments section */}
        {showComments && (
          <div className="mt-6 border-t border-gray-200/50 dark:border-gray-700/50 pt-6 animate-in slide-in-from-top duration-300">
            {/* Comment input */}
            {currentUser && (
              <div className="flex gap-3 mb-6">
                <img
                  src={currentUser?.profilePic || "/avatar.png"}
                  alt="Your avatar"
                  className="rounded-full w-10 h-10 object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                />
                <div className="flex-1 flex gap-3">
                  <input
                    id={`comment-box-${_id}`}
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleComment(e);
                      }
                    }}
                    placeholder="Write a comment..."
                    className="flex-1 border border-gray-300/50 dark:border-gray-600/50 px-4 py-3 rounded-full dark:bg-gray-700/50 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 hover:scale-105 shadow-lg"
                  >
                    <Send size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Comments list */}
            {comments.length > 0 && (
              <div className="space-y-4">
                {comments.map((comment, index) => (
                  <div key={comment._id || index} className="flex gap-3 animate-in fade-in duration-300">
                    <img
                      src={comment.author?.profilePic || "/avatar.png"}
                      alt="Commenter avatar"
                      className="rounded-full w-9 h-9 object-cover border-2 border-gray-200 dark:border-gray-600 shadow-sm"
                    />
                    <div className="flex-1">
                      <div className="bg-gray-100/80 dark:bg-gray-700/50 rounded-2xl px-4 py-3 backdrop-blur-sm">
                        <div className="font-semibold text-sm text-gray-900 dark:text-white mb-1">
                          {comment.author?.fullName || "Anonymous"}
                        </div>
                        <div className="text-gray-700 dark:text-gray-300 leading-relaxed">
                          {comment.text}
                        </div>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span className="font-medium">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : "Just now"}</span>
                        <button className="hover:underline hover:text-blue-500 transition-colors">Like</button>
                        <button className="hover:underline hover:text-blue-500 transition-colors">Reply</button>
                        {comment.author?._id === currentUser?._id && (
                          <button
                            onClick={() => handleDeleteComment(comment._id)}
                            className="hover:underline text-red-500 hover:text-red-600 transition-colors"
                          >
                            Delete
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Share Modal */}
        {showShareModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
            <div className="bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 duration-300">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold dark:text-white bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text">Share this post</h3>
                <button
                  onClick={() => setShowShareModal(false)}
                  className="p-2 rounded-full hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-all duration-200 hover:scale-110"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-2">
                <button
                  onClick={() => handleShare('copy')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="p-2 bg-gray-100 dark:bg-gray-700 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <Copy size={20} />
                  </div>
                  <span className="font-medium">Copy link</span>
                </button>
                <button
                  onClick={() => handleShare('facebook')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="p-2 bg-blue-600 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </div>
                  <span className="font-medium">Share on Facebook</span>
                </button>
                <button
                  onClick={() => handleShare('twitter')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="p-2 bg-blue-400 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </div>
                  <span className="font-medium">Share on Twitter</span>
                </button>
                <button
                  onClick={() => handleShare('linkedin')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="p-2 bg-blue-700 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </div>
                  <span className="font-medium">Share on LinkedIn</span>
                </button>
                <button
                  onClick={() => handleShare('whatsapp')}
                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100/80 dark:hover:bg-gray-700/50 transition-all duration-200 hover:scale-105 group"
                >
                  <div className="p-2 bg-green-500 rounded-full group-hover:scale-110 transition-transform duration-200">
                    <div className="w-5 h-5 bg-white rounded-sm"></div>
                  </div>
                  <span className="font-medium">Share on WhatsApp</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Post;