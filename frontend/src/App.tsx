import { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from './components/layout/Layout';
import { LoadingState } from './components/ui/LoadingState';
import { useAuth } from './contexts/AuthContext';

// Public pages
const Landing = lazy(() => import('./pages/public/Landing').then(m => ({ default: m.Landing })));
const About = lazy(() => import('./pages/public/About').then(m => ({ default: m.About })));
const HowItWorks = lazy(() => import('./pages/public/HowItWorks').then(m => ({ default: m.HowItWorks })));
const FindBlood = lazy(() => import('./pages/public/FindBlood').then(m => ({ default: m.FindBlood })));
const BecomeDonor = lazy(() => import('./pages/public/BecomeDonor').then(m => ({ default: m.BecomeDonor })));
const Contact = lazy(() => import('./pages/public/Contact').then(m => ({ default: m.Contact })));
const BloodCompatibility = lazy(() => import('./pages/public/BloodCompatibility').then(m => ({ default: m.BloodCompatibility })));
const FAQ = lazy(() => import('./pages/public/FAQ').then(m => ({ default: m.FAQ })));

// Auth pages
const Login = lazy(() => import('./pages/auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('./pages/auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/auth/ResetPassword').then(m => ({ default: m.ResetPassword })));

// Donor pages
const DonorDashboard = lazy(() => import('./pages/donor/Dashboard').then(m => ({ default: m.DonorDashboard })));
const DonorProfile = lazy(() => import('./pages/donor/Profile').then(m => ({ default: m.DonorProfile })));
const DonorBloodInfo = lazy(() => import('./pages/donor/BloodInfo').then(m => ({ default: m.DonorBloodInfo })));
const DonorHistory = lazy(() => import('./pages/donor/History').then(m => ({ default: m.DonorHistory })));
const DonorEligibility = lazy(() => import('./pages/donor/Eligibility').then(m => ({ default: m.DonorEligibility })));
const DonorRequests = lazy(() => import('./pages/donor/Requests').then(m => ({ default: m.DonorRequests })));
const DonorAvailability = lazy(() => import('./pages/donor/Availability').then(m => ({ default: m.DonorAvailability })));

// Recipient pages
const RecipientDashboard = lazy(() => import('./pages/recipient/Dashboard').then(m => ({ default: m.RecipientDashboard })));
const RecipientProfile = lazy(() => import('./pages/recipient/Profile').then(m => ({ default: m.RecipientProfile })));
const RecipientRequests = lazy(() => import('./pages/recipient/Requests').then(m => ({ default: m.RecipientRequests })));
const CreateBloodRequest = lazy(() => import('./pages/recipient/CreateBloodRequest').then(m => ({ default: m.CreateBloodRequest })));
const FindBloodPage = lazy(() => import('./pages/recipient/FindBlood').then(m => ({ default: m.FindBlood })));

// Staff pages
const StaffDashboard = lazy(() => import('./pages/staff/Dashboard').then(m => ({ default: m.StaffDashboard })));
const StaffDonors = lazy(() => import('./pages/staff/Donors').then(m => ({ default: m.StaffDonors })));
const StaffDonations = lazy(() => import('./pages/staff/Donations').then(m => ({ default: m.StaffDonations })));
const StaffRequests = lazy(() => import('./pages/staff/Requests').then(m => ({ default: m.StaffRequests })));
const StaffInventory = lazy(() => import('./pages/staff/Inventory').then(m => ({ default: m.StaffInventory })));
const StaffReports = lazy(() => import('./pages/staff/Reports').then(m => ({ default: m.StaffReports })));

// Admin pages
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard').then(m => ({ default: m.AdminDashboard })));
const AdminUsers = lazy(() => import('./pages/admin/Users').then(m => ({ default: m.AdminUsers })));
const AdminDonors = lazy(() => import('./pages/admin/Donors').then(m => ({ default: m.AdminDonors })));
const AdminRecipients = lazy(() => import('./pages/admin/Recipients').then(m => ({ default: m.AdminRecipients })));
const AdminStaff = lazy(() => import('./pages/admin/Staff').then(m => ({ default: m.AdminStaff })));
const AdminDonations = lazy(() => import('./pages/admin/Donations').then(m => ({ default: m.AdminDonations })));
const AdminRequests = lazy(() => import('./pages/admin/Requests').then(m => ({ default: m.AdminRequests })));
const AdminInventory = lazy(() => import('./pages/admin/Inventory').then(m => ({ default: m.AdminInventory })));
const AdminReports = lazy(() => import('./pages/admin/Reports').then(m => ({ default: m.AdminReports })));
const AdminAuditLogs = lazy(() => import('./pages/admin/AuditLogs').then(m => ({ default: m.AdminAuditLogs })));
const AdminSettings = lazy(() => import('./pages/admin/Settings').then(m => ({ default: m.AdminSettings })));

// Common pages
const Profile = lazy(() => import('./pages/common/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('./pages/common/Settings').then(m => ({ default: m.Settings })));
const Notifications = lazy(() => import('./pages/common/Notifications').then(m => ({ default: m.Notifications })));
const NotFound = lazy(() => import('./pages/common/NotFound').then(m => ({ default: m.NotFound })));

const PageWrapper = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<LoadingState message="Loading page..." />}>
    {children}
  </Suspense>
);

function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
  const { user, isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingState message="Checking authentication..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: window.location.pathname }} />;
  }

  if (!allowedRoles.includes(user?.role || '')) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

export function App() {
  return (
    <PublicLayout>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<PageWrapper><Landing /></PageWrapper>} />
        <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
        <Route path="/how-it-works" element={<PageWrapper><HowItWorks /></PageWrapper>} />
        <Route path="/find-blood" element={<PageWrapper><FindBlood /></PageWrapper>} />
        <Route path="/become-donor" element={<PageWrapper><BecomeDonor /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        <Route path="/blood-compatibility" element={<PageWrapper><BloodCompatibility /></PageWrapper>} />
        <Route path="/faq" element={<PageWrapper><FAQ /></PageWrapper>} />

        {/* Auth routes */}
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
        <Route path="/forgot-password" element={<PageWrapper><ForgotPassword /></PageWrapper>} />
        <Route path="/reset-password" element={<PageWrapper><ResetPassword /></PageWrapper>} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['donor', 'recipient', 'staff', 'admin']}>
              <Navigate to="/donor/dashboard" replace />
            </ProtectedRoute>
          }
        />

        {/* Donor routes */}
        <Route
          path="/donor/*"
          element={
            <ProtectedRoute allowedRoles={['donor']}>
              <Routes>
                <Route path="dashboard" element={<PageWrapper><DonorDashboard /></PageWrapper>} />
                <Route path="profile" element={<PageWrapper><DonorProfile /></PageWrapper>} />
                <Route path="blood-info" element={<PageWrapper><DonorBloodInfo /></PageWrapper>} />
                <Route path="history" element={<PageWrapper><DonorHistory /></PageWrapper>} />
                <Route path="eligibility" element={<PageWrapper><DonorEligibility /></PageWrapper>} />
                <Route path="requests" element={<PageWrapper><DonorRequests /></PageWrapper>} />
                <Route path="availability" element={<PageWrapper><DonorAvailability /></PageWrapper>} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Recipient routes */}
        <Route
          path="/recipient/*"
          element={
            <ProtectedRoute allowedRoles={['recipient']}>
              <Routes>
                <Route path="dashboard" element={<PageWrapper><RecipientDashboard /></PageWrapper>} />
                <Route path="profile" element={<PageWrapper><RecipientProfile /></PageWrapper>} />
                <Route path="requests" element={<PageWrapper><RecipientRequests /></PageWrapper>} />
                <Route path="create-request" element={<PageWrapper><CreateBloodRequest /></PageWrapper>} />
                <Route path="find-blood" element={<PageWrapper><FindBloodPage /></PageWrapper>} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Staff routes */}
        <Route
          path="/staff/*"
          element={
            <ProtectedRoute allowedRoles={['staff', 'admin']}>
              <Routes>
                <Route path="dashboard" element={<PageWrapper><StaffDashboard /></PageWrapper>} />
                <Route path="donors" element={<PageWrapper><StaffDonors /></PageWrapper>} />
                <Route path="donations" element={<PageWrapper><StaffDonations /></PageWrapper>} />
                <Route path="requests" element={<PageWrapper><StaffRequests /></PageWrapper>} />
                <Route path="inventory" element={<PageWrapper><StaffInventory /></PageWrapper>} />
                <Route path="reports" element={<PageWrapper><StaffReports /></PageWrapper>} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route path="dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
                <Route path="users" element={<PageWrapper><AdminUsers /></PageWrapper>} />
                <Route path="donors" element={<PageWrapper><AdminDonors /></PageWrapper>} />
                <Route path="recipients" element={<PageWrapper><AdminRecipients /></PageWrapper>} />
                <Route path="staff" element={<PageWrapper><AdminStaff /></PageWrapper>} />
                <Route path="donations" element={<PageWrapper><AdminDonations /></PageWrapper>} />
                <Route path="requests" element={<PageWrapper><AdminRequests /></PageWrapper>} />
                <Route path="inventory" element={<PageWrapper><AdminInventory /></PageWrapper>} />
                <Route path="reports" element={<PageWrapper><AdminReports /></PageWrapper>} />
                <Route path="audit-logs" element={<PageWrapper><AdminAuditLogs /></PageWrapper>} />
                <Route path="settings" element={<PageWrapper><AdminSettings /></PageWrapper>} />
              </Routes>
            </ProtectedRoute>
          }
        />

        {/* Common routes */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['donor', 'recipient', 'staff', 'admin']}>
              <PageWrapper><Profile /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <ProtectedRoute allowedRoles={['donor', 'recipient', 'staff', 'admin']}>
              <PageWrapper><Settings /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/notifications"
          element={
            <ProtectedRoute allowedRoles={['donor', 'recipient', 'staff', 'admin']}>
              <PageWrapper><Notifications /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
      </Routes>
    </PublicLayout>
  );
}