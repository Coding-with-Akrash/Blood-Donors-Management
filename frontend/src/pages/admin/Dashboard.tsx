import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { formatRelativeTime } from '../../utils/cn';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { Icons } from '../../components/ui/Icons';
import { ROLE_STAT_COLORS, STAT_COLORS } from '../../constants';

const mockRecentUsers = [
  { id: 'USR-001', name: 'Ali Hassan', email: 'ali@example.com', role: 'donor', status: 'Active', joined: '2 hours ago' },
  { id: 'USR-002', name: 'Sara Ahmed', email: 'sara@example.com', role: 'recipient', status: 'Active', joined: '4 hours ago' },
  { id: 'USR-003', name: 'Hassan Raza', email: 'hassan@example.com', role: 'staff', status: 'Active', joined: '1 day ago' },
];

const mockRecentActivity = [
  { id: '1', action: 'User registered', user: 'Ali Hassan', role: 'donor', time: '2 hours ago' },
  { id: '2', action: 'Blood request created', user: 'Sara Ahmed', role: 'recipient', time: '4 hours ago' },
  { id: '3', action: 'Donation recorded', user: 'Staff Member', role: 'staff', time: '6 hours ago' },
  { id: '4', action: 'Donor approved', user: 'Admin', role: 'admin', time: '1 day ago' },
];

export function AdminDashboard() {
  const { user } = useAuth();
  const adminName = user?.username || 'Admin';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Good morning, {adminName} 👋
          </h1>
          <p className="text-muted-foreground">System administration overview</p>
        </div>
        <Button variant="default">
          <Icons.plus className="w-5 h-5 mr-2 inline" aria-hidden="true" />
          Create User
        </Button>
      </motion.div>

      <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Users', value: '2,847', icon: Icons.users, colorKey: 'primary' },
          { label: 'Donors', value: '1,284', icon: Icons.heart, colorKey: 'primary' },
          { label: 'Recipients', value: '432', icon: Icons.droplet, colorKey: 'info' },
          { label: 'Staff', value: '28', icon: Icons.shield, colorKey: 'success' },
          { label: 'Admins', value: '3', icon: Icons.badge, colorKey: 'warning' },
          { label: 'Active Sessions', value: '156', icon: Icons.activity, colorKey: 'success' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-background border border-border"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${STAT_COLORS[stat.colorKey as keyof typeof STAT_COLORS]}`}>
                <stat.icon className="h-6 w-6" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-background border border-border"
        >
          <h3 className="font-semibold mb-4">User Growth</h3>
          <div className="h-64 flex items-end justify-around gap-2 px-4 py-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month, i) => (
              <div key={month} className="flex flex-col items-center flex-1">
                <div className="w-full bg-primary rounded-t transition-all hover:bg-primary-hover" style={{ height: `${Math.max(10, 20 + i * 5 + Math.sin(i) * 10)}%` }} />
                <span className="text-xs text-muted-foreground mt-2">{month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-xl bg-background border border-border"
        >
          <h3 className="font-semibold mb-4">User Roles Distribution</h3>
          <div className="space-y-4">
            {[
              { role: 'Donors', count: 1284, percentage: 45, colorKey: 'primary' },
              { role: 'Recipients', count: 432, percentage: 15, colorKey: 'info' },
              { role: 'Staff', count: 28, percentage: 1, colorKey: 'success' },
              { role: 'Admins', count: 3, percentage: 0.1, colorKey: 'warning' },
            ].map((item) => (
              <div key={item.role} className="flex items-center gap-4">
                <span className="w-24 font-medium">{item.role}</span>
                <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${STAT_COLORS[item.colorKey as keyof typeof STAT_COLORS].replace('bg-', 'bg-').replace('text-', '').replace('/10', '')}`} style={{ width: `${item.percentage}%`, backgroundColor: 'hsl(var(--' + item.colorKey + '))', opacity: 0.8 }} />
                </div>
                <span className="text-sm font-medium w-16 text-right">{item.percentage}%</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        <div className="p-6 rounded-xl bg-background border border-border">
          <h3 className="font-semibold mb-4">Recent User Registrations</h3>
          <div className="space-y-3">
            {[
              { name: 'Ali Hassan', role: 'donor', time: '2 hours ago' },
              { name: 'Sara Ahmed', role: 'recipient', time: '4 hours ago' },
              { name: 'Hassan Raza', role: 'staff', time: '1 day ago' },
              { name: 'Fatima Ali', role: 'donor', time: '2 days ago' },
              { name: 'Ahmed Khan', role: 'recipient', time: '3 days ago' },
            ].map((user, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl ${ROLE_STAT_COLORS[user.role as keyof typeof ROLE_STAT_COLORS]}`}>
                    <Icons.user className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.role}</p>
                  </div>
                </div>
                <span className="text-sm text-muted-foreground">{user.time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-background border border-border">
          <h3 className="font-semibold mb-4">System Activity</h3>
          <div className="space-y-3">
            {[
              { action: 'User registered', user: 'Ali Hassan', role: 'donor', time: '2 hours ago', icon: Icons.userPlus },
              { action: 'Blood request created', user: 'Sara Ahmed', role: 'recipient', time: '4 hours ago', icon: Icons.droplet },
              { action: 'Donation recorded', user: 'Staff Member', role: 'staff', time: '6 hours ago', icon: Icons.heart },
              { action: 'Donor approved', user: 'Admin', role: 'admin', time: '1 day ago', icon: Icons.shieldCheck },
              { action: 'Inventory updated', user: 'Staff Member', role: 'staff', time: '2 days ago', icon: Icons.package },
            ].map((activity, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50">
                <div className={`p-2 rounded-xl ${ROLE_STAT_COLORS[activity.role as keyof typeof ROLE_STAT_COLORS]}`}>
                  <activity.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">By {activity.user} ({activity.role})</p>
                </div>
                <span className="text-sm text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid lg:grid-cols-3 gap-6"
      >
        <div className="p-6 rounded-xl bg-background border border-border">
          <h3 className="font-semibold mb-4">System Health</h3>
          <div className="space-y-4">
            {[
              { label: 'API Uptime', value: '99.9%', status: 'healthy' },
              { label: 'Database', value: 'Connected', status: 'healthy' },
              { label: 'Auth Service', value: 'Operational', status: 'healthy' },
              { label: 'Storage', value: '45% used', status: 'warning' },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                <span className="font-medium">{item.label}</span>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${item.status === 'healthy' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>
                    {item.status}
                  </span>
                  <span className="font-mono text-sm">{item.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 rounded-xl bg-background border border-border lg:col-span-2">
          <h3 className="font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Create User', colorKey: 'primary', icon: Icons.userPlus },
              { label: 'View Audit Logs', colorKey: 'info', icon: Icons.fileText },
              { label: 'System Settings', colorKey: 'secondary', icon: Icons.settings },
              { label: 'Manage Roles', colorKey: 'warning', icon: Icons.shield },
              { label: 'Export Data', colorKey: 'success', icon: Icons.download },
              { label: 'Backup Database', colorKey: 'destructive', icon: Icons.database },
            ].map((action, i) => (
              <Button key={i} variant="outline" className="p-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all text-left justify-start gap-3">
                <div className={`p-2 rounded-xl ${STAT_COLORS[action.colorKey as keyof typeof STAT_COLORS]}`}>
                  <action.icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <p className="mt-2 font-medium text-sm">{action.label}</p>
              </Button>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}