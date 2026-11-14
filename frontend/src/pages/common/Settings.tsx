import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Switch } from '../../components/ui/Switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/ui/Tabs';
import { Separator } from '../../components/ui/Separator';
import { motion } from 'framer-motion';
import { changePasswordSchema, type ChangePasswordData } from '../../schemas/validation';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useTheme } from '../../contexts/ThemeContext';

export function Settings() {
  const { user } = useAuth();
  const { success: notifySuccess } = useNotification();
  const { theme, setTheme } = useTheme();
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<{
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  }>({
    resolver: (values) => {
      if (values.newPassword !== values.confirmPassword) {
        return { confirmPassword: { message: 'Passwords do not match', type: 'manual' } };
      }
      return { value: values };
    },
  });

  const onSubmit = async (data: any) => {
    notifySuccess('Password changed successfully');
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your account preferences</p>
        </div>
      </motion.div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex gap-2" role="tablist">
          <button role="tab" aria-selected={activeTab === 'profile'} onClick={() => setActiveTab('profile')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'profile' ? 'bg-red-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}>Profile</button>
          <button role="tab" aria-selected={activeTab === 'account'} onClick={() => setActiveTab('account')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'account' ? 'bg-red-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}>Account</button>
          <button role="tab" aria-selected={activeTab === 'notifications'} onClick={() => setActiveTab('notifications')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications' ? 'bg-red-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}>Notifications</button>
          <button role="tab" aria-selected={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'appearance' ? 'bg-red-600 text-white' : 'text-muted-foreground hover:text-foreground'}`}>Appearance</button>
        </div>
      </div>

      <div className="mt-6">
        {activeTab === 'profile' && (
          <div className="p-6 rounded-xl bg-background border border-border">
            <h3 className="font-semibold mb-4">Personal Information</h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input disabled placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Username</label>
                <input disabled placeholder="@username" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input type="email" disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone Number</label>
                <input type="tel" disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <input disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'account' && (
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Change Password</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Current Password</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">New Password</label>
                  <div className="relative">
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm pr-10" />
                    <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Confirm New Password</label>
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
                </div>
                <button className="w-full px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                  <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2z" /></svg>
                  Update Password
                </button>
              </form>
            </div>

            <hr className="my-6 border-border" />

            <div className="p-6 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <h3 className="font-semibold text-red-800 mb-2">Danger Zone</h3>
              <p className="text-sm text-red-600 mb-4">Deleting your account is permanent and cannot be undone. All your data will be permanently removed.</p>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium">
                <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5.034 7H18" /></svg>
                Delete Account
              </button>
            </div>
          </div>
        )}

        {activeTab === 'notifications' && (
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Email Notifications', desc: 'Receive email notifications for important updates', default: true },
                  { label: 'SMS Notifications', desc: 'Receive SMS for critical alerts', default: false },
                  { label: 'Push Notifications', desc: 'Receive push notifications on mobile', default: true },
                  { label: 'Donation Reminders', desc: 'Reminders when you\'re eligible to donate', default: true },
                  { label: 'Request Alerts', desc: 'Alerts for compatible blood requests', default: true },
                  { label: 'Marketing Emails', desc: 'Receive updates and promotions', default: false },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <div>
                      <label className="block text-sm font-medium text-foreground">{item.label}</label>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <input type="checkbox" defaultChecked={item.default} className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6 mt-6">
            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Theme</h3>
              <div className="grid grid-cols-3 gap-4">
                {[
                  { value: 'light', label: 'Light', icon: '☀️' },
                  { value: 'dark', label: 'Dark', icon: '🌙' },
                  { value: 'system', label: 'System', icon: '💻' },
                ].map((theme) => (
                  <button
                    key={theme.value}
                    className={`p-6 rounded-xl border-2 transition-all text-center ${theme.value === 'light' ? 'bg-white border-gray-200' : theme.value === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-background border-border'}`}
                  >
                    <span className="text-4xl mb-2">{theme.icon}</span>
                    <p className="font-medium">{theme.label}</p>
                    <p className="text-sm text-muted-foreground capitalize">{theme.value} mode</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6 rounded-xl bg-background border border-border">
              <h3 className="font-semibold mb-4">Display Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-foreground">Compact Mode</label>
                    <p className="text-sm text-muted-foreground">Reduce spacing for more content</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-foreground">Reduced Motion</label>
                    <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-sm font-medium text-foreground">High Contrast</label>
                    <p className="text-sm text-muted-foreground">Increase color contrast for accessibility</p>
                  </div>
                  <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}