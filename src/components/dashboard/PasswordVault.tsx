import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Plus,
  Grid3X3,
  List,
  Heart,
  Eye,
  EyeOff,
  Copy,
  ExternalLink,
  Pencil,
  Trash2,
  X,
  Check,
} from 'lucide-react';
import type { PasswordEntry } from '../../types';

// 🚀 Dashboard માંથી આવતા Props ના ટાઇપ્સ અહીં ડિફાઇન કર્યા
interface PasswordVaultProps {
  passwords: PasswordEntry[];
  addPassword: (entry: Partial<PasswordEntry>) => Promise<void> | void;
  updatePassword: (id: string, entry: Partial<PasswordEntry>) => Promise<void> | void;
  deletePassword: (id: string) => Promise<void> | void;
  toggleFavorite: (id: string) => Promise<void> | void;
  allCategories: string[];
  addCustomCategory: (category: string) => void;
  isPro?: boolean;
  passwordCount?: number;
}

export default function PasswordVault({
  passwords,
  addPassword,
  updatePassword,
  deletePassword,
  toggleFavorite,
  allCategories,
  addCustomCategory,
  isPro = false,
}: PasswordVaultProps) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'date' | 'category'>('date');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPassword, setSelectedPassword] = useState<PasswordEntry | null>(null);
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({});
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [editingPassword, setEditingPassword] = useState<PasswordEntry | null>(null);

  // સર્ચ અને ફિલ્ટર લોજિક (હવે આ સીધું Props માંથી આવતા passwords પર કામ કરશે)
  const filtered = useMemo(() => {
    let result = [...passwords];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.websiteName?.toLowerCase().includes(q) ||
          p.websiteUrl?.toLowerCase().includes(q) ||
          p.username?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }
    if (filterCategory !== 'All') {
      result = result.filter((p) => p.category === filterCategory);
    }
    result.sort((a, b) => {
      if (sortBy === 'name') return a.websiteName.localeCompare(b.websiteName);
      if (sortBy === 'category') return a.category.localeCompare(b.category);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return result;
  }, [passwords, search, filterCategory, sortBy]);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const toggleShowPassword = (id: string) => {
    setShowPasswords((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // 🚀 લિમિટ ચેક કરવાનું લોજિક (જો PRO ન હોય અને 5 કે તેથી વધુ પાસવર્ડ હોય તો લિમિટ લાગશે)
  const isLimitReached = !isPro && passwords.length >= 5;

 return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Password Vault</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all your stored credentials.</p>
        </div>
        
        {/* ⚡ Free vs PRO કન્ડિશનલ એડ બટન */}
        <button
          disabled={isLimitReached}
          onClick={() => { setEditingPassword(null); setShowAddModal(true); }}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-sm ${
            isLimitReached 
              ? 'bg-slate-300 dark:bg-slate-700 text-slate-400 cursor-not-allowed opacity-60' 
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <Plus className="w-4 h-4" />
          {isLimitReached ? "Limit Reached (PRO)" : "Add Password"}
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search passwords..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          {allCategories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="date">Sort by Date</option>
          <option value="name">Sort by Name</option>
          <option value="category">Sort by Category</option>
        </select>
        <div className="flex rounded-xl border border-slate-200 overflow-hidden">
          <button
            onClick={() => setViewMode('list')}
            className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-400'}`}
          >
            <List className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'bg-white text-slate-400'}`}
          >
            <Grid3X3 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Password List / Grid View */}
      {viewMode === 'list' ? (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Website</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Username</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Password</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Category</th>
                <th className="text-left text-xs font-semibold text-slate-500 uppercase px-4 py-3">Updated</th>
                <th className="text-right text-xs font-semibold text-slate-500 uppercase px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((pwd) => (
                <tr key={pwd.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button onClick={() => toggleFavorite(pwd.id)}>
                        <Heart className={`w-4 h-4 ${pwd.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
                      </button>
                      <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-blue-700">{pwd.websiteName ? pwd.websiteName[0].toUpperCase() : 'W'}</span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900">{pwd.websiteName}</p>
                        <p className="text-xs text-slate-400">{pwd.websiteUrl}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700">{pwd.username}</span>
                      <button onClick={() => handleCopy(pwd.username, `user-${pwd.id}`)} className="text-slate-400 hover:text-blue-600">
                        {copiedField === `user-${pwd.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-700 font-mono">
                        {showPasswords[pwd.id] ? pwd.password : '•'.repeat(Math.min(pwd.password?.length || 8, 12))}
                      </span>
                      <button onClick={() => toggleShowPassword(pwd.id)} className="text-slate-400 hover:text-blue-600">
                        {showPasswords[pwd.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => handleCopy(pwd.password, `pass-${pwd.id}`)} className="text-slate-400 hover:text-blue-600">
                        {copiedField === `pass-${pwd.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">{pwd.category}</span>
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-500">{new Date(pwd.updatedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button onClick={() => setSelectedPassword(pwd)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button onClick={() => { setEditingPassword(pwd); setShowAddModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deletePassword(pwd.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => window.open(`https://${pwd.websiteUrl}`, '_blank')} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600">
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-slate-400">No passwords found.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((pwd) => (
            <motion.div
              key={pwd.id}
              layout
              className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-blue-200 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-700">{pwd.websiteName ? pwd.websiteName[0].toUpperCase() : 'W'}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{pwd.websiteName}</p>
                    <p className="text-xs text-slate-400">{pwd.websiteUrl}</p>
                  </div>
                </div>
                <button onClick={() => toggleFavorite(pwd.id)}>
                  <Heart className={`w-4 h-4 ${pwd.favorite ? 'fill-rose-500 text-rose-500' : 'text-slate-300'}`} />
                </button>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Username</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs text-slate-700">{pwd.username}</span>
                    <button onClick={() => handleCopy(pwd.username, `user-${pwd.id}`)} className="text-slate-400 hover:text-blue-600">
                      {copiedField === `user-${pwd.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">Password</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-mono text-slate-700">
                      {showPasswords[pwd.id] ? pwd.password : '••••••••'}
                    </span>
                    <button onClick={() => toggleShowPassword(pwd.id)} className="text-slate-400 hover:text-blue-600">
                      {showPasswords[pwd.id] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </button>
                    <button onClick={() => handleCopy(pwd.password, `pass-${pwd.id}`)} className="text-slate-400 hover:text-blue-600">
                      {copiedField === `pass-${pwd.id}` ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 rounded-lg text-xs font-medium bg-slate-100 text-slate-600">{pwd.category}</span>
                <div className="flex gap-1">
                  <button onClick={() => setSelectedPassword(pwd)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600">
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={() => { setEditingPassword(pwd); setShowAddModal(true); }} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-blue-600">
                    <Pencil className="w-3.5 h-3.5" />
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

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddEditModal
            editing={editingPassword}
            isLimitReached={isLimitReached}
            onClose={() => { setShowAddModal(false); setEditingPassword(null); }}
            allCategories={allCategories}
            addCustomCategory={addCustomCategory}
            onSave={(entry) => {
              if (editingPassword) {
                updatePassword(editingPassword.id, entry);
              } else {
                addPassword(entry);
              }
              setShowAddModal(false);
              setEditingPassword(null);
            }}
          />
        )}
      </AnimatePresence>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedPassword && (
          <PasswordDetailsModal
            password={selectedPassword}
            onClose={() => setSelectedPassword(null)}
            onEdit={() => { setEditingPassword(selectedPassword); setSelectedPassword(null); setShowAddModal(true); }}
            onDelete={() => { deletePassword(selectedPassword.id); setSelectedPassword(null); }}
            onCopy={handleCopy}
            copiedField={copiedField}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   Add/Edit Modal કમ્પોનન્ટ 
   ========================================== */
function AddEditModal({
  editing,
  isLimitReached,
  onClose,
  onSave,
  allCategories,
  addCustomCategory,
}: {
  editing: PasswordEntry | null;
  isLimitReached: boolean;
  onClose: () => void;
  onSave: (entry: Partial<PasswordEntry>) => void;
  allCategories: string[];
  addCustomCategory: (category: string) => void;
}) {
  const [form, setForm] = useState<Partial<PasswordEntry>>(
    editing || {
      websiteName: '',
      websiteUrl: '',
      username: '',
      email: '',
      password: '',
      category: 'Personal',
      tags: [],
      notes: '',
      favorite: false,
      customFields: [],
    }
  );
  const [tagInput, setTagInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  const addTag = () => {
    if (tagInput.trim() && !form.tags?.includes(tagInput.trim())) {
      setForm((prev) => ({ ...prev, tags: [...(prev.tags || []), tagInput.trim()] }));
      setTagInput('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <h2 className="text-lg font-semibold text-slate-900">
            {editing ? 'Edit Password' : 'Add Password'}
          </h2>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Website Name *</label>
              <input
                required
                value={form.websiteName || ''}
                onChange={(e) => setForm({ ...form, websiteName: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Website URL *</label>
              <input
                required
                value={form.websiteUrl || ''}
                onChange={(e) => setForm({ ...form, websiteUrl: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Username</label>
              <input
                value={form.username || ''}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email"
                value={form.email || ''}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Password</label>
            <input
              type="text"
              value={form.password || ''}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Category</label>
              <select
                value={form.category || 'Personal'}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {allCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <div className="mt-2 flex gap-2">
                <input
                  type="text"
                  placeholder="Or type new category..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = (e.target as HTMLInputElement).value.trim();
                      if (val) {
                        addCustomCategory(val);
                        setForm({ ...form, category: val });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                  className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer mb-2">
                <input
                  type="checkbox"
                  checked={form.favorite || false}
                  onChange={(e) => setForm({ ...form, favorite: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-slate-700">Add to Favorites</span>
              </label>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Tags</label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {form.tags?.map((tag) => (
                <span key={tag} className="px-2 py-1 rounded-lg text-xs bg-blue-50 text-blue-700 flex items-center gap-1">
                  {tag}
                  <button type="button" onClick={() => setForm({ ...form, tags: form.tags?.filter((t) => t !== tag) })}>
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="Add tag..."
                className="flex-1 px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button type="button" onClick={addTag} className="px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100">
                Add
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1.5">Notes</label>
            <textarea
              value={form.notes || ''}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>
          
          {/* ⚡ Free vs PRO સેવ બટન લોજિક */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!editing && isLimitReached}
              className={`flex-1 py-2.5 text-sm font-medium text-white rounded-xl transition-all ${
                (!editing && isLimitReached)
                  ? 'bg-slate-300 text-slate-400 cursor-not-allowed opacity-60'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {editing ? 'Update Password' : 'Save Password'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* ==========================================
   Password Details Modal કમ્પોનન્ટ 
   ========================================== */
function PasswordDetailsModal({
  password,
  onClose,
  onEdit,
  onDelete,
  onCopy,
  copiedField,
}: {
  password: PasswordEntry;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onCopy: (text: string, field: string) => void;
  copiedField: string | null;
}) {
  const [showPass, setShowPass] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center">
                <span className="text-xl font-bold text-blue-700">{password.websiteName ? password.websiteName[0].toUpperCase() : 'W'}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{password.websiteName}</h2>
                <p className="text-sm text-slate-500">{password.websiteUrl}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <DetailRow label="Username" value={password.username} onCopy={() => onCopy(password.username, `detail-user-${password.id}`)} copied={copiedField === `detail-user-${password.id}`} />
            <DetailRow label="Email" value={password.email} onCopy={() => onCopy(password.email, `detail-email-${password.id}`)} copied={copiedField === `detail-email-${password.id}`} />
            <div className="flex items-center justify-between py-2 border-b border-slate-100">
              <span className="text-xs font-medium text-slate-500 uppercase">Password</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-mono text-slate-700">{showPass ? password.password : '•'.repeat(12)}</span>
                <button onClick={() => setShowPass(!showPass)} className="text-slate-400 hover:text-blue-600">
                  {showPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => onCopy(password.password, `detail-pass-${password.id}`)} className="text-slate-400 hover:text-blue-600">
                  {copiedField === `detail-pass-${password.id}` ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
            <DetailRow label="Category" value={password.category} />
            <DetailRow label="Tags" value={password.tags?.join(', ') || '-'} />
            {password.notes && <DetailRow label="Notes" value={password.notes} />}
            <DetailRow label="Created" value={password.createdAt ? new Date(password.createdAt).toLocaleDateString() : '-'} />
            <DetailRow label="Updated" value={password.updatedAt ? new Date(password.updatedAt).toLocaleDateString() : '-'} />
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={onEdit} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-xl hover:bg-blue-100">
              <Pencil className="w-4 h-4" /> Edit
            </button>
            <button onClick={() => window.open(`https://${password.websiteUrl}`, '_blank')} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <ExternalLink className="w-4 h-4" /> Open
            </button>
            <button onClick={onDelete} className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-red-700 bg-red-50 rounded-xl hover:bg-red-100">
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DetailRow({ label, value, onCopy, copied }: { label: string; value: string; onCopy?: () => void; copied?: boolean }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-100">
      <span className="text-xs font-medium text-slate-500 uppercase">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-700">{value || '-'}</span>
        {onCopy && value && (
          <button onClick={onCopy} className="text-slate-400 hover:text-blue-600">
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        )}
      </div>
    </div>
  );
}