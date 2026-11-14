export type UserRole = 'donor' | 'recipient' | 'staff' | 'admin';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  donorProfile?: DonorProfile;
  recipientProfile?: RecipientProfile;
}

export interface DonorProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  address?: string;
  city: string;
  bloodGroup: BloodGroup;
  rhFactor: 'Positive' | 'Negative';
  weight?: number;
  height?: number;
  emergencyContact?: string;
  lastDonationDate?: string;
  nextEligibleDate?: string;
  eligibilityStatus: EligibilityStatus;
  medicalScreening?: MedicalScreening;
  createdAt: string;
  updatedAt: string;
}

export interface RecipientProfile {
  id: string;
  userId: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  city: string;
  hospital?: string;
  emergencyContact?: string;
  createdAt: string;
  updatedAt: string;
}

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';

export type EligibilityStatus = 
  | 'Pending Medical Review' 
  | 'Eligible' 
  | 'Temporarily Deferred' 
  | 'Permanently Deferred';

export type DonationStatus = 
  | 'Pending' 
  | 'Accepted' 
  | 'Rejected' 
  | 'Tested' 
  | 'Available' 
  | 'Used' 
  | 'Expired';

export type RequestStatus = 
  | 'Pending' 
  | 'Under Review' 
  | 'Approved' 
  | 'Searching for Donor' 
  | 'Donor Found' 
  | 'Fulfilled' 
  | 'Cancelled' 
  | 'Rejected';

export type UrgencyLevel = 'Normal' | 'Urgent' | 'Critical';

export type ComponentType = 'Whole Blood' | 'Red Cells' | 'Plasma' | 'Platelets';

export interface MedicalScreening {
  notFeelingHealthy: boolean;
  recentSurgery: boolean;
  medication: boolean;
  medicalCondition: boolean;
  infectionsFever: boolean;
  recentVaccination: boolean;
}

export interface Donation {
  id: string;
  donorId: string;
  donationDate: string;
  bloodGroup: BloodGroup;
  quantity: number;
  collectionLocation: string;
  screeningStatus: 'Passed' | 'Failed' | 'Pending';
  donationStatus: DonationStatus;
  componentType: ComponentType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodRequest {
  id: string;
  requestNumber: string;
  recipientId: string;
  requiredBloodGroup: BloodGroup;
  unitsRequired: number;
  hospital: string;
  city: string;
  requiredDate: string;
  urgency: UrgencyLevel;
  notes?: string;
  status: RequestStatus;
  assignedDonorId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BloodInventory {
  id: string;
  bloodGroup: BloodGroup;
  componentType: ComponentType;
  quantity: number;
  location: string;
  expiryDate: string;
  status: 'Available' | 'Reserved' | 'Expired' | 'Used';
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  relatedEntityType?: string;
  relatedEntityId?: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FilterParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  [key: string]: unknown;
}

export interface DashboardStats {
  totalDonors: number;
  eligibleDonors: number;
  pendingReviews: number;
  totalRequests: number;
  criticalRequests: number;
  totalDonations: number;
  availableBlood: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
  color?: string;
}

export interface BloodGroupDistribution {
  bloodGroup: BloodGroup;
  count: number;
  percentage: number;
}