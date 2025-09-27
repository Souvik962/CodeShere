import React, { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Shield,
    Activity,
    TrendingUp,
    BarChart3,
    Settings,
    Eye,
    UserCheck,
    AlertTriangle,
    Calendar,
    Code2,
    Zap
} from 'lucide-react';
import { axiosInstance } from '../lib/axios';

const AdminDashboard = () => {
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axiosInstance.get('/admin/dashboard');
            setDashboardData(response.data);
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
                <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
            </div>
        );
    }

    const { stats, postsByLanguage, userRegistrationTrend, mostActiveUsers } = dashboardData || {};

    const StatCard = ({ title, value, icon: Icon, color, trend, subtitle }) => (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border-l-4 ${color}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">{subtitle}</p>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color.replace('border-l-', 'bg-').replace('-500', '-100')} dark:bg-opacity-20`}>
                    <Icon className={`w-8 h-8 ${color.replace('border-l-', 'text-')}`} />
                </div>
            </div>
            {trend && (
                <div className="mt-4 flex items-center">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm font-medium text-green-500">+{trend}% this week</span>
                </div>
            )}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">CodeShare Administration Panel</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-sm font-medium text-green-700 dark:text-green-300">System Online</span>
                            </div>
                            <button className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors">
                                <Settings className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Navigation Tabs */}
                <div className="mb-8">
                    <nav className="flex space-x-8">
                        {[
                            { id: 'overview', label: 'Overview', icon: Activity },
                            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                            { id: 'users', label: 'User Insights', icon: Users }
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                onClick={() => setActiveTab(id)}
                                className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === id
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-8">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Users"
                                value={stats?.totalUsers?.toLocaleString() || '0'}
                                icon={Users}
                                color="border-l-blue-500"
                                trend={stats?.newUsersThisWeek > 0 ? Math.round((stats.newUsersThisWeek / stats.totalUsers) * 100) : 0}
                                subtitle={`+${stats?.newUsersThisWeek || 0} this week`}
                            />
                            <StatCard
                                title="Total Posts"
                                value={stats?.totalPosts?.toLocaleString() || '0'}
                                icon={FileText}
                                color="border-l-green-500"
                                trend={stats?.newPostsThisWeek > 0 ? Math.round((stats.newPostsThisWeek / stats.totalPosts) * 100) : 0}
                                subtitle={`+${stats?.newPostsThisWeek || 0} this week`}
                            />
                            <StatCard
                                title="Administrators"
                                value={stats?.totalAdmins || '0'}
                                icon={Shield}
                                color="border-l-purple-500"
                                subtitle="Active admins"
                            />
                            <StatCard
                                title="Moderators"
                                value={stats?.totalModerators || '0'}
                                icon={UserCheck}
                                color="border-l-orange-500"
                                subtitle="Active moderators"
                            />
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Zap className="w-5 h-5 text-blue-500" />
                                Quick Actions
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {[
                                    { label: 'Manage Users', icon: Users, color: 'bg-blue-500', href: '/admin/users' },
                                    { label: 'Review Posts', icon: FileText, color: 'bg-green-500', href: '/admin/posts' },
                                    { label: 'System Settings', icon: Settings, color: 'bg-purple-500', href: '/admin/settings' },
                                    { label: 'View Reports', icon: BarChart3, color: 'bg-orange-500', href: '/admin/reports' }
                                ].map(({ label, icon: Icon, color, href }) => (
                                    <button
                                        key={label}
                                        className={`${color} text-white p-4 rounded-xl hover:opacity-90 transition-opacity flex items-center gap-3 font-medium`}
                                    >
                                        <Icon className="w-5 h-5" />
                                        {label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Most Active Users */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-green-500" />
                                    Most Active Users
                                </h3>
                                <div className="space-y-3">
                                    {mostActiveUsers?.slice(0, 5).map((user, index) => (
                                        <div key={user._id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex-shrink-0">
                                                <img
                                                    src={user.user.profilePic || '/avatar.png'}
                                                    alt={user.user.fullName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 dark:text-white truncate">
                                                    {user.user.fullName}
                                                </p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                                    {user.user.email}
                                                </p>
                                            </div>
                                            <div className="flex-shrink-0">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">
                                                    {user.postCount} posts
                                                </span>
                                            </div>
                                        </div>
                                    )) || (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                No active users data available
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* System Status */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Eye className="w-5 h-5 text-blue-500" />
                                    System Status
                                </h3>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Database', status: 'Healthy', color: 'text-green-500' },
                                        { label: 'API Server', status: 'Running', color: 'text-green-500' },
                                        { label: 'File Storage', status: 'Active', color: 'text-green-500' },
                                        { label: 'Email Service', status: 'Connected', color: 'text-green-500' },
                                        { label: 'CAPTCHA Service', status: 'Operational', color: 'text-green-500' }
                                    ].map(({ label, status, color }) => (
                                        <div key={label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <span className="text-gray-900 dark:text-white font-medium">{label}</span>
                                            <span className={`${color} font-medium flex items-center gap-1`}>
                                                <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}></div>
                                                {status}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Posts by Language */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Code2 className="w-5 h-5 text-purple-500" />
                                    Posts by Programming Language
                                </h3>
                                <div className="space-y-3">
                                    {postsByLanguage?.map((lang, index) => {
                                        const total = postsByLanguage.reduce((sum, item) => sum + item.count, 0);
                                        const percentage = Math.round((lang.count / total) * 100);
                                        return (
                                            <div key={lang._id} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                                                        {lang._id}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {lang.count} posts ({percentage}%)
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    }) || (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                No language data available
                                            </div>
                                        )}
                                </div>
                            </div>

                            {/* User Registration Trend */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <Calendar className="w-5 h-5 text-green-500" />
                                    User Registration Trend (Last 30 Days)
                                </h3>
                                <div className="space-y-3">
                                    {userRegistrationTrend?.slice(-10).map((day, index) => {
                                        const maxCount = Math.max(...(userRegistrationTrend?.map(d => d.count) || [1]));
                                        const percentage = (day.count / maxCount) * 100;
                                        return (
                                            <div key={index} className="space-y-2">
                                                <div className="flex justify-between items-center">
                                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                                        {day._id.month}/{day._id.day}
                                                    </span>
                                                    <span className="text-sm text-gray-500 dark:text-gray-400">
                                                        {day.count} users
                                                    </span>
                                                </div>
                                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                    <div
                                                        className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                                                        style={{ width: `${percentage}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        );
                                    }) || (
                                            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                                                No registration data available
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                <Users className="w-5 h-5 text-blue-500" />
                                User Management Overview
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl">
                                    <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Users className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.totalUsers || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Users</p>
                                </div>

                                <div className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl">
                                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <UserCheck className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats?.newUsersThisWeek || 0}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">New This Week</p>
                                </div>

                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl">
                                    <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <AlertTriangle className="w-6 h-6 text-white" />
                                    </div>
                                    <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Suspended Users</p>
                                </div>
                            </div>

                            <div className="mt-6 flex gap-4">
                                <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                                    View All Users
                                </button>
                                <button className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors font-medium">
                                    User Reports
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;