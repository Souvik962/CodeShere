// src/pages/LoginPage.jsx (Updated with Firebase Social Auth)
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, Code2, Users, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleCaptcha } from "../components/Captcha";
import { useCaptcha } from "../hooks/useCaptcha";
import { useSocialAuth } from "../hooks/useSocialAuth";

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const { login, isLoggingIn } = useAuthStore();
    const {
        captchaToken,
        isCaptchaVerified,
        captchaRef,
        handleCaptchaVerify,
        handleCaptchaError,
        resetCaptcha
    } = useCaptcha();

    const { signInWithGoogle, signInWithFacebook, isLoading: isSocialLoading } = useSocialAuth();

    const validateForm = () => {
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        if (!isCaptchaVerified) return toast.error("Please complete the CAPTCHA verification");
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = validateForm();
        if (success) {
            try {
                await login({ ...formData, captchaToken });
                resetCaptcha();
            } catch (error) {
                resetCaptcha();
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const handleFacebookSignIn = async () => {
        try {
            await signInWithFacebook();
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const isAnyLoading = isLoggingIn || isSocialLoading;

    return (
        <div className="h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-900 dark:from-gray-900 dark:via-blue-900/20 dark:to-purple-900/20 flex justify-center items-center p-4 relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-pink-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-20 left-10 w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                <div className="absolute top-40 right-20 w-3 h-3 bg-blue-300/40 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
                <div className="absolute bottom-32 left-1/3 w-2 h-2 bg-purple-300/40 rounded-full animate-bounce" style={{ animationDelay: '2s' }}></div>
                <div className="absolute bottom-20 right-1/3 w-3 h-3 bg-pink-300/40 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
            </div>

            <div className="relative flex w-full max-w-6xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/20">
                {/* Left section: Welcome message */}
                <div className="flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-blue-600/90 via-purple-600/90 to-pink-600/90 backdrop-blur-sm text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-8 right-8 w-20 h-20 border border-white/20 rounded-full animate-spin-slow"></div>
                    <div className="absolute bottom-8 left-8 w-16 h-16 border border-white/30 rounded-full animate-pulse"></div>
                    <div className="absolute top-1/2 right-4 w-12 h-12 bg-white/10 rounded-full animate-bounce"></div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-sm">
                                <img src="/logo.png" alt="logo" className="h-12 w-12" />
                            </div>
                            <Sparkles className="w-8 h-8 text-yellow-300 animate-pulse" />
                        </div>

                        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                            Code-Share
                        </h1>
                        <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                            Connect with developers around the world and share your code.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3 text-blue-100">
                                <Code2 className="w-5 h-5 text-yellow-300" />
                                <span className="text-sm">Share & collaborate on code</span>
                            </div>
                            <div className="flex items-center gap-3 text-blue-100">
                                <Users className="w-5 h-5 text-green-300" />
                                <span className="text-sm">Connect with developers</span>
                            </div>
                            <div className="flex items-center gap-3 text-blue-100">
                                <Globe className="w-5 h-5 text-purple-300" />
                                <span className="text-sm">Global community</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right section: Login form */}
                <div className="flex flex-col p-12 w-1/2 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
                    <div className="text-center mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                            Welcome Back
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">Sign in to continue your journey</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="form-control flex flex-col gap-2">
                            <label className="label">
                                <span className="label-text font-medium text-lg text-gray-700 dark:text-gray-300">Email</span>
                            </label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10" />
                                <input
                                    type="email"
                                    className="w-full pl-12 pr-4 h-14 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={isAnyLoading}
                                />
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                        </div>

                        <div className="form-control flex flex-col gap-2">
                            <label className="label flex justify-between items-center w-full">
                                <span className="label-text font-medium text-lg text-gray-700 dark:text-gray-300">Password</span>
                                <Link to="/" className="text-blue-600 hover:text-purple-600 text-sm font-medium hover:underline transition-colors duration-200">
                                    Forgot your password?
                                </Link>
                            </label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 z-10" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 backdrop-blur-sm"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isAnyLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors duration-200 z-10"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isAnyLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-focus-within:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
                            </div>
                        </div>

                        {/* CAPTCHA Component */}
                        <div className="flex flex-col items-center bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-200/30 dark:border-gray-600/30">
                            <GoogleCaptcha
                                ref={captchaRef}
                                onVerify={handleCaptchaVerify}
                                onError={handleCaptchaError}
                            />
                            {!isCaptchaVerified && (
                                <p className="text-sm text-red-500 mt-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                                    Please complete CAPTCHA to continue
                                </p>
                            )}
                            {isCaptchaVerified && (
                                <p className="text-sm text-green-500 mt-3 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    CAPTCHA verified successfully!
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-3 p-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-xl backdrop-blur-sm">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                            <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Remember me for 30 days</span>
                        </div>

                        <button
                            type="submit"
                            className={`relative w-full h-14 flex justify-center items-center rounded-xl font-bold transition-all duration-300 transform active:scale-95 overflow-hidden ${isCaptchaVerified && !isAnyLoading
                                    ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl"
                                    : "bg-gray-400 text-gray-600 cursor-not-allowed"
                                }`}
                            disabled={isAnyLoading || !isCaptchaVerified}
                        >
                            {isCaptchaVerified && !isAnyLoading && (
                                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                            )}
                            <span className="relative z-10">
                                {isLoggingIn ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin mr-2" />
                                        Logging In...
                                    </>
                                ) : (
                                    "Sign In"
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-gray-600 dark:text-gray-400">
                            Don't have an account?{" "}
                            <Link to="/signUp" className="font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hover:from-purple-600 hover:to-pink-600 transition-all duration-200">
                                Sign up
                            </Link>
                        </p>
                    </div>

                    <div className="flex items-center my-8">
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                        <span className="mx-6 text-gray-500 dark:text-gray-400 text-sm font-medium bg-white/80 dark:bg-gray-800/80 px-4 py-2 rounded-full backdrop-blur-sm">OR</span>
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button
                            onClick={handleGoogleSignIn}
                            disabled={isAnyLoading}
                            className="group relative flex gap-3 h-14 w-full border-2 border-gray-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white items-center justify-center font-bold rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 backdrop-blur-sm overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isSocialLoading ? (
                                <Loader2 size={20} className="animate-spin relative z-10" />
                            ) : (
                                <img src="/g-logo.png" alt="Google logo" className="h-8 relative z-10" />
                            )}
                            <span className="relative z-10">
                                {isSocialLoading ? "Signing in..." : "Sign in with Google"}
                            </span>
                        </button>

                        <button
                            onClick={handleFacebookSignIn}
                            disabled={isAnyLoading}
                            className="group relative flex gap-3 h-14 w-full border-2 border-gray-200/50 dark:border-gray-600/50 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-white items-center justify-center font-bold rounded-xl hover:border-blue-300 dark:hover:border-blue-500 transition-all duration-300 backdrop-blur-sm overflow-hidden disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isSocialLoading ? (
                                <Loader2 size={20} className="animate-spin relative z-10" />
                            ) : (
                                <img src="/fb-logo.png" alt="Facebook logo" className="h-8 rounded-full relative z-10" />
                            )}
                            <span className="relative z-10">
                                {isSocialLoading ? "Signing in..." : "Sign in with Facebook"}
                            </span>
                        </button>
                    </div>
                </div>
            </div>

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
                    animation: spin-slow 8s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default LoginPage;