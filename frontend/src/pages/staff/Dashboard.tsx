import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { formatRelativeTime } from '../../utils/cn';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const mockRecentDonations = [
  { id: 'DON-001', donor: 'Ahmed Khan', bloodGroup: 'O+', location: 'Wah Blood Center', date: '2 hours ago', status: 'Completed' },
  { id: 'DON-002', donor: 'Sara Ahmed', bloodGroup: 'A-', location: 'Islamabad Medical Center', date: '4 hours ago', status: 'Completed' },
  { id: 'DON-003', donor: 'Hassan Raza', bloodGroup: 'B+', location: 'Rawalpindi Blood Bank', date: '6 hours ago', status: 'Pending' },
];

const mockUrgentRequests = [
  { id: 'REQ-001', bloodGroup: 'O-', urgency: 'Critical', units: 2, hospital: 'Wah General Hospital', location: 'Wah Cantt', time: '30 minutes ago' },
  { id: 'REQ-002', bloodGroup: 'AB-', urgency: 'Critical', units: 1, hospital: 'PIMS', location: 'Islamabad', time: '1 hour ago' },
  { id: 'REQ-003', bloodGroup: 'B+', urgency: 'Urgent', units: 3, hospital: 'Holy Family Hospital', location: 'Rawalpindi', time: '2 hours ago' },
];

const mockPendingReviews = [
  { id: 'DNR-001', name: 'Ali Hassan', bloodGroup: 'O-', location: 'Wah Cantt', submitted: '2 days ago' },
  { id: 'DNR-002', name: 'Fatima Ali', bloodGroup: 'A-', location: 'Islamabad', submitted: '1 day ago' },
];

export function StaffDashboard() {
  const { user } = useAuth();
  const staffName = user?.username || 'Staff Member';

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">
            Good morning, {staffName} 👋
          </h1>
          <p className="text-muted-foreground">Staff dashboard overview</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="blood" size="lg">
            <a href="/staff/donors">
              <Icons.plus className="mr-2 h-5 w-5" aria-hidden="true" />
              Register Donor
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/staff/requests">
              <Icons.clipboardList className="mr-2 h-5 w-5" aria-hidden="true" />
              View Requests
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total Donors', value: '1,284', icon: Icons.users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Eligible Donors', value: '947', icon: Icons.checkCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Pending Reviews', value: '28', icon: Icons.clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Blood Requests', value: '41', icon: Icons.clipboardList, color: 'text-purple-500', bg: 'bg-purple-100 dark:bg-purple-900/30' },
          { label: 'Critical Requests', value: '6', icon: Icons.alertTriangle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-background border border-border"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} aria-hidden="true" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts Row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        {/* Donations Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Donations This Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-end justify-around gap-2 px-4 py-4">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                <div key={day} className="flex flex-col items-center flex-1">
                  <div
                    className="w-full bg-primary rounded-t transition-all hover:bg-primary/80"
                    style={{ height: `${Math.max(20, 30 + Math.sin(i) * 40)}%` }}
                  />
                  <span className="text-xs text-muted-foreground mt-2">{day}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Blood Group Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Group Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { group: 'O+', percentage: 38, color: 'bg-red-500' },
                { group: 'A+', percentage: 34, color: 'bg-red-600' },
                { group: 'B+', percentage: 9, color: 'bg-blue-500' },
                { group: 'AB+', percentage: 3, color: 'bg-purple-500' },
                { group: 'O-', percentage: 7, color: 'bg-red-700' },
                { group: 'A-', percentage: 6, color: 'bg-red-800' },
                { group: 'B-', percentage: 2, color: 'bg-blue-700' },
                { group: 'AB-', percentage: 1, color: 'bg-purple-700' },
              ].map((item) => (
                <div key={item.group} className="flex items-center gap-4">
                  <BloodGroupBadge bloodGroup={item.group} size="sm" className="w-20" />
                  <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className={`${item.color} h-full rounded-full transition-all`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium w-12 text-right">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Activity & Urgent Items */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Recent Donations</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <a href="/staff/donations">View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockRecentDonations.map((donation) => (
                <div key={donation.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 text-primary">
                      <Icons.droplet className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{donation.donor}</p>
                      <p className="text-sm text-muted-foreground">{donation.bloodGroup} • {donation.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <span className="text-muted-foreground">{formatRelativeTime(donation.date)}</span>
                    <StatusBadge status={donation.status} size="sm" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Urgent Requests */}
        <Card className="border-red-500/30 bg-red-50/50 dark:bg-red-900/10">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Icons.alertTriangle className="h-5 w-5 text-red-500" aria-hidden="true" />
                Urgent Blood Requests
              </CardTitle>
              <Button asChild variant="ghost" size="sm">
                <a href="/staff/requests">View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUrgentRequests.map((request) => (
                <div key={request.id} className="p-4 rounded-lg bg-red-50/50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                  <div className="flex items-center justify-between mb-2">
                    <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.urgency === 'Critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {request.urgency}
                    </span>
                  </div>
                  <p className="font-medium text-foreground">{request.units} unit{request.units > 1 ? 's' : ''} needed</p>
                  <p className="text-sm text-muted-foreground">{request.hospital} • {request.location}</p>
                  <p className="text-xs text-red-600 mt-1">{request.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Pending Reviews & Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid lg:grid-cols-2 gap-6"
      >
        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Pending Donor Reviews</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <a href="/staff/donors?filter=pending">View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockPendingReviews.map((review) => (
                <div key={review.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-amber-100 text-amber-600">
                      <Icons.clock className="h-5 w-5" aria-hidden="true" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{review.name}</p>
                      <p className="text-sm text-muted-foreground">{review.bloodGroup} • {review.location} • Submitted {review.submitted}</p>
                    </div>
                  </div>
                  <Button variant="blood" size="sm">Review</Button>
                </div>
              ))}
              {mockPendingReviews.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No pending reviews
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: 'Register New Donor', href: '/staff/donors/new', icon: Icons.userPlus, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
                { label: 'Record Donation', href: '/staff/donations/new', icon: Icons.droplet, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
                { label: 'Manage Inventory', href: '/staff/inventory', icon: Icons.droplets, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
                { label: 'Review Requests', href: '/staff/requests', icon: Icons.clipboardList, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
                { label: 'Generate Report', href: '/staff/reports', icon: Icons.barChart, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
                { label: 'Blood Compatibility', href: '/blood-compatibility', icon: Icons.droplets, color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400' },
              ].map((action, i) => (
                <motion.a
                  key={action.label}
                  href={action.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="block p-4 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all text-center"
                >
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${action.color} mb-3`}>
                    <action.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <p className="font-medium text-foreground text-sm">{action.label}</p>
                </motion.a>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}