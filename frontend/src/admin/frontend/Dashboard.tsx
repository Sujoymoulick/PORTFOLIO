import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { BarChart, LineChart, DonutChart } from './Charts';
import { 
  Users, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2, 
  Search, 
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertTriangle,
  Database,
  Server,
  Activity,
  X
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const formatCurrency = (val: number, cur: string = 'USD') => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

// --- SPARKLINE WIDGET ---
const Sparkline = ({ points, color = '#3b82f6' }: { points: number[], color?: string }) => {
  if (points.length < 2) {
    return (
      <div className="h-full w-full flex items-center justify-center text-[9px] text-white/20 font-mono">
        Optimizing...
      </div>
    );
  }
  const width = 300;
  const height = 60;
  const max = Math.max(...points, 50); // min ceiling is 50ms
  
  const svgPoints = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - (p / max) * height * 0.8 - 5; // leave small padding
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg className="w-full h-10 overflow-visible" viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={svgPoints}
      />
    </svg>
  );
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  
  // Realtime Connectivity Monitor State
  const [dbHistory, setDbHistory] = useState<number[]>([]);
  const [apiHistory, setApiHistory] = useState<number[]>([]);
  const [monitorData, setMonitorData] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const statsData = await api.get('/api/dashboard/stats');
        const chartsData = await api.get('/api/dashboard/charts');
        setStats(statsData);
        setCharts(chartsData);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  // Poll Realtime Connectivity Stats
  useEffect(() => {
    let active = true;
    const fetchMonitorStats = async () => {
      try {
        const apiStart = Date.now();
        const data = await api.get('/api/connectivity/stats');
        const apiLatency = Date.now() - apiStart;
        
        if (!active) return;
        setMonitorData(data);
        
        // Append history and limit to last 20 points
        setDbHistory(prev => {
          const next = [...prev, data.mongodb.latencyMs >= 0 ? data.mongodb.latencyMs : 0];
          return next.slice(-20);
        });
        
        setApiHistory(prev => {
          const next = [...prev, apiLatency];
          return next.slice(-20);
        });
      } catch (err) {
        console.error('Failed to fetch connectivity stats:', err);
      }
    };

    fetchMonitorStats();
    const interval = setInterval(fetchMonitorStats, 3000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Global Search handler
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults(null);
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setSearchLoading(true);
      try {
        const results = await api.get(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        setSearchResults(results);
      } catch (err) {
        console.error('Search failed:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        {/* Search Bar Skeleton */}
        <div className="h-12 bg-white/5 border border-white/5 rounded-2xl w-full max-w-xl"></div>
        
        {/* Metric Cards Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 border border-white/5 rounded-3xl p-6"></div>
          ))}
        </div>

        {/* Charts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 bg-white/5 border border-white/5 rounded-[2rem]"></div>
          <div className="h-72 bg-white/5 border border-white/5 rounded-[2rem]"></div>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Clients',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      path: '/admin/clients'
    },
    {
      title: 'Active Projects',
      value: stats?.activeProjects || 0,
      icon: Briefcase,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      path: '/admin/projects'
    },
    {
      title: 'Completed Projects',
      value: stats?.completedProjects || 0,
      icon: CheckCircle2,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
      path: '/admin/projects'
    },
    {
      title: 'Pending Payments',
      value: stats?.pendingPayments || 0,
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      path: '/admin/invoices'
    },
    {
      title: 'Revenue',
      value: formatCurrency(stats?.revenue || 0, stats?.currency),
      icon: DollarSign,
      color: 'text-teal-400 bg-teal-500/10 border-teal-500/20',
      path: '/admin/payments'
    },
    {
      title: 'Outstanding',
      value: formatCurrency(stats?.outstandingAmount || 0, stats?.currency),
      icon: AlertTriangle,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      path: '/admin/invoices'
    }
  ];

  return (
    <div className="space-y-8">
      {/* Global Search Bar */}
      <div className="relative max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Global search clients, projects, invoices, transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-5 py-4 pl-12 bg-zinc-900/50 border border-white/5 focus:border-blue-500/35 rounded-2xl text-xs text-white/80 focus:outline-none backdrop-blur-md transition-colors"
          />
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" />
          {searchLoading && (
            <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-blue-500 animate-spin" />
          )}
        </div>

        {/* Global Instant Search Results Dropdown */}
        {searchResults && (
          <div className="absolute top-full left-0 right-0 mt-3 rounded-2xl bg-zinc-900 border border-white/10 shadow-2xl p-4 z-[99] max-h-96 overflow-y-auto backdrop-blur-xl">
            <div className="flex justify-between items-center pb-2 border-b border-white/5 mb-3 text-[10px] uppercase font-bold text-white/40 tracking-wider">
              <span>Search Results</span>
              <button onClick={() => setSearchQuery('')} className="hover:text-white">Clear</button>
            </div>

            {/* Clients */}
            {searchResults.clients?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Clients</h4>
                <div className="space-y-1.5">
                  {searchResults.clients.map((c: any) => (
                    <Link 
                      key={c._id} 
                      to="/admin/clients" 
                      onClick={() => setSearchQuery('')}
                      className="block p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-xs text-white/80 transition-colors"
                    >
                      <span className="font-bold text-white">{c.name}</span> {c.company && `(${c.company})`} — {c.email}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {searchResults.projects?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 mb-2">Projects</h4>
                <div className="space-y-1.5">
                  {searchResults.projects.map((p: any) => (
                    <Link 
                      key={p._id} 
                      to="/admin/projects" 
                      onClick={() => setSearchQuery('')}
                      className="block p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-xs text-white/80 transition-colors"
                    >
                      <span className="font-bold text-white">{p.projectName}</span> — {p.status} ({p.progress}%)
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Invoices */}
            {searchResults.invoices?.length > 0 && (
              <div className="mb-4">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-purple-400 mb-2">Invoices</h4>
                <div className="space-y-1.5">
                  {searchResults.invoices.map((inv: any) => (
                    <Link 
                      key={inv._id} 
                      to="/admin/invoices" 
                      onClick={() => setSearchQuery('')}
                      className="block p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-xs text-white/80 transition-colors"
                    >
                      <span className="font-bold text-white">{inv.invoiceNumber}</span> — {formatCurrency(inv.grandTotal, inv.currency || stats?.currency)} ({inv.status})
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Payments */}
            {searchResults.payments?.length > 0 && (
              <div>
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-teal-400 mb-2">Transactions</h4>
                <div className="space-y-1.5">
                  {searchResults.payments.map((pay: any) => (
                    <Link 
                      key={pay._id} 
                      to="/admin/payments" 
                      onClick={() => setSearchQuery('')}
                      className="block p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 text-xs text-white/80 transition-colors"
                    >
                      {pay.date} — <span className="font-bold text-teal-400">{formatCurrency(pay.amount, pay.invoiceDetails?.currency || stats?.currency)}</span> via {pay.method} {pay.transactionId && `(TX: ${pay.transactionId})`}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {searchResults.clients?.length === 0 && 
             searchResults.projects?.length === 0 && 
             searchResults.invoices?.length === 0 && 
             searchResults.payments?.length === 0 && (
              <p className="text-xs text-white/40 text-center py-4">No records found matching "{searchQuery}".</p>
            )}
          </div>
        )}
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              onClick={() => navigate(card.path)}
              className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col justify-between cursor-pointer hover:border-white/10 hover:bg-zinc-900/60 hover:scale-[1.02] active:scale-[0.98] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white/60 transition-colors">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div className="text-xl font-display font-black text-white">{card.value}</div>
            </div>
          );
        })}
      </div>

      {/* Realtime Connectivity Monitor */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* MongoDB Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Database Engine</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Database size={16} className="text-emerald-400" /> MongoDB Atlas
              </h3>
            </div>
            <div className="flex items-center gap-2 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              {monitorData?.mongodb?.status || 'Connected'}
            </div>
          </div>
          
          <div className="my-2 z-10 flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-white/40 block">Ping Latency</span>
              <span className="text-2xl font-display font-black text-white">
                {monitorData?.mongodb?.latencyMs >= 0 ? `${monitorData.mongodb.latencyMs} ms` : '--'}
              </span>
            </div>
            <div className="w-48 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
              <Sparkline points={dbHistory} color="#10b981" />
            </div>
          </div>
        </div>

        {/* Express Server Card */}
        <div className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col justify-between h-48 relative overflow-hidden group">
          <div className="flex justify-between items-start z-10">
            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">Backend API</span>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Server size={16} className="text-blue-400" /> Express Node.js
              </h3>
            </div>
            <button 
              onClick={() => setDetailsOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/5 text-white/70 hover:text-white text-[10px] font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer"
            >
              <Activity size={12} className="animate-pulse" /> Details
            </button>
          </div>
          
          <div className="my-2 z-10 flex items-end justify-between">
            <div className="space-y-1">
              <span className="text-[10px] text-white/40 block">API Latency (Roundtrip)</span>
              <span className="text-2xl font-display font-black text-white">
                {apiHistory.length > 0 ? `${apiHistory[apiHistory.length - 1]} ms` : '--'}
              </span>
            </div>
            <div className="w-48 h-10 opacity-70 group-hover:opacity-100 transition-opacity">
              <Sparkline points={apiHistory} color="#3b82f6" />
            </div>
          </div>
        </div>
      </div>

      {/* Realtime API Logs Modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
          <div className="w-full max-w-3xl rounded-[2rem] bg-zinc-900 border border-white/10 p-6 md:p-8 shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center pb-4 border-b border-white/5 mb-6">
              <div className="space-y-1">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Activity size={18} className="text-blue-500 animate-pulse" /> Realtime API Diagnostics
                </h3>
                <p className="text-[10px] text-white/40 font-light">Monitor Express server network activity, response codes, and roundtrip performance.</p>
              </div>
              <button 
                onClick={() => setDetailsOpen(false)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 block">Server Status</span>
                  <span className="text-xs font-bold text-emerald-400">Active / Online</span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 block">Uptime</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {monitorData?.uptime ? `${Math.floor(monitorData.uptime / 60)}m ${Math.floor(monitorData.uptime % 60)}s` : '--'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 block">Avg DB Ping</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {dbHistory.length > 0 ? `${Math.round(dbHistory.reduce((a, b) => a + b, 0) / dbHistory.length)} ms` : '--'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-white/40 block">Avg API Latency</span>
                  <span className="text-xs font-mono font-bold text-white">
                    {apiHistory.length > 0 ? `${Math.round(apiHistory.reduce((a, b) => a + b, 0) / apiHistory.length)} ms` : '--'}
                  </span>
                </div>
              </div>

              <div className="border border-white/5 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5 text-[9px] font-bold uppercase tracking-widest text-white/40 animate-pulse">
                      <th className="p-3">Time</th>
                      <th className="p-3 w-20">Method</th>
                      <th className="p-3">Route</th>
                      <th className="p-3 w-20 text-center">Status</th>
                      <th className="p-3 w-24 text-right">Duration</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-mono text-[11px] text-white/70">
                    {monitorData?.recentCalls?.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-white/30 font-sans">No API requests recorded yet. Try navigating pages!</td>
                      </tr>
                    ) : (
                      (monitorData?.recentCalls || []).map((call: any, idx: number) => {
                        const isSuccess = call.statusCode < 400;
                        return (
                          <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                            <td className="p-3 text-white/30">{new Date(call.timestamp).toLocaleTimeString()}</td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                                call.method === 'GET' ? 'bg-blue-500/10 text-blue-400' :
                                call.method === 'POST' ? 'bg-emerald-500/10 text-emerald-400' :
                                call.method === 'PUT' ? 'bg-amber-500/10 text-amber-400' :
                                'bg-red-500/10 text-red-400'
                              }`}>
                                {call.method}
                              </span>
                            </td>
                            <td className="p-3 text-white/90 truncate max-w-[200px]">{call.url}</td>
                            <td className="p-3 text-center">
                              <span className={`font-bold ${isSuccess ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {call.statusCode}
                              </span>
                            </td>
                            <td className="p-3 text-right text-white/90 font-bold">{call.responseTimeMs} ms</td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Charts Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={charts?.monthlyRevenue || []} 
          title="Monthly Income & Expenses" 
          currency={stats?.currency}
        />
        <LineChart 
          data={charts?.clientGrowth || []} 
          title="Client Acquisition Growth" 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonutChart
          data={charts?.invoiceStatus || {}}
          colors={{ Paid: '#10b981', Pending: '#f59e0b', Partial: '#3b82f6', Overdue: '#ef4444' }}
          title="Invoice Settlement Status"
        />
        <DonutChart
          data={charts?.projectStatus || {}}
          colors={{ Planning: '#9ca3af', Active: '#3b82f6', Revision: '#f59e0b', Completed: '#10b981', Cancelled: '#ef4444' }}
          title="Project Pipeline Distribution"
        />
      </div>
    </div>
  );
}
