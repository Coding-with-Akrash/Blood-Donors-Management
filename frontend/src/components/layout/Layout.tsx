import { ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Button } from '../ui/Button';
import { Icons } from '../ui/Icons';
import { Avatar } from '../ui/Avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from '../ui/DropdownMenu';
import { Sheet, SheetTrigger, SheetContent } from '../ui/Sheet';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';
import { useNotification } from '../../contexts/NotificationContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROLES, ROLE_LABELS, ROLE_COLORS } from '../../constants';

interface PublicLayoutProps {
  children: ReactNode;
}

export function PublicLayout({ children }: PublicLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/');
  };

  const isAuthPage = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  if (isAuthenticated && !isAuthPage) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return (
    <div className="min-h-screen bg-background">
      {!isAuthPage && (
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
            <div className="flex items-center gap-8">
              <a href="/" className="flex items-center gap-2 text-xl font-heading font-bold text-primary" aria-label="LifeBlood Home">
                <Icons.heart className="h-6 w-6" aria-hidden="true" />
                <span>LifeBlood</span>
              </a>
              <div className="hidden md:flex items-center gap-6">
                <a href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">About</a>
                <a href="/how-it-works" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">How It Works</a>
                <a href="/find-blood" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Find Blood</a>
                <a href="/become-donor" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Become a Donor</a>
                <a href="/contact" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Contact</a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
                {theme === 'dark' ? <Icons.sun className="h-5 w-5" /> : <Icons.moon className="h-5 w-5" />}
              </Button>
<Button variant="ghost" size="sm" onClick={() => navigate('/login')}>
  Sign In
</Button>
<Button variant="default" size="sm" onClick={() => navigate('/register')}>
  Get Started
</Button>
            </div>
          </nav>
        </header>
      )}
      <main id="main-content">{children}</main>
      <footer className="border-t bg-muted/30 py-8">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">LifeBlood</h4>
              <p className="text-sm text-muted-foreground">Every Drop Can Save a Life.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/about" className="hover:text-foreground">About Us</a></li>
                <li><a href="/how-it-works" className="hover:text-foreground">How It Works</a></li>
                <li><a href="/find-blood" className="hover:text-foreground">Find Blood</a></li>
                <li><a href="/contact" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/blood-compatibility" className="hover:text-foreground">Blood Compatibility</a></li>
                <li><a href="/eligibility" className="hover:text-foreground">Eligibility</a></li>
                <li><a href="/faq" className="hover:text-foreground">FAQ</a></li>
                <li><a href="/help" className="hover:text-foreground">Help Center</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="/privacy" className="hover:text-foreground">Privacy Policy</a></li>
                <li><a href="/terms" className="hover:text-foreground">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} LifeBlood. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

interface AuthenticatedLayoutProps {
  children: ReactNode;
}

function AuthenticatedLayout({ children }: AuthenticatedLayoutProps) {
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { success } = useNotification();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [mobileUserMenuOpen, setMobileUserMenuOpen] = React.useState(false);

  if (!isAuthenticated || !user) {
    return <PublicLayout>{children}</PublicLayout>;
  }

  const role = user.role;
  const roleLabel = ROLE_LABELS[role];
  const roleColor = ROLE_COLORS[role];

  const navigation = getNavigation(role);
  const currentPath = location.pathname;

  const handleLogout = async () => {
    await logout();
    success('Logged out successfully');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open navigation menu">
            <Icons.menu className="h-6 w-6" aria-hidden="true" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <nav className="flex h-full flex-col" aria-label="Main navigation">
            <div className="flex h-16 items-center justify-between px-4 border-b">
              <a href="/" className="flex items-center gap-2 text-xl font-heading font-bold text-primary">
                <Icons.heart className="h-6 w-6" aria-hidden="true" />
                <span>LifeBlood</span>
              </a>
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} aria-label="Close navigation menu">
                <Icons.x className="h-5 w-5" aria-hidden="true" />
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto py-4 px-3">
              <div className="mb-4 px-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Menu</p>
              </div>
              <ul className="space-y-1" role="list">
                {navigation.map((item) => (
                  <li key={item.path}>
                    <a
                      href={item.path}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        currentPath === item.path || currentPath.startsWith(item.path + '/')
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                      )}
                      aria-current={currentPath === item.path || currentPath.startsWith(item.path + '/') ? 'page' : undefined}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t p-4">
              <div className="flex items-center gap-3">
                <Avatar name={user.username} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.username}</p>
                  <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', roleColor)}>
                    {roleLabel}
                  </span>
                </div>
              </div>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setSidebarOpen(true)} aria-label="Open navigation menu">
              <Icons.menu className="h-6 w-6" aria-hidden="true" />
            </Button>
            <a href="/" className="flex items-center gap-2 text-xl font-heading font-bold text-primary">
              <Icons.heart className="h-6 w-6" aria-hidden="true" />
              <span>LifeBlood</span>
            </a>
            <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
              {navigation.map((item) => (
                <a
                  key={item.path}
                  href={item.path}
                  className={cn(
                    'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    currentPath === item.path || currentPath.startsWith(item.path + '/')
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                  )}
                  aria-current={currentPath === item.path || currentPath.startsWith(item.path + '/') ? 'page' : undefined}
                >
                  {item.label}
                </a>
              ))}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
              {theme === 'dark' ? <Icons.sun className="h-5 w-5" /> : <Icons.moon className="h-5 w-5" />}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full" aria-label="User menu">
                  <Avatar name={user.username} size="md" src={user.donorProfile?.fullName || user.recipientProfile?.fullName ? undefined : user.username} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user.username}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                    <span className={cn('inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium', roleColor)}>
                      {roleLabel}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  <Icons.user className="mr-2 h-4 w-4" aria-hidden="true" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/settings')}>
                  <Icons.settings className="mr-2 h-4 w-4" aria-hidden="true" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive">
                  <Icons.logOut className="mr-2 h-4 w-4" aria-hidden="true" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      <main id="main-content" className="pt-4" tabIndex={-1}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

function getNavigation(role: string) {
  const base = [
    { path: '/dashboard', label: 'Dashboard', icon: Icons.home },
  ];

  switch (role) {
    case 'donor':
      return [
        ...base,
        { path: '/dashboard', label: 'Dashboard', icon: Icons.home },
        { path: '/donor/profile', label: 'My Profile', icon: Icons.user },
        { path: '/donor/blood-info', label: 'Blood Information', icon: Icons.droplet },
        { path: '/donor/history', label: 'Donation History', icon: Icons.history },
        { path: '/donor/eligibility', label: 'Eligibility', icon: Icons.shieldCheck },
        { path: '/donor/requests', label: 'Blood Requests', icon: Icons.heartHandshake },
        { path: '/donor/availability', label: 'Availability', icon: Icons.calendar },
        { path: '/notifications', label: 'Notifications', icon: Icons.bell },
      ];
    case 'recipient':
      return [
        ...base,
        { path: '/dashboard', label: 'Dashboard', icon: Icons.home },
        { path: '/recipient/profile', label: 'My Profile', icon: Icons.user },
        { path: '/recipient/requests', label: 'My Requests', icon: Icons.clipboardList },
        { path: '/recipient/create-request', label: 'Create Request', icon: Icons.plus },
        { path: '/recipient/find-blood', label: 'Find Blood', icon: Icons.search },
        { path: '/notifications', label: 'Notifications', icon: Icons.bell },
      ];
    case 'staff':
      return [
        ...base,
        { path: '/staff/dashboard', label: 'Dashboard', icon: Icons.home },
        { path: '/staff/donors', label: 'Donors', icon: Icons.users },
        { path: '/staff/donations', label: 'Donations', icon: Icons.droplet },
        { path: '/staff/requests', label: 'Blood Requests', icon: Icons.clipboardList },
        { path: '/staff/inventory', label: 'Blood Inventory', icon: Icons.droplets },
        { path: '/staff/reports', label: 'Reports', icon: Icons.barChart },
        { path: '/notifications', label: 'Notifications', icon: Icons.bell },
      ];
    case 'admin':
      return [
        ...base,
        { path: '/admin/dashboard', label: 'Dashboard', icon: Icons.home },
        { path: '/admin/users', label: 'Users', icon: Icons.users },
        { path: '/admin/donors', label: 'Donors', icon: Icons.heart },
        { path: '/admin/recipients', label: 'Recipients', icon: Icons.droplet },
        { path: '/admin/staff', label: 'Staff', icon: Icons.shield },
        { path: '/admin/donations', label: 'Donations', icon: Icons.droplet },
        { path: '/admin/requests', label: 'Blood Requests', icon: Icons.clipboardList },
        { path: '/admin/inventory', label: 'Blood Inventory', icon: Icons.droplets },
        { path: '/admin/reports', label: 'Reports', icon: Icons.barChart },
        { path: '/admin/audit-logs', label: 'Audit Logs', icon: Icons.fileText },
        { path: '/admin/settings', label: 'System Settings', icon: Icons.settings },
      ];
    default:
      return base;
  }
}