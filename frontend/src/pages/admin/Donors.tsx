import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';
import { BLOOD_GROUPS, ELIGIBILITY_STATUSES } from '../../constants';

const mockDonors = [
  { id: 'DNR-001', name: 'Ali Hassan', username: 'alihassan', email: 'ali@example.com', bloodGroup: 'O-', city: 'Wah Cantt', status: 'Eligible', lastDonation: '2024-11-15', donations: 8 },
  { id: 'DNR-002', name: 'Sara Ahmed', username: 'saraahmed', email: 'sara@example.com', bloodGroup: 'A-', city: 'Islamabad', status: 'Eligible', lastDonation: '2024-10-20', donations: 5 },
  { id: 'DNR-003', name: 'Hassan Raza', username: 'hassanraza', email: 'hassan@example.com', bloodGroup: 'B+', city: 'Rawalpindi', status: 'Pending Medical Review', lastDonation: '2024-09-10', donations: 3 },
  { id: 'DNR-004', name: 'Fatima Ali', username: 'fatimaali', email: 'fatima@example.com', bloodGroup: 'AB-', city: 'Islamabad', status: 'Eligible', lastDonation: '2024-11-05', donations: 12 },
  { id: 'DNR-005', name: 'Ahmed Khan', username: 'ahmedkhan', email: 'ahmed@example.com', bloodGroup: 'O+', city: 'Wah Cantt', status: 'Temporarily Deferred', lastDonation: '2024-08-15', donations: 3 },
  { id: 'DNR-006', name: 'Sanaullah', username: 'sanaullah', email: 'sana@example.com', bloodGroup: 'B-', city: 'Rawalpindi', status: 'Eligible', lastDonation: '2024-10-01', donations: 6 },
];

export function AdminDonors() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Donor Management</h1>
          <p className="text-muted-foreground">Manage donor records, eligibility, and donations</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Add Donor
        </button>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, ID, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setBloodGroupFilter(e.target.value)}>
            <option value="">All Blood Groups</option>
            {BLOOD_GROUPS.map(bg => <option key={bg} value={bg}>{bg}</option>)}
          </select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            {ELIGIBILITY_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Blood Group</th>
            <th className="text-left p-4 font-medium text-muted-foreground">City</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Last Donation</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Total Donations</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockDonors.slice(0, 5).map((donor) => (
            <tr key={donor.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{donor.id}</td>
              <td className="p-4 font-medium">{donor.name}</td>
              <td className="p-4"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{donor.bloodGroup}</span></td>
              <td className="p-4">{donor.city}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${donor.status === 'Eligible' ? 'bg-emerald-100 text-emerald-700' : donor.status === 'Pending Medical Review' ? 'bg-amber-100 text-amber-700' : 'bg-amber-100 text-amber-700'}`}>{donor.status}</span></td>
              <td className="p-4">{donor.lastDonation}</td>
              <td className="p-4 font-medium">{donor.donations}</td>
              <td className="p-4 text-right">
                <button className="text-blue-600 hover:underline text-sm mr-2">View</button>
                <button className="text-blue-600 hover:underline text-sm mr-2">Edit</button>
                <button className="text-red-600 hover:underline text-sm">Deactivate</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">Showing 1 to 5 of 6 donors</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Previous</button>
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}