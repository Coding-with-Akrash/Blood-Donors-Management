import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { motion } from 'framer-motion';

const mockDonations = [
  { id: 'DON-001', donor: 'Ali Hassan', donorId: 'DNR-001', bloodGroup: 'O-', date: '2024-11-15', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-002', donor: 'Sara Ahmed', donorId: 'DNR-002', bloodGroup: 'A-', date: '2024-10-20', location: 'Islamabad Medical Center', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-003', donor: 'Hassan Raza', donorId: 'DNR-003', bloodGroup: 'B+', date: '2024-09-10', location: 'Rawalpindi Blood Bank', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-004', donor: 'Fatima Ali', donorId: 'DNR-004', bloodGroup: 'AB-', date: '2024-11-05', location: 'Islamabad Medical Center', status: 'Completed', units: 1, component: 'Plasma', screening: 'Passed' },
  { id: 'DON-005', donor: 'Ahmed Khan', donorId: 'DNR-005', bloodGroup: 'O+', date: '2024-08-15', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-006', donor: 'Sanaullah', donorId: 'DNR-006', bloodGroup: 'B-', date: '2024-10-01', location: 'Rawalpindi Blood Bank', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
];

export function StaffDonations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [componentFilter, setComponentFilter] = useState('');
  const [selectedDonation, setSelectedDonation] = useState<typeof mockDonations[0] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const itemsPerPage = 5;
  const filteredDonations = mockDonations.filter(d =>
    (!search || d.donor.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())) &&
    (!bloodGroupFilter || d.bloodGroup === bloodGroupFilter) &&
    (!statusFilter || d.status === statusFilter) &&
    (!componentFilter || d.component === componentFilter)
  );
  const totalPages = Math.ceil(filteredDonations.length / 5);
  const paginatedDonations = filteredDonations.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Donation Records</h1>
          <p className="text-muted-foreground">Manage and track all blood donations</p>
        </div>
        <Button variant="blood" size="lg" onClick={() => setShowAddDialog(true)}>
          <Icons.plus className="mr-2 h-5 w-5" aria-hidden="true" />
          Record Donation
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-4 rounded-xl bg-background border border-border"
      >
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search by donor, ID, or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <Select value={bloodGroupFilter} onValueChange={setBloodGroupFilter} placeholder="Blood Group" options={[{ value: '', label: 'All' }, 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ value: bg, label: bg }))} />
          <Select value={statusFilter} onValueChange={setStatusFilter} placeholder="Status" options={[{ value: '', label: 'All' }, 'Completed', 'Pending', 'Tested', 'Available', 'Used', 'Expired'].map(s => ({ value: s, label: s }))} />
          <Select value={componentFilter} onValueChange={setComponentFilter} placeholder="Component" options={[{ value: '', label: 'All' }, 'Whole Blood', 'Red Cells', 'Plasma', 'Platelets'].map(c => ({ value: c, label: c }))} />
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total Donations', value: '1,247', icon: Icons.droplet, color: 'text-red-500' },
          { label: 'This Month', value: '89', icon: Icons.calendar, color: 'text-blue-500' },
          { label: 'Pending Screening', value: '12', icon: Icons.clock, color: 'text-amber-500' },
          { label: 'Available Units', value: '456', icon: Icons.droplets, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-4 rounded-xl bg-background border border-border"
          >
            <div className="flex items-center justify-between">
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" aria-hidden="true" />
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
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>All Donations ({mockDonations.length})</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.filter className="h-4 w-4" aria-hidden="true" />
                <span>Showing {filteredDonations.length} records</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Donor</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Component</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Screening</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockDonations.slice((currentPage - 1) * 5, currentPage * 5).map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-mono text-sm">{donation.id}</TableCell>
                    <TableCell>
                      <p className="font-medium">{donation.donor}</p>
                      <p className="text-sm text-muted-foreground">{donation.donorId}</p>
                    </TableCell>
                    <TableCell><BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" /></TableCell>
                    <TableCell>{formatDate(donation.date)}</TableCell>
                    <TableCell>{donation.location}</TableCell>
                    <TableCell>{donation.component}</TableCell>
                    <TableCell>{donation.units} unit{donation.units > 1 ? 's' : ''}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${donation.screening === 'Passed' ? 'bg-emerald-100 text-emerald-700' : donation.screening === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                        {donation.screening}
                      </span>
                    </TableCell>
                    <TableCell><StatusBadge status={donation.status} size="sm" /></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDonation(donation)}>
                        <Icons.eye className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">View</span>
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Icons.edit className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Edit</span>
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
                totalPages={Math.ceil(mockDonations.length / 5)}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Add Donation Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Record New Donation</DialogTitle>
            <DialogDescription>Enter donation details</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddDialog(false); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Donor ID" placeholder="DNR-001" required />
              <Select label="Blood Group" placeholder="Select" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ value: bg, label: bg }))} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Donation Date" type="date" value={new Date().toISOString().split('T')[0]} required />
              <Select label="Component" placeholder="Select" options={['Whole Blood', 'Red Cells', 'Plasma', 'Platelets'].map(c => ({ value: c, label: c }))} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Quantity (units)" type="number" min="0.5" max="2" step="0.5" value="1" required />
              <Select label="Location" placeholder="Select" options={['Wah Blood Center', 'Islamabad Medical Center', 'Rawalpindi Blood Bank'].map(l => ({ value: l, label: l }))} required />
            </div>
            <Select label="Screening Status" placeholder="Select" options={['Passed', 'Failed', 'Pending'].map(s => ({ value: s, label: s }))} />
            <Select label="Donation Status" placeholder="Select" options={['Completed', 'Pending', 'Tested', 'Available', 'Used', 'Expired'].map(s => ({ value: s, label: s }))} />
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" type="button" onClick={() => setShowAddDialog(false)}>Cancel</Button>
              <Button variant="blood" type="submit">
                <Icons.save className="mr-2 h-5 w-5" aria-hidden="true" />
                Record Donation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}