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

const mockStaff = [
  { id: 'STF-001', name: 'Hassan Raza', username: 'hassanraza', email: 'hassan@example.com', role: 'staff', status: 'Active', department: 'Donor Services', joined: '2024-03-10', lastLogin: '1 day ago' },
  { id: 'STF-002', name: 'Admin User', username: 'admin', email: 'admin@lifeblood.org', role: 'admin', status: 'Active', department: 'Administration', joined: '2023-01-01', lastLogin: '1 hour ago' },
  { id: 'STF-003', name: 'Fatima Ali', username: 'fatimaali', email: 'fatima@example.com', role: 'staff', status: 'Active', department: 'Inventory Management', joined: '2024-04-05', lastLogin: '2 hours ago' },
  { id: 'STF-004', name: 'Ahmed Khan', username: 'ahmedkhan', email: 'ahmed@example.com', role: 'staff', status: 'Inactive', department: 'Donor Services', joined: '2024-05-12', lastLogin: '2 weeks ago' },
  { id: 'STF-005', name: 'Sanaullah', username: 'sanaullah', email: 'sana@example.com', role: 'staff', status: 'Active', department: 'Inventory Management', joined: '2024-06-20', lastLogin: '3 hours ago' },
];

export function AdminStaff() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const itemsPerPage = 5;
  const filteredStaff = mockStaff.filter(s =>
    (!search || s.name.toLowerCase().includes(search.toLowerCase()) || s.username.toLowerCase().includes(search.toLowerCase())) &&
    (!statusFilter || s.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredStaff.length / 5);
  const paginatedStaff = filteredStaff.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Staff Management</h1>
          <p className="text-muted-foreground">Manage staff accounts and permissions</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Create Staff Account
        </button>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, username, or email..."
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
            <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Department</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Last Login</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockStaff.slice(0, 5).map((staff) => (
            <tr key={staff.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{staff.id}</td>
              <td className="p-4 font-medium">{staff.name}</td>
              <td className="p-4">{staff.email}</td>
              <td className="p-4">
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">{staff.role}</span>
              </td>
              <td className="p-4">{staff.department}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{staff.status}</span></td>
              <td className="p-4">{staff.joined}</td>
              <td className="p-4 text-muted-foreground">{staff.lastLogin}</td>
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
        <span className="text-sm text-muted-foreground">Showing 1 to 5 of 5 staff</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Previous</button>
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}