import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';

const mockDonations = [
  { id: '1', date: '2024-11-15', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1 },
  { id: '2', date: '2024-08-20', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1 },
  { id: '3', date: '2024-05-10', bloodGroup: 'O+', location: 'Islamabad Medical Center', status: 'Completed', units: 1 },
];

const mockRequests = [
  { id: 'REQ-001', bloodGroup: 'O-', urgency: 'Critical', location: 'Wah Cantt', time: '2 hours ago', units: 2 },
  { id: 'REQ-002', bloodGroup: 'O+', urgency: 'Urgent', location: 'Rawalpindi', time: '5 hours ago', units: 1 },
  { id: 'REQ-003', bloodGroup: 'A+', urgency: 'Normal', location: 'Islamabad', time: '1 day ago', units: 3 },
];

export function DonorDashboard() {
  const { user } = useAuth();
  const donorName = user?.donorProfile?.fullName || user?.username || 'Donor';
  const bloodGroup = user?.donorProfile?.bloodGroup || 'O+';
  const eligibilityStatus = user?.donorProfile?.eligibilityStatus || 'Eligible';
  const nextEligibleDate = user?.donorProfile?.nextEligibleDate || '2024-12-15';
  const lastDonationDate = user?.donorProfile?.lastDonationDate || '2024-11-15';
  const totalDonations = 8;

  const isEligible = eligibilityStatus === 'Eligible';

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
            Good morning, {donorName.split(' ')[0]} 👋
          </h1>
          <p className="text-muted-foreground">Here's your donation overview</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="blood" size="lg">
            <a href="/donor/requests">
              <Icons.heart className="mr-2 h-5 w-5" aria-hidden="true" />
              View Requests
            </a>
          </Button>
          <Button asChild variant="outline" size="lg">
            <a href="/donor/history">
              <Icons.history className="mr-2 h-5 w-5" aria-hidden="true" />
              Donation History
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Status Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className={isEligible ? 'border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-900/10' : 'border-amber-500/30 bg-amber-50/50 dark:bg-amber-900/10'}>
          <CardContent className="p-6 lg:p-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className={`p-4 rounded-2xl ${isEligible ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400'}`}>
                  {isEligible ? <Icons.checkCircle className="h-8 w-8" /> : <Icons.clock className="h-8 w-8" />}
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <BloodGroupBadge bloodGroup={bloodGroup} size="lg" />
                    <StatusBadge status={eligibilityStatus} size="md" />
                  </div>
                  <p className="text-muted-foreground mt-1">
                    {isEligible ? 'You can donate blood today' : 'Check eligibility details'}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Icons.calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Last donation: {formatDate(lastDonationDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.calendar className="h-4 w-4" aria-hidden="true" />
                  <span>Next eligible: {formatDate(nextEligibleDate)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icons.award className="h-4 w-4" aria-hidden="true" />
                  <span>{totalDonations} total donations</span>
                </div>
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
          { label: 'Total Donations', value: totalDonations.toString(), icon: Icons.heart, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
          { label: 'Lives Impacted', value: (totalDonations * 3).toString(), icon: Icons.users, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Current Streak', value: '3', icon: Icons.award, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Blood Group', value: bloodGroup, icon: Icons.droplet, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
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

      {/* Recent Donations & Blood Requests */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Donations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Recent Donations</h2>
                <Button asChild variant="ghost" size="sm">
                  <a href="/donor/history">View All</a>
                </Button>
              </div>
              <div className="space-y-3">
                {mockDonations.slice(0, 3).map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-xl bg-primary/10 text-primary">
                        <Icons.droplet className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Donation Completed</p>
                        <p className="text-sm text-muted-foreground">{formatDate(donation.date)} • {donation.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" />
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${donation.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>
                        {donation.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Blood Requests Near You */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-foreground">Urgent Requests Near You</h2>
                <Button asChild variant="ghost" size="sm">
                  <a href="/donor/requests">View All</a>
                </Button>
              </div>
              <div className="space-y-3">
                {mockRequests.map((request) => (
                  <div key={request.id} className={`flex items-center justify-between p-4 rounded-lg ${request.urgency === 'Critical' ? 'border-l-4 border-red-500 bg-red-50/50' : request.urgency === 'Urgent' ? 'border-l-4 border-amber-500 bg-amber-50/50' : 'bg-muted/30'}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl ${request.urgency === 'Critical' ? 'bg-red-100 text-red-600' : request.urgency === 'Urgent' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'}`}>
                        <Icons.alertTriangle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <BloodGroupBadge bloodGroup={request.bloodGroup} size="sm" />
                          <span className="text-sm font-medium">{request.units} unit{request.units > 1 ? 's' : ''} needed</span>
                        </div>
                        <p className="text-sm text-muted-foreground">{request.location} • {request.time}</p>
                      </div>
                    </div>
                    <StatusBadge status={request.urgency} size="sm" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Schedule Donation', href: '/donor/schedule', icon: Icons.calendar, color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
          { label: 'Check Eligibility', href: '/donor/eligibility', icon: Icons.shieldCheck, color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' },
          { label: 'Update Availability', href: '/donor/availability', icon: Icons.clock, color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
          { label: 'View Certificates', href: '/donor/certificates', icon: Icons.award, color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
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