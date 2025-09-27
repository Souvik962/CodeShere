import { Search, Users, X, UserPlus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { usePostStore } from "../store/usePostStore"
import SidebarSkeleton from "./skeletons/SidebarSkeleton";

const RightSideBar = () => {
  const { authUser } = useAuthStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = usePostStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id) && 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
    : users.filter((user) => 
        user.fullName.toLowerCase().includes(searchQuery.toLowerCase()));

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <div className="flex flex-col h-[90vh] w-full bg-gradient-to-br from-slate-50 to-blue-50 dark:from-gray-900 dark:to-slate-800 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
              <Users className="w-8 h-8" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-center mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-100">
            CodeShare
          </h1>
          <p className="text-center text-blue-100 text-sm">
            A platform to share and collaborate on code snippets
          </p>
          <p className="text-center text-blue-50 text-xs mt-2 bg-white/10 rounded-lg p-2 backdrop-blur-sm">
            Find your friends online and share code snippets with them!
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
      </div>

      {authUser ? (
        <>
          {/* Search Section */}
          <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50">
            <div className={`relative transition-all duration-300 ${isSearchFocused ? 'scale-105' : 'scale-100'}`}>
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 transition-colors duration-300 ${
                  isSearchFocused ? 'text-blue-500' : 'text-gray-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 text-gray-900 dark:text-white shadow-lg"
                />
                {searchQuery && (
                  <button
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Filter Section */}
          <div className="p-4 bg-white/30 dark:bg-gray-800/30 backdrop-blur-sm border-b border-gray-200/50">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={showOnlineOnly}
                    onChange={(e) => setShowOnlineOnly(e.target.checked)}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-all duration-300 ${
                    showOnlineOnly ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-0.5 ${
                      showOnlineOnly ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>
                <span className="font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                  Show online only
                </span>
              </label>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  ({onlineUsers.length - 1} online)
                </span>
              </div>
            </div>
          </div>

          {/* Users List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <button
                  key={user._id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-4 flex items-center gap-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:-translate-y-1 ${
                    selectedUser?._id === user._id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                      : 'bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-xl'
                  } backdrop-blur-sm border border-white/50 dark:border-gray-600/50`}
                >
                  <div className="relative">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.name}
                      className="size-12 object-cover rounded-full shadow-lg ring-2 ring-white/50"
                    />
                    {onlineUsers.includes(user._id) && (
                      <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-white shadow-lg animate-pulse" />
                    )}
                  </div>
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-semibold text-lg truncate">
                      {user.fullName}
                    </div>
                    <div className={`text-sm flex items-center gap-1 ${
                      selectedUser?._id === user._id ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      <div className={`w-2 h-2 rounded-full ${
                        onlineUsers.includes(user._id) ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                    </div>
                  </div>
                  {selectedUser?._id === user._id && (
                    <div className="text-white">
                      <UserPlus className="w-5 h-5" />
                    </div>
                  )}
                </button>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                  <Users className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 font-medium">
                  {searchQuery ? 'No users found' : 'No online users'}
                </p>
                <p className="text-sm text-gray-400 mt-1">
                  {searchQuery ? 'Try a different search term' : 'Check back later'}
                </p>
              </div>
            )}
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-2xl p-8 shadow-xl border border-white/50">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Welcome to CodeShare</h3>
            <p className="text-gray-600 dark:text-gray-300">
              You are not logged in. Please log in to access all features.
            </p>
          </div>
        </div>
      )}

      {/* Footer */}
      {authUser && (
        <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-slate-800 border-t border-gray-200/50">
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Connect with {users.length} developers
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default RightSideBar;