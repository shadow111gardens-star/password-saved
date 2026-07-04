import { useState, useCallback } from 'react';
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [darkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(15);

  const allCategories = [...CATEGORIES, ...customCategories];

  const handleGetStarted = useCallback(() => {
    setView('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLogout = useCallback(() => {
    setView('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  if (view === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
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
    />
  );
}
