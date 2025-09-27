import { usePostStore } from '../store/usePostStore';
import { useAuthStore } from '../store/useAuthStore';
import { Mail, User, Code, Trophy, Calendar, Star, Edit, Settings, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const LeftSideBar = () => {
  const { logout, authUser } = useAuthStore();
  const posts = usePostStore((state) => state.posts);

  // Filter posts by current user
  const userPosts = authUser ? posts.filter(post => {
    if (!post.senderId) return false;
    if (typeof post.senderId === 'object') {
      return post.senderId._id === authUser._id;
    }
    return post.senderId === authUser._id;
  }) : [];

  // Calculate user stats
  const userStats = {
    totalPosts: userPosts.length,
    joinDate: authUser?.createdAt ? new Date(authUser.createdAt).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    }) : 'Recently',
    reputation: userPosts.length * 10 + 50 // Simple reputation calculation
  };

  return (
    <div className="flex flex-col h-auto w-full bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-gray-900 dark:to-slate-800 rounded-2xl shadow-2xl border border-white/20 backdrop-blur-sm overflow-hidden">
      {authUser ? (
        <div className="h-full">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-bold mb-1">Your Profile</h1>
              <p className="text-blue-100 text-sm">Manage your developer identity</p>
            </div>
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          </div>

          <div className="p-6 space-y-6">
            {/* Profile Picture Section */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full animate-pulse opacity-75"></div>
                <img
                  src={authUser.profilePic || "/avatar.png"}
                  alt="Profile"
                  className="relative size-32 rounded-full border-4 border-white dark:border-gray-700 object-cover shadow-xl z-10"
                />
                <button className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-2 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-20">
                  <Edit className="w-4 h-4" />
                </button>
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">{authUser.fullName}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1 mt-1">
                  <Calendar className="w-4 h-4" />
                  Joined {userStats.joinDate}
                </p>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Code className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.totalPosts}</div>
                <div className="text-xs opacity-90">Projects</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Trophy className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{userStats.reputation}</div>
                <div className="text-xs opacity-90">Points</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl text-center shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                <Star className="w-6 h-6 mx-auto mb-2" />
                <div className="text-2xl font-bold">{Math.min(5, Math.floor(userStats.totalPosts / 2))}</div>
                <div className="text-xs opacity-90">Rating</div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Profile Information
              </h3>

              <div className="space-y-3">
                <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md">
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-indigo-500" />
                    Full Name
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{authUser.fullName}</p>
                </div>

                <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md">
                  <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2 mb-2">
                    <Mail className="w-4 h-4 text-indigo-500" />
                    Email Address
                  </div>
                  <p className="text-gray-900 dark:text-white font-medium">{authUser.email}</p>
                </div>
              </div>
            </div>

            {/* Contributions Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center gap-2">
                  <Code className="w-5 h-5 text-indigo-500" />
                  Your Contributions
                </h3>
                <div className="bg-gradient-to-r from-indigo-500 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                  {userPosts.length} Total
                </div>
              </div>

              {userPosts.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {userPosts.map((post, index) => (
                    <div
                      key={post._id}
                      className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-3 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-[1.02] cursor-pointer group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                          {post.projectName.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {post.projectName}
                          </h4>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Recently'}
                          </p>
                        </div>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <Star className="w-4 h-4 text-yellow-500" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white/70 dark:bg-gray-700/70 backdrop-blur-sm p-6 rounded-xl border border-gray-200/50 dark:border-gray-600/50 shadow-md text-center">
                  <Code className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">No contributions yet</p>
                  <p className="text-sm text-gray-500">Start sharing your code to build your portfolio!</p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button className="flex-1 bg-gradient-to-r from-indigo-500 to-blue-500 text-white py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </button>
              <button className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                onClick={logout}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-full">
          {/* Guest Header */}
          <div className="bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 p-6 text-white relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10 text-center">
              <h1 className="text-2xl font-bold mb-1">Welcome to CodeShare</h1>
              <p className="text-gray-200 text-sm">Please login to access your profile</p>
            </div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -ml-12 -mb-12"></div>
          </div>

          <div className="p-6 space-y-6">
            {/* Guest Profile Picture */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <img
                  src="/avatar.png"
                  alt="Profile"
                  className="size-32 rounded-full border-4 border-gray-300 dark:border-gray-600 object-cover shadow-xl opacity-50"
                />
              </div>
              <div className="mt-4 text-center">
                <h2 className="text-xl font-bold text-gray-500 dark:text-gray-400">Guest User</h2>
                <p className="text-sm text-gray-400">Login to personalize your profile</p>
              </div>
            </div>

            {/* Guest Information Cards */}
            <div className="space-y-3">
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 opacity-75">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <User className="w-4 h-4" />
                  Full Name
                </div>
                <p className="text-gray-600 dark:text-gray-300">Please login to view</p>
              </div>

              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-xl border border-gray-200 dark:border-gray-600 opacity-75">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-2">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="text-gray-600 dark:text-gray-300">Please login to view</p>
              </div>
            </div>

            {/* Guest Contributions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-2">
                <Code className="w-5 h-5" />
                Your Contributions
              </h3>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 p-8 rounded-xl border-2 border-dashed border-blue-200 dark:border-gray-600 text-center">
                <User className="w-16 h-16 text-blue-300 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">Join CodeShare Today!</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Login to see your contributions, connect with developers, and share amazing code snippets.
                </p>
                <Link className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-6 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                  to="/login"
                >
                  Get Started
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LeftSideBar;