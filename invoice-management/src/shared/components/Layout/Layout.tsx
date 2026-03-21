import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Building2,
  Settings,
  ChevronDown,
  LogOut,
  User,
  Menu,
  X,
  Zap,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/invoices', icon: FileText, label: 'Invoices' },
  { to: '/vendors', icon: Building2, label: 'Vendors' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export function Layout() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const userInitial = user?.email?.charAt(0).toUpperCase() || 'U';
  const userName = user?.username || user?.email?.split('@')[0] || 'User';
  const userEmail = user?.email || 'user@example.com';

  return (
    <div className="flex h-screen bg-[#f9fafb] overflow-hidden">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-30 w-60 flex flex-col bg-[#1f2937] transition-transform duration-300 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-6 h-16 border-b border-white/10">
          <div className="w-8 h-8 bg-[#3b82f6] rounded-lg flex items-center justify-center">
            <Zap size={16} className="text-white" />
          </div>
          <span className="text-white font-semibold text-lg tracking-tight">Invoice Manager</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-[#3b82f6]/20 text-white border-l-2 border-[#3b82f6]'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User section */}
        <div className="px-3 py-4 border-t border-white/10">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-400 hover:bg-white/10 hover:text-white transition-colors"
            >
              <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                {userInitial}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="text-sm text-white truncate">{userName}</div>
                <div className="text-xs text-gray-500 truncate">{userEmail}</div>
              </div>
              <ChevronDown size={14} className={`flex-shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
            </button>

            {profileOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-1 bg-[#374151] rounded-lg border border-white/10 overflow-hidden shadow-lg">
                <button 
                  onClick={() => {
                    setProfileOpen(false);
                    navigate('/settings');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/10 transition-colors"
                >
                  <User size={14} />
                  Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
                >
                  <LogOut size={14} />
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-[#e5e7eb] flex items-center justify-between px-6 flex-shrink-0">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden lg:block">
            <p className="text-sm text-gray-500">
              Welcome back, <span className="text-gray-900 font-medium">{userName}</span>
            </p>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#3b82f6] rounded-full flex items-center justify-center text-white text-sm font-medium">
                {userInitial}
              </div>
              <span className="text-sm text-gray-700 hidden sm:block">{userName}</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
