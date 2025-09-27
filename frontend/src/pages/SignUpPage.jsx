// src/pages/SignUpPage.jsx (Updated with Firebase Social Auth)
import { useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { Eye, EyeOff, Loader2, Lock, Mail, User, Check, X, Shield, Star, Users, Code, Zap, Send } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { GoogleCaptcha } from "../components/Captcha";
import { useCaptcha } from "../hooks/useCaptcha";
import { useSocialAuth } from "../hooks/useSocialAuth";

const SignUpPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
    });
    const [otpData, setOtpData] = useState({
        otp: "",
        isOtpSent: false,
        isOtpVerified: false,
    });

    const { signup, isSigningUp, sendOtp, isSendingOtp, verifyOtp, isVerifyingOtp } = useAuthStore();
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
        if (!formData.fullName.trim()) return toast.error("Full name is required");
        if (!formData.email.trim()) return toast.error("Email is required");
        if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
        if (!otpData.isOtpVerified) return toast.error("Please verify your email with OTP");
        if (!formData.password) return toast.error("Password is required");
        if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");
        if (!isCaptchaVerified) return toast.error("Please complete the CAPTCHA verification");
        return true;
    };

    const handleSendOtp = async () => {
        if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
            return toast.error("Please enter a valid email address first");
        }

        try {
            await sendOtp({ email: formData.email });
            setOtpData(prev => ({
                ...prev,
                isOtpSent: true,
            }));
        } catch (error) {
            console.error("Error sending OTP:", error);
        }
    };

    const handleVerifyOtp = async () => {
        if (!otpData.otp || otpData.otp.length < 6) {
            return toast.error("Please enter a valid 6-digit OTP");
        }

        try {
            await verifyOtp({
                email: formData.email,
                otp: otpData.otp
            });

            setOtpData(prev => ({
                ...prev,
                isOtpVerified: true,
            }));
        } catch (error) {
            console.error("Error verifying OTP:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const success = validateForm();
        if (success) {
            try {
                await signup({ ...formData, captchaToken });
                resetCaptcha();
            } catch (error) {
                resetCaptcha();
            }
        }
    };

    const handleGoogleSignUp = async () => {
        try {
            await signInWithGoogle();
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    const handleFacebookSignUp = async () => {
        try {
            await signInWithFacebook();
        } catch (error) {
            // Error is already handled in the hook
        }
    };

    // Password strength indicator
    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
        if (password.match(/\d/)) strength++;
        if (password.match(/[^a-zA-Z\d]/)) strength++;
        return strength;
    };

    const passwordStrength = getPasswordStrength(formData.password);
    const isAnyLoading = isSigningUp || isSocialLoading;

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex justify-center items-center p-4">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-pulse animation-delay-2000"></div>
                <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-70 animate-pulse animation-delay-4000"></div>
            </div>

            <div className="relative flex w-full max-w-6xl bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700/20">
                {/* Left section: Welcome message with enhanced design */}
                <div className="hidden lg:flex flex-col justify-center p-12 w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white relative overflow-hidden">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

                    <div className="relative z-10">
                        <div className="flex items-center mb-8">
                            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                                <img src="/logo.png" alt="logo" className="h-12 w-12" />
                            </div>
                            <div className="ml-4">
                                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                                    Code-Share
                                </h1>
                            </div>
                        </div>

                        <h2 className="text-2xl font-semibold mb-4">Feel free to explore and contribute!</h2>
                        <p className="text-xl mb-8 text-blue-100 leading-relaxed">
                            Connect with developers around the world and share your code in a secure, collaborative environment.
                        </p>

                        {/* Feature highlights */}
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 rounded-lg mr-3">
                                    <Users className="h-5 w-5" />
                                </div>
                                <span className="text-blue-100">Global developer community</span>
                            </div>
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 rounded-lg mr-3">
                                    <Shield className="h-5 w-5" />
                                </div>
                                <span className="text-blue-100">Enterprise-grade security</span>
                            </div>
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 rounded-lg mr-3">
                                    <Code className="h-5 w-5" />
                                </div>
                                <span className="text-blue-100">Real-time collaboration</span>
                            </div>
                            <div className="flex items-center">
                                <div className="p-2 bg-white/20 rounded-lg mr-3">
                                    <Zap className="h-5 w-5" />
                                </div>
                                <span className="text-blue-100">Lightning-fast sharing</span>
                            </div>
                        </div>
                        <p className="text-blue-100/80 text-sm text-center mt-6">
                            **Note: if you do not get the OTP, please check your spam folder or try resending it.
                        </p>
                    </div>
                </div>

                {/* Right section: Enhanced sign-up form */}
                <div className="flex flex-col p-8 lg:p-12 w-full lg:w-1/2">
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">
                            Create Account
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 text-lg">Start your coding journey today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Full Name Field */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Full Name *
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                                    placeholder="Enter your full name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    disabled={isAnyLoading}
                                />
                                {formData.fullName && (
                                    <Check className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-500 h-5 w-5" />
                                )}
                            </div>
                        </div>

                        {/* Email Field with inline Send OTP button */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Email Address *
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type="email"
                                    className={`w-full pl-12 ${otpData.isOtpVerified ? 'pr-12' : 'pr-28'} py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500`}
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    disabled={otpData.isOtpVerified || isAnyLoading}
                                />

                                {/* Show Send OTP button inside input if email is valid but not verified */}
                                {formData.email && /\S+@\S+\.\S+/.test(formData.email) && !otpData.isOtpVerified && (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isSendingOtp || isAnyLoading}
                                        className="absolute right-2 top-1/2 transform -translate-y-1/2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1"
                                    >
                                        {isSendingOtp ? (
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                        ) : (
                                            <Send className="h-3 w-3" />
                                        )}
                                        {isSendingOtp ? 'Sending...' : 'Send OTP'}
                                    </button>
                                )}

                                {/* Show verified check mark if email is verified */}
                                {otpData.isOtpVerified && (
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center text-green-500">
                                        <Check className="h-5 w-5" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* OTP Verification Field - Only show if OTP is sent */}
                        {otpData.isOtpSent && !otpData.isOtpVerified && (
                            <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800 space-y-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Mail className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        Verify Your Email
                                    </h3>
                                </div>

                                <div className="flex gap-3">
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength={6}
                                            value={otpData.otp}
                                            onChange={(e) => setOtpData(prev => ({ ...prev, otp: e.target.value.replace(/\D/g, '') }))}
                                            className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all text-center text-lg font-mono tracking-widest"
                                            disabled={isAnyLoading}
                                        />
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleVerifyOtp}
                                        disabled={isVerifyingOtp || otpData.otp.length < 6 || isAnyLoading}
                                        className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap"
                                    >
                                        {isVerifyingOtp ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Shield className="h-4 w-4" />
                                        )}
                                        Verify
                                    </button>
                                </div>

                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center text-amber-600 dark:text-amber-400">
                                        <Shield className="h-4 w-4 mr-2" />
                                        <span>OTP sent to {formData.email}</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={isSendingOtp || isAnyLoading}
                                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium hover:underline disabled:opacity-50"
                                    >
                                        {isSendingOtp ? 'Sending...' : 'Resend OTP'}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Show verification success message */}
                        {otpData.isOtpVerified && (
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800">
                                <div className="flex items-center text-green-600 dark:text-green-400">
                                    <Check className="h-5 w-5 mr-3" />
                                    <span className="font-medium">Email verification successful!</span>
                                </div>
                            </div>
                        )}

                        {/* Password Field with Strength Indicator */}
                        <div className="group">
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className="w-full pl-12 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 hover:border-gray-300 dark:hover:border-gray-500"
                                    placeholder="Create a strong password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    disabled={isAnyLoading}
                                />
                                <button
                                    type="button"
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isAnyLoading}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>

                            {/* Password Strength Indicator */}
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex space-x-1">
                                        {[1, 2, 3, 4].map((level) => (
                                            <div
                                                key={level}
                                                className={`h-2 flex-1 rounded-full transition-colors ${passwordStrength >= level
                                                    ? passwordStrength === 1
                                                        ? 'bg-red-500'
                                                        : passwordStrength === 2
                                                            ? 'bg-yellow-500'
                                                            : passwordStrength === 3
                                                                ? 'bg-blue-500'
                                                                : 'bg-green-500'
                                                    : 'bg-gray-200 dark:bg-gray-600'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-xs mt-1 text-gray-600 dark:text-gray-400">
                                        {passwordStrength === 1 && 'Weak password'}
                                        {passwordStrength === 2 && 'Fair password'}
                                        {passwordStrength === 3 && 'Good password'}
                                        {passwordStrength === 4 && 'Strong password'}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* CAPTCHA Component with enhanced styling */}
                        <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600">
                            <div className="flex flex-col items-center">
                                <GoogleCaptcha
                                    ref={captchaRef}
                                    onVerify={handleCaptchaVerify}
                                    onError={handleCaptchaError}
                                />
                                {!isCaptchaVerified && (
                                    <div className="flex items-center mt-3 text-amber-600 dark:text-amber-400">
                                        <Shield className="h-4 w-4 mr-2" />
                                        <p className="text-sm">Please complete security verification</p>
                                    </div>
                                )}
                                {isCaptchaVerified && (
                                    <div className="flex items-center mt-3 text-green-600 dark:text-green-400">
                                        <Check className="h-4 w-4 mr-2" />
                                        <p className="text-sm font-medium">Security verified successfully!</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform ${isCaptchaVerified && otpData.isOtpVerified && !isAnyLoading
                                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-400 cursor-not-allowed"
                                }`}
                            disabled={isAnyLoading || !isCaptchaVerified || !otpData.isOtpVerified}
                        >
                            {isSigningUp ? (
                                <>
                                    <Loader2 size={20} className="animate-spin inline mr-2" />
                                    Creating Your Account...
                                </>
                            ) : (
                                "Create Account"
                            )}
                        </button>
                    </form>

                    {/* Sign In Link */}
                    <div className="text-center mt-8">
                        <p className="text-gray-600 dark:text-gray-400">
                            Already have an account?{" "}
                            <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                            >
                                Sign in here
                            </Link>
                        </p>
                    </div>

                    {/* Divider */}
                    <div className="flex items-center my-8">
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                        <span className="mx-4 text-gray-500 dark:text-gray-400 text-sm font-medium bg-white dark:bg-gray-800 px-3">
                            OR CONTINUE WITH
                        </span>
                        <div className="flex-grow h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"></div>
                    </div>

                    {/* Social Login Buttons - Updated with Firebase functionality */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                            onClick={handleGoogleSignUp}
                            disabled={isAnyLoading}
                            className="group relative flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isSocialLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin relative z-10" />
                            ) : (
                                <img src="/g-logo.png" alt="Google logo" className="h-5 w-5 relative z-10" />
                            )}
                            <span className="relative z-10">
                                {isSocialLoading ? 'Creating...' : 'Google'}
                            </span>
                        </button>

                        <button
                            onClick={handleFacebookSignUp}
                            disabled={isAnyLoading}
                            className="group relative flex items-center justify-center gap-3 py-3 px-4 border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium rounded-xl hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            {isSocialLoading ? (
                                <Loader2 className="h-5 w-5 animate-spin relative z-10" />
                            ) : (
                                <img src="/fb-logo.png" alt="Facebook logo" className="h-5 w-5 relative z-10" />
                            )}
                            <span className="relative z-10">
                                {isSocialLoading ? 'Creating...' : 'Facebook'}
                            </span>
                        </button>
                    </div>

                    {/* Trust indicators */}
                    <div className="mt-8 text-center">
                        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                            Trusted by developers at
                        </p>
                        <div className="flex items-center justify-center space-x-6 opacity-60">
                            <span className="font-semibold text-gray-600 dark:text-gray-400">Google</span>
                            <span className="font-semibold text-gray-600 dark:text-gray-400">Microsoft</span>
                            <span className="font-semibold text-gray-600 dark:text-gray-400">GitHub</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUpPage;