import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDateTime } from '../../utils/cn';
import { STATUS_COLORS } from '../../constants';

const mockAuditLogs = [
  { id: 'AUD-001', action: 'USER_REGISTERED', entityType: 'User', entityId: 'USR-001', userId: 'ADMIN-001', userName: 'Admin', details: 'New donor registered: Ali Hassan', ipAddress: '192.168.1.100', userAgent: 'Chrome 120.0', createdAt: '2024-11-15T10:30:00Z' },
  { id: 'AUD-002', action: 'BLOOD_REQUEST_CREATED', entityType: 'BloodRequest', entityId: 'REQ-001', userId: 'USR-002', userName: 'Sara Ahmed', details: 'Created blood request for O- blood', ipAddress: '192.168.1.105', userAgent: 'Chrome 120.0', createdAt: '2024-11-15T11:15:00Z' },
  { id: 'AUD-003', action: 'DONATION_RECORDED', entityType: 'Donation', entityId: 'DON-001', userId: 'STF-001', userName: 'Hassan Raza', details: 'Recorded donation for donor DNR-001', ipAddress: '192.168.1.200', userAgent: 'Chrome 120.0', createdAt: '2024-11-15T12:30:00Z' },
  { id: 'AUD-004', action: 'DONOR_APPROVED', entityType: 'Donor', entityId: 'DNR-003', userId: 'ADMIN-001', userName: 'Admin', details: 'Approved donor Hassan Raza for eligibility', ipAddress: '192.168.1.100', userAgent: 'Chrome 120.0', createdAt: '2024-11-14T14:20:00Z' },
  { id: 'AUD-005', action: 'INVENTORY_UPDATED', entityType: 'Inventory', entityId: 'INV-001', userId: 'STF-002', userName: 'Fatima Ali', details: 'Updated O- Red Cells quantity to 12', ipAddress: '192.168.1.201', userAgent: 'Chrome 120.0', createdAt: '2024-11-14T10:45:00Z' },
  { id: 'AUD-006', action: 'USER_LOGIN', entityType: 'User', entityId: 'USR-001', userId: 'USR-001', userName: 'Ali Hassan', details: 'User logged in', ipAddress: '192.168.1.100', userAgent: 'Chrome 120.0', createdAt: '2024-11-15T09:00:00Z' },
];

const actionColors: Record<string, string> = {
  USER_REGISTERED: STATUS_COLORS['Pending'] || 'bg-info/10 text-info',
  BLOOD_REQUEST_CREATED: STATUS_COLORS['Pending'] || 'bg-destructive/10 text-destructive',
  DONATION_RECORDED: STATUS_COLORS['Accepted'] || 'bg-success/10 text-success',
  DONOR_APPROVED: STATUS_COLORS['Eligible'] || 'bg-success/10 text-success',
  INVENTORY_UPDATED: STATUS_COLORS['Pending Medical Review'] || 'bg-warning/10 text-warning',
  USER_LOGIN: STATUS_COLORS['Pending'] || 'bg-info/10 text-info',
  USER_LOGOUT: STATUS_COLORS['Inactive'] || 'bg-muted/50 text-muted-foreground',
  DONOR_DEACTIVATED: STATUS_COLORS['Deactivated'] || 'bg-destructive/10 text-destructive',
  REQUEST_CANCELLED: STATUS_COLORS['Cancelled'] || 'bg-destructive/10 text-destructive',
  INVENTORY_RESERVED: STATUS_COLORS['Pending Medical Review'] || 'bg-warning/10 text-warning',
};

export function AdminAuditLogs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const itemsPerPage = 10;
  const filteredLogs = mockAuditLogs.filter(log =>
    (!search || log.action.toLowerCase().includes(search.toLowerCase()) || log.details.toLowerCase().includes(search.toLowerCase())) &&
    (!actionFilter || log.action === actionFilter) &&
    (!userFilter || log.userName.toLowerCase().includes(userFilter.toLowerCase()))
  );
  const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

  const actions = Array.from(new Set(mockAuditLogs.map(log => log.action)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Audit Logs</h1>
          <p className="text-muted-foreground">View system activity and audit trail</p>
        </div>
        <Button variant="default">
          <Icons.download className="w-5 h-5 mr-2 inline" aria-hidden="true" />
          Export Logs
        </Button>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by action, details, or user..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 rounded-lg border border-input bg-background text-sm"
          />
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm" onChange={(e) => setActionFilter(e.target.value)}>
            <option value="">All Actions</option>
            {Array.from(new Set(mockAuditLogs.map(l => l.action))).map(action => <option key={action} value={action}>{action}</option>)}
          </select>
          <input type="text" placeholder="Filter by user..." className="px-4 py-2 rounded-lg border border-input bg-background text-sm max-w-xs" />
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">Timestamp</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Action</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Entity</th>
            <th className="text-left p-4 font-medium text-muted-foreground">User</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Details</th>
            <th className="text-left p-4 font-medium text-muted-foreground">IP Address</th>
          </tr>
        </thead>
        <tbody>
          {mockAuditLogs.map((log) => (
            <tr key={log.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 text-sm font-mono">{formatDateTime(log.createdAt)}</td>
              <td className="p-4"><span className={`px-2 py-1 rounded-full text-xs font-medium ${actionColors[log.action] || 'bg-muted/50 text-muted-foreground'}`}>{log.action}</span></td>
              <td className="p-4 text-sm">{log.entityType} - {log.entityId}</td>
              <td className="p-4 text-sm">{log.userName} ({log.userId})</td>
              <td className="p-4 text-sm text-muted-foreground max-w-xs truncate">{log.details}</td>
              <td className="p-4 text-sm font-mono text-muted-foreground">{log.ipAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">Showing 1 to 6 of 6 audit logs</span>
        <div className="flex gap-2"><Button variant="outline" size="sm">Previous</Button><Button variant="outline" size="sm">Next</Button></div>
      </div>
    </div>
  );
}