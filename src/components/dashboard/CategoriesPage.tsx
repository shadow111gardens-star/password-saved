import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen, Briefcase, CreditCard, ShoppingBag, Code, Server,
  Users, MessageCircle, Gamepad2, Lock, Plus, Trash2, X, Star,
} from 'lucide-react';
import type { PasswordEntry, ViewType } from '../../types';
import { CATEGORIES } from '../../types';

interface CategoriesPageProps {
  passwords: PasswordEntry[];
  setView: (v: ViewType) => void;
  allCategories: string[];
  customCategories: string[];
  addCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
}

const categoryConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  Personal: { icon: FolderOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
  Work: { icon: Briefcase, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  Finance: { icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  Shopping: { icon: ShoppingBag, color: 'text-amber-600', bg: 'bg-amber-50' },
  Development: { icon: Code, color: 'text-slate-600', bg: 'bg-slate-100' },
  Hosting: { icon: Server, color: 'text-cyan-600', bg: 'bg-cyan-50' },
  Client: { icon: Users, color: 'text-violet-600', bg: 'bg-violet-50' },
  Social: { icon: MessageCircle, color: 'text-sky-600', bg: 'bg-sky-50' },
  Entertainment: { icon: Gamepad2, color: 'text-rose-600', bg: 'bg-rose-50' },
  Other: { icon: Lock, color: 'text-slate-500', bg: 'bg-slate-50' },
};

export default function CategoriesPage({
  passwords, setView, allCategories, customCategories, addCustomCategory, removeCustomCategory,
}: CategoriesPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCategory, setNewCategory] = useState('');

  const categoryCounts = passwords.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const builtInCategories = allCategories.filter((c) => CATEGORIES.includes(c));
  const customCats = allCategories.filter((c) => customCategories.includes(c));

  const handleAddCategory = () => {
    const trimmed = newCategory.trim();
    if (trimmed) {
      addCustomCategory(trimmed);
      setNewCategory('');
      setShowAddForm(false);
    }
  };

  const renderCategoryCard = (name: string, count: number, i: number, isCustom: boolean) => {
    const config = categoryConfig[name] || { icon: FolderOpen, color: 'text-slate-600', bg: 'bg-slate-100' };
    const Icon = config.icon;
    return (
      <motion.div
        key={name}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.05 }}
        className="relative group"
      >
        <button
          onClick={() => setView('vault')}
          className="w-full text-left p-5 rounded-2xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-md transition-all"
        >
          <div className="flex items-start justify-between">
            <div className={`w-11 h-11 rounded-xl ${config.bg} flex items-center justify-center mb-3`}>
              <Icon className={`w-5 h-5 ${config.color}`} />
            </div>
            {isCustom && (
              <button
                onClick={(e) => { e.stopPropagation(); removeCustomCategory(name); }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <p className="text-lg font-bold text-slate-900">{count}</p>
          <div className="flex items-center gap-1.5">
            <p className="text-sm text-slate-500 truncate">{name}</p>
            {isCustom && (
              <span className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-50 text-primary-600">Custom</span>
            )}
          </div>
        </button>
      </motion.div>
    );
  };

  return (
    <div className="p-4 sm:p-8 w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
            <FolderOpen className="w-5 h-5 text-violet-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Categories</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">Organize your passwords by category.</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-3 sm:p-4 rounded-2xl bg-white border border-slate-200 flex flex-col sm:flex-row items-center gap-3"
        >
          <input
            type="text"
            placeholder="Enter category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
            className="w-full sm:flex-1 px-4 py-2.5 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
            autoFocus
          />
          <div className="flex w-full sm:w-auto gap-2">
            <button
              onClick={handleAddCategory}
              className="flex-1 sm:flex-none px-6 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
            >
              Add
            </button>
            <button
              onClick={() => { setShowAddForm(false); setNewCategory(''); }}
              className="p-2.5 rounded-xl hover:bg-slate-100 text-slate-400"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}

      <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
        <Star className="w-4 h-4 text-amber-500" />
        Built-in Categories
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {builtInCategories.map((name, i) =>
          renderCategoryCard(name, categoryCounts[name] || 0, i, false)
        )}
      </div>

      {customCats.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
            <Plus className="w-4 h-4 text-primary-500" />
            Custom Categories
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {customCats.map((name, i) =>
              renderCategoryCard(name, categoryCounts[name] || 0, i, true)
            )}
          </div>
        </>
      )}
    </div>
  );
}