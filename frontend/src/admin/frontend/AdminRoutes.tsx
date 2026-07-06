import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';

import Dashboard from './Dashboard';
import Clients from './Clients';
import Projects from './Projects';
import Invoices from './Invoices';
import InvoicePrint from './InvoicePrint';
import Payments from './Payments';
import Expenses from './Expenses';
import Analytics from './Analytics';
import Settings from './Settings';
import AdminLogin from './AdminLogin';
import WorkingProjects from './WorkingProjects';
import Contributions from './Contributions';

import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  DollarSign,
  TrendingDown,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  User as UserIcon,
  Bell,
  Search,
  ChevronLeft,
  ChevronRight,
  Rocket,
  GitPullRequest
} from 'lucide-react';

export default function AdminRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<string[]>([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Skip auth check if we are on the print view or login page
  const isPrintView = location.pathname.includes('/invoices/') && location.pathname.includes('/print');
  const isLoginView = location.pathname === '/admin/login';

  useEffect(() => {
    if (isPrintView) {
      setLoading(false);
      return;
    }
    
    const token = localStorage.getItem('admin_token');
    if (!token) {
      setLoading(false);
      if (!isLoginView) {
        navigate('/admin/login', { replace: true });
      }
      return;
    }

    // Verify token
    api.get('/api/auth/me')
      .then((res) => {
        setUser(res.user);
        setLoading(false);
        if (isLoginView) {
          navigate('/admin', { replace: true });
        }
      })
      .catch((err) => {
        console.error('Auth check failed:', err);
        localStorage.removeItem('admin_token');
        setLoading(false);
        if (!isLoginView) {
          navigate('/admin/login', { replace: true });
        }
      });
  }, [location.pathname]);

  // Fetch notifications (deadlines, invoice dues)
  useEffect(() => {
    if (!user) return;
    
    // Simulate or fetch alerts based on actual data
    const fetchAlerts = async () => {
      try {
        const stats = await api.get('/api/dashboard/stats');
        const projData = await api.get('/api/projects');
        const invData = await api.get('/api/invoices');
        
        const alerts: string[] = [];
        
        // 1. Projects near deadline
        const today = new Date();
        projData.forEach((p: any) => {
          if (p.deadline && p.status !== 'Completed' && p.status !== 'Cancelled') {
            const diffTime = new Date(p.deadline).getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 7) {
              alerts.push(`Project "${p.projectName}" deadline is in ${diffDays} days!`);
            } else if (diffDays < 0) {
              alerts.push(`Project "${p.projectName}" is overdue by ${Math.abs(diffDays)} days!`);
            }
          }
        });

        // 2. Overdue Invoices
        invData.forEach((i: any) => {
          if (i.dueDate && i.status !== 'Paid') {
            const diffTime = new Date(i.dueDate).getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays < 0) {
              alerts.push(`Invoice ${i.invoiceNumber} is overdue by ${Math.abs(diffDays)} days!`);
            }
          }
        });

        if (stats.pendingPayments > 0) {
          alerts.push(`You have ${stats.pendingPayments} pending payments to track.`);
        }

        setNotifications(alerts);
      } catch (err) {
        console.error('Failed to load notifications:', err);
      }
    };

    fetchAlerts();
  }, [user, location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-white/40 text-sm font-display tracking-widest uppercase">Verifying Session...</p>
      </div>
    );
  }

  // Render print view directly without admin layout
  if (isPrintView) {
    return (
      <Routes>
        <Route path="/invoices/:id/print" element={<InvoicePrint />} />
      </Routes>
    );
  }

  // Render login view directly
  if (isLoginView) {
    return (
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
      </Routes>
    );
  }

  // Require login for other routes
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  const navItems = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Clients', path: '/admin/clients', icon: Users },
    { label: 'Projects', path: '/admin/projects', icon: Briefcase },
    { label: 'Working Projects', path: '/admin/working-projects', icon: Rocket },
    { label: 'Contributions', path: '/admin/contributions', icon: GitPullRequest },
    { label: 'Invoices', path: '/admin/invoices', icon: FileText },
    { label: 'Payments', path: '/admin/payments', icon: DollarSign },
    { label: 'Expenses', path: '/admin/expenses', icon: TrendingDown },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', path: '/admin/settings', icon: SettingsIcon },
  ];

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login', { replace: true });
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-zinc-950/80 border-r border-white/5 backdrop-blur-xl">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/5 flex items-center justify-between">
        <Link to="/" className="text-xl font-display font-black tracking-tighter text-white">
          SM<span className="text-blue-500">.</span><span className="text-xs text-white/40 ml-2 font-light uppercase tracking-widest">Admin</span>
        </Link>
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="hidden md:flex p-1.5 rounded-lg hover:bg-white/5 text-white/60 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>
      </div>

      {/* Nav List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border-l-2 border-blue-500 font-medium'
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <Icon size={18} className={isActive ? 'text-blue-400' : 'text-white/40 group-hover:text-white/80'} />
              {sidebarOpen && <span className="text-sm font-display tracking-wide">{item.label}</span>}
              {!sidebarOpen && (
                <div className="absolute left-full ml-4 px-2 py-1 rounded bg-zinc-900 border border-white/10 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
                  {item.label}
                </div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Footer / Logout */}
      <div className="p-4 border-t border-white/5 flex flex-col gap-2">
        {sidebarOpen && user && (
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 border border-white/5">
            {user.picture ? (
              <img src={user.picture} alt="Avatar" className="w-8 h-8 rounded-full border border-white/10" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                <UserIcon size={14} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-white truncate">{user.name}</p>
              <p className="text-[10px] text-white/40 truncate">{user.email}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-white/50 hover:bg-red-500/10 hover:text-red-400 rounded-xl transition-all duration-200 w-full group relative"
        >
          <LogOut size={18} className="text-white/40 group-hover:text-red-400" />
          {sidebarOpen && <span className="text-sm font-display">Logout</span>}
          {!sidebarOpen && (
            <div className="absolute left-full ml-4 px-2 py-1 rounded bg-zinc-900 border border-white/10 text-xs text-red-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex overflow-hidden font-display">
      {/* Sidebar for Desktop */}
      <aside 
        className={`hidden md:block shrink-0 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden bg-black/60 backdrop-blur-sm">
          <div className="w-64 h-full shrink-0 relative animate-slide-in">
            <button 
              onClick={() => setMobileSidebarOpen(false)}
              className="absolute top-4 right-[-3rem] p-2 rounded-xl bg-zinc-900 border border-white/10 text-white"
            >
              <X size={20} />
            </button>
            <SidebarContent />
          </div>
          <div className="flex-1" onClick={() => setMobileSidebarOpen(false)}></div>
        </div>
      )}

      {/* Main Panel Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-16 shrink-0 border-b border-white/5 bg-zinc-950/40 backdrop-blur-md flex items-center justify-between px-6 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setMobileSidebarOpen(true)}
              className="md:hidden p-2 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-white"
            >
              <Menu size={18} />
            </button>
            
            <h1 className="text-sm font-bold tracking-widest uppercase text-white/40 hidden md:block">
              {navItems.find(item => location.pathname === item.path)?.label || 'Admin Panel'}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-white/70 hover:text-white relative"
              >
                <Bell size={16} />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-black animate-pulse" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-2xl z-50 max-h-96 overflow-y-auto">
                  <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/50">Alerts & Notifications</span>
                    <button onClick={() => setNotificationsOpen(false)} className="text-white/40 hover:text-white">
                      <X size={14} />
                    </button>
                  </div>
                  {notifications.length === 0 ? (
                    <p className="text-xs text-white/40 text-center py-6">No urgent notifications.</p>
                  ) : (
                    <div className="space-y-2">
                      {notifications.map((note, index) => (
                        <div key={index} className="p-3 rounded-xl bg-white/5 border border-white/5 text-xs text-white/80 font-light leading-relaxed">
                          {note}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Quick Portfolio Shortcut */}
            <Link 
              to="/"
              className="text-[10px] font-bold tracking-widest uppercase text-white/40 hover:text-white border border-white/10 px-4 py-2.5 rounded-xl hover:bg-white/5 transition-all"
            >
              View Site
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 p-6 md:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/working-projects" element={<WorkingProjects />} />
            <Route path="/contributions" element={<Contributions />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/payments" element={<Payments />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
