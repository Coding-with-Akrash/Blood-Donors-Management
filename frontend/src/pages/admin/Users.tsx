import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate, formatRelativeTime } from '../../utils/cn';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../../components/ui/Dialog';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel, AlertDialogAction } from '../../components/ui/AlertDialog';
import { motion } from 'framer-motion';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '../../constants';

const mockUsers = [
  { id: 'USR-001', name: 'Ali Hassan', username: 'alihassan', email: 'ali@example.com', role: 'donor', status: 'Active', joined: '2024-01-15', lastLogin: '2 hours ago' },
  { id: 'USR-002', name: 'Sara Ahmed', username: 'saraahmed', email: 'sara@example.com', role: 'recipient', status: 'Active', joined: '2024-02-20', lastLogin: '4 hours ago' },
  { id: 'USR-003', name: 'Hassan Raza', username: 'hassanraza', email: 'hassan@example.com', role: 'staff', status: 'Active', joined: '2024-03-10', lastLogin: '1 day ago' },
  { id: 'USR-004', name: 'Fatima Ali', username: 'fatimaali', email: 'fatima@example.com', role: 'donor', status: 'Inactive', joined: '2024-04-05', lastLogin: '2 weeks ago' },
  { id: 'USR-005', name: 'Ahmed Khan', username: 'ahmedkhan', email: 'ahmed@example.com', role: 'recipient', status: 'Active', joined: '2024-05-12', lastLogin: '3 hours ago' },
  { id: 'USR-006', name: 'Admin User', username: 'admin', email: 'admin@lifeblood.org', role: 'admin', status: 'Active', joined: '2023-01-01', lastLogin: '1 hour ago' },
];

export function AdminUsers() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<typeof mockUsers[0] | null>(null);
  const itemsPerPage = 5;
  const filteredUsers = mockUsers.filter(u =>
    (!search || u.name.toLowerCase().includes(search.toLowerCase()) || u.username.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())) &&
    (!roleFilter || u.role === roleFilter) &&
    (!statusFilter || u.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredUsers.length / 5);
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * 5, currentPage * 5);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their roles</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
          Create User
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
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
            <option value="">All Roles</option>
            <option value="donor">Donor</option>
            <option value="recipient">Recipient</option>
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
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
            <th className="text-left p-4 font-medium text-muted-foreground">Username</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Email</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Joined</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Last Login</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockUsers.slice(0, 5).map((user) => (
            <tr key={user.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{user.id}</td>
              <td className="p-4 font-medium">{user.name}</td>
              <td className="p-4 font-mono text-sm">{user.username}</td>
              <td className="p-4">{user.email}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${ROLE_COLORS[user.role as keyof typeof ROLE_COLORS]}`}>
                  {ROLE_LABELS[user.role as keyof typeof ROLE_LABELS]}
                </span>
              </td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'}`}>{user.status}</span></td>
              <td className="p-4">{user.joined}</td>
              <td className="p-4 text-muted-foreground">{user.lastLogin}</td>
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
        <span className="text-sm text-muted-foreground">Showing 1 to 5 of 6 users</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Previous</button>
          <button className="px-3 py-1 rounded-lg border border-input text-sm">Next</button>
        </div>
      </div>
    </div>
  );
}