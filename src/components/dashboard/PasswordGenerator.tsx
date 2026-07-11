import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Check, RefreshCw, Shield } from 'lucide-react';

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [uppercase, setUppercase] = useState(true);
  const [lowercase, setLowercase] = useState(true);
  const [numbers, setNumbers] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);
  const [isRotating, setIsRotating] = useState(false);

  const generate = useCallback(() => {
    if (!uppercase && !lowercase && !numbers && !symbols) {
      setLowercase(true);
      return;
    }
    const chars = {
      uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      lowercase: 'abcdefghijklmnopqrstuvwxyz',
      numbers: '0123456789',
      symbols: '!@#$%^&*()_+-=[]{}|;:,.<>?',
    };
    let pool = '';
    if (uppercase) pool += chars.uppercase;
    if (lowercase) pool += chars.lowercase;
    if (numbers) pool += chars.numbers;
    if (symbols) pool += chars.symbols;
    let result = '';
    for (let i = 0; i < length; i++) {
      result += pool[Math.floor(Math.random() * pool.length)];
    }
    setPassword(result);
  }, [length, uppercase, lowercase, numbers, symbols]);

  useEffect(() => { generate(); }, [generate]);

  const handleGenerateClick = () => {
    setIsRotating(true);
    generate();
    setTimeout(() => setIsRotating(false), 500);
  };

  const getStrength = () => {
    if (length < 8) return 1;
    let score = 0;
    if (length >= 12) score += 1;
    if (length >= 16) score += 1;
    if (uppercase) score += 1;
    if (lowercase) score += 1;
    if (numbers) score += 1;
    if (symbols) score += 1;
    return score;
  };

  const strength = getStrength();
  const strengthLabel = strength <= 2 ? 'Weak' : strength <= 4 ? 'Fair' : strength <= 5 ? 'Good' : 'Strong';
  const strengthColor = strength <= 2 ? 'bg-red-500' : strength <= 4 ? 'bg-amber-500' : strength <= 5 ? 'bg-blue-500' : 'bg-emerald-500';

  const handleCopy = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center flex-shrink-0">
          <Wand2 className="w-5 h-5 text-violet-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Password Generator</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Create strong, secure passwords instantly.</p>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
        
        {/* Generated Password */}
        <div className="relative mb-6">
          <div className="flex items-center gap-3 p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200">
            <code className="flex-1 text-sm sm:text-lg font-mono text-slate-900 break-all">{password}</code>
            <button onClick={handleCopy} className="p-2 rounded-lg hover:bg-white text-slate-400 hover:text-blue-600 transition-colors">
              {copied ? <Check className="w-5 h-5 text-emerald-500" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Strength Meter */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Strength</span>
            <span className={`text-sm font-semibold ${strengthColor.replace('bg-', 'text-')}`}>{strengthLabel}</span>
          </div>
          <div className="flex gap-1.5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className={`flex-1 h-2 rounded-full ${i <= strength ? strengthColor : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>

        {/* Length Slider */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-700">Length</span>
            <span className="text-sm font-bold text-slate-900">{length}</span>
          </div>
          <input type="range" min={4} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full h-2 rounded-full bg-slate-100 appearance-none cursor-pointer accent-blue-600" />
        </div>

        {/* Options - મોબાઈલમાં ૧ કોલમ, ટેબ્લેટમાં ૨ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {[
            { label: 'Uppercase (A-Z)', checked: uppercase, onChange: setUppercase },
            { label: 'Lowercase (a-z)', checked: lowercase, onChange: setLowercase },
            { label: 'Numbers (0-9)', checked: numbers, onChange: setNumbers },
            { label: 'Symbols (!@#)', checked: symbols, onChange: setSymbols },
          ].map((opt) => (
            <label key={opt.label} className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 hover:border-blue-200 cursor-pointer">
              <input type="checkbox" checked={opt.checked} onChange={(e) => opt.onChange(e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-blue-600" />
              <span className="text-sm text-slate-700">{opt.label}</span>
            </label>
          ))}
        </div>

        <button onClick={handleGenerateClick} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-xl">
          <RefreshCw className={`w-4 h-4 ${isRotating ? 'animate-spin' : ''}`} />
          Generate Again
        </button>
      </motion.div>

      {/* Tips */}
      <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-3">
        <Shield className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-xs text-amber-700">Use at least 16 characters with a mix of types for maximum security.</p>
      </div>
    </div>
  );
}