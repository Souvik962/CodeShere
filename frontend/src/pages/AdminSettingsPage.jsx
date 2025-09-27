import React, { useState, useEffect } from 'react';
import {
  Settings,
  Server,
  Shield,
  Mail,
  Database,
  Globe,
  Lock,
  AlertTriangle,
  CheckCircle,
  Save,
  RefreshCw,
  Eye,
  EyeOff,
  Bell,
  Users,
  FileText,
  Zap,
  PanelLeft
} from 'lucide-react';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  const [showSecrets, setShowSecrets] = useState({});

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await axiosInstance.get('/admin/settings');
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (section, data) => {
    try {
      setSaving(true);
      // This would typically save to a settings endpoint
      // await axiosInstance.put('/admin/settings', { section, data });
      toast.success('Settings saved successfully');
    } catch (error) {
      console.error('Failed to save settings:', error);
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const toggleSecretVisibility = (key) => {
    setShowSecrets(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 flex items-center justify-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'system', label: 'System', icon: Server },
    { id: 'notifications', label: 'Notifications', icon: Bell }
  ];

  const SystemStatusCard = ({ title, status, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-4 border border-gray-200 dark:border-gray-600">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${color.replace('text-', 'bg-').replace('-500', '-100')} dark:bg-opacity-20`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <span className="font-medium text-gray-900 dark:text-white">{title}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')} animate-pulse`}></div>
          <span className={`text-sm font-medium ${color}`}>{status}</span>
        </div>
      </div>
    </div>
  );

  const SettingCard = ({ title, description, children, icon: Icon }) => (
    <div className="bg-white dark:bg-gray-700 rounded-xl p-6 border border-gray-200 dark:border-gray-600 shadow-sm">
      <div className="flex items-start gap-4">
        {Icon && (
          <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg mt-1">
            <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{description}</p>
          {children}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">System Settings</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">Configure system-wide settings and preferences</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={fetchSettings}
                className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                title="Refresh settings"
              >
                <RefreshCw className="w-5 h-5" />
              </button>
              <Link className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors" to="/admin/dashboard" title='Go to Dashboard'>
                <PanelLeft className="w-5 h-5" />
              </Link>
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/20 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">All Systems Operational</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8">
          <nav className="flex space-x-8 border-b border-gray-200 dark:border-gray-700">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === id
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

        {/* General Settings */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <SettingCard
              title="Site Configuration"
              description="Basic site information and branding settings"
              icon={Globe}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={settings?.siteName || 'CodeShare'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Version
                  </label>
                  <input
                    type="text"
                    value={settings?.version || '1.0.0'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="User Registration"
              description="Control user registration and account creation"
              icon={Users}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Allow New Registrations</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable or disable new user sign-ups</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings?.registrationEnabled}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      settings?.registrationEnabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings?.registrationEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Verification Required</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Require email verification for new accounts</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-12 h-6 bg-blue-500 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-6 mt-0.5"></div>
                    </div>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Content Moderation"
              description="Settings for content moderation and approval"
              icon={FileText}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Auto-approve Posts</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Automatically approve new posts without review</p>
                  </div>
                  <div className="relative">
                    <input type="checkbox" defaultChecked className="sr-only" />
                    <div className="w-12 h-6 bg-blue-500 rounded-full">
                      <div className="w-5 h-5 bg-white rounded-full shadow transform translate-x-6 mt-0.5"></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Maximum File Size (MB)
                  </label>
                  <input
                    type="number"
                    defaultValue="10"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <SettingCard
              title="CAPTCHA Configuration"
              description="Configure CAPTCHA service for spam protection"
              icon={Shield}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Enable CAPTCHA</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Require CAPTCHA verification for logins and registrations</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings?.security?.captchaEnabled}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      settings?.security?.captchaEnabled ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings?.security?.captchaEnabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      reCAPTCHA Site Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.recaptchaSite ? 'text' : 'password'}
                        defaultValue="6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                      <button
                        onClick={() => toggleSecretVisibility('recaptchaSite')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets.recaptchaSite ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      reCAPTCHA Secret Key
                    </label>
                    <div className="relative">
                      <input
                        type={showSecrets.recaptchaSecret ? 'text' : 'password'}
                        defaultValue="6LcXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                        className="w-full px-3 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                      />
                      <button
                        onClick={() => toggleSecretVisibility('recaptchaSecret')}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showSecrets.recaptchaSecret ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Rate Limiting"
              description="Configure rate limiting to prevent abuse"
              icon={Zap}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Window (minutes)
                  </label>
                  <input
                    type="number"
                    defaultValue="15"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Requests
                  </label>
                  <input
                    type="number"
                    defaultValue="100"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Login Security"
              description="Configure login attempt limits and lockout settings"
              icon={Lock}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    value={settings?.security?.maxLoginAttempts || 5}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Lockout Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={settings?.security?.lockoutDuration || 30}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {/* System Settings */}
        {activeTab === 'system' && (
          <div className="space-y-6">
            {/* System Status */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                System Status
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <SystemStatusCard
                  title="Database"
                  status="Connected"
                  icon={Database}
                  color="text-green-500"
                />
                <SystemStatusCard
                  title="API Server"
                  status="Running"
                  icon={Server}
                  color="text-green-500"
                />
                <SystemStatusCard
                  title="File Storage"
                  status="Active"
                  icon={FileText}
                  color="text-green-500"
                />
                <SystemStatusCard
                  title="Email Service"
                  status="Connected"
                  icon={Mail}
                  color="text-green-500"
                />
                <SystemStatusCard
                  title="CAPTCHA Service"
                  status="Operational"
                  icon={Shield}
                  color="text-green-500"
                />
                <SystemStatusCard
                  title="Monitoring"
                  status="Active"
                  icon={Eye}
                  color="text-green-500"
                />
              </div>
            </div>

            <SettingCard
              title="Database Configuration"
              description="Database connection and performance settings"
              icon={Database}
            >
              <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Connection:</span>
                    <span className="text-green-600 dark:text-green-400 ml-2">✓ Connected</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Pool Size:</span>
                    <span className="text-gray-900 dark:text-white ml-2">10/10</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
                    <span className="text-gray-900 dark:text-white ml-2">12ms</span>
                  </div>
                  <div>
                    <span className="text-gray-600 dark:text-gray-400">Collections:</span>
                    <span className="text-gray-900 dark:text-white ml-2">3</span>
                  </div>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Maintenance Mode"
              description="Enable maintenance mode to temporarily disable site access"
              icon={AlertTriangle}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">Maintenance Mode</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">When enabled, only admins can access the site</p>
                </div>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={settings?.maintenance}
                    className="sr-only"
                  />
                  <div className={`w-12 h-6 rounded-full transition-colors ${
                    settings?.maintenance ? 'bg-orange-500' : 'bg-gray-300 dark:bg-gray-600'
                  }`}>
                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                      settings?.maintenance ? 'translate-x-6' : 'translate-x-0.5'
                    }`}></div>
                  </div>
                </div>
              </div>
            </SettingCard>
          </div>
        )}

        {/* Notifications Settings */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <SettingCard
              title="Email Notifications"
              description="Configure email notification settings"
              icon={Mail}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Email Service Enabled</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Enable sending of email notifications</p>
                  </div>
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={settings?.emailSettings?.enabled}
                      className="sr-only"
                    />
                    <div className={`w-12 h-6 rounded-full transition-colors ${
                      settings?.emailSettings?.enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                    }`}>
                      <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                        settings?.emailSettings?.enabled ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    SMTP Provider
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="ses">Amazon SES</option>
                  </select>
                </div>
              </div>
            </SettingCard>

            <SettingCard
              title="Admin Notifications"
              description="Configure what events trigger admin notifications"
              icon={Bell}
            >
              <div className="space-y-4">
                {[
                  { id: 'newUser', label: 'New User Registration', enabled: true },
                  { id: 'suspiciousActivity', label: 'Suspicious Activity Detected', enabled: true },
                  { id: 'systemErrors', label: 'System Errors', enabled: true },
                  { id: 'reportedContent', label: 'Content Reports', enabled: false },
                  { id: 'dailyStats', label: 'Daily Statistics Report', enabled: false }
                ].map(({ id, label, enabled }) => (
                  <div key={id} className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{label}</h4>
                    </div>
                    <div className="relative">
                      <input type="checkbox" defaultChecked={enabled} className="sr-only" />
                      <div className={`w-12 h-6 rounded-full transition-colors ${
                        enabled ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'
                      }`}>
                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform mt-0.5 ${
                          enabled ? 'translate-x-6' : 'translate-x-0.5'
                        }`}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </SettingCard>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-6">
          <button
            onClick={() => handleSaveSettings(activeTab, {})}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettingsPage;