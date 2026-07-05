import { useState, useCallback, useEffect } from 'react';
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';

// Firebase માંથી જરૂરી ફંક્શન્સ અને કન્ફિગરેશન ઇમ્પોર્ટ કરો
import { signInWithGoogle, auth, db } from './firebase'; 
import { signOut, User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy, addDoc } from 'firebase/firestore';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [darkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(15);
  
  // ગૂગલ યુઝરનો ડેટા સ્ટોર કરવા માટે સ્ટેટ
  const [user, setUser] = useState<User | null>(null);
  // લોડિંગ સ્ટેટ જેથી રીફ્રેશ વખતે પેજ ઝબકારો ન મારે
  const [loading, setLoading] = useState(true);

  const allCategories = [...CATEGORIES, ...customCategories];

  // 🚀 ૧. રીફ્રેશ પ્રોબ્લેમ સોલ્વ કરવા માટે (Firebase Auth Session Listener)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // જો યુઝર ઓલરેડી લોગીન હશે, તો સીધો ડેશબોર્ડ વ્યુ સેટ થશે
        setUser(firebaseUser);
        setView('dashboard');
      } else {
        setUser(null);
        setView('landing');
      }
      setLoading(false); // ચેકિંગ પૂરું થયું
    });

    return () => unsubscribeAuth();
  }, []);

  // 🚀 ૨. રિયલ-ટાઇમ ડેટા ફાયરબેઝમાંથી મેળવવા માટે (Real-time Fetching)
  useEffect(() => {
    if (!user) {
      setPasswords([]); 
      return;
    }

    const userPasswordsRef = collection(db, 'users', user.uid, 'passwords');
    const q = query(userPasswordsRef, orderBy('createdAt', 'desc'));

    const unsubscribeSnapshot = onSnapshot(q, (snapshot) => {
      const fetchedPasswords = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as PasswordEntry[];
      
      setPasswords(fetchedPasswords);
    }, (error) => {
      console.error("Firestore snapshot error:", error);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  // ગૂગલ લોગીન હેન્ડલ કરવા માટેનું ફંક્શન
  const handleGoogleLogin = useCallback(async () => {
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setUser(loggedInUser);
        setView('dashboard'); 
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (error) {
      console.error("Google Auth Error in App.tsx:", error);
    }
  }, []);

  // લોગઆઉટ હેન્ડલ કરવા માટેનું ફંક્શન
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth); 
      setUser(null);
      setView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, []);

  // પાસવર્ડ ફાયરબેઝમાં સેવ કરવાનું ફંક્શન
  const addPassword = useCallback(async (entry: Partial<PasswordEntry>) => {
    try {
      if (!user) {
        console.error("યુઝર લોગિન નથી!");
        return;
      }

      const userPasswordsRef = collection(db, 'users', user.uid, 'passwords');
      
      await addDoc(userPasswordsRef, {
        websiteName: entry.websiteName || '',
        websiteUrl: entry.websiteUrl || '',
        username: entry.username || '',
        email: entry.email || '',
        password: entry.password || '',
        category: entry.category || 'Personal',
        tags: entry.tags || [],
        notes: entry.notes || '',
        favorite: entry.favorite || false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      console.log("Password saved to Firebase perfectly!");
    } catch (error) {
      console.error("Error saving password to Firebase:", error);
    }
  }, [user]);

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

  // જો ફાયરબેઝ સેશન ચેક કરી રહ્યું હોય ત્યાં સુધી સ્ક્રીન લોડિંગ બતાવવી
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
      </div>
    );
  }

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
      currentUser={user} 
    />
  );
}