import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email or username is required').max(255),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerStep1Schema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  role: z.enum(['donor', 'recipient']),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type RegisterStep1Data = z.infer<typeof registerStep1Schema>;

export const donorProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10, 'Phone number is required').max(20),
  address: z.string().max(200).optional(),
  city: z.string().min(1, 'City is required').max(100),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  rhFactor: z.enum(['Positive', 'Negative']),
  weight: z.number().min(30, 'Weight must be at least 30kg').max(300).optional(),
  height: z.number().min(100, 'Height must be at least 100cm').max(250).optional(),
  emergencyContact: z.string().max(20).optional(),
  lastDonationDate: z.string().optional(),
  notFeelingHealthy: z.boolean().optional(),
  recentSurgery: z.boolean().optional(),
  onMedication: z.boolean().optional(),
  medicalCondition: z.boolean().optional(),
  infectionsFever: z.boolean().optional(),
  recentVaccination: z.boolean().optional(),
});

export type DonorProfileData = z.infer<typeof donorProfileSchema>;

export const recipientProfileSchema = z.object({
  fullName: z.string().min(2, 'Full name is required').max(120),
  dateOfBirth: z.string().min(1, 'Date of birth is required'),
  gender: z.enum(['Male', 'Female', 'Other']),
  phone: z.string().min(10, 'Phone number is required').max(20),
  city: z.string().min(1, 'City is required').max(100),
  hospital: z.string().max(200).optional(),
  emergencyContact: z.string().max(20).optional(),
});

export type RecipientProfileData = z.infer<typeof recipientProfileSchema>;

export const bloodRequestSchema = z.object({
  requiredBloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  unitsRequired: z.number().min(1, 'At least 1 unit required').max(10, 'Maximum 10 units'),
  hospital: z.string().min(1, 'Hospital is required').max(200),
  city: z.string().min(1, 'City is required').max(100),
  requiredDate: z.string().min(1, 'Required date is required'),
  urgency: z.enum(['Normal', 'Urgent', 'Critical']),
  notes: z.string().max(500).optional(),
});

export type BloodRequestData = z.infer<typeof bloodRequestSchema>;

export const donationSchema = z.object({
  donorId: z.number().min(1, 'Donor is required'),
  donationDate: z.string().min(1, 'Donation date is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  quantity: z.number().min(0.5, 'Minimum 0.5 units').max(2.0, 'Maximum 2.0 units'),
  collectionLocation: z.string().max(200).optional(),
  screeningStatus: z.enum(['Passed', 'Failed', 'Pending']),
  donationStatus: z.enum(['Pending', 'Accepted', 'Rejected', 'Tested', 'Available', 'Used', 'Expired']),
  componentType: z.enum(['Whole Blood', 'Red Cells', 'Plasma', 'Platelets']),
  notes: z.string().max(500).optional(),
});

export type DonationData = z.infer<typeof donationSchema>;

export const donorReviewSchema = z.object({
  eligibilityStatus: z.enum(['Pending Medical Review', 'Eligible', 'Temporarily Deferred', 'Permanently Deferred']),
  notes: z.string().max(1000).optional(),
});

export type DonorReviewData = z.infer<typeof donorReviewSchema>;

export const staffRegistrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(20, 'Username must be at most 20 characters')
    .regex(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
  fullName: z.string().min(2, 'Full name is required').max(120),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type StaffRegistrationData = z.infer<typeof staffRegistrationSchema>;

export const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export type ChangePasswordData = z.infer<typeof changePasswordSchema>;