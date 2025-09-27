import { useEffect } from 'react';
import { usePostStore } from '../store/usePostStore';
import { axiosInstance } from '../lib/axios';

export const useFetchPosts = () => {
    const [posts, setPosts] = usePostStore((state) => [state.posts, state.setPosts]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axiosInstance.get('/posts');
                setPosts(res.data);
            } catch (error) {
                // handle error
            }
        };
        fetchPosts();
    }, [setPosts]);

    return posts;
};
