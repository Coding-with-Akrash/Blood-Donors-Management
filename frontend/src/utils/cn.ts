import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(d);
}

export function getBloodGroupColor(bloodGroup: string): string {
  const colors: Record<string, string> = {
    'A+': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'A-': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    'B+': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'B-': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    'AB+': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'AB-': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    'O+': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    'O-': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
  };
  return colors[bloodGroup] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    eligible: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    approved: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    rejected: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    critical: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    urgent: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    normal: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    available: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    unavailable: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    expired: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    searching: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    fulfilled: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    cancelled: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    active: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    inactive: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
    deferred: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'temporarily deferred': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    'permanently deferred': 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  };
  return colors[status.toLowerCase()] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
}

export function getStatusIcon(status: string): string {
  const icons: Record<string, string> = {
    eligible: 'check-circle',
    pending: 'clock',
    approved: 'check-circle',
    rejected: 'x-circle',
    critical: 'alert-triangle',
    urgent: 'alert-triangle',
    normal: 'info',
    available: 'check-circle',
    unavailable: 'x-circle',
    completed: 'check-circle',
    expired: 'x-circle',
    searching: 'search',
    fulfilled: 'check-circle',
    cancelled: 'x-circle',
    active: 'check-circle',
    inactive: 'x-circle',
    deferred: 'clock',
    'temporarily deferred': 'clock',
    'permanently deferred': 'x-circle',
  };
  return icons[status.toLowerCase()] || 'info';
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function classNames(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}