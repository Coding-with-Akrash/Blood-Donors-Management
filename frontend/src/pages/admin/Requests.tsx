import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { URGENCY_LEVELS, REQUEST_STATUSES } from '../../constants';

const mockRequests = [
  { id: 'REQ-001', bloodGroup: 'O-', urgency: 'Critical', units: 2, hospital: 'Wah General Hospital', location: 'Wah Cantt', status: 'Searching for Donor', requiredDate: '2024-12-15', posted: '2 hours ago', assignedDonor: null },
  { id: 'REQ-002', bloodGroup: 'A-', urgency: 'Urgent', units: 1, hospital: 'PIMS', location: 'Islamabad', status: 'Donor Found', requiredDate: '2024-12-20', posted: '1 day ago', assignedDonor: { name: 'Ali Hassan', bloodGroup: 'A-', phone: '+92 300 1234567' } },
  { id: 'REQ-003', bloodGroup: 'B+', urgency: 'Normal', units: 3, hospital: 'Holy Family Hospital', location: 'Rawalpindi', status: 'Pending', requiredDate: '2025-01-05', posted: '3 days ago', assignedDonor: null },
  { id: 'REQ-004', bloodGroup: 'O-', urgency: 'Critical', units: 2, hospital: 'Wah General Hospital', location: 'Wah Cantt', status: 'Fulfilled', requiredDate: '2024-12-10', posted: '5 days ago', assignedDonor: { name: 'Ali Hassan', bloodGroup: 'O-', phone: '+92 300 1234567' } },
  { id: 'REQ-005', bloodGroup: 'AB-', urgency: 'Urgent', units: 1, hospital: 'PIMS', location: 'Islamabad', status: 'Cancelled', requiredDate: '2024-12-25', posted: '1 week ago', assignedDonor: null },
];

export function AdminRequests() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [urgencyFilter, setUrgencyFilter] = useState('');
  const itemsPerPage = 5;
  const filteredRequests = mockRequests.filter(r =>
    (!search || r.id.toLowerCase().includes(search.toLowerCase()) || r.hospital.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || r.status === statusFilter) &&
    (!urgencyFilter || r.urgency === urgencyFilter)
  );
  const totalPages = Math.ceil(filteredRequests.length / 5);
  const paginatedRequests = filteredRequests.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Blood Request Management</h1>
          <p className="text-muted-foreground">Track and manage all blood requests system-wide</p>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by ID, hospital, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {REQUEST_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setUrgencyFilter(e.target.value)}>
            <option value="">All Urgencies</option>
            {URGENCY_LEVELS.map(u => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Blood Group</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Urgency</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Units</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Hospital</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Assigned</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockRequests.slice(0, 5).map((request) => (
            <tr key={request.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{request.id}</td>
              <td className="p-4"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{request.bloodGroup}</span></td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${request.urgency === 'Critical' ? 'bg-red-100 text-red-700' : request.urgency === 'Urgent' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>{request.urgency}</span></td>
              <td className="p-4">{request.units} unit{request.units > 1 ? 's' : ''}</td>
              <td className="p-4">
                <p className="font-medium">{request.hospital}</p>
                <p className="text-sm text-muted-foreground">{request.location}</p>
              </td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${request.status === 'Critical' ? 'bg-red-100 text-red-700' : request.status === 'Searching for Donor' ? 'bg-blue-100 text-blue-700' : request.status === 'Donor Found' ? 'bg-emerald-100 text-emerald-700' : request.status === 'Fulfilled' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{request.status}</span></td>
              <td className="p-4">
                {request.assignedDonor ? (
                  <span className="text-green-600 font-medium">{request.assignedDonor.name}</span>
                ) : (
                  <span className="text-muted-foreground">Not assigned</span>
                )}
              </td>
              <td className="p-4 text-right">
                <button className="text-blue-600 hover:underline text-sm mr-2">View</button>
                <button className="text-blue-600 hover:underline text-sm mr-2">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">Showing 1 to 5 of 5 requests</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Previous</button>
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}