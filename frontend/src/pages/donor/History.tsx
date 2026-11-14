import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';
import { motion } from 'framer-motion';

const mockDonations = [
  { id: 'DON-001', date: '2024-11-15', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-002', date: '2024-08-20', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-003', date: '2024-05-10', bloodGroup: 'O+', location: 'Islamabad Medical Center', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-004', date: '2024-02-14', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-005', date: '2023-11-05', bloodGroup: 'O+', location: 'Rawalpindi Blood Bank', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-006', date: '2023-08-22', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-007', date: '2023-05-15', bloodGroup: 'O+', location: 'Islamabad Medical Center', status: 'Completed', units: 1, component: 'Whole Blood' },
  { id: 'DON-008', date: '2023-02-10', bloodGroup: 'O+', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood' },
];

export function DonorHistory() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockDonations.length / itemsPerPage);
  const paginatedDonations = mockDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Donation History</h1>
          <p className="text-muted-foreground">View your complete donation record</p>
        </div>
        <div className="flex gap-3">
          <Button asChild variant="outline" size="sm">
            <a href="/donor/history/export">
              <Icons.download className="mr-2 h-4 w-4" aria-hidden="true" />
              Export CSV
            </a>
          </Button>
          <Button asChild variant="blood" size="sm">
            <a href="/donor/schedule">
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Schedule Donation
            </a>
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Donations', value: '8', icon: Icons.heart, color: 'text-red-500' },
          { label: 'Total Volume', value: '4.0 L', icon: Icons.droplet, color: 'text-red-600' },
          { label: 'Lives Saved', value: '24', icon: Icons.users, color: 'text-red-700' },
          { label: 'Years Active', value: '4', icon: Icons.award, color: 'text-red-800' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-background border border-border"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/30">
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

      {/* Donations Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Donations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDonations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell>{formatDate(donation.date)}</TableCell>
                    <TableCell><BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" /></TableCell>
                    <TableCell>{donation.component}</TableCell>
                    <TableCell>{donation.location}</TableCell>
                    <TableCell>{donation.units} unit{donation.units > 1 ? 's' : ''}</TableCell>
                    <TableCell><StatusBadge status={donation.status} size="sm" /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Icons.eye className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, mockDonations.length)} of {mockDonations.length} donations
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                showTotal
                total={mockDonations.length}
                limit={itemsPerPage}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Milestones & Achievements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { milestone: 'First Donation', date: '2023-02-10', description: 'Your journey began', icon: Icons.heart },
                { milestone: '5th Donation', date: '2023-11-05', description: 'Reached 5 donations', icon: Icons.award },
                { milestone: '1 Gallon Club', date: '2024-05-10', description: 'Donated 1 gallon (8 pints)', icon: Icons.droplet },
                { milestone: 'Lives Impacted: 24', date: '2024-11-15', description: 'Estimated lives saved', icon: Icons.users },
              ].map((milestone, i) => (
                <motion.div
                  key={milestone.milestone}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-muted/30"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    <milestone.icon className="h-6 w-6" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{milestone.milestone}</p>
                    <p className="text-sm text-muted-foreground">{milestone.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">{formatDate(milestone.date)}</p>
                    <p className="text-xs text-muted-foreground">Achieved</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}