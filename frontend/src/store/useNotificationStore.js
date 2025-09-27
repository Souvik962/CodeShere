import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "../store/useAuthStore";

export const useNotificationStore = create((set, get) => ({
    notifications: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isNotificationLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get("/admin/users");
            set({ users: res.data });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch users");
        } finally {
            set({ isUsersLoading: false });
        }
    },

    getNotifications: async () => {
        set({ isNotificationLoading: true });
        try {
            const authUser = useAuthStore.getState().authUser;
            if (!authUser || !authUser._id) {
                throw new Error("User not found");
            }
            const res = await axiosInstance.get(`/notifications/${authUser._id}`);
            set({ notifications: res.data });
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to fetch notifications");
        } finally {
            set({ isNotificationLoading: false });
        }
    },

    sendNotification: async (notificationData) => {
        const { notifications } = get();
        try {
            const res = await axiosInstance.post("/admin/send-notification", notificationData);

            // Update notifications list with new notifications
            set({ notifications: [...notifications, ...res.data.notifications] });

            return res.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || "Failed to send notification";
            toast.error(errorMessage);
            throw error;
        }
    },

    deleteNotification: async (notificationId) => {
        try {
            const response = await axiosInstance.delete(`/notifications/delete/${notificationId}`);

            // Remove the notification from local state immediately after successful deletion
            set((state) => ({
                notifications: state.notifications.filter(n => n._id !== notificationId)
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to delete notification';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    // Add a function to delete multiple notifications
    deleteMultipleNotifications: async (notificationIds) => {
        try {
            const deletePromises = notificationIds.map(id =>
                axiosInstance.delete(`/notifications/delete/${id}`)
            );

            await Promise.all(deletePromises);

            // Remove notifications from local state
            set((state) => ({
                notifications: state.notifications.filter(n => !notificationIds.includes(n._id))
            }));

            return { success: true };
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to delete notifications';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    markAsRead: async (notificationId) => {
        try {
            const response = await axiosInstance.patch(`/notifications/${notificationId}/read`, { read: true });

            // Update local state
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n._id === notificationId ? { ...n, read: true } : n
                )
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to mark notification as read';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    markAsUnread: async (notificationId) => {
        try {
            const response = await axiosInstance.patch(`/notifications/${notificationId}/read`, { read: false });

            // Update local state
            set((state) => ({
                notifications: state.notifications.map(n =>
                    n._id === notificationId ? { ...n, read: false } : n
                )
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to mark notification as unread';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    markAllAsRead: async () => {
        try {
            const response = await axiosInstance.patch('/notifications/mark-all-read');

            // Update local state
            set((state) => ({
                notifications: state.notifications.map(n => ({ ...n, read: true }))
            }));

            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.error || 'Failed to mark all notifications as read';
            toast.error(errorMessage);
            throw new Error(errorMessage);
        }
    },

    subscribeToNotifications: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newNotification", (newNotification) => {
            set({
                notifications: [...get().notifications, newNotification],
            });

            // Show toast notification
            toast.success(`New notification: ${newNotification.title}`);
        });
    },

    unsubscribeFromNotifications: () => {
        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.off("newNotification");
    },

    setSelectedUser: (selectedUser) => set({ selectedUser }),

    // Clear notifications
    clearNotifications: () => set({ notifications: [] }),
}));