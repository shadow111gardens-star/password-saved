import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StickyNote, Search, Pencil, Save } from 'lucide-react';
import type { PasswordEntry } from '../../types';

interface NotesPageProps {
  passwords: PasswordEntry[];
  updatePassword: (id: string, entry: Partial<PasswordEntry>) => void;
}

export default function NotesPage({ passwords, updatePassword }: NotesPageProps) {
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNote, setEditNote] = useState('');

  const filtered = passwords.filter(
    (p) =>
      (p.websiteName || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.notes || '').toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (pwd: PasswordEntry) => {
    setEditingId(pwd.id);
    setEditNote(pwd.notes || '');
  };

  const saveEdit = (id: string) => {
    updatePassword(id, { notes: editNote });
    setEditingId(null);
    setEditNote('');
  };

  return (
    <div className="p-4 sm:p-8 w-full">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
          <StickyNote className="w-5 h-5 text-orange-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Notes</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Secure notes attached to your passwords.</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search notes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence>
          {filtered.map((pwd, i) => (
            <motion.div
              key={pwd.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: i * 0.03 }}
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all flex flex-col"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-lg bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-bold text-primary-700">
                    {pwd.websiteName ? pwd.websiteName[0].toUpperCase() : 'W'}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{pwd.websiteName || 'Untitled'}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 truncate">{pwd.websiteUrl}</p>
                </div>
                {editingId === pwd.id ? (
                  <button
                    onClick={() => saveEdit(pwd.id)}
                    className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    onClick={() => startEdit(pwd)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-primary-600"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                )}
              </div>

              {editingId === pwd.id ? (
                <textarea
                  value={editNote}
                  onChange={(e) => setEditNote(e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
                  autoFocus
                />
              ) : (
                <div className="bg-slate-50 rounded-xl p-3 min-h-[80px] mb-3">
                  <p className="text-sm text-slate-700 whitespace-pre-wrap break-words">
                    {pwd.notes && pwd.notes.trim() ? pwd.notes : <span className="text-slate-400 italic">No notes added yet.</span>}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mt-auto">
                <span className="px-2 py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-slate-100 text-slate-600 truncate">
                  {pwd.category}
                </span>
                <span className="text-[10px] sm:text-xs text-slate-400 truncate">
                  Updated {pwd.updatedAt ? new Date(pwd.updatedAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
          <StickyNote className="w-12 h-12 text-slate-200 mx-auto mb-4" />
          <p className="text-sm text-slate-400">No passwords or notes found.</p>
        </div>
      )}
    </div>
  );
}