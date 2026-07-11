// src/components/Dashboard.tsx
import { useEffect, useRef, useState, useCallback } from 'react';
import type { ViewType, PasswordEntry } from '../../types';
import Sidebar from './Sidebar';
import DashboardHome from './DashboardHome';
import PasswordVault from './PasswordVault';
import FavoritesPage from './FavoritesPage';
import CategoriesPage from './CategoriesPage';
import PasswordGenerator from './PasswordGenerator';
import SecurityCenter from './SecurityCenter';
import ImportExport from './ImportExport';
import NotesPage from './NotesPage';
import ProfilePage from './ProfilePage';
import SettingsPage from './SettingsPage';
import { Lock, Unlock, ShieldAlert, Menu, X, Shield } from 'lucide-react'; // 🚀 Menu, X, Shield ઉમેર્યા
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase';

interface DashboardProps {
  view: ViewType;
  setView: (v: ViewType) => void;
  currentUser: any;
  passwords: PasswordEntry[];
  addPassword: (entry: Partial<PasswordEntry>) => void; 
  updatePassword: (id: string, entry: Partial<PasswordEntry>) => void;
  deletePassword: (id: string) => void;
  toggleFavorite: (id: string) => void;
  allCategories: string[];
  customCategories: string[];
  addCustomCategory: (category: string) => void;
  removeCustomCategory: (category: string) => void;
  darkMode: boolean;
  autoLock: boolean;
  setAutoLock: (v: boolean) => void;
  timeoutMinutes: number;
  setTimeoutMinutes: (v: number) => void;
  onLogout: () => void;
}

export default function Dashboard({
  view,
  setView,
  currentUser,
  passwords,
  addPassword, 
  updatePassword,
  deletePassword,
  toggleFavorite,
  allCategories,
  customCategories,
  addCustomCategory,
  removeCustomCategory,
  darkMode,
  autoLock,
  setAutoLock,
  timeoutMinutes,
  setTimeoutMinutes,
  onLogout,
}: DashboardProps) {
  const [isLocked, setIsLocked] = useState(false);
  const [liveRole, setLiveRole] = useState('free'); 
  
  // 🚀 મોબાઈલ મેનુ ઓપન/ક્લોઝ કરવા માટેનું સ્ટેટ
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const unsubscribe = onSnapshot(doc(db, 'users', currentUser.uid), (docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setLiveRole(userData.role || 'free');
      }
    });

    return () => unsubscribe();
  }, [currentUser]);

  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLockedRef = useRef(false);

  const userRole = liveRole;
  const isPro = userRole === 'pro';
  const passwordCount = passwords.length;

  const handleAddPasswordWithLimit = (entry: Partial<PasswordEntry>) => {
    if (!isPro && passwordCount >= 5) {
      alert("⚠️ You have reached the free tier limit of 5 passwords. Please upgrade to PRO to add unlimited vault entries!");
      return;
    }
    addPassword(entry);
  };

  isLockedRef.current = isLocked;

  const resetActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
    if (isLockedRef.current) {
      setIsLocked(false);
    }
  }, []);

  useEffect(() => {
    if (!autoLock) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setIsLocked(false);
      return;
    }

    const checkInactivity = () => {
      const inactiveTime = Date.now() - lastActivityRef.current;
      const timeoutMs = timeoutMinutes * 60 * 1000;
      if (inactiveTime >= timeoutMs && !isLockedRef.current) {
        setIsLocked(true);
      }
    };

    timerRef.current = setInterval(checkInactivity, 1000);

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    events.forEach((e) => window.addEventListener(e, resetActivity));

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      events.forEach((e) => window.removeEventListener(e, resetActivity));
    };
  }, [autoLock, timeoutMinutes, resetActivity]);

  const handleUnlock = () => {
    lastActivityRef.current = Date.now();
    setIsLocked(false);
  };

  // 🚀 સેફ વ્યુ ચેન્જર જે મોબાઈલ મેનુને પણ આપોઆપ બંધ કરશે
  const handleViewChange = (v: ViewType) => {
    setView(v);
    setIsMobileMenuOpen(false);
  };

  const renderPremiumLock = (featureName: string) => {
    const descriptionText = featureName === "Password Generator"
      ? "Upgrade your account to unlock our premium, ultra-secure password generator and create highly advanced keys."
      : "Upgrade to PRO to safely backup, export, or migrate your entire vault data anytime you want.";

    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4 sm:p-6">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 dark:bg-amber-950/30 flex items-center justify-center mb-4 animate-bounce">
          <ShieldAlert className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold !text-black dark:!text-black mb-2">
          {featureName} is for PRO Users Only!
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 px-2">
          {descriptionText}
        </p>
        <a 
          href={`https://sandbox-api.polar.sh/v1/checkout-links/polar_cl_wGBEtq9aBZ3wt5qTo9fuYaobKtqJYlIb71uX846NQHs/redirect?customer_email=${encodeURIComponent(currentUser?.email || '')}&metadata[firebase_uid]=${currentUser?.uid}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="w-full sm:w-auto"
        >
          <button className="w-full sm:w-auto px-6 py-3 font-semibold text-white bg-gradient-to-r from-amber-500 to-orange-600 rounded-xl shadow-lg hover:opacity-90 transition-opacity">
            Upgrade to Pro ⭐
          </button>
        </a>
      </div>
    );
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardHome passwords={passwords} setView={handleViewChange} />;
      case 'vault':
        return (
          <PasswordVault
            passwords={passwords}
            addPassword={handleAddPasswordWithLimit}
            updatePassword={updatePassword}
            deletePassword={deletePassword}
            toggleFavorite={toggleFavorite}
            allCategories={allCategories}
            addCustomCategory={addCustomCategory}
            isPro={isPro}
            passwordCount={passwords.length}
          />
        );
      case 'favorites':
        return (
          <FavoritesPage
            passwords={passwords}
            toggleFavorite={toggleFavorite}
            updatePassword={updatePassword}
            deletePassword={deletePassword}
          />
        );
      case 'categories':
        return (
          <CategoriesPage
            passwords={passwords}
            setView={handleViewChange}
            allCategories={allCategories}
            customCategories={customCategories}
            addCustomCategory={addCustomCategory}
            removeCustomCategory={removeCustomCategory}
          />
        );
      case 'generator':
        return isPro ? <PasswordGenerator /> : renderPremiumLock("Password Generator");
      case 'security':
        return <SecurityCenter passwords={passwords} />;
      case 'importexport':
        return isPro ? <ImportExport passwords={passwords} addPassword={handleAddPasswordWithLimit} /> : renderPremiumLock("Import & Export");
      case 'notes':
        return <NotesPage passwords={passwords} updatePassword={updatePassword} />;
      case 'profile':
        return <ProfilePage currentUser={currentUser} />; 
      case 'settings':
        return (
          <SettingsPage
            autoLock={autoLock}
            setAutoLock={setAutoLock}
            timeoutMinutes={timeoutMinutes}
            setTimeoutMinutes={setTimeoutMinutes}
            onLogout={onLogout}
          />
        );
      default:
        return <DashboardHome passwords={passwords} setView={handleViewChange} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      
      {/* 1. 📱 મોબાઈલ માટે ટોપ બાર હેડર (ફક્ત મોબાઈલમાં જ દેખાશે) */}
      <div className="md:hidden flex items-center justify-between bg-white dark:bg-slate-900 px-4 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-primary-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <span className="font-semibold text-slate-900 dark:text-white text-base">VaultPass</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-1.5 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </div>

      {/* 2. 📱 મોબાઈલ સાઇડબાર ડ્રોવર (મેનુ ઓપન થાય ત્યારે જ દેખાશે) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* બેકગ્રાઉન્ડ ઓવરલે બ્લર */}
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
          
          {/* 🚀 ફિક્સ ૧: h-full અને overflow-hidden આપ્યું જેથી નીચેનો ડાર્ક ભાગ હટી જાય */}
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-slate-900 shadow-xl flex flex-col max-w-[80vw] h-full overflow-hidden">
            
            {/* 🚀 ફિક્સ ૨: ક્લોઝ (X) બટનને પ્રોપર ઉપર પૅડિંગ સાથે સેટ કર્યું */}
            <div className="flex items-center justify-end p-4 border-b border-slate-100 dark:border-slate-800">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 🚀 ફિક્સ ૩: મેનુ લિસ્ટને ડ્રોવરની અંદર જ રાખવા માટે સ્ક્રોલ આપ્યું */}
            <div className="flex-1 overflow-y-auto">
              <Sidebar currentView={view} setView={handleViewChange} darkMode={darkMode} onLogout={onLogout} />
            </div>
          </div>
        </div>
      )}

      {/* 3. 💻 ડેસ્કટોપ સાઇડબાર (મોટા સ્ક્રીન પર નોર્મલ દેખાશે) */}
      <aside className="hidden md:block w-64 shrink-0 sticky top-0 h-screen border-r border-slate-200 dark:border-slate-800">
        <Sidebar currentView={view} setView={setView} darkMode={darkMode} onLogout={onLogout} />
      </aside>

      {/* 4. 📦 મેઈન કન્ટેન્ટ એરિયા (વર્કિંગ સ્પેસ) */}
      <main className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8 relative">
        {renderContent()}
        
        {/* Auto Lock Overlay */}
        {isLocked && (
          <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Vault Locked</h2>
              <p className="text-sm text-slate-500 mb-6">
                Your vault was automatically locked due to inactivity.
              </p>
              <div className="space-y-3">
                <button
                  onClick={handleUnlock}
                  className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                >
                  <Unlock className="w-4 h-4" />
                  Unlock Vault
                </button>
                <button
                  onClick={onLogout}
                  className="w-full py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}