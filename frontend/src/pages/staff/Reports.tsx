import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Select } from '../../components/ui/Select';
import { Input } from '../../components/ui/Input';
import { Icons } from '../../components/ui/Icons';
import { motion } from 'framer-motion';

const reportTypes = [
  { id: 'donations', label: 'Donation Report', icon: 'droplet', description: 'Track donations by date, blood group, location' },
  { id: 'requests', label: 'Blood Request Report', icon: 'clipboardList', description: 'Analyze requests by urgency, status, location' },
  { id: 'inventory', label: 'Inventory Report', icon: 'droplets', description: 'Current stock levels, expiry alerts, trends' },
  { id: 'donors', label: 'Donor Analytics', icon: 'users', description: 'Donor demographics, retention, eligibility' },
  { id: 'requests-by-urgency', label: 'Urgency Analysis', icon: 'alertTriangle', description: 'Critical vs urgent vs normal request trends' },
  { id: 'blood-compatibility', label: 'Compatibility Report', icon: 'heartHandshake', description: 'Blood group matching success rates' },
];

export function StaffReports() {
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selectedReport, setSelectedReport] = useState('donations');
  const [generated, setGenerated] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-heading font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate and export detailed reports</p>
        </div>
        <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
          <svg className="w-5 h-5 mr-2 inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Export All
        </button>
      </div>

      {/* Filters */}
      <div className="p-4 rounded-xl bg-background border border-border">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2">Date Range</label>
            <div className="flex gap-2">
              <input
                type="date"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm"
              />
              <span className="flex items-center px-2 text-muted-foreground">to</span>
              <input
                type="date"
                className="flex-1 px-4 py-2 rounded-lg border border-input bg-background text-sm"
              />
            </div>
          </div>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm">
            <option value="all">All Locations</option>
            <option value="wah">Wah Cantt</option>
            <option value="islamabad">Islamabad</option>
            <option value="rawalpindi">Rawalpindi</option>
          </select>
          <select className="px-4 py-2 rounded-lg border border-input bg-background text-sm">
            <option value="all">All Blood Groups</option>
            <option value="O-">O-</option>
            <option value="O+">O+</option>
            <option value="A-">A-</option>
            <option value="A+">A+</option>
          </select>
        </div>
      </div>

      {/* Report Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { id: 'donations', label: 'Donation Report', icon: 'droplet', description: 'Track donations by date, blood group, location', color: 'bg-red-100 text-red-600' },
          { id: 'requests', label: 'Blood Request Report', icon: 'clipboardList', description: 'Analyze requests by urgency, status, location', color: 'bg-blue-100 text-blue-600' },
          { id: 'inventory', label: 'Inventory Report', icon: 'droplets', description: 'Current stock levels, expiry alerts, trends', color: 'bg-emerald-100 text-emerald-600' },
          { id: 'donors', label: 'Donor Analytics', icon: 'users', description: 'Donor demographics, retention, eligibility', color: 'bg-purple-100 text-purple-600' },
          { id: 'urgency', label: 'Urgency Analysis', icon: 'alertTriangle', description: 'Critical vs urgent vs normal request trends', color: 'bg-red-100 text-red-600' },
          { id: 'compatibility', label: 'Compatibility Report', icon: 'heartHandshake', description: 'Blood group matching success rates', color: 'bg-pink-100 text-pink-600' },
        ].map((report) => (
          <div key={report.id} className="p-6 rounded-xl bg-background border border-border hover:border-red-300 hover:shadow-lg transition-all cursor-pointer">
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${report.color}`}>
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-foreground">{report.id === 'donations' ? 'Donation Report' : report.id === 'requests' ? 'Blood Request Report' : report.id === 'inventory' ? 'Inventory Report' : report.id === 'donors' ? 'Donor Analytics' : report.id === 'urgency' ? 'Urgency Analysis' : 'Compatibility Report'}</h3>
                <p className="text-sm text-muted-foreground">{report.id === 'donations' ? 'Track donations by date, blood group, location' : report.id === 'requests' ? 'Analyze requests by urgency, status, location' : report.id === 'inventory' ? 'Current stock levels, expiry alerts, trends' : report.id === 'donors' ? 'Donor demographics, retention, eligibility' : report.id === 'urgency' ? 'Critical vs urgent vs normal request trends' : 'Blood group matching success rates'}</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4 pt-4 border-t">
              <button className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700">Generate</button>
              <button className="px-4 py-2 border border-input rounded-lg text-sm hover:bg-accent">Preview</button>
            </div>
          </div>
        ))}
      </div>

      {/* Generated Report Preview */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Report Preview</h2>
        <div className="p-6 rounded-xl bg-background border border-border">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold">Donation Summary Report</h3>
              <p className="text-muted-foreground">Nov 1, 2024 - Nov 30, 2024 | All Locations | All Blood Groups</p>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-input rounded-lg text-sm hover:bg-accent">CSV</button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">PDF</button>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
              <p className="text-sm text-red-600">Total Donations</p>
              <p className="text-2xl font-bold text-red-600">1,247</p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20">
              <p className="text-sm text-blue-600">Unique Donors</p>
              <p className="text-2xl font-bold text-blue-600">892</p>
            </div>
            <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20">
              <p className="text-sm text-emerald-600">Units Collected</p>
              <p className="text-2xl font-bold text-emerald-600">1,847</p>
            </div>
            <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20">
              <p className="text-sm text-amber-600">Avg/Donation</p>
              <p className="text-2xl font-bold text-amber-600">1.48 units</p>
            </div>
          </div>
          <div className="h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <span className="text-muted-foreground">Chart: Donations Over Time</span>
          </div>
        </div>
      </div>
    </div>
  );
}