import { useState, useCallback } from 'react';
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';

// Firebase માંથી જરૂરી ફંક્શન્સ અને ઓથોરિટી ઇમ્પોર્ટ કરો
import { signInWithGoogle, auth } from './firebase'; 
import { signOut, User } from 'firebase/auth';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [darkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(15);
  
  // ગૂગલ યુઝરનો ડેટા સ્ટોર કરવા માટે સ્ટેટ
  const [user, setUser] = useState<User | null>(null);

  const allCategories = [...CATEGORIES, ...customCategories];

  // ગૂગલ લોગીન હેન્ડલ કરવા માટેનું નવું અને સાચું ફંક્શન
const handleGoogleLogin = useCallback(async () => {
  try {
    // 1. પહેલા Firebase નું પોપ-અપ ઓપન થશે અને પ્રોસેસ પૂરી થવાની રાહ જોશે
    const loggedInUser = await signInWithGoogle();
    
    // 2. જો યુઝર ગૂગલ એકાઉન્ટ સિલેક્ટ કરીને સક્સેસફુલ લોગીન કરશે, તો જ અંદર જશે
    if (loggedInUser) {
      setUser(loggedInUser);
      setView('dashboard'); // હવે લોગીન કન્ફર્મ થયા પછી જ ડેશબોર્ડ વ્યુ સેટ થશે
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // જો યુઝર પોપ-અપ બંધ કરી દે અથવા લોગીન કેન્સલ કરે
      console.log("Login cancelled or failed.");
    }
  } catch (error) {
    console.error("Google Auth Error in App.tsx:", error);
  }
}, []);

  // લોગઆઉટ હેન્ડલ કરવા માટેનું ફંક્શન (Firebase સાઇન-આઉટ સાથે)
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth); // Firebase માંથી લોગઆઉટ થશે
      setUser(null);
      setView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, []);

  const addPassword = useCallback((entry: PasswordEntry) => {
    setPasswords((prev) => [entry, ...prev]);
  }, []);

  const updatePassword = useCallback((id: string, entry: Partial<PasswordEntry>) => {
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...entry, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  const deletePassword = useCallback((id: string) => {
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p))
    );
  }, []);

  const addCustomCategory = useCallback((category: string) => {
    setCustomCategories((prev) => {
      if (prev.includes(category) || CATEGORIES.includes(category)) return prev;
      return [...prev, category];
    });
  }, []);

  const removeCustomCategory = useCallback((category: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== category));
    setPasswords((prev) =>
      prev.map((p) => (p.category === category ? { ...p, category: 'Other' } : p))
    );
  }, []);

  // જો લેન્ડિંગ પેજ હોય તો ગૂગલ લોગીન ફંક્શન પાસ કરો
  if (view === 'landing') {
    return <LandingPage onGetStarted={handleGoogleLogin} />;
  }

  return (
    <Dashboard
      view={view}
      setView={setView}
      passwords={passwords}
      addPassword={addPassword}
      updatePassword={updatePassword}
      deletePassword={deletePassword}
      toggleFavorite={toggleFavorite}
      allCategories={allCategories}
      customCategories={customCategories}
      addCustomCategory={addCustomCategory}
      removeCustomCategory={removeCustomCategory}
      darkMode={darkMode}
      autoLock={autoLock}
      setAutoLock={setAutoLock}
      timeoutMinutes={timeoutMinutes}
      setTimeoutMinutes={setTimeoutMinutes}
      onLogout={handleLogout}
      currentUser={user} // જો ડેશબોર્ડમાં યુઝર પ્રોફાઇલ બતાવવી હોય તો આ કામ આવશે
    />
  );
}