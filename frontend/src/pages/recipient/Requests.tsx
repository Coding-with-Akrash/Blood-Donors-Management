import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../components/ui/AlertDialog';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { motion } from 'framer-motion';

const mockRequests = [
  { id: 'REQ-001', bloodGroup: 'O+', units: 2, hospital: 'Wah General Hospital', location: 'Wah Cantt', urgency: 'Critical', requiredDate: '2024-12-15', status: 'Searching for Donor', posted: '2 hours ago', donor: null },
  { id: 'REQ-002', bloodGroup: 'A-', units: 1, hospital: 'PIMS', location: 'Islamabad', urgency: 'Urgent', requiredDate: '2024-12-20', status: 'Donor Found', posted: '1 day ago', donor: { name: 'Ahmed Khan', bloodGroup: 'A-', phone: '+92 300 1234567' } },
  { id: 'REQ-003', bloodGroup: 'B+', units: 3, hospital: 'Holy Family Hospital', location: 'Rawalpindi', urgency: 'Normal', requiredDate: '2025-01-05', status: 'Pending', posted: '3 days ago', donor: null },
  { id: 'REQ-004', bloodGroup: 'O-', units: 2, hospital: 'Wah General Hospital', location: 'Wah Cantt', urgency: 'Critical', requiredDate: '2024-12-10', status: 'Fulfilled', posted: '5 days ago', donor: { name: 'Ali Hassan', bloodGroup: 'O-', phone: '+92 321 7654321' } },
  { id: 'REQ-005', bloodGroup: 'AB-', units: 1, hospital: 'PIMS', location: 'Islamabad', urgency: 'Urgent', requiredDate: '2024-12-25', status: 'Cancelled', posted: '1 week ago', donor: null },
];

export function RecipientRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<typeof mockRequests[0] | null>(null);
  const itemsPerPage = 5;
  const totalPages = Math.ceil(mockRequests.length / itemsPerPage);
  const paginatedRequests = mockRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">My Blood Requests</h1>
          <p className="text-muted-foreground">Track and manage your blood requests</p>
        </div>
        <Button variant="blood" size="lg" onClick={() => setShowCreateDialog(true)}>
          <Icons.plus className="mr-2 h-5 w-5" aria-hidden="true" />
          Create New Request
        </Button>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-5 gap-4"
      >
        {[
          { label: 'Total Requests', value: mockRequests.length, icon: Icons.clipboardList, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Active', value: mockRequests.filter(r => r.status === 'Searching for Donor' || r.status === 'Donor Found').length, icon: Icons.search, color: 'text-blue-500', bg: 'bg-blue-100 dark:bg-blue-900/30' },
          { label: 'Fulfilled', value: mockRequests.filter(r => r.status === 'Fulfilled').length, icon: Icons.checkCircle, color: 'text-emerald-500', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
          { label: 'Pending', value: mockRequests.filter(r => r.status === 'Pending').length, icon: Icons.clock, color: 'text-amber-500', bg: 'bg-amber-100 dark:bg-amber-900/30' },
          { label: 'Critical', value: mockRequests.filter(r => r.status === 'Critical' || r.urgency === 'Critical').length, icon: Icons.alertTriangle, color: 'text-red-500', bg: 'bg-red-100 dark:bg-red-900/30' },
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

      {/* Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>All Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Blood Group</TableHead>
                  <TableHead>Units</TableHead>
                  <TableHead>Urgency</TableHead>
                  <TableHead>Hospital</TableHead>
                  <TableHead>Required By</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell className="font-mono text-sm">{request.id}</TableCell>
                    <TableCell><BloodGroupBadge bloodGroup={request.bloodGroup} size="sm" /></TableCell>
                    <TableCell>{request.units} unit{request.units > 1 ? 's' : ''}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${request.urgency === 'Critical' ? 'bg-red-100 text-red-700' : request.urgency === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                        {request.urgency}
                      </span>
                    </TableCell>
                    <TableCell>
                      <p className="font-medium">{request.hospital}</p>
                      <p className="text-sm text-muted-foreground">{request.location}</p>
                    </TableCell>
                    <TableCell>{formatDate(request.requiredDate)}</TableCell>
                    <TableCell><StatusBadge status={request.status} size="sm" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(request)}>
                          <Icons.eye className="h-4 w-4" aria-hidden="true" />
                          <span className="sr-only">View</span>
                        </Button>
                        {request.status === 'Pending' && (
                          <AlertDialog open={deleteConfirm?.id === request.id} onOpenChange={(open) => !open && setDeleteConfirm(null)}>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Cancel Request?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to cancel this blood request? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Keep Request</AlertDialogCancel>
                                <AlertDialogAction onClick={() => { setDeleteConfirm(null); /* delete */ }}>
                                  <Icons.trash className="mr-2 h-4 w-4" aria-hidden="true" />
                                  Cancel Request
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, mockRequests.length)} of {mockRequests.length} requests
              </span>
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(mockRequests.length / 5)}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
            <DialogDescription>Request ID: {selectedRequest?.id}</DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <BloodGroupBadge bloodGroup={selectedRequest.bloodGroup} size="md" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${selectedRequest.urgency === 'Critical' ? 'bg-red-100 text-red-700' : selectedRequest.urgency === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      {selectedRequest.urgency}
                    </span>
                  </div>
                  <p className="font-medium">{selectedRequest.units} unit{selectedRequest.units > 1 ? 's' : ''} needed</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="font-medium">{selectedRequest.hospital}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.location}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="font-medium">Required by {formatDate(selectedRequest.requiredDate)}</p>
                  <p className="text-sm text-muted-foreground">Posted {formatRelativeTime(selectedRequest.posted)}</p>
                </div>
                <div className="p-4 rounded-lg bg-muted/30">
                  <StatusBadge status={selectedRequest.status} size="md" />
                </div>
              </div>

              <div className="p-4 rounded-lg bg-muted/30">
                <p className="font-medium mb-2">Hospital</p>
                <p>{selectedRequest.hospital}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.location}</p>
              </div>

              {selectedRequest.donor && (
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                        <Icons.checkCircle className="h-5 w-5" aria-hidden="true" />
                      </div>
                      <div>
                        <p className="font-semibold text-emerald-800">Donor Found!</p>
                        <p className="text-sm text-emerald-600">A compatible donor has been matched</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{selectedRequest.donor.name}</p>
                      <p className="text-sm text-muted-foreground">{selectedRequest.donor.bloodGroup} • {selectedRequest.donor.phone}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedRequest.status === 'Searching for Donor' && (
                <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-3">
                    <Icons.clock className="h-5 w-5 text-amber-600" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-amber-800">Searching for Donor</p>
                      <p className="text-sm text-amber-600">We're actively looking for compatible donors in your area</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Request Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Create Blood Request</DialogTitle>
            <DialogDescription>Fill in the details to create a new blood request</DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setShowCreateDialog(false); }}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodGroup">Blood Group *</Label>
                <Select id="bloodGroup" placeholder="Select blood group" options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(bg => ({ value: bg, label: bg }))} />
              </div>
              <div>
                <Label htmlFor="units">Units Required *</Label>
                <Input id="units" type="number" min="1" max="10" placeholder="2" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgency">Urgency *</Label>
                <Select id="urgency" placeholder="Select urgency" options={['Normal', 'Urgent', 'Critical'].map(u => ({ value: u, label: u }))} />
              </div>
              <div>
                <Label htmlFor="requiredDate">Required By *</Label>
                <Input id="requiredDate" type="date" min={new Date().toISOString().split('T')[0]} />
              </div>
            </div>
            <div>
              <Label htmlFor="hospital">Hospital *</Label>
              <Input id="hospital" placeholder="Wah General Hospital" />
            </div>
            <div>
              <Label htmlFor="location">Location *</Label>
              <Input id="location" placeholder="Wah Cantt" />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <textarea id="notes" rows={3} className="w-full p-3 rounded-lg border border-input bg-background text-sm" placeholder="Any additional information..." />
            </div>
          </form>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>Cancel</Button>
            <Button variant="blood" type="submit">
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
              Create Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}