import { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';

export const useFetchPosts = () => {
    const [posts, setPosts] = usePostStore((state) => [state.posts, state.setPosts]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axiosInstance.get('/posts');
                setPosts(res.data);
            } catch (error) {
                console.error('Error fetching posts:', error);
                toast.error('Failed to load posts. Please try again.');
            }
        };
        fetchPosts();
    }, [setPosts]);

    return posts;
};
