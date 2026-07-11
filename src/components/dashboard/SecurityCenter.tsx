import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, AlertTriangle, Copy, Check, Eye, EyeOff } from 'lucide-react';
import type { PasswordEntry } from '../../types';

interface SecurityCenterProps {
  passwords: PasswordEntry[];
}

export default function SecurityCenter({ passwords }: SecurityCenterProps) {
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const analysis = useMemo(() => {
    const weak = passwords.filter((p) => p.password.length < 8);
    const duplicates = passwords.filter((p, i, arr) =>
      arr.findIndex((q) => q.password === p.password) !== i
    );
    const old = passwords.filter(
      (p) => new Date().getTime() - new Date(p.updatedAt).getTime() > 180 * 24 * 60 * 60 * 1000
    );
    const score = Math.max(0, Math.min(100, Math.round(100 - ((weak.length + duplicates.length + old.length) / (passwords.length || 1)) * 50)));
    return { weak, duplicates, old, score };
  }, [passwords]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const scoreColor = analysis.score >= 80 ? 'text-emerald-600' : analysis.score >= 50 ? 'text-amber-600' : 'text-red-600';
  const scoreBg = analysis.score >= 80 ? 'bg-emerald-50' : analysis.score >= 50 ? 'bg-amber-50' : 'bg-red-50';

  return (
    <div className="p-4 sm:p-8 w-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
          <ShieldCheck className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Security Center</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Monitor and improve your password security.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-5 sm:p-6 rounded-2xl border mb-6 ${scoreBg} border-opacity-50`}
        style={{ borderColor: analysis.score >= 80 ? '#10b981' : analysis.score >= 50 ? '#f59e0b' : '#ef4444' }}
      >
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
              <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="rgba(0,0,0,0.1)" strokeWidth="3" />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke={analysis.score >= 80 ? '#10b981' : analysis.score >= 50 ? '#f59e0b' : '#ef4444'}
                strokeWidth="3"
                strokeDasharray={`${analysis.score}, 100`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-xl sm:text-2xl font-bold ${scoreColor}`}>{analysis.score}</span>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <p className={`text-base sm:text-lg font-semibold ${scoreColor}`}>
              {analysis.score >= 80 ? 'Excellent' : analysis.score >= 50 ? 'Good' : 'Needs Attention'}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              {analysis.weak.length > 0 && `${analysis.weak.length} weak passwords. `}
              {analysis.duplicates.length > 0 && `${analysis.duplicates.length} duplicates. `}
              {analysis.old.length > 0 && `${analysis.old.length} old passwords. `}
              {analysis.weak.length === 0 && analysis.duplicates.length === 0 && analysis.old.length === 0 && 'All passwords look great!'}
            </p>
          </div>
        </div>
      </motion.div>

      <div className="space-y-6">
        {analysis.weak.length > 0 && (
          <IssueSection
            title="Weak Passwords"
            description="These passwords are too short or simple. Consider updating them."
            items={analysis.weak}
            showPasswords={showPasswords}
            toggleShowPassword={toggleShowPassword}
            copiedField={copiedField}
            handleCopy={handleCopy}
          />
        )}
        {analysis.duplicates.length > 0 && (
          <IssueSection
            title="Duplicate Passwords"
            description="These passwords are used on multiple sites. Each site should have a unique password."
            items={analysis.duplicates}
            showPasswords={showPasswords}
            toggleShowPassword={toggleShowPassword}
            copiedField={copiedField}
            handleCopy={handleCopy}
          />
        )}
        {analysis.old.length > 0 && (
          <IssueSection
            title="Old Passwords"
            description="These passwords haven't been updated in over 6 months."
            items={analysis.old}
            showPasswords={showPasswords}
            toggleShowPassword={toggleShowPassword}
            copiedField={copiedField}
            handleCopy={handleCopy}
          />
        )}
      </div>
    </div>
  );
}

function IssueSection({
  title, description, items, showPasswords, toggleShowPassword, copiedField, handleCopy,
}: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
    >
      <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-500" />
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
          <p className="text-xs text-slate-500">{description}</p>
        </div>
      </div>
      <div className="divide-y divide-slate-50">
        {items.map((pwd: PasswordEntry) => (
          <div key={pwd.id} className="flex flex-wrap items-center gap-3 px-5 py-3">
            <div className="w-8 h-8 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-primary-700">{pwd.websiteName[0]}</span>
            </div>
            <div className="flex-1 min-w-[120px]">
              <p className="text-sm font-medium text-slate-900">{pwd.websiteName}</p>
              <p className="text-[10px] text-slate-400 truncate">{pwd.websiteUrl}</p>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <span className="text-xs font-mono text-slate-600 hidden sm:block">
                {showPasswords[pwd.id] ? pwd.password : '••••••••'}
              </span>
              <button onClick={() => toggleShowPassword(pwd.id)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary-600">
                {showPasswords[pwd.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
              <button onClick={() => handleCopy(pwd.password, `sec-${pwd.id}`)} className="p-2 hover:bg-slate-50 rounded-full text-slate-400 hover:text-primary-600">
                {copiedField === `sec-${pwd.id}` ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}