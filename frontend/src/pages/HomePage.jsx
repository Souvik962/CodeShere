import React, { useEffect, useState } from 'react'
import LeftSideBar from '../components/LeftSideBar'
import RightSideBar from '../components/RightSideBar'
import Post from '../components/Post'
import { useAuthStore } from '../store/useAuthStore'
import { usePostStore } from '../store/usePostStore'
import { axiosInstance } from '../lib/axios'
import { Code2, Sparkles, Users, Zap, ArrowUp } from 'lucide-react'

const HomePage = () => {
    const { authUser } = useAuthStore();
    const posts = usePostStore((state) => state.posts);
    const setPosts = usePostStore((state) => state.setPosts);
    const [showGoToTop, setShowGoToTop] = useState(false);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axiosInstance.get('/posts');
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        };
        fetchPosts();
    }, [setPosts]);

    // Handle scroll to show/hide go-to-top button
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            setShowGoToTop(scrollTop > 300); // Show after scrolling 300px
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Smooth scroll to top function
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
            </div>

            <div className="relative flex justify-between min-h-screen w-full items-start gap-6 p-6 max-w-8xl mx-auto">
                {/* Left Sidebar */}
                <div className="w-80 sticky top-6">
                    <div className="transform transition-all duration-300 hover:scale-105">
                        <LeftSideBar />
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 max-w-4xl flex flex-col gap-6">
                    {/* Hero Section */}
                    <div className="relative group">
                        {/* Gradient border effect */}
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

                        <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                            {/* Background decoration */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-600/10 rounded-full blur-2xl"></div>
                            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-600/10 rounded-full blur-2xl"></div>

                            <div className="relative z-10">
                                {/* Logo/Brand section */}
                                <div className="flex items-center justify-center mb-6">
                                    <div className="flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                                        <Code2 className="w-8 h-8 text-white" />
                                        <span className="text-white font-bold text-xl">CodeShare</span>
                                        <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
                                    </div>
                                </div>

                                {/* Welcome Message */}
                                <div className="text-center space-y-4">
                                    <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-gray-800 via-blue-600 to-purple-600 dark:from-white dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight">
                                        Welcome to the Future
                                    </h1>
                                    <div className="flex items-center justify-center gap-2 text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300">
                                        <span>What's brewing,</span>
                                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                            {authUser ? authUser.fullName : "Developer"}
                                        </span>
                                        <span>?</span>
                                        <Zap className="w-8 h-8 text-yellow-500 animate-bounce" />
                                    </div>
                                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
                                        Share your code masterpieces, breakthrough ideas, or exciting projects with our vibrant developer community.
                                    </p>

                                    {/* Quick Stats/Features */}
                                    <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Users className="w-5 h-5 text-blue-500" />
                                            <span>Join 10K+ Developers</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Code2 className="w-5 h-5 text-purple-500" />
                                            <span>Share & Collaborate</span>
                                        </div>
                                        <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                                        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
                                            <Sparkles className="w-5 h-5 text-pink-500" />
                                            <span>Inspire & Get Inspired</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Posts Section */}
                    <div className="space-y-6">
                        {posts && posts.length > 0 ? (
                            <>
                                {/* Posts Header */}
                                <div className="flex items-center gap-3 px-2">
                                    <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex-1"></div>
                                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <Code2 className="w-6 h-6" />
                                        Latest Projects
                                    </h2>
                                    <div className="h-1 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex-1"></div>
                                </div>

                                {/* Posts List */}
                                <div className="space-y-6">
                                    {posts.map((post, index) => (
                                        <div
                                            key={post._id}
                                            className="animate-in fade-in slide-in-from-bottom duration-500"
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >
                                            <Post post={post} currentUser={authUser} />
                                        </div>
                                    ))}
                                </div>

                                {/* Load More Indicator */}
                                <div className="text-center py-8">
                                    <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                                        <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                                        <span className="text-gray-600 dark:text-gray-400 font-medium">You've caught up with all posts!</span>
                                        <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Empty State */
                            <div className="text-center py-16">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
                                    <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl p-12 shadow-2xl border border-gray-200/50 dark:border-gray-700/50 max-w-md mx-auto">
                                        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                                            <Code2 className="w-12 h-12 text-white" />
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                            No Projects Yet
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                            Be the first to share your amazing code! Start the conversation and inspire others.
                                        </p>
                                        <div className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full border border-blue-200/50 dark:border-blue-700/50">
                                            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
                                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Create your first post</span>
                                            <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="w-80 sticky top-6">
                    <div className="transform transition-all duration-300 hover:scale-105">
                        <RightSideBar />
                    </div>
                </div>
            </div>

            {/* Go to Top Button */}
            <button
                onClick={scrollToTop}
                className={`fixed bottom-2 right-8 z-50 group transition-all duration-300 ${showGoToTop
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-16 pointer-events-none'
                    }`}
                aria-label="Go to top"
            >
                {/* Gradient border effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-300"></div>

                <div className="relative bg-white dark:bg-gray-800 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 group-hover:scale-110 transition-all duration-300">
                    <ArrowUp className="w-6 h-6 text-gray-700 dark:text-gray-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300" />
                </div>

                {/* Ripple effect on hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 scale-0 group-hover:scale-110 group-hover:animate-ping transition-all duration-300"></div>
            </button>
        </div>
    )
}

export default HomePage