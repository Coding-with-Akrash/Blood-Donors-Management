import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';

const mockNotifications = [
  { id: '1', title: 'New critical blood request', message: 'O- blood needed urgently at Wah General Hospital', type: 'critical' as const, time: '2 minutes ago', read: false },
  { id: '2', title: 'Your donor eligibility approved', message: 'You are now eligible to donate blood', type: 'success' as const, time: '1 hour ago', read: false },
  { id: '3', title: 'Donation record updated', message: 'Your donation on Nov 15 has been confirmed', type: 'info' as const, time: 'Yesterday', read: true },
  { id: '4', title: 'New blood request near you', message: 'A+ blood needed at PIMS Islamabad', type: 'warning' as const, time: '2 days ago', read: true },
  { id: '5', title: 'Donation reminder', message: 'You are eligible to donate again from Dec 15', type: 'info' as const, time: '3 days ago', read: true },
  { id: '6', title: 'New donor registered', message: 'Ali Hassan registered as O- donor', type: 'info' as const, time: '1 week ago', read: true },
];

const typeColors = {
  critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  info: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

const typeIcons = {
  critical: '⚠️',
  urgent: '⚠️',
  success: '✅',
  warning: '⚠️',
  info: 'ℹ️',
};

export function Notifications() {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(mockNotifications);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const filteredNotifications = filter === 'unread'
    ? mockNotifications.filter(n => !n.read)
    : mockNotifications;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with important alerts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={mockNotifications.every(n => n.read)}>
            <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 11l-2 2-4-4m-6-4v.01M12 16h2.5" /></svg>
            Mark All Read
          </Button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <Button variant={filter === 'all' ? 'blood' : 'outline'} size="sm" onClick={() => setFilter('all')}>
          All ({mockNotifications.length})
        </Button>
        <Button variant={filter === 'unread' ? 'blood' : 'outline'} size="sm" onClick={() => setFilter('unread')}>
          Unread ({mockNotifications.filter(n => !n.read).length})
        </Button>
      </div>

      <div className="space-y-3">
        {mockNotifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 }}
            className={`p-4 rounded-xl border border-border transition-all ${notification.read ? 'bg-background' : 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800'}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-xl ${['critical', 'urgent'].includes(notification.type) ? 'bg-red-100 text-red-600' : notification.type === 'success' ? 'bg-emerald-100 text-emerald-600' : notification.type === 'warning' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                <span className="text-2xl">{['critical', 'urgent'].includes(notification.type) ? '⚠️' : notification.type === 'success' ? '✅' : notification.type === 'warning' ? '⚠️' : 'ℹ️'}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-4">
                  <h3 className={`font-semibold ${notification.read ? 'text-foreground' : 'text-foreground font-bold'}`}>
                    {notification.title}
                  </h3>
                  {notification.read ? (
                    <span className="text-xs text-muted-foreground">Read</span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">New</span>
                  )}
                </div>
                <p className="text-muted-foreground mt-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
              </div>
              {!notification.read && (
                <Button variant="ghost" size="sm" onClick={() => setNotifications(prev => prev.map(n => n.id === notification.id ? { ...n, read: true } : n))}>
                  Mark as read
                </Button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {mockNotifications.filter(n => !n.read).length === 0 && (
        <div className="text-center py-12">
          <svg className="mx-auto h-12 w-12 text-muted-foreground mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.381C7.673 5.04 7 5.53 7 6.16V21a2 2 0 002 2h11a2 2 0 002-2v-.381c0-.63.13-1.119.355-1.54" /></svg>
          <h3 className="text-lg font-medium text-foreground mb-2">All caught up!</h3>
          <p className="text-muted-foreground">No new notifications at the moment</p>
        </div>
      )}
    </div>
  );
}