import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Eye, EyeOff, Copy, Check, ExternalLink, Trash2 } from 'lucide-react';
import type { PasswordEntry } from '../../types';

interface FavoritesPageProps {
  passwords: PasswordEntry[];
  toggleFavorite: (id: string) => void;
  updatePassword: (id: string, entry: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
}

export default function FavoritesPage({ passwords, toggleFavorite, deletePassword }: FavoritesPageProps) {
  const favorites = passwords.filter((p) => p.favorite);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
          <Heart className="w-5 h-5 text-rose-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Favorites</h1>
          <p className="text-sm text-slate-500 mt-1">Your most important passwords.</p>
        </div>
      </div>

      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <Heart className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm text-slate-400">No favorites yet. Star a password to add it here.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((pwd, i) => (
            <motion.div
              key={pwd.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-700">{pwd.websiteName[0]}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{pwd.websiteName}</p>
                    <p className="text-xs text-slate-400">{pwd.websiteUrl}</p>
                  </div>
                </div>
                <button onClick={() => toggleFavorite(pwd.id)}>
                  <Heart className="w-4 h-5 fill-rose-500 text-rose-500" />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Username</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-700">{pwd.username}</span>
                    <button onClick={() => handleCopy(pwd.username, `fav-user-${pwd.id}`)} className="text-slate-400 hover:text-primary-600">
                      {copiedField === `fav-user-${pwd.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Password</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-700">{showPasswords[pwd.id] ? pwd.password : '••••••••'}</span>
                    <button onClick={() => toggleShowPassword(pwd.id)} className="text-slate-400 hover:text-primary-600">
                      {showPasswords[pwd.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button onClick={() => handleCopy(pwd.password, `fav-pass-${pwd.id}`)} className="text-slate-400 hover:text-primary-600">
                      {copiedField === `fav-pass-${pwd.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">{pwd.category}</span>
                <div className="flex gap-1">
                  <button onClick={() => window.open(`https://${pwd.websiteUrl}`, '_blank')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600">
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => deletePassword(pwd.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
