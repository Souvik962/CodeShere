import { Link } from "react-router-dom";
import { Search, User, Home, Bell, SunIcon, MoonIcon, LogOut, MessageSquarePlus, LogInIcon, PanelRightIcon } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { useAuthStore } from "../store/useAuthStore";
import { useState } from "react";
import SearchOverlay from "./SearchOverlay";

export default function Navbar() {
  const { theme, toggleTheme } = useThemeStore();
  const { logout, authUser } = useAuthStore();
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);

  const handleSearchClick = () => {
    setShowSearchOverlay(true);
  };

  return (
    <>
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 h-16 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
        {/* Left section: Logo and Search */}
        <div className="flex items-center gap-6">
          <Link to="/" title="Logo" className="group">
            <div className="relative">
              <img
                src="/logo-white.png"
                alt="Logo"
                className="h-10 w-10 transition-transform duration-200 group-hover:scale-110"
              />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 blur-sm"></div>
            </div>
          </Link>

          <div className="relative group">
            <button
              onClick={handleSearchClick}
              className="pl-11 pr-4 py-2.5 w-72 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all duration-200 hover:bg-gray-100/80 dark:hover:bg-gray-700/80 text-left"
              title="Search"
            >
              <span className="text-gray-500 dark:text-gray-400">Search Code</span>
            </button>
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-200 pointer-events-none" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"></div>
          </div>
        </div>

        {/* Center section: Navigation Links */}
        <div className="flex items-center gap-1 bg-gray-50/50 dark:bg-gray-800/50 rounded-2xl p-1 backdrop-blur-sm border border-gray-200/30 dark:border-gray-700/30">
          <Link
            to="/"
            className="relative p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group shadow-sm hover:shadow-md"
            title="Home"
          >
            <Home size={24} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-blue-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            to="/contributions"
            className="relative p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group shadow-sm hover:shadow-md"
            title="Contributions"
          >
            <MessageSquarePlus size={24} className="text-gray-600 dark:text-gray-400 group-hover:text-purple-500 group-hover:scale-110 transition-all duration-200" />
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-500/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>

          <Link
            to="/notifications"
            className="relative p-3 rounded-xl hover:bg-white dark:hover:bg-gray-700 transition-all duration-200 group shadow-sm hover:shadow-md"
            title="Notification"
          >
            <Bell size={24} className="text-gray-600 dark:text-gray-400 group-hover:text-orange-500 group-hover:scale-110 transition-all duration-200" />
            <div className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-orange-500/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </Link>
        </div>

        {/* Right Section: User and Other Icons */}
        <div className="flex items-center gap-3">
          <button
            className="relative p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md"
            onClick={toggleTheme}
            title="Change Theme"
          >
            {theme === "dark" ?
              <SunIcon size={20} className="text-yellow-500 group-hover:scale-110 group-hover:rotate-12 transition-all duration-200" /> :
              <MoonIcon size={20} className="text-indigo-600 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-200" />
            }
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          </button>

          {authUser ? (
            <div className="flex items-center gap-2">
              <Link
                className="relative p-2.5 rounded-xl bg-gray-50/80 dark:bg-gray-800/80 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 group border border-gray-200/30 dark:border-gray-700/30 shadow-sm hover:shadow-md"
                to="/admin/dashboard"
                title="Admin Panel"
              >
                <PanelRightIcon size={20} />
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500/20 to-orange-500/20 dark:from-indigo-500/20 dark:to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
              </Link>
              <Link
                to="/profile"
                className="relative group"
                title="Profile"
              >
                <div className="p-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 group-hover:from-purple-500 group-hover:to-pink-500 transition-all duration-300">
                  <img
                    src={authUser.profilePic || "/avatar.png"}
                    alt="Profile"
                    className="h-9 w-9 rounded-full border-2 border-white dark:border-gray-800 group-hover:scale-105 transition-transform duration-200"
                  />
                </div>
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 group-hover:opacity-30 blur transition-opacity duration-300"></div>
              </Link>

              <button
                className="flex gap-2 items-center px-4 py-2 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-medium cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95"
                onClick={logout}
              >
                <LogOut className="size-4" />
                <span className="hidden sm:inline text-sm">Logout</span>
              </button>
            </div>
          ) : (
            <Link to="/login" title="Login">
              <button className="flex gap-2 items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium cursor-pointer transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-[1.02] active:scale-95">
                <LogInIcon className="size-4" />
                <span className="hidden sm:inline text-sm">Login</span>
              </button>
            </Link>
          )}
        </div>
      </nav>

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={showSearchOverlay}
        onClose={() => setShowSearchOverlay(false)}
      />
    </>
  );
}