import { useEffect, useRef, useState, useCallback } from 'react';
import type { User } from 'firebase/auth';
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
import { Lock, Unlock } from 'lucide-react';

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
  addPassword, // 🚀 App.tsx માંથી આવતું ફાયરબેઝ ફંક્શન
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
  const lastActivityRef = useRef(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const isLockedRef = useRef(false);

  // Keep ref in sync with state
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

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardHome passwords={passwords} setView={setView} />;
      case 'vault':
        return (
          <PasswordVault
            passwords={passwords}
            addPassword={addPassword} // 🚀 App.tsx નું ડાયરેક્ટ ફંક્શન અહીં કનેક્ટ કર્યું
            updatePassword={updatePassword}
            deletePassword={deletePassword}
            toggleFavorite={toggleFavorite}
            allCategories={allCategories}
            addCustomCategory={addCustomCategory}
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
            setView={setView}
            allCategories={allCategories}
            customCategories={customCategories}
            addCustomCategory={addCustomCategory}
            removeCustomCategory={removeCustomCategory}
          />
        );
      case 'generator':
        return <PasswordGenerator />;
      case 'security':
        return <SecurityCenter passwords={passwords} />;
      case 'importexport':
        return <ImportExport passwords={passwords} addPassword={addPassword} />;
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
        return <DashboardHome passwords={passwords} setView={setView} />;
    }
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? 'bg-slate-900' : 'bg-slate-50'}`}>
      <Sidebar
        currentView={view}
        setView={setView}
        darkMode={darkMode}
        onLogout={onLogout}
      />
      <main className="flex-1 overflow-auto relative">
        {renderContent()}

        {/* Auto Lock Overlay */}
        {isLocked && (
          <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4 text-center">
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