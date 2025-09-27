import React, { useState, useEffect } from 'react';
import {
    Bell,
    Check,
    X,
    Settings,
    Filter,
    MoreVertical,
    Code,
    Users,
    Heart,
    MessageSquare,
    GitBranch,
    Star,
    AlertCircle,
    CheckCircle2,
    Clock,
    Trash2,
    Archive,
    Loader2
} from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

const NotificationsPage = () => {
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [selectedNotifications, setSelectedNotifications] = useState(new Set());

    const {
        notifications,
        isNotificationLoading,
        getNotifications,
        subscribeToNotifications,
        unsubscribeFromNotifications,
        deleteNotification: deleteNotificationFromStore,
        // deleteMultipleNotifications,
        markAsRead: markAsReadInStore,
        markAsUnread: markAsUnreadInStore,
        markAllAsRead: markAllAsReadInStore,
    } = useNotificationStore();

    useEffect(() => {
        getNotifications();
        subscribeToNotifications();

        return () => {
            unsubscribeFromNotifications();
        };
    }, [getNotifications, subscribeToNotifications, unsubscribeFromNotifications]);

    // Transform API data to match the expected format
    const transformNotification = (notification) => {
        // Map notification types to icons and colors
        const typeConfig = {
            code_share: { icon: Code, color: 'blue' },
            collaboration: { icon: Users, color: 'green' },
            system: { icon: AlertCircle, color: 'orange' },
            like: { icon: Heart, color: 'red' },
            comment: { icon: MessageSquare, color: 'purple' },
            star: { icon: Star, color: 'yellow' },
            branch: { icon: GitBranch, color: 'blue' },
            default: { icon: Bell, color: 'blue' }
        };

        const config = typeConfig[notification.type] || typeConfig.default;

        return {
            ...notification,
            id: notification._id || notification.id, // Ensure id is always present for key
            icon: config.icon,
            color: config.color,
            priority: notification.priority || 'low',
            time: formatTime(notification.createdAt || notification.timestamp),
            avatar: notification.sender?.avatar || notification.avatar,
            read: notification.read || false
        };
    };

    // Format time helper function
    const formatTime = (timestamp) => {
        if (!timestamp) return 'Unknown time';

        const now = new Date();
        const time = new Date(timestamp);
        const diffInMinutes = Math.floor((now - time) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        return `${Math.floor(diffInMinutes / 1440)}d ago`;
    };

    // Transform notifications for display
    const transformedNotifications = notifications.map(transformNotification);

    const filters = [
        { key: 'all', label: 'All', count: transformedNotifications.length },
        { key: 'unread', label: 'Unread', count: transformedNotifications.filter(n => !n.read).length },
        { key: 'code_share', label: 'Code Shares', count: transformedNotifications.filter(n => n.type === 'code_share').length },
        { key: 'collaboration', label: 'Collaborations', count: transformedNotifications.filter(n => n.type === 'collaboration').length },
        { key: 'system', label: 'System', count: transformedNotifications.filter(n => n.type === 'system').length }
    ];

    const getFilteredNotifications = () => {
        if (selectedFilter === 'all') return transformedNotifications;
        if (selectedFilter === 'unread') return transformedNotifications.filter(n => !n.read);
        return transformedNotifications.filter(n => n.type === selectedFilter);
    };

    // Local state management for UI interactions
    const [localNotifications, setLocalNotifications] = useState([]);

    // Update local notifications when store notifications change
    useEffect(() => {
        setLocalNotifications(transformedNotifications);
    }, [notifications]);

    const markAsRead = async (id) => {
        // Store original state for potential rollback
        const originalNotifications = localNotifications;
        try {
            // Optimistically update UI
            setLocalNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));

            // Call store function to update backend
            await markAsReadInStore(id);
        } catch (error) {
            // Revert optimistic update on error
            setLocalNotifications(originalNotifications);
            console.error('Failed to mark notification as read:', error);
        }
    };

    const markAsUnread = async (id) => {
        // Store original state for potential rollback
        const originalNotifications = localNotifications;
        try {
            // Optimistically update UI
            setLocalNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, read: false } : n
            ));

            // Call store function
            await markAsUnreadInStore(id);
        } catch (error) {
            // Revert optimistic update on error
            setLocalNotifications(originalNotifications);
            console.error('Failed to mark notification as unread:', error);
        }
    };
    const deleteNotification = async (id) => {
        // Store original state for potential rollback
        const originalNotifications = localNotifications;
        try {
            const originalSelected = new Set(selectedNotifications);

            // Optimistically update UI
            setLocalNotifications(prev => prev.filter(n => n.id !== id));
            setSelectedNotifications(prev => {
                const newSet = new Set(prev);
                newSet.delete(id);
                return newSet;
            });

            // Call store function to delete from backend
            await deleteNotificationFromStore(id);
            window.location.reload();
        } catch (error) {
            // Revert optimistic update on error
            setLocalNotifications(originalNotifications);
            setSelectedNotifications(originalSelected);
            console.error('Failed to delete notification:', error);
        }
    };

    const markAllAsRead = async () => {
        // Store original state for potential rollback
        const originalNotifications = localNotifications;
        try {
            // Optimistically update UI
            setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));

            // Call store function
            await markAllAsReadInStore();
        } catch (error) {
            // Revert optimistic update on error
            setLocalNotifications(originalNotifications);
            console.error('Failed to mark all notifications as read:', error);
        }
    };

    const deleteSelectedNotifications = async () => {
        if (selectedNotifications.size === 0) return;

        // Store original state for potential rollback BEFORE try block
        const originalNotifications = localNotifications;
        const originalSelected = new Set(selectedNotifications);
        const selectedIds = Array.from(selectedNotifications);

        try {
            // Optimistically update UI
            setLocalNotifications(prev => prev.filter(n => !selectedNotifications.has(n.id)));
            setSelectedNotifications(new Set());

            await deleteNotificationFromStore(selectedIds);
        } catch (error) {
            setLocalNotifications(originalNotifications);
            setSelectedNotifications(originalSelected);
            console.error('Failed to delete selected notifications:', error);
        }
    };

    const toggleSelectNotification = (id) => {
        setSelectedNotifications(prev => {
            const newSet = new Set(prev);
            if (newSet.has(id)) {
                newSet.delete(id);
            } else {
                newSet.add(id);
            }
            return newSet;
        });
    };

    const selectAllNotifications = () => {
        const filtered = getFilteredNotifications();
        setSelectedNotifications(new Set(filtered.map(n => n.id)));
    };

    const deselectAllNotifications = () => {
        setSelectedNotifications(new Set());
    };

    const getIconColor = (color) => {
        const colors = {
            blue: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
            green: 'text-green-500 bg-green-100 dark:bg-green-900/30',
            red: 'text-red-500 bg-red-100 dark:bg-red-900/30',
            purple: 'text-purple-500 bg-purple-100 dark:bg-purple-900/30',
            orange: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30',
            yellow: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30'
        };
        return colors[color] || colors.blue;
    };

    const getPriorityBorder = (priority) => {
        const borders = {
            high: 'border-l-red-500',
            medium: 'border-l-yellow-500',
            low: 'border-l-green-500'
        };
        return borders[priority] || borders.low;
    };

    const filteredNotifications = getFilteredNotifications();
    const unreadCount = localNotifications.filter(n => !n.read).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6 lg:p-8">
            {/* Animated background elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/30 dark:bg-blue-600/20 rounded-full filter blur-xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/30 dark:bg-purple-600/20 rounded-full filter blur-xl animate-pulse animation-delay-2000"></div>
            </div>

            <div className="relative max-w-6xl mx-auto">
                {/* Header */}
                <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 mb-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <div className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                    <Bell className="h-8 w-8 text-white" />
                                </div>
                                {unreadCount > 0 && (
                                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-pulse">
                                        {unreadCount}
                                    </div>
                                )}
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                                    Notifications
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Stay updated with your code sharing activities
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {selectedNotifications.size > 0 && (
                                <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/30 px-4 py-2 rounded-lg">
                                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {selectedNotifications.size} selected
                                    </span>
                                    <button
                                        onClick={deleteSelectedNotifications}
                                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/30 rounded"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}

                            <button
                                onClick={markAllAsRead}
                                disabled={isNotificationLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
                            >
                                Mark all read
                            </button>
                            <button
                                onClick={getNotifications}
                                disabled={isNotificationLoading}
                                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors disabled:opacity-50"
                            >
                                {isNotificationLoading ? (
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                ) : (
                                    <Settings className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 p-6 sticky top-8">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Filters</h2>
                                <Filter className="h-5 w-5 text-gray-400" />
                            </div>

                            <div className="space-y-2">
                                {filters.map((filter) => (
                                    <button
                                        key={filter.key}
                                        onClick={() => setSelectedFilter(filter.key)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-300 ${selectedFilter === filter.key
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium">{filter.label}</span>
                                            <span className={`text-sm px-2 py-1 rounded-full ${selectedFilter === filter.key
                                                ? 'bg-white/20 text-white'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                                                }`}>
                                                {filter.count}
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {/* Quick Actions */}
                            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-600">
                                <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wider">
                                    Quick Actions
                                </h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={filteredNotifications.length === selectedNotifications.size ? deselectAllNotifications : selectAllNotifications}
                                        className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                    >
                                        {filteredNotifications.length === selectedNotifications.size ? 'Deselect All' : 'Select All'}
                                    </button>
                                    <button className="w-full text-left px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2">
                                        <Archive className="h-4 w-4" />
                                        Archive Old
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Notifications List */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 dark:border-gray-700/20 overflow-hidden">
                            {isNotificationLoading ? (
                                <div className="text-center py-16">
                                    <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
                                    <p className="text-gray-600 dark:text-gray-400">Loading notifications...</p>
                                </div>
                            ) : filteredNotifications.length === 0 ? (
                                <div className="text-center py-16">
                                    <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center">
                                        <Bell className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                        No notifications found
                                    </h3>
                                    <p className="text-gray-500 dark:text-gray-500">
                                        {selectedFilter === 'all'
                                            ? "You're all caught up! Check back later for updates."
                                            : `No ${selectedFilter} notifications at the moment.`
                                        }
                                    </p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredNotifications.map((notification) => {
                                        const IconComponent = notification.icon;
                                        const isSelected = selectedNotifications.has(notification.id);

                                        return (
                                            <div
                                                key={notification.id}
                                                className={`group relative p-6 transition-all duration-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                    } ${isSelected ? 'bg-blue-100 dark:bg-blue-900/20' : ''} border-l-4 ${getPriorityBorder(notification.priority)}`}
                                            >
                                                <div className="flex items-start gap-4">
                                                    {/* Selection Checkbox */}
                                                    <input
                                                        type="checkbox"
                                                        checked={isSelected}
                                                        onChange={() => toggleSelectNotification(notification.id)}
                                                        className="mt-1 h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                                                    />

                                                    {/* Icon */}
                                                    <div className={`flex-shrink-0 p-3 rounded-xl ${getIconColor(notification.color)}`}>
                                                        <IconComponent className="h-5 w-5" />
                                                    </div>

                                                    {/* Avatar */}
                                                    {notification.avatar && (
                                                        <img
                                                            src={notification.avatar}
                                                            alt="User avatar"
                                                            className="flex-shrink-0 h-10 w-10 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
                                                        />
                                                    )}

                                                    {/* Content */}
                                                    <div className="flex-grow min-w-0">
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="min-w-0 flex-grow">
                                                                <h3 className={`font-semibold ${!notification.read
                                                                    ? 'text-gray-900 dark:text-white'
                                                                    : 'text-gray-700 dark:text-gray-300'
                                                                    }`}>
                                                                    {notification.title}
                                                                    {!notification.read && (
                                                                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                                                    )}
                                                                </h3>
                                                                <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                                                    {notification.message}
                                                                </p>
                                                                <div className="flex items-center gap-4 mt-3">
                                                                    <span className="text-sm text-gray-500 dark:text-gray-500 flex items-center gap-1">
                                                                        <Clock className="h-3 w-3" />
                                                                        {notification.time}
                                                                    </span>
                                                                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${notification.priority === 'high'
                                                                        ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                                                                        : notification.priority === 'medium'
                                                                            ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
                                                                            : 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
                                                                        }`}>
                                                                        {notification.priority}
                                                                    </span>
                                                                </div>
                                                            </div>

                                                            {/* Action Menu */}
                                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {!notification.read ? (
                                                                    <button
                                                                        onClick={() => markAsRead(notification.id)}
                                                                        className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                                                                        title="Mark as read"
                                                                    >
                                                                        <Check className="h-4 w-4" />
                                                                    </button>
                                                                ) : (
                                                                    <button
                                                                        onClick={() => markAsUnread(notification.id)}
                                                                        className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                                                                        title="Mark as unread"
                                                                    >
                                                                        <Bell className="h-4 w-4" />
                                                                    </button>
                                                                )}

                                                                <button
                                                                    onClick={() => deleteNotification(notification.id)}
                                                                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                                                    title="Delete notification"
                                                                >
                                                                    <X className="h-4 w-4" />
                                                                </button>

                                                                <button className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                                                    <MoreVertical className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Load More Button */}
                        {filteredNotifications.length > 0 && !isNotificationLoading && (
                            <div className="text-center mt-8">
                                <button
                                    onClick={getNotifications}
                                    className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors font-medium shadow-sm"
                                >
                                    Load More Notifications
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage;