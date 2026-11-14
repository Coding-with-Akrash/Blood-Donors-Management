import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { motion } from 'framer-motion';

const mockRequests = [
  { id: 'REQ-001', bloodGroup: 'O-', urgency: 'Critical', units: 2, location: 'Wah Cantt', hospital: 'Wah General Hospital', posted: '2 hours ago', distance: '3.2 km', status: 'Searching' },
  { id: 'REQ-002', bloodGroup: 'O+', urgency: 'Urgent', units: 1, location: 'Rawalpindi', hospital: 'Holy Family Hospital', posted: '5 hours ago', distance: '12.5 km', status: 'Searching' },
  { id: 'REQ-003', bloodGroup: 'A+', urgency: 'Normal', units: 3, location: 'Islamabad', hospital: 'PIMS', posted: '1 day ago', distance: '28.7 km', status: 'Donor Found' },
  { id: 'REQ-004', bloodGroup: 'B+', urgency: 'Urgent', units: 2, location: 'Wah Cantt', hospital: 'Wah Medical College', posted: '3 hours ago', distance: '1.8 km', status: 'Searching' },
  { id: 'REQ-005', bloodGroup: 'AB-', urgency: 'Critical', units: 1, location: 'Taxila', hospital: 'THQ Hospital', posted: '30 minutes ago', distance: '8.4 km', status: 'Searching' },
  { id: 'REQ-006', bloodGroup: 'O+', urgency: 'Normal', units: 2, location: 'Rawalpindi', hospital: 'Benazir Bhutto Hospital', posted: '6 hours ago', distance: '15.2 km', status: 'Fulfilled' },
];

const urgencyColors = {
  Critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  Urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
};

export function DonorRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<typeof mockRequests[0] | null>(null);
  const [filterUrgency, setFilterUrgency] = useState<'All' | 'Critical' | 'Urgent' | 'Normal'>('All');
  const itemsPerPage = 5;
  const filteredRequests = filterUrgency === 'All' 
    ? mockRequests 
    : mockRequests.filter(r => r.urgency === filterUrgency);
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRespond = (request: typeof mockRequests[0]) => {
    setSelectedRequest(request);
  };

  const getCompatibility = (donorBg: string, recipientBg: string) => {
    const compatibility: Record<string, string[]> = {
      'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
      'O+': ['O+', 'A+', 'B+', 'AB+'],
      'A-': ['A-', 'A+', 'AB-', 'AB+'],
      'A+': ['A+', 'AB+'],
      'B-': ['B-', 'B+', 'AB-', 'AB+'],
      'B+': ['B+', 'AB+'],
      'AB-': ['AB-', 'AB+'],
      'AB+': ['AB+'],
    };
    return compatibility[donorBg]?.includes(recipientBg) || false;
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Blood Requests</h1>
          <p className="text-muted-foreground">View and respond to blood requests near you</p>
        </div>
        <div className="flex gap-3">
          <select
            value={filterUrgency}
            onChange={(e) => setFilterUrgency(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="All">All Urgencies</option>
            <option value="Critical">Critical</option>
            <option value="Urgent">Urgent</option>
            <option value="Normal">Normal</option>
          </select>
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Active Requests', value: mockRequests.filter(r => r.status === 'Searching').length, icon: Icons.heart, color: 'text-red-500' },
          { label: 'Critical Nearby', value: mockRequests.filter(r => r.urgency === 'Critical' && parseFloat(r.distance) < 10).length, icon: Icons.alertTriangle, color: 'text-red-600' },
          { label: 'Responded', value: mockRequests.filter(r => r.status === 'Donor Found' || r.status === 'Fulfilled').length, icon: Icons.checkCircle, color: 'text-emerald-500' },
          { label: 'Within 10km', value: mockRequests.filter(r => parseFloat(r.distance) < 10).length, icon: Icons.mapPin, color: 'text-blue-500' },
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

      {/* Requests Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <CardTitle>Available Requests</CardTitle>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Icons.filter className="h-4 w-4" aria-hidden="true" />
                <span>Showing {filteredRequests.length} of {mockRequests.length} requests</span>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Blood Group</TableHead>
                    <TableHead>Urgency</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Hospital</TableHead>
                    <TableHead>Distance</TableHead>
                    <TableHead>Posted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedRequests.map((request) => {
                    const isCompatible = getCompatibility('O+', request.bloodGroup);
                    return (
                      <TableRow key={request.id} className={!isCompatible ? 'opacity-50' : ''}>
                        <TableCell><BloodGroupBadge bloodGroup={request.bloodGroup} size="sm" /></TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[request.urgency as keyof typeof urgencyColors]}`}>
                            {request.urgency}
                          </span>
                        </TableCell>
                        <TableCell>{request.units} unit{request.units > 1 ? 's' : ''}</TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{request.hospital}</p>
                            <p className="text-sm text-muted-foreground">{request.location}</p>
                          </div>
                        </TableCell>
                        <TableCell>{request.distance}</TableCell>
                        <TableCell><span className="text-sm text-muted-foreground">{formatRelativeTime(request.posted)}</span></TableCell>
                        <TableCell><StatusBadge status={request.status} size="sm" /></TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant={isCompatible ? 'blood' : 'outline'}
                            size="sm"
                            onClick={() => handleRespond(request)}
                            disabled={!isCompatible || request.status !== 'Searching'}
                          >
                            {request.status === 'Donor Found' ? 'Donor Found' : request.status === 'Fulfilled' ? 'Fulfilled' : 'Respond'}
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <span className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * 5 + 1} to {Math.min(currentPage * 5, filteredRequests.length)} of {filteredRequests.length} requests
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

      {/* Response Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Respond to Blood Request</DialogTitle>
            <DialogDescription>
              Confirm your availability to donate for this request
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <BloodGroupBadge bloodGroup={selectedRequest.bloodGroup} size="md" />
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${urgencyColors[selectedRequest.urgency as keyof typeof urgencyColors]}`}>
                    {selectedRequest.urgency}
                  </span>
                </div>
                <p className="font-medium">{selectedRequest.hospital}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.location} • {selectedRequest.distance}</p>
                <p className="text-sm text-muted-foreground">{selectedRequest.units} unit{selectedRequest.units > 1 ? 's' : ''} needed</p>
              </div>
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <Icons.alertTriangle className="mr-1 h-4 w-4 inline" aria-hidden="true" />
                  By responding, you confirm you are eligible to donate and can reach the hospital within the required timeframe.
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRequest(null)}>Cancel</Button>
            <Button variant="blood" onClick={() => { setSelectedRequest(null); /* handle response */ }}>
              <Icons.check className="mr-2 h-4 w-4" aria-hidden="true" />
              Confirm Response
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}