import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Label } from '../../components/ui/Label';
import { Avatar } from '../../components/ui/Avatar';
import { motion } from 'framer-motion';
import { changePasswordSchema, type ChangePasswordData } from '../../schemas/validation';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';

export function Profile() {
  const { user } = useAuth();
  const { success: notifySuccess } = useNotification();
  const [isEditing, setIsEditing] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<{
    fullName: string;
    email: string;
    phone: string;
    city: string;
  }>({
    defaultValues: {
      fullName: user?.donorProfile?.fullName || user?.recipientProfile?.fullName || user?.username || '',
      email: user?.email || '',
      phone: user?.donorProfile?.phone || user?.recipientProfile?.phone || '',
      city: user?.donorProfile?.city || user?.recipientProfile?.city || '',
    },
  });

  const onSubmit = async (data: any) => {
    notifySuccess('Profile updated successfully');
    setIsEditing(false);
  };

  const toggleEdit = () => {
    if (!isEditing) {
      setIsEditing(true);
    } else {
      reset();
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">My Profile</h1>
          <p className="text-muted-foreground">Manage your account settings</p>
        </div>
        <button className="px-4 py-2 border border-input rounded-lg hover:bg-muted transition-colors" onClick={toggleEdit}>
          {isEditing ? (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              Cancel
            </>
          ) : (
            <>
              <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.364 5.636l-3.536 3.536M15 17.364l-3.536 3.536" /></svg>
              Edit Profile
            </>
          )}
        </button>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="p-6 rounded-xl bg-background border border-border">
            <div className="text-center">
              <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4 text-red-600">
                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 01-7 7h10a7 7 0 00-7-7z" /></svg>
              </div>
              <h2 className="text-xl font-semibold text-foreground">{user?.donorProfile?.fullName || user?.recipientProfile?.fullName || user?.username}</h2>
              <p className="text-muted-foreground">@{user?.username}</p>
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                  {user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
              </div>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>{user?.email}</p>
                <p>Member since 2024</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-6 rounded-xl bg-background border border-border">
            <h3 className="font-semibold mb-4">Quick Stats</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-background border border-border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Account Type</p>
                    <p className="font-medium capitalize">{user?.role}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-100 text-red-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 01-7 7h10a7 7 0 00-7-7z" /></svg>
                  </div>
                </div>
              </div>
              {user?.role === 'donor' && (
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Blood Group</p>
                      <p className="font-medium">{user?.donorProfile?.bloodGroup || 'Not set'}</p>
                    </div>
                  </div>
                </div>
              )}
              {user?.role === 'donor' && (
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Donations</p>
                      <p className="font-medium">8</p>
                    </div>
                  </div>
                </div>
              )}
              {user?.role === 'recipient' && (
                <div className="p-4 rounded-xl bg-background border border-border">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Active Requests</p>
                      <p className="font-medium">2</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="p-6 rounded-xl bg-background border border-border">
            <h3 className="font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {[
                { action: 'Profile updated', time: '2 hours ago' },
                { action: 'Donation recorded', time: '2 days ago' },
                { action: 'Request created', time: '5 days ago' },
                { action: 'Password changed', time: '1 week ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                  <div className="p-2 rounded-xl bg-red-100 text-red-600">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5M18.364 5.636l-3.536 3.536M15 17.364l-3.536 3.536" /></svg>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="p-6 rounded-xl bg-background border border-border">
          <h3 className="font-semibold mb-4">Personal Information</h3>
          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <input type="email" disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Phone</label>
                <input type="tel" disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">City</label>
                <input disabled className="w-full px-4 py-3 rounded-lg border border-input bg-background text-sm" />
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}