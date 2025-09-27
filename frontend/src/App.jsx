import { useState, useEffect } from 'react'
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import { Routes, Route, Navigate } from "react-router-dom"
import { Toaster } from 'react-hot-toast'
import LoginPage from './pages/LoginPage'
import SignUpPage from './pages/SignUpPage'
import { useAuthStore } from './store/useAuthStore'
import { useThemeStore } from './store/useThemeStore'
import { DotLoader } from 'react-spinners'
import ProfilePage from './pages/ProfilePage'
import ContributionsPage from './pages/ContributionsPage'
import NotificationsPage from './pages/NotificationsPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminUsersPage from './pages/AdminUsersPage'
import AdminPostsPage from './pages/AdminPostsPage'
import AdminSettingsPage from './pages/AdminSettingsPage'
import SendNotificationPage from './pages/SendNotificationPage'

// Admin Route Protection Component
const AdminRoute = ({ children }) => {
  const { authUser } = useAuthStore();

  // Check if user is logged in and is an admin
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }

  if (authUser.role !== 'admin' && authUser.role !== 'moderator') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { authUser, checkAuth, isCheckingAuth } = useAuthStore();
  const { initializeTheme } = useThemeStore();

  useEffect(() => {
    checkAuth();
    initializeTheme(); // Ensure theme is applied on app mount
  }, [checkAuth, initializeTheme]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className='bg-gray-100 dark:bg-gray-900 min-h-screen flex items-center justify-center'>
        <DotLoader color={"#36d7b7"} />
      </div>
    );
  }

  return (
    <div className='bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300'>
      <Toaster 
        toastOptions={{
          className: 'dark:bg-gray-800 dark:text-white',
          duration: 4000,
        }}
      />
      <Navbar />
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/login' element={!authUser ?<LoginPage /> :<Navigate to="/" />} />
        <Route path='/signUp' element={!authUser ?<SignUpPage /> :<Navigate to="/" />} />
        <Route path='/Profile' element={authUser ?<ProfilePage /> :<Navigate to="/" />} />
        <Route path='/contributions' element={authUser ?<ContributionsPage /> :<Navigate to="/" />} />
        <Route path='/notifications' element={authUser ?<NotificationsPage /> :<Navigate to="/" />} />
        <Route path='/send-notifications' element={authUser ?<SendNotificationPage /> :<Navigate to="/" />} />
        {/* Admin Routes */}
        <Route path='/admin' element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path='/admin/dashboard' element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        } />
        <Route path='/admin/users' element={
          <AdminRoute>
            <AdminUsersPage />
          </AdminRoute>
        } />
        <Route path='/admin/posts' element={
          <AdminRoute>
            <AdminPostsPage />
          </AdminRoute>
        } />
        <Route path='/admin/settings' element={
          <AdminRoute>
            <AdminSettingsPage />
          </AdminRoute>
        } />
      </Routes>
      <Footer />
    </div>
  )
}

export default App;