import { useEffect } from 'react';
import { getRedirectResult } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuthStore } from '../store/useAuthStore';
import toast from 'react-hot-toast';

const FirebaseRedirectHandler = () => {
    const { socialAuth } = useAuthStore();

    useEffect(() => {
        const handleRedirectResult = async () => {
            try {
                const result = await getRedirectResult(auth);

                if (result && result.user) {
                    const user = result.user;

                    // Determine provider from user data
                    const provider = user.providerData[0]?.providerId === 'google.com'
                        ? 'google'
                        : user.providerData[0]?.providerId === 'facebook.com'
                            ? 'facebook'
                            : 'unknown';

                    const userData = {
                        firebaseUid: user.uid,
                        email: user.email,
                        fullName: user.displayName || 'User',
                        profilePic: user.photoURL || '',
                        provider: provider
                    };

                    console.log('Processing redirect result for:', provider);

                    // Send to backend
                    await socialAuth(userData);

                    toast.success(`Successfully signed in with ${provider === 'google' ? 'Google' : 'Facebook'}!`);
                }
            } catch (error) {
                console.error('Redirect result handling error:', error);

                if (error.response) {
                    toast.error(error.response.data?.message || 'Authentication failed');
                } else {
                    toast.error('Failed to complete sign-in. Please try again.');
                }
            }
        };

        // Handle redirect result on component mount
        handleRedirectResult();
    }, [socialAuth]);

    return null; // This component doesn't render anything
};

export default FirebaseRedirectHandler;