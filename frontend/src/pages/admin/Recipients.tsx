import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';
import { ELIGIBILITY_STATUSES } from '../../constants';

const mockRecipients = [
  { id: 'RCP-001', name: 'Sara Ahmed', username: 'saraahmed', email: 'sara@example.com', city: 'Islamabad', hospital: 'PIMS', requests: 3, status: 'Active', joined: '2024-02-20' },
  { id: 'RCP-002', name: 'Fatima Ali', username: 'fatimaali', email: 'fatima@example.com', city: 'Rawalpindi', hospital: 'Holy Family Hospital', requests: 1, status: 'Active', joined: '2024-04-05' },
  { id: 'RCP-003', name: 'Ahmed Khan', username: 'ahmedkhan', email: 'ahmed@example.com', city: 'Wah Cantt', hospital: 'Wah General Hospital', requests: 2, status: 'Active', joined: '2024-05-12' },
  { id: 'RCP-004', name: 'Fatima Ali', username: 'fatimaali2', email: 'fatima2@example.com', city: 'Rawalpindi', hospital: 'Benazir Bhutto Hospital', requests: 0, status: 'Inactive', joined: '2024-06-10' },
  { id: 'RCP-005', name: 'Hassan Raza', username: 'hassanraza', email: 'hassan@example.com', city: 'Islamabad', hospital: 'PIMS', requests: 5, status: 'Active', joined: '2024-03-10' },
];

export function AdminRecipients() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 5;
  const filteredRecipients = mockRecipients.filter(r =>
    (!search || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || r.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredRecipients.length / 5);
  const paginatedRecipients = filteredRecipients.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Recipient Management</h1>
          <p className="text-muted-foreground">Manage recipient records and blood requests</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Add Recipient
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
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Name</th>
            <th className="text-left p-4 font-medium text-muted-foreground">City</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Hospital</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Requests</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockRecipients.slice(0, 5).map((recipient) => (
            <tr key={recipient.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{recipient.id}</td>
              <td className="p-4 font-medium">{recipient.name}</td>
              <td className="p-4">{recipient.city}</td>
              <td className="p-4">{recipient.hospital}</td>
              <td className="p-4 font-medium">{recipient.requests}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${recipient.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{recipient.status}</span></td>
              <td className="p-4">{recipient.joined}</td>
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
        <span className="text-sm text-muted-foreground">Showing 1 to 5 of 5 recipients</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Previous</button>
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}