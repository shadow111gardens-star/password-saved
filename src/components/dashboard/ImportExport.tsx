import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Upload, Download, FileSpreadsheet, FileJson, Check } from 'lucide-react';
import type { PasswordEntry } from '../../types';

interface ImportExportProps {
  passwords: PasswordEntry[];
  addPassword: (entry: PasswordEntry) => void;
}

export default function ImportExport({ passwords, addPassword }: ImportExportProps) {
  const [imported, setImported] = useState(false);
  const [exported, setExported] = useState<string | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // --- Export Logic ---
  const handleExportCSV = () => {
    if (passwords.length === 0) return;
    const headers = ['Website Name', 'Website URL', 'Username', 'Email', 'Password', 'Category', 'Tags', 'Notes'];
    const rows = passwords.map((p) => [
      p.websiteName, p.websiteUrl, p.username, p.email, p.password, p.category, p.tags.join(';'), p.notes,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vaultpass-export.csv';
    a.click();
    setExported('CSV');
    setTimeout(() => setExported(null), 2000);
  };

  const handleExportJSON = () => {
    if (passwords.length === 0) return;
    const blob = new Blob([JSON.stringify(passwords, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'vaultpass-export.json';
    a.click();
    setExported('JSON');
    setTimeout(() => setExported(null), 2000);
  };

  // --- Import Logic ---
  const parseCSV = (text: string): Partial<PasswordEntry>[] => {
    const lines = text.trim().split('\n');
    if (lines.length < 2) return [];
    const result: Partial<PasswordEntry>[] = [];
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.replace(/^"|"$/g, '').trim());
      result.push({
        websiteName: values[0] || '', websiteUrl: values[1] || '', username: values[2] || '',
        email: values[3] || '', password: values[4] || '', category: values[5] || 'Other',
        tags: values[6] ? values[6].split(';').filter(Boolean) : [], notes: values[7] || '',
      });
    }
    return result;
  };

  const handleFileImport = (file: File, type: 'csv' | 'json') => {
    setImportError(null);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        let entries: Partial<PasswordEntry>[] = [];
        if (type === 'json') {
          const parsed = JSON.parse(text);
          entries = Array.isArray(parsed) ? parsed : [parsed];
        } else {
          entries = parseCSV(text);
        }
        entries.forEach((entry) => {
          addPassword({
            id: Math.random().toString(36).substr(2, 9),
            websiteName: entry.websiteName || 'Unknown',
            websiteUrl: entry.websiteUrl || '',
            username: entry.username || '',
            email: entry.email || '',
            password: entry.password || '',
            category: entry.category || 'Other',
            tags: entry.tags || [],
            notes: entry.notes || '',
            favorite: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            customFields: [],
          } as PasswordEntry);
        });
        setImported(true);
        setTimeout(() => setImported(false), 2000);
      } catch (err) {
        setImportError('Failed to parse file. Please check the format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="p-4 sm:p-8 max-w-4xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-cyan-50 flex items-center justify-center flex-shrink-0">
          <ArrowLeftRight className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Import / Export</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Move your passwords in and out of VaultPass.</p>
        </div>
      </div>

      {importError && (
        <div className="mb-6 p-3 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
          {importError}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <Download className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Export Passwords</h3>
              <p className="text-[10px] sm:text-xs text-slate-500">{passwords.length} passwords available</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleExportCSV}
              disabled={passwords.length === 0}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all text-left disabled:opacity-50"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Export as CSV</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">Compatible with Excel</p>
              </div>
              {exported === 'CSV' && <Check className="w-5 h-5 text-emerald-500" />}
            </button>
            
            <button
              onClick={handleExportJSON}
              disabled={passwords.length === 0}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all text-left disabled:opacity-50"
            >
              <FileJson className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Export as JSON</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">Full data export</p>
              </div>
              {exported === 'JSON' && <Check className="w-5 h-5 text-emerald-500" />}
            </button>
          </div>
        </motion.div>

        {/* Import Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center flex-shrink-0">
              <Upload className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">Import Passwords</h3>
              <p className="text-[10px] sm:text-xs text-slate-500">From other managers</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <input ref={csvInputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileImport(file, 'csv'); }} />
            <button
              onClick={() => csvInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all text-left"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Import from CSV</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">CSV file import</p>
              </div>
              {imported && <Check className="w-5 h-5 text-emerald-500" />}
            </button>
            
            <input ref={jsonInputRef} type="file" accept=".json" className="hidden" onChange={(e) => { const file = e.target.files?.[0]; if (file) handleFileImport(file, 'json'); }} />
            <button
              onClick={() => jsonInputRef.current?.click()}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-all text-left"
            >
              <FileJson className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">Import from JSON</p>
                <p className="text-[10px] sm:text-xs text-slate-500 truncate">JSON file import</p>
              </div>
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}