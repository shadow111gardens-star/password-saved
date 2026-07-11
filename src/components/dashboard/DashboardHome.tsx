import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Lock, Heart, AlertTriangle, Plus, Clock, ShieldCheck, Wand2, ArrowRight, TrendingUp } from 'lucide-react';
import type { PasswordEntry, ViewType } from '../../types';

interface DashboardHomeProps {
  passwords: PasswordEntry[];
  setView: (v: ViewType) => void;
}

export default function DashboardHome({ passwords, setView }: DashboardHomeProps) {
  // ... (તમારું લોજિક યથાવત)
  const stats = useMemo(() => {
    const total = passwords.length;
    const favorites = passwords.filter((p) => p.favorite).length;
    const weak = passwords.filter((p) => p.password.length < 8).length;
    const recent = [...passwords]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
    const securityScore = total === 0 ? 100 : Math.max(0, Math.min(100, Math.round(100 - (weak / total) * 100)));
    return { total, favorites, weak, recent, securityScore };
  }, [passwords]);

  const statCards = [
    { label: 'Total Passwords', value: stats.total, icon: Lock, color: 'bg-blue-50 text-blue-600', onClick: () => setView('vault') },
    { label: 'Favorites', value: stats.favorites, icon: Heart, color: 'bg-rose-50 text-rose-600', onClick: () => setView('favorites') },
    { label: 'Weak Passwords', value: stats.weak, icon: AlertTriangle, color: 'bg-amber-50 text-amber-600', onClick: () => setView('security') },
    { label: 'Recently Added', value: stats.recent.length, icon: Clock, color: 'bg-emerald-50 text-emerald-600', onClick: () => setView('vault') },
  ];

  const quickActions = [
    { label: 'Add Password', icon: Plus, onClick: () => setView('vault'), color: 'bg-blue-600 text-white hover:bg-blue-700' },
    { label: 'Generate Password', icon: Wand2, onClick: () => setView('generator'), color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' },
    { label: 'Security Check', icon: ShieldCheck, onClick: () => setView('security'), color: 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header - રિસ્પોન્સિવ લેઆઉટ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Welcome back to your secure vault.</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 self-start sm:self-auto">
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-xs font-medium text-emerald-700">All systems secure</span>
        </div>
      </div>

      {/* Stats Grid - રિસ્પોન્સિવ કોલમ્સ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((card, i) => (
          <motion.button
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={card.onClick}
            className="text-left p-5 rounded-2xl bg-white border border-slate-200 hover:shadow-md transition-all"
          >
            <div className={`w-10 h-10 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
              <card.icon className="w-5 h-5" />
            </div>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            <p className="text-sm text-slate-500 mt-0.5">{card.label}</p>
          </motion.button>
        ))}
      </div>

      {/* Lower Section - સ્માર્ટ સ્ટેકિંગ */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Security Score */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-white border border-slate-200">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Security Score</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24">
               {/* SVG યથાવત */}
               <svg className="w-24 h-24 -rotate-90" viewBox="0 0 36 36">
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e2e8f0" strokeWidth="3" />
                <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke={stats.securityScore >= 80 ? '#10b981' : stats.securityScore >= 50 ? '#f59e0b' : '#ef4444'} strokeWidth="3" strokeDasharray={`${stats.securityScore}, 100`} strokeLinecap="round" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-bold text-slate-900">{stats.securityScore}</span>
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">{stats.securityScore >= 80 ? 'Excellent' : stats.securityScore >= 50 ? 'Good' : 'Needs Attention'}</p>
              <button onClick={() => setView('security')} className="mt-2 text-xs font-medium text-blue-600 flex items-center gap-1">View details <ArrowRight className="w-3 h-3" /></button>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions & Latest Passwords - રિસ્પોન્સિવ */}
        <motion.div className="p-6 rounded-2xl bg-white border border-slate-200">
           <h3 className="text-sm font-semibold text-slate-900 mb-4">Quick Actions</h3>
           <div className="space-y-2">
             {quickActions.map((action) => (
               <button key={action.label} onClick={action.onClick} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${action.color}`}>
                 <action.icon className="w-4 h-4" />
                 {action.label}
               </button>
             ))}
           </div>
        </motion.div>

        <motion.div className="p-6 rounded-2xl bg-white border border-slate-200">
           {/* Latest Passwords લોજિક યથાવત */}
           <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-slate-900">Latest Passwords</h3>
            <button onClick={() => setView('vault')} className="text-xs font-medium text-blue-600">View all</button>
          </div>
          <div className="space-y-2">
            {stats.recent.map((pwd) => (
              <div key={pwd.id} className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setView('vault')}>
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-blue-700">{pwd.websiteName[0]}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">{pwd.websiteName}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}