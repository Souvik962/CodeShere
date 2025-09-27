import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Code, Calendar, User, Globe, Lock, Eye, Heart, MessageCircle, Trash2 } from 'lucide-react';
import { usePostStore } from '../store/usePostStore';

const SearchOverlay = ({ isOpen, onClose }) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const searchInputRef = useRef(null);
    const { posts } = usePostStore();
    const [selectedPost, setSelectedPost] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // Focus search input when overlay opens
    useEffect(() => {
        if (isOpen && searchInputRef.current) {
            setTimeout(() => {
                searchInputRef.current.focus();
            }, 100);
        }
    }, [isOpen]);

    // Handle search functionality
    useEffect(() => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        // Debounce search
        const debounceTimer = setTimeout(() => {
            const filteredPosts = posts.filter(post =>
                post.projectName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                post.programmingLanguage.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (post.senderId?.fullName && post.senderId.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
                post.projectCode.toLowerCase().includes(searchQuery.toLowerCase())
            );

            setSearchResults(filteredPosts);
            setIsSearching(false);
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [searchQuery, posts]);

    // Handle escape key
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setSearchQuery('');
        setSearchResults([]);
        setSelectedPost(null);
        setShowViewModal(false);
        setShowDeleteModal(false);
        onClose();
    };

    const handleResultClick = (post) => {
        setSelectedPost(post);
        setShowViewModal(true);
    };

    const truncateText = (text, maxLength = 100) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
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
                        className="hidden"
                    >
                    </button>
                </div>
            </div>
        </div>
    );

    const highlightText = (text, query) => {
        if (!query.trim()) return text;

        const regex = new RegExp(`(${query})`, 'gi');
        const parts = text.split(regex);

        return parts.map((part, index) =>
            regex.test(part) ? (
                <span key={index} className="bg-yellow-200 dark:bg-yellow-800 text-yellow-900 dark:text-yellow-100 font-semibold">
                    {part}
                </span>
            ) : (
                <span key={index}>{part}</span>
            )
        );
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16">
            {/* Background blur overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
                onClick={handleClose}
            />

            {/* Search container */}
            <div className="relative w-full max-w-4xl mx-4 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 animate-in zoom-in-95 fade-in duration-300">

                {/* Search Header */}
                <div className="flex items-center gap-4 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                    <Search className="w-6 h-6 text-gray-400" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder="Search posts, projects, languages, or authors..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 text-xl bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button
                        onClick={handleClose}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                    {isSearching ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                            <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
                        </div>
                    ) : searchQuery.trim() === '' ? (
                        <div className="text-center py-12">
                            <Search className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                Start typing to search
                            </h3>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">
                                Find posts by project name, programming language, author, or code content
                            </p>
                        </div>
                    ) : searchResults.length > 0 ? (
                        <div className="p-4 space-y-3">
                            <div className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''}
                            </div>
                            {searchResults.map((post) => (
                                <div
                                    key={post._id}
                                    className="group p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-all duration-200 border border-gray-200/30 dark:border-gray-600/30 hover:border-blue-300 dark:hover:border-blue-600"
                                >
                                    <div className="flex items-start gap-4">
                                        {/* Project Icon */}
                                        <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-105 transition-transform">
                                            {post.projectName.charAt(0).toUpperCase()}
                                        </div>

                                        {/* Post Content */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {highlightText(post.projectName, searchQuery)}
                                            </h3>

                                            <div className="flex items-center gap-4 mb-2 text-sm text-gray-600 dark:text-gray-400">
                                                <div className="flex items-center gap-1">
                                                    <User className="w-4 h-4" />
                                                    <span>{post.senderId?.fullName || 'Anonymous'}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Code className="w-4 h-4" />
                                                    <span className="capitalize">{post.programmingLanguage}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {post.privacy === 'public' ? (
                                                        <>
                                                            <Globe className="w-4 h-4 text-green-500" />
                                                            <span className="text-green-600 dark:text-green-400">Public</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Lock className="w-4 h-4 text-orange-500" />
                                                            <span className="text-orange-600 dark:text-orange-400">Private</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                                                {highlightText(truncateText(post.projectCode), searchQuery)}
                                            </p>

                                            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-500">
                                                <span>{post.likes || 0} likes</span>
                                                <span>{post.comments?.length || 0} comments</span>
                                                <div className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleResultClick(post);
                                                        }}
                                                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                                                    >
                                                        <Eye className="w-4 h-4" />
                                                        View Post
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Search className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                No results found
                            </h3>
                            <p className="text-gray-500 dark:text-gray-500 text-sm">
                                Try searching for different keywords or check your spelling
                            </p>
                        </div>
                    )}
                </div>

                {/* Quick Tips */}
                {searchQuery.trim() === '' && (
                    <div className="p-6 border-t border-gray-200/50 dark:border-gray-700/50">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="text-center">
                                <Code className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                                <span className="text-gray-600 dark:text-gray-400">Languages</span>
                            </div>
                            <div className="text-center">
                                <User className="w-6 h-6 text-purple-500 mx-auto mb-1" />
                                <span className="text-gray-600 dark:text-gray-400">Authors</span>
                            </div>
                            <div className="text-center">
                                <Search className="w-6 h-6 text-green-500 mx-auto mb-1" />
                                <span className="text-gray-600 dark:text-gray-400">Projects</span>
                            </div>
                            <div className="text-center">
                                <Globe className="w-6 h-6 text-orange-500 mx-auto mb-1" />
                                <span className="text-gray-600 dark:text-gray-400">Content</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {showViewModal && <ViewPostModal />}
        </div>
    );
};

export default SearchOverlay;