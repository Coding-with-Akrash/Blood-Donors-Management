import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';
import { STATUS_COLORS } from '../../constants';

const mockDonations = [
  { id: 'DON-001', donor: 'Ali Hassan', donorId: 'DNR-001', bloodGroup: 'O-', date: '2024-11-15', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-002', donor: 'Sara Ahmed', donorId: 'DNR-002', bloodGroup: 'A-', date: '2024-10-20', location: 'Islamabad Medical Center', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-003', donor: 'Hassan Raza', donorId: 'DNR-003', bloodGroup: 'B+', date: '2024-09-10', location: 'Rawalpindi Blood Bank', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-004', donor: 'Fatima Ali', donorId: 'DNR-004', bloodGroup: 'AB-', date: '2024-11-05', location: 'Islamabad Medical Center', status: 'Completed', units: 1, component: 'Plasma', screening: 'Passed' },
  { id: 'DON-005', donor: 'Ahmed Khan', donorId: 'DNR-005', bloodGroup: 'O+', date: '2024-08-15', location: 'Wah Blood Center', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
  { id: 'DON-006', donor: 'Sanaullah', donorId: 'DNR-006', bloodGroup: 'B-', date: '2024-10-01', location: 'Rawalpindi Blood Bank', status: 'Completed', units: 1, component: 'Whole Blood', screening: 'Passed' },
];

export function AdminDonations() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [componentFilter, setComponentFilter] = useState('');
  const itemsPerPage = 5;
  const filteredDonations = mockDonations.filter(d =>
    (!search || d.donor.toLowerCase().includes(search.toLowerCase()) || d.id.toLowerCase().includes(search.toLowerCase())) &&
    (!bloodGroupFilter || d.bloodGroup === bloodGroupFilter) &&
    (!statusFilter || d.status === statusFilter) &&
    (!componentFilter || d.component === componentFilter)
  );
  const totalPages = Math.ceil(filteredDonations.length / itemsPerPage);
  const paginatedDonations = filteredDonations.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Donation Records</h1>
          <p className="text-muted-foreground">View and manage all blood donations system-wide</p>
        </div>
        <Button variant="default">
          <Icons.plus className="w-5 h-5 mr-2 inline" aria-hidden="true" />
          Record Donation
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by donor, ID, or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setBloodGroupFilter(e.target.value)}>
            <option value="">All Blood Groups</option>
            <option value="O-">O-</option>
            <option value="O+">O+</option>
            <option value="A-">A-</option>
            <option value="A+">A+</option>
            <option value="B-">B-</option>
            <option value="B+">B+</option>
            <option value="AB-">AB-</option>
            <option value="AB+">AB+</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
            <option value="Tested">Tested</option>
            <option value="Available">Available</option>
            <option value="Used">Used</option>
            <option value="Expired">Expired</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setComponentFilter(e.target.value)}>
            <option value="">All Components</option>
            <option value="Whole Blood">Whole Blood</option>
            <option value="Red Cells">Red Cells</option>
            <option value="Plasma">Plasma</option>
            <option value="Platelets">Platelets</option>
          </select>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Donor</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Blood Group</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Date</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Component</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Units</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Screening</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedDonations.map((donation) => (
            <tr key={donation.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{donation.id}</td>
              <td className="p-4">
                <p className="font-medium">{donation.donor}</p>
                <p className="text-sm text-muted-foreground">{donation.donorId}</p>
              </td>
              <td className="p-4"><BloodGroupBadge bloodGroup={donation.bloodGroup} size="sm" /></td>
              <td className="p-4">{formatDate(donation.date)}</td>
              <td className="p-4">{donation.location}</td>
              <td className="p-4">{donation.component}</td>
              <td className="p-4">{donation.units} unit{donation.units > 1 ? 's' : ''}</td>
              <td className="p-4"><StatusBadge status={donation.screening} /></td>
              <td className="p-4"><StatusBadge status={donation.status} /></td>
              <td className="p-4 text-right">
                <Button variant="ghost" size="sm">View</Button>
                <Button variant="ghost" size="sm">Edit</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, filteredDonations.length)} of {filteredDonations.length} donations</span>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)}>Previous</Button>
          <Button variant="outline" size="sm" disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)}>Next</Button>
        </div>
      </div>
    </div>
  );
}