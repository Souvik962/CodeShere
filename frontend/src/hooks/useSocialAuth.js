// src/hooks/useSocialAuth.js (COOP-friendly version)
import { useState } from 'react';
import { signInWithPopup, signInWithRedirect, getRedirectResult } from 'firebase/auth';
import { auth, googleProvider, facebookProvider } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

export const useSocialAuth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { socialAuth } = useAuthStore();

  // Helper function to handle authentication result
  const handleAuthResult = async (result, provider) => {
    if (!result || !result.user) {
      throw new Error('No user data received');
    }

    const user = result.user;

    const userData = {
      firebaseUid: user.uid,
      email: user.email,
      fullName: user.displayName || 'User',
      profilePic: user.photoURL || '/avatar.png',
      provider: provider
    };

    await socialAuth(userData);
    return userData;
  };

  // Solution 1: Use redirect instead of popup for better COOP compatibility
  const signInWithGoogleRedirect = async () => {
    setIsLoading(true);
    try {
      await signInWithRedirect(auth, googleProvider);
      // The redirect will handle the rest, no need to await here
    } catch (error) {
      console.error('Google redirect sign in error:', error);
      toast.error('Failed to redirect to Google. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  const signInWithFacebookRedirect = async () => {
    setIsLoading(true);
    try {
      await signInWithRedirect(auth, facebookProvider);
      // The redirect will handle the rest, no need to await here
    } catch (error) {
      console.error('Facebook redirect sign in error:', error);
      toast.error('Failed to redirect to Facebook. Please try again.');
      setIsLoading(false);
      throw error;
    }
  };

  // Solution 2: Enhanced popup with better error handling
  const signInWithGooglePopup = async () => {
    setIsLoading(true);
    try {
      // Configure popup settings to minimize COOP issues
      const result = await signInWithPopup(auth, googleProvider);
      await handleAuthResult(result, 'google');
      toast.success('Successfully signed in with Google!');
    } catch (error) {
      console.error('Google popup sign in error:', error);

      // Ignore COOP-related errors as they don't affect functionality
      if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        // Try to get the result anyway, as auth might have succeeded
        try {
          const redirectResult = await getRedirectResult(auth);
          if (redirectResult) {
            await handleAuthResult(redirectResult, 'google');
            toast.success('Successfully signed in with Google!');
            return;
          }
        } catch (redirectError) {
          console.log('No redirect result available');
        }
      }

      // Handle other popup errors
      if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups or try the redirect option.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/network-request-failed') {
        toast.error('Network error. Please check your connection.');
      } else if (error.response) {
        toast.error(error.response.data?.message || 'Authentication failed');
      } else {
        toast.error('Failed to sign in with Google. Please try again.');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signInWithFacebookPopup = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      await handleAuthResult(result, 'facebook');
      toast.success('Successfully signed in with Facebook!');
    } catch (error) {
      console.error('Facebook popup sign in error:', error);

      // Ignore COOP-related errors
      if (error.message?.includes('Cross-Origin-Opener-Policy')) {
        try {
          const redirectResult = await getRedirectResult(auth);
          if (redirectResult) {
            await handleAuthResult(redirectResult, 'facebook');
            toast.success('Successfully signed in with Facebook!');
            return;
          }
        } catch (redirectError) {
          console.log('No redirect result available');
        }
      }

      if (error.code === 'auth/popup-blocked') {
        toast.error('Popup blocked. Please allow popups or try the redirect option.');
      } else if (error.code === 'auth/popup-closed-by-user') {
        toast.error('Sign-in cancelled. Please try again.');
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        toast.error('Account exists with different sign-in method.');
      } else if (error.response) {
        toast.error(error.response.data?.message || 'Authentication failed');
      } else {
        toast.error('Failed to sign in with Facebook. Please try again.');
      }

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-detect and handle redirect results on page load
  const handleRedirectResult = async () => {
    try {
      const result = await getRedirectResult(auth);
      if (result && result.user) {
        const provider = result.user.providerData[0]?.providerId === 'google.com' ? 'google' : 'facebook';
        await handleAuthResult(result, provider);
        toast.success(`Successfully signed in with ${provider}!`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Redirect result error:', error);
      setIsLoading(false);
    }
  };

  // Default to popup with fallback option
  const signInWithGoogle = signInWithGooglePopup;
  const signInWithFacebook = signInWithFacebookPopup;

  return {
    signInWithGoogle,
    signInWithFacebook,
    signInWithGoogleRedirect,
    signInWithFacebookRedirect,
    handleRedirectResult,
    isLoading
  };
};