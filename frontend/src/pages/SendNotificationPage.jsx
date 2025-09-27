import { Bell, Send, Users, MessageSquare, ChevronDown, Sparkles, Zap, CheckCircle, AlertCircle, Code, Star, Heart, Calendar, X, Search, UserPlus } from 'lucide-react'
import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { useNotificationStore } from '../store/useNotificationStore'
import { useAuthStore } from '../store/useAuthStore'
import { usePostStore } from '../store/usePostStore'
import SidebarSkeleton from '../components/skeletons/SidebarSkeleton'


const SendNotificationPage = () => {
  const [notificationTitle, setNotificationTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')
  const [notificationType, setNotificationType] = useState('code_share')
  const [priority, setPriority] = useState('medium')
  const [recipientType, setRecipientType] = useState('all')
  const [showTypeDropdown, setShowTypeDropdown] = useState(false)
  const [showPriorityDropdown, setShowPriorityDropdown] = useState(false)
  const [showRecipientDropdown, setShowRecipientDropdown] = useState(false)
  const { sendNotification } = useNotificationStore();

  // New states for user selection
  const [selectedUsers, setSelectedUsers] = useState([])
  const [showUserSelection, setShowUserSelection] = useState(false)
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [showOnlineOnly, setShowOnlineOnly] = useState(false)

  const { authUser } = useAuthStore();
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = usePostStore();
  const { onlineUsers } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const clearSearch = () => {
    setSearchQuery('');
  };

  if (isUsersLoading) return <SidebarSkeleton />;

  // const onlineUsers = users.filter(user => user.isOnline).map(user => user._id)

  const notificationTypes = [
    { value: 'code_share', label: 'Code Share', icon: Code, color: 'blue' },
    { value: 'announcement', label: 'Announcement', icon: Bell, color: 'purple' },
    { value: 'update', label: 'Update', icon: Zap, color: 'green' },
    { value: 'reminder', label: 'Reminder', icon: Calendar, color: 'orange' },
    { value: 'appreciation', label: 'Appreciation', icon: Heart, color: 'pink' },
    { value: 'achievement', label: 'Achievement', icon: Star, color: 'yellow' }
  ]

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'green' },
    { value: 'medium', label: 'Medium Priority', color: 'blue' },
    { value: 'high', label: 'High Priority', color: 'red' }
  ]

  const recipientTypes = [
    { value: 'all', label: 'All Users', icon: Users },
    { value: 'contributors', label: 'Contributors Only', icon: Code },
    { value: 'specific', label: 'Specific Users', icon: MessageSquare }
  ]

  const getCurrentType = () => notificationTypes.find(type => type.value === notificationType)
  const getCurrentPriority = () => priorityLevels.find(p => p.value === priority)
  const getCurrentRecipient = () => recipientTypes.find(recipient => recipient.value === recipientType)

  const isFormValid = notificationTitle.trim() && notificationMessage.trim()

  // Filter users based on search and online status
  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id) &&
      user.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()))
    : users.filter((user) =>
      user.fullName.toLowerCase().includes(userSearchQuery.toLowerCase()))

  // Handle recipient type change
  const handleRecipientTypeChange = (value) => {
    setRecipientType(value)
    setShowRecipientDropdown(false)
    if (value !== 'specific') {
      setSelectedUsers([])
      setShowUserSelection(false)
    } else {
      setShowUserSelection(true)
    }
  }

  // Toggle user selection
  const toggleUserSelection = (user) => {
    setSelectedUsers(prev => {
      const isSelected = prev.find(u => u._id === user._id)
      if (isSelected) {
        return prev.filter(u => u._id !== user._id)
      } else {
        return [...prev, user]
      }
    })
  }

  // Remove selected user
  const removeSelectedUser = (userId) => {
    setSelectedUsers(prev => prev.filter(u => u._id !== userId))
  }

  const handleSendNotification = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      await sendNotification({
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        priority,
        recipientType,
        selectedUsers: selectedUsers.map(user => user._id)
      });

      toast.success('Notification sent successfully!');
      console.log('Notification Data:', {
        title: notificationTitle,
        message: notificationMessage,
        type: notificationType,
        priority,
        recipientType,
        selectedUsers: selectedUsers.map(user => user._id),
        senderId: authUser._id
      });

      // Reset form
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedUsers([]);
    } catch (error) {
      toast.error('Failed to send notification. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-900/10 dark:to-purple-900/10">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-gradient-to-br from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="relative py-8 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-lg mb-4">
              <Bell className="w-8 h-8 text-white animate-pulse" />
              <span className="text-white font-bold text-xl">Send Notification</span>
              <Sparkles className="w-6 h-6 text-yellow-300 animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-gray-800 via-purple-600 to-pink-600 dark:from-white dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent mb-2">
              Engage Your Community
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Send notifications to keep your community informed and engaged
            </p>
          </div>

          <div className={`grid gap-8 ${showUserSelection ? 'grid-cols-1 lg:grid-cols-3' : 'grid-cols-1'}`}>
            {/* Main Form Container */}
            <div className={`${showUserSelection ? 'lg:col-span-2' : 'max-w-4xl mx-auto'} relative group`}>
              {/* Gradient border effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 rounded-3xl blur opacity-30 group-hover:opacity-50 transition duration-500"></div>

              <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-pink-600/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-blue-600/10 rounded-full blur-2xl"></div>

                {/* Header */}
                <div className="relative bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 p-6 border-b border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-xl shadow-lg">
                      <Send className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Notification Center</h2>
                      <p className="text-gray-600 dark:text-gray-400">Create and send notifications to your community</p>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <div className="relative p-8">
                  <form className="space-y-8" method='POST'>
                    {/* Notification Type & Priority Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Notification Type */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                            <Bell className="w-5 h-5 text-white" />
                          </div>
                          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Type</label>
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowTypeDropdown(!showTypeDropdown)}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                          >
                            <div className="flex items-center gap-3">
                              {React.createElement(getCurrentType()?.icon, {
                                className: `w-5 h-5 text-${getCurrentType()?.color}-500`
                              })}
                              <span>{getCurrentType()?.label}</span>
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </button>

                          {showTypeDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              {notificationTypes.map((type) => (
                                <button
                                  key={type.value}
                                  type="button"
                                  onClick={() => { setNotificationType(type.value); setShowTypeDropdown(false) }}
                                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                                >
                                  {React.createElement(type.icon, {
                                    className: `w-5 h-5 mr-3 text-${type.color}-500`
                                  })}
                                  <span>{type.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Priority Level */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-600 rounded-lg shadow-md">
                            <Zap className="w-5 h-5 text-white" />
                          </div>
                          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Priority</label>
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowPriorityDropdown(!showPriorityDropdown)}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 hover:border-orange-300 dark:hover:border-orange-500"
                          >
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full bg-${getCurrentPriority()?.color}-500`}></div>
                              <span>{getCurrentPriority()?.label}</span>
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </button>

                          {showPriorityDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              {priorityLevels.map((priorityLevel) => (
                                <button
                                  key={priorityLevel.value}
                                  type="button"
                                  onClick={() => { setPriority(priorityLevel.value); setShowPriorityDropdown(false) }}
                                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                                >
                                  <div className={`w-3 h-3 rounded-full bg-${priorityLevel.color}-500 mr-3`}></div>
                                  <span>{priorityLevel.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Recipients */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Recipients</label>
                        </div>
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => setShowRecipientDropdown(!showRecipientDropdown)}
                            className="w-full flex items-center justify-between p-4 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 hover:border-green-300 dark:hover:border-green-500"
                          >
                            <div className="flex items-center gap-3">
                              {React.createElement(getCurrentRecipient()?.icon, {
                                className: "w-5 h-5 text-green-500"
                              })}
                              <span>{getCurrentRecipient()?.label}</span>
                            </div>
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          </button>

                          {showRecipientDropdown && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-700/95 backdrop-blur-xl border border-gray-200/50 dark:border-gray-600/50 rounded-xl shadow-2xl z-10 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                              {recipientTypes.map((recipient) => (
                                <button
                                  key={recipient.value}
                                  type="button"
                                  onClick={() => handleRecipientTypeChange(recipient.value)}
                                  className="flex items-center w-full px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-900 dark:text-white transition-colors"
                                >
                                  {React.createElement(recipient.icon, {
                                    className: "w-5 h-5 mr-3 text-green-500"
                                  })}
                                  <span>{recipient.label}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Selected Users Display */}
                    {recipientType === 'specific' && selectedUsers.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md">
                            <UserPlus className="w-5 h-5 text-white" />
                          </div>
                          <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                            Selected Users ({selectedUsers.length})
                          </label>
                        </div>
                        <div className="flex flex-wrap gap-2 p-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                          {selectedUsers.map((user) => (
                            <div key={user._id} className="flex items-center gap-2 px-3 py-2 bg-white/80 dark:bg-gray-700/80 rounded-full shadow-md border border-gray-200/50 dark:border-gray-600/50">
                              <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                className="w-6 h-6 rounded-full"
                              />
                              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user.fullName}</span>
                              <button
                                type="button"
                                onClick={() => removeSelectedUser(user._id)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Notification Title Input */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md">
                          <MessageSquare className="w-5 h-5 text-white" />
                        </div>
                        <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          Notification Title <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          value={notificationTitle}
                          onChange={(e) => setNotificationTitle(e.target.value)}
                          className="w-full p-4 pl-6 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-2xl bg-white/80 dark:bg-gray-700/80 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-500"
                          placeholder="Enter notification title..."
                          required
                        />
                        {notificationTitle.trim() && (
                          <CheckCircle className="absolute right-4 top-1/2 transform -translate-y-1/2 w-6 h-6 text-green-500" />
                        )}
                      </div>
                      {notificationTitle.trim() === '' && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>Notification title is required</span>
                        </div>
                      )}
                    </div>

                    {/* Notification Message Input */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md">
                          <Send className="w-5 h-5 text-white" />
                        </div>
                        <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                          Notification Message <span className="text-red-500">*</span>
                        </label>
                      </div>
                      <div className="relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur opacity-30"></div>
                        <div className="relative border-2 border-purple-200/50 dark:border-purple-600/50 rounded-2xl overflow-hidden shadow-lg">
                          <textarea
                            value={notificationMessage}
                            onChange={(e) => setNotificationMessage(e.target.value)}
                            className="w-full p-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-vertical min-h-[150px] leading-relaxed text-lg"
                            placeholder="Write your notification message here... Keep it engaging and informative!"
                            rows="8"
                            required
                          />
                        </div>
                      </div>
                      {notificationMessage.trim() === '' && (
                        <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
                          <AlertCircle className="w-4 h-4" />
                          <span>Notification message is required</span>
                        </div>
                      )}
                    </div>

                    {/* Preview Section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="p-2 bg-gradient-to-r from-gray-500 to-gray-600 rounded-lg shadow-md">
                          <Bell className="w-5 h-5 text-white" />
                        </div>
                        <label className="text-lg font-semibold text-gray-700 dark:text-gray-300">Preview</label>
                      </div>
                      <div className="p-6 bg-gradient-to-r from-gray-50/80 to-blue-50/80 dark:from-gray-700/50 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-600/50">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 bg-gradient-to-r from-${getCurrentType()?.color}-500 to-${getCurrentType()?.color}-600 rounded-xl shadow-lg flex-shrink-0`}>
                            {React.createElement(getCurrentType()?.icon, {
                              className: "w-6 h-6 text-white"
                            })}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {notificationTitle || 'Notification Title'}
                              </h3>
                              <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${getCurrentPriority()?.color}-100 text-${getCurrentPriority()?.color}-800 dark:bg-${getCurrentPriority()?.color}-900/20 dark:text-${getCurrentPriority()?.color}-300`}>
                                {getCurrentPriority()?.label}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {notificationMessage || 'Your notification message will appear here...'}
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                              <span>Just now</span>
                              <span>•</span>
                              <span>
                                {recipientType === 'specific' && selectedUsers.length > 0
                                  ? `${selectedUsers.length} selected users`
                                  : getCurrentRecipient()?.label
                                }
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6">
                      <button
                        type="submit"
                        onClick={handleSendNotification}
                        disabled={!isFormValid}
                        className={`relative w-full py-5 px-8 font-bold text-lg rounded-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-purple-500/50 overflow-hidden group ${isFormValid
                          ? 'bg-gradient-to-r from-purple-500 via-pink-600 to-blue-500 hover:from-purple-600 hover:via-pink-700 hover:to-blue-600 text-white shadow-2xl hover:shadow-purple-500/25 transform hover:scale-[1.02] active:scale-[0.98]'
                          : 'bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                          {isFormValid ? (
                            <>
                              <Send className="w-6 h-6 animate-pulse" />
                              <span>Send Notification</span>
                              <Sparkles className="w-6 h-6 animate-bounce" />
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-6 h-6" />
                              <span>Complete All Fields to Send</span>
                            </>
                          )}
                        </div>
                        {isFormValid && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </button>

                    </div>

                    {/* Form Progress Indicator */}
                    <div className="flex items-center justify-center gap-6 pt-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${notificationTitle.trim() ? 'bg-green-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Title</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full transition-all duration-200 ${notificationMessage.trim() ? 'bg-green-500 shadow-lg' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Message</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-green-500 shadow-lg"></div>
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Settings</span>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>

            {/* User Selection Sidebar */}
            {showUserSelection && (
              <div className="lg:col-span-1">
                <div className="sticky top-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-6 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-black/10"></div>
                    <div className="relative z-10">
                      <div className="flex items-center justify-center mb-4">
                        <div className="bg-white/20 p-3 rounded-full backdrop-blur-sm">
                          <Users className="w-6 h-6" />
                        </div>
                      </div>
                      <h2 className="text-xl font-bold text-center mb-2">Select Users</h2>
                      <p className="text-center text-blue-100 text-sm">
                        Choose specific users to receive this notification
                      </p>
                    </div>
                  </div>

                  {/* Search Section */}
                  <div className="p-4 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200/50">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        value={userSearchQuery}
                        onChange={(e) => setUserSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-10 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 text-gray-900 dark:text-white shadow-lg"
                      />
                      {userSearchQuery && (
                        <button
                          onClick={() => setUserSearchQuery('')}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      )}
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
                          <div className={`w-10 h-6 rounded-full transition-all duration-300 ${showOnlineOnly ? 'bg-gradient-to-r from-green-400 to-green-500' : 'bg-gray-300 dark:bg-gray-600'
                            }`}>
                            <div className={`w-4 h-4 bg-white rounded-full shadow-lg transform transition-transform duration-300 mt-1 ${showOnlineOnly ? 'translate-x-5' : 'translate-x-1'
                              }`}></div>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                          Online only
                        </span>
                      </label>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                          ({onlineUsers.length - 1} online)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Users List */}
                  <div className="max-h-96 overflow-y-auto p-4 space-y-2">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user) => {
                        const isSelected = selectedUsers.find(u => u._id === user._id)
                        return (
                          <button
                            key={user._id}
                            onClick={() => toggleUserSelection(user)}
                            className={`w-full p-3 flex items-center gap-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] ${isSelected
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/25'
                              : 'bg-white/70 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-700 text-gray-900 dark:text-white shadow-md hover:shadow-lg'
                              } backdrop-blur-sm border border-white/50 dark:border-gray-600/50`}
                          >
                            <div className="relative">
                              <img
                                src={user.profilePic || "/avatar.png"}
                                alt={user.fullName}
                                className="w-10 h-10 object-cover rounded-full shadow-lg ring-2 ring-white/50"
                              />
                              {user.isOnline && (
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white shadow-lg animate-pulse" />
                              )}
                            </div>
                            <div className="flex-1 text-left min-w-0">
                              <div className="font-semibold text-sm truncate">
                                {user.fullName}
                              </div>
                              <div className={`text-xs flex items-center gap-1 ${isSelected ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-400' : 'bg-gray-400'
                                  }`}></div>
                                {user.isOnline ? "Online" : "Offline"}
                              </div>
                            </div>
                            {isSelected && (
                              <div className="text-white">
                                <CheckCircle className="w-5 h-5" />
                              </div>
                            )}
                          </button>
                        )
                      })
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mb-3">
                          <Users className="w-6 h-6 text-gray-400" />
                        </div>
                        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                          {userSearchQuery ? 'No users found' : 'No users available'}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {userSearchQuery ? 'Try a different search term' : 'Check back later'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Selection Summary */}
                  <div className="p-4 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-slate-800 border-t border-gray-200/50">
                    <div className="text-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUsers.length} user{selectedUsers.length !== 1 ? 's' : ''} selected
                      </p>
                      {selectedUsers.length > 0 && (
                        <button
                          onClick={() => setSelectedUsers([])}
                          className="text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
                        >
                          Clear selection
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendNotificationPage