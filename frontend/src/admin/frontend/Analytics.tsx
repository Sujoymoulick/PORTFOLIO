import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import { BarChart, LineChart, DonutChart } from './Charts';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  Users, 
  FileText, 
  Percent, 
  Loader2 
} from 'lucide-react';

const formatCurrency = (val: number, cur: string = 'USD') => {
  const locale = cur === 'INR' ? 'en-IN' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: cur || 'USD',
    maximumFractionDigits: 0
  }).format(val);
};

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [charts, setCharts] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [expensesTotal, setExpensesTotal] = useState(0);
  const [averageBudget, setAverageBudget] = useState(0);

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        setLoading(true);
        const statsData = await api.get('/api/dashboard/stats');
        const chartsData = await api.get('/api/dashboard/charts');
        const expenseList = await api.get('/api/expenses');
        const projectList = await api.get('/api/projects');

        setStats(statsData);
        setCharts(chartsData);

        // Calculate totals
        const totalExp = expenseList.reduce((sum: number, e: any) => sum + e.amount, 0);
        setExpensesTotal(totalExp);

        const activeBudgets = projectList.filter((p: any) => p.budget > 0);
        const avgBudget = activeBudgets.length > 0 
          ? activeBudgets.reduce((sum: number, p: any) => sum + p.budget, 0) / activeBudgets.length
          : 0;
        setAverageBudget(avgBudget);
      } catch (err) {
        console.error('Failed to load analytics details:', err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalyticsData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 border border-white/5 rounded-3xl p-6"></div>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-80 bg-white/5 border border-white/5 rounded-[2.5rem]"></div>
          <div className="h-80 bg-white/5 border border-white/5 rounded-[2.5rem]"></div>
        </div>
      </div>
    );
  }

  const revenue = stats?.revenue || 0;
  const netProfit = revenue - expensesTotal;
  const profitMargin = revenue > 0 ? (netProfit / revenue) * 100 : 0;

  const analyticsCards = [
    {
      title: 'Gross Revenue',
      value: formatCurrency(revenue, stats?.currency),
      icon: DollarSign,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      description: 'Total inflow collections settled.'
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(expensesTotal, stats?.currency),
      icon: TrendingDown,
      color: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'Hosting, SaaS tools, laptop outlays.'
    },
    {
      title: 'Net Profit',
      value: formatCurrency(netProfit, stats?.currency),
      icon: TrendingUp,
      color: netProfit >= 0 ? 'text-teal-400 bg-teal-500/10 border-teal-500/20' : 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      description: 'Gross revenue minus operational outflow.'
    },
    {
      title: 'Profit Margin',
      value: `${profitMargin.toFixed(1)}%`,
      icon: Percent,
      color: profitMargin >= 30 ? 'text-purple-400 bg-purple-500/10 border-purple-500/20' : 'text-amber-400 bg-amber-500/10 border-amber-500/20',
      description: 'Ratio of profit generated per dollar.'
    }
  ];

  const subCards = [
    {
      title: 'Average Deal Size',
      value: formatCurrency(averageBudget, stats?.currency),
      icon: Briefcase,
      color: 'text-blue-400',
      description: 'Average budget per contract project.'
    },
    {
      title: 'Accounts Receivable',
      value: formatCurrency(stats?.outstandingAmount || 0, stats?.currency),
      icon: FileText,
      color: 'text-amber-400',
      description: 'Outstanding invoice amounts due.'
    },
    {
      title: 'Client Relationships',
      value: stats?.totalClients || 0,
      icon: Users,
      color: 'text-indigo-400',
      description: 'Total business client relationships.'
    }
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-display font-black text-white">Business Analytics</h2>
        <p className="text-xs text-white/40 font-light mt-1">Review organizational statistics, billing conversions, and profit metrics.</p>
      </div>

      {/* Main financial cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          return (
            <div 
              key={card.title} 
              className="p-6 rounded-3xl bg-zinc-900/40 border border-white/5 backdrop-blur-md flex flex-col justify-between"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40">{card.title}</span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <Icon size={14} />
                </div>
              </div>
              <div>
                <div className="text-xl font-display font-black text-white">{card.value}</div>
                <p className="text-[10px] text-white/30 mt-1 font-light">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="p-6 rounded-3xl bg-zinc-900/20 border border-white/5 flex gap-4 items-center">
              <div className={`p-3 rounded-2xl bg-white/5 border border-white/5 ${card.color}`}>
                <Icon size={18} />
              </div>
              <div>
                <span className="text-[9px] font-bold uppercase tracking-widest text-white/30">{card.title}</span>
                <h4 className="text-sm font-bold text-white mt-0.5">{card.value}</h4>
                <p className="text-[9px] text-white/30 mt-0.5 font-light">{card.description}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Primary charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChart 
          data={charts?.monthlyRevenue || []} 
          title="Income vs Expenses (Last 6 Months)" 
          currency={stats?.currency}
        />
        <LineChart 
          data={charts?.clientGrowth || []} 
          title="Client Growth Trend" 
        />
      </div>

      {/* Secondary charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DonutChart
          data={charts?.invoiceStatus || {}}
          colors={{ Paid: '#10b981', Pending: '#f59e0b', Partial: '#3b82f6', Overdue: '#ef4444' }}
          title="Invoices Settlement Status"
        />
        <DonutChart
          data={charts?.projectStatus || {}}
          colors={{ Planning: '#9ca3af', Active: '#3b82f6', Revision: '#f59e0b', Completed: '#10b981', Cancelled: '#ef4444' }}
          title="Projects Pipeline Distribution"
        />
      </div>
    </div>
  );
}
