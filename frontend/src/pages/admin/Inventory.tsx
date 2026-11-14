import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { BloodGroupBadge, StatusBadge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Pagination } from '../../components/ui/Pagination';
import { Icons } from '../../components/ui/Icons';
import { formatDate } from '../../utils/cn';

const mockInventory = [
  { id: 'INV-001', bloodGroup: 'O-', component: 'Red Cells', quantity: 12, location: 'Wah Blood Center', expiryDate: '2024-12-20', status: 'Available' },
  { id: 'INV-002', bloodGroup: 'O+', component: 'Red Cells', quantity: 45, location: 'Wah Blood Center', expiryDate: '2024-12-25', status: 'Available' },
  { id: 'INV-003', bloodGroup: 'A-', component: 'Red Cells', quantity: 8, location: 'Islamabad Medical Center', expiryDate: '2024-12-18', status: 'Available' },
  { id: 'INV-004', bloodGroup: 'A+', component: 'Red Cells', quantity: 32, location: 'Islamabad Medical Center', expiryDate: '2024-12-30', status: 'Available' },
  { id: 'INV-005', bloodGroup: 'B-', component: 'Red Cells', quantity: 5, location: 'Rawalpindi Blood Bank', expiryDate: '2024-12-22', status: 'Available' },
  { id: 'INV-006', bloodGroup: 'B+', component: 'Red Cells', quantity: 18, location: 'Rawalpindi Blood Bank', expiryDate: '2024-12-28', status: 'Available' },
  { id: 'INV-007', bloodGroup: 'AB-', component: 'Red Cells', quantity: 3, location: 'PIMS', expiryDate: '2024-12-15', status: 'Available' },
  { id: 'INV-008', bloodGroup: 'AB+', component: 'Red Cells', quantity: 7, location: 'PIMS', expiryDate: '2024-12-20', status: 'Available' },
  { id: 'INV-009', bloodGroup: 'O+', component: 'Plasma', quantity: 25, location: 'Wah Blood Center', expiryDate: '2025-01-15', status: 'Available' },
  { id: 'INV-010', bloodGroup: 'A+', component: 'Plasma', quantity: 12, location: 'Islamabad Medical Center', expiryDate: '2025-01-20', status: 'Available' },
];

export function AdminInventory() {
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [bloodGroupFilter, setBloodGroupFilter] = useState('');
  const [componentFilter, setComponentFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const itemsPerPage = 5;
  const filteredInventory = mockInventory.filter(item =>
    (!search || item.bloodGroup.toLowerCase().includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase())) &&
    (!bloodGroupFilter || item.bloodGroup === bloodGroupFilter) &&
    (!componentFilter || item.component === componentFilter) &&
    (!statusFilter || item.status === statusFilter)
  );
  const totalPages = Math.ceil(filteredInventory.length / 5);
  const paginatedInventory = filteredInventory.slice((currentPage - 1) * 5, currentPage * 5);

  // Pre-compute all stats as local constants
  const totalUnitsVal = mockInventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockVal = mockInventory.filter(item => item.quantity < 10 && item.status === 'Available').reduce((sum, item) => sum + item.quantity, 0);
  const expiringSoonCountVal = mockInventory.filter(item => {
    const diffDays = Math.ceil((new Date(item.expiryDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && item.status === 'Available';
  }).length;
  const componentTypesCountVal = Object.keys(mockInventory.reduce((acc, item) => {
    acc[item.component] = (acc[item.component] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Blood Inventory</h1>
          <p className="text-muted-foreground">Monitor blood stock levels and expiry dates system-wide</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          + Add Inventory
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" /></svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{totalUnitsVal}</p>
            <p className="text-sm text-muted-foreground">Total Units</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-red-100 text-red-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77-1.333.192 3 1.732 3z" /></svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{lowStockVal}</p>
            <p className="text-sm text-muted-foreground">Low Stock ({'<10 units'})</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-amber-100 text-amber-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{expiringSoonCountVal}</p>
            <p className="text-sm text-muted-foreground">Expiring Soon (&le;7 days)</p>
          </div>
        </div>
        <div className="p-4 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between">
            <div className="p-3 rounded-xl bg-blue-100 text-blue-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7-7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-2xl font-bold text-foreground">{componentTypesCountVal}</p>
            <p className="text-sm text-muted-foreground">Component Types</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <input type="text" placeholder="Search by blood group, component, or location..." className="flex-1 max-w-md px-4 py-2 rounded-lg border border-input bg-background text-sm" />
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm"><option value="">All Blood Groups</option><option value="O-">O-</option><option value="O+">O+</option><option value="A-">A-</option><option value="A+">A+</option><option value="B-">B-</option><option value="B+">B+</option><option value="AB-">AB-</option><option value="AB+">AB+</option></select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm"><option value="">All Components</option><option value="Red Cells">Red Cells</option><option value="Plasma">Plasma</option><option value="Platelets">Platelets</option><option value="Whole Blood">Whole Blood</option></select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm"><option value="">All Statuses</option><option value="Available">Available</option><option value="Reserved">Reserved</option><option value="Expired">Expired</option><option value="Used">Used</option></select>
        </div>
      </div>

      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left p-4 font-medium text-muted-foreground">ID</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Blood Group</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Component</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Quantity</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Location</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Expiry Date</th>
            <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
          </tr>
        </thead>
        <tbody>
          {mockInventory.slice(0, 5).map((item) => (
            <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
              <td className="p-4 font-mono text-sm">{item.id}</td>
              <td className="p-4"><span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">{item.bloodGroup}</span></td>
              <td className="p-4">{item.component}</td>
              <td className="p-4 font-medium">{item.quantity} units</td>
              <td className="p-4">{item.location}</td>
              <td className="p-4">{item.expiryDate}</td>
              <td className="p-4"><span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">{item.status}</span></td>
              <td className="p-4 text-right"><button className="text-blue-600 hover:underline text-sm mr-2">View</button><button className="text-blue-600 hover:underline text-sm mr-2">Edit</button><button className="text-red-600 hover:underline text-sm">Reserve</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex items-center justify-between mt-4">
        <span className="text-sm text-muted-foreground">Showing 1 to 5 of 10 items</span>
        <div className="flex gap-2"><button className="px-3 py-1 rounded-lg border border-input text-sm">Previous</button><button className="px-3 py-1 rounded-lg border border-input text-sm">Next</button></div>
      </div>
    </div>
  );
}