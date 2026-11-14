import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const mockRequests = [
  { id: 'REQ-001', bloodGroup: 'O+', units: 2, hospital: 'Wah General Hospital', location: 'Wah Cantt', urgency: 'Critical', requiredDate: '2024-12-15', status: 'Searching for Donor', posted: '2 hours ago' },
  { id: 'REQ-002', bloodGroup: 'A-', units: 1, hospital: 'PIMS', location: 'Islamabad', urgency: 'Urgent', requiredDate: '2024-12-20', status: 'Donor Found', posted: '1 day ago' },
  { id: 'REQ-003', bloodGroup: 'B+', units: 3, hospital: 'Holy Family Hospital', location: 'Rawalpindi', urgency: 'Normal', requiredDate: '2025-01-05', status: 'Pending', posted: '3 days ago' },
];

export function RecipientDashboard() {
  const { user } = useAuth();
  const recipientName = user?.recipientProfile?.fullName || user?.username || 'Recipient';
  const bloodGroup = user?.recipientProfile?.bloodGroup || 'O+';

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
            Good morning, {recipientName.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">Manage your blood requests</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="blood" size="lg">
            <a href="/recipient/create-request">
              <Icons.plus className="mr-2 h-5 w-5" aria-hidden="true" />
              Create Blood Request
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/recipient/find-blood">
              <Icons.search className="mr-2 h-5 w-5" aria-hidden="true" />
              Find Blood
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Primary Action Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-primary/10 text-primary">
                  <Icons.droplet className="h-8 w-8" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-foreground">Need Blood?</h2>
                  <p className="text-muted-foreground">Create a blood request and let our system find compatible donors near you</p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button asChild variant="blood" size="lg">
                  <a href="/recipient/create-request">
                    <Icons.plus className="mr-2 h-5 w-5" aria-hidden="true" />
                    Create Blood Request
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <a href="/recipient/find-blood">
                    <Icons.search className="mr-2 h-5 w-5" aria-hidden="true" />
                    Search Donors
                  </a>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Active Requests', value: '2', icon: Icons.clipboardList, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Pending', value: '1', icon: Icons.clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Fulfilled', value: '5', icon: Icons.checkCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Total Units', value: '8', icon: Icons.droplet, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
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

      {/* Active Requests */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Your Blood Requests</CardTitle>
              <Button asChild variant="ghost" size="sm">
                <a href="/recipient/requests">View All</a>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Icons.droplet className="h-6 w-6" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3">
                          <BloodGroupBadge bloodGroup={request.bloodGroup} size="md" />
                          <span className="font-medium text-foreground">{request.units} unit{request.units > 1 ? 's' : ''}</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.urgency === 'Critical' ? 'bg-red-100 text-red-700' : request.urgency === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                            {request.urgency}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.hospital} • {request.location}</p>
                        <p className="text-sm text-muted-foreground">Needed by: {formatDate(request.requiredDate)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge status={request.status} size="md" />
                      <Button variant="outline" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Create Request', href: '/recipient/create-request', icon: Icons.plus, color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' },
          { label: 'Find Donors', href: '/recipient/find-blood', icon: Icons.search, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
          { label: 'My Requests', href: '/recipient/requests', icon: Icons.clipboardList, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
          { label: 'Notifications', href: '/notifications', icon: Icons.bell, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
        ].map((action, i) => (
          <motion.div
            key={action.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <a
              href={action.href}
              className="block p-6 rounded-xl bg-background border border-border hover:border-primary/50 hover:shadow-lg transition-all text-center"
            >
              <div className={`inline-flex items-center justify-center w-14 h-14 rounded-xl ${action.color} mb-4`}>
                <action.icon className="h-7 w-7" aria-hidden="true" />
              </div>
              <p className="font-medium text-foreground">{action.label}</p>
            </a>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}