import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { motion } from 'framer-motion';
import { BLOOD_GROUPS, ELIGIBILITY_STATUSES } from '../../constants';

const mockDonors = [
  { id: 'DNR-001', name: 'Ali Hassan', bloodGroup: 'O-', city: 'Wah Cantt', status: 'Eligible', lastDonation: '2024-11-15', email: 'ali@example.com', phone: '+92 300 1234567' },
  { id: 'DNR-002', name: 'Sara Ahmed', bloodGroup: 'A-', city: 'Islamabad', status: 'Eligible', lastDonation: '2024-10-20', email: 'sara@example.com', phone: '+92 321 7654321' },
  { id: 'DNR-003', name: 'Hassan Raza', bloodGroup: 'B+', city: 'Rawalpindi', status: 'Pending Medical Review', lastDonation: '2024-09-10', email: 'hassan@example.com', phone: '+92 333 5555555' },
  { id: 'DNR-004', name: 'Fatima Ali', bloodGroup: 'AB-', city: 'Islamabad', status: 'Eligible', lastDonation: '2024-11-05', email: 'fatima@example.com', phone: '+92 345 6667777' },
  { id: 'DNR-005', name: 'Ahmed Khan', bloodGroup: 'O+', city: 'Wah Cantt', status: 'Temporarily Deferred', lastDonation: '2024-08-15', email: 'ahmed@example.com', phone: '+92 300 1112222' },
  { id: 'DNR-006', name: 'Sanaullah', bloodGroup: 'B-', city: 'Rawalpindi', status: 'Eligible', lastDonation: '2024-10-01', email: 'sana@example.com', phone: '+92 321 3334444' },
];

export function StaffDonors() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedDonor, setSelectedDonor] = useState<typeof mockDonors[0] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const itemsPerPage = 5;
  const filteredDonors = mockDonors.filter(d =>
    (!search || d.name.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())) &&
    (!bloodGroupFilter || d.bloodGroup === bloodGroupFilter) &&
    (!statusFilter || d.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredDonors.length / 5);
  const paginatedDonors = filteredDonors.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Donor Management</h1>
          <p className="text-muted-foreground">Manage donor records and eligibility</p>
        </div>
        <Button variant="blood" size="lg" onClick={() => setShowAddDialog(true)}>
          <Icons.plus className="mr-2 h-5 w-5" aria-hidden="true" />
          Register New Donor
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
              placeholder="Search by name, ID, or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-md"
            />
          </div>
          <div>
            <Select
              value={bloodGroupFilter}
              onValueChange={setBloodGroupFilter}
              placeholder="Blood Group"
              options={[{ value: '', label: 'All Blood Groups' }, ...BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))]}
            />
          </div>
          <div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              placeholder="Status"
              options={[{ value: '', label: 'All Statuses' }, ...ELIGIBILITY_STATUSES.map(s => ({ value: s, label: s }))]}
            />
          </div>
        </div>
      </motion.div>

      {/* Donors Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>All Donors ({filteredDonors.length})</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.filter className="h-4 w-4" aria-hidden="true" />
                <span>Showing {filteredDonors.length} of {mockDonors.length}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Donation</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedDonors.map((donor) => (
                  <TableRow key={donor.id}>
                    <TableCell className="font-mono text-sm">{donor.id}</TableCell>
                    <TableCell>
                      <p className="font-medium">{donor.name}</p>
                      <p className="text-sm text-muted-foreground">{donor.email}</p>
                    </TableCell>
                    <TableCell><BloodGroupBadge bloodGroup={donor.bloodGroup} size="sm" /></TableCell>
                    <TableCell>{donor.city}</TableCell>
                    <TableCell><StatusBadge status={donor.status} size="sm" /></TableCell>
                    <TableCell>{donor.lastDonation ? formatDate(donor.lastDonation) : 'Never'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => setSelectedDonor(donor)}>
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
                Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, filteredDonors.length)} of {filteredDonors.length} donors
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Donor Detail Dialog */}
      <Dialog open={!!selectedDonor} onOpenChange={(open) => !open && setSelectedDonor(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Donor Details</DialogTitle>
            <DialogDescription>ID: {selectedDonor?.id}</DialogDescription>
          </DialogHeader>
          {selectedDonor && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <BloodGroupBadge bloodGroup={selectedDonor.bloodGroup} size="md" />
                    <StatusBadge status={selectedDonor.status} size="md" />
                  </div>
                  <p className="font-medium">{selectedDonor.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedDonor.id}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="font-medium">{selectedDonor.city}</p>
                  <p className="text-sm text-muted-foreground">{selectedDonor.email}</p>
                  <p className="text-sm text-muted-foreground">{selectedDonor.phone}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="font-medium">Last Donation</p>
                  <p className="text-muted-foreground">{selectedDonor.lastDonation ? formatDate(selectedDonor.lastDonation) : 'Never'}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="font-medium">Eligibility Status</p>
                  <StatusBadge status={selectedDonor.status} size="md" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <Icons.alertTriangle className="mr-1 h-4 w-4 inline" aria-hidden="true" />
                  Eligibility review required for medical clearance before next donation.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedDonor(null)}>Close</Button>
            <Button variant="blood" onClick={() => { setSelectedDonor(null); /* edit */ }}>
              <Icons.edit className="mr-2 h-4 w-4" aria-hidden="true" />
              Edit Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Donor Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Register New Donor</DialogTitle>
            <DialogDescription>Enter donor information to create a new record</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowAddDialog(false); }}>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="John Doe" required />
              <Input label="Email" type="email" placeholder="john@example.com" required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="Phone" type="tel" placeholder="+92 300 1234567" required />
              <Select label="Blood Group" placeholder="Select" options={BLOOD_GROUPS.map(bg => ({ value: bg, label: bg }))} required />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input label="City" placeholder="Wah Cantt" required />
              <Select label="Gender" placeholder="Select" options={[{ value: 'Male', label: 'Male' }, { value: 'Female', label: 'Female' }, { value: 'Other', label: 'Other' }]} required />
            </div>
            <Input label="Date of Birth" type="date" required />
            <Input label="Address" placeholder="123 Main Street" />
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input id="emergencyContact" type="tel" placeholder="+92 300 1234567" />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>Cancel</Button>
            <Button variant="blood" type="submit">
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Register Donor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}