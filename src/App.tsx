import { useState, useCallback, useEffect } from 'react';
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';

// Firebase માંથી જરૂરી ફંક્શન્સ અને કન્ફિગરેશન ઇમ્પોર્ટ કરો
import { signInWithGoogle, auth, db } from './firebase'; 
import { signOut, User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, DocumentSnapshot, deleteDoc } from 'firebase/firestore';

export default function App() {
  const [view, setView] = useState<ViewType>('landing');
  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [darkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(15);
  
  // ગૂગલ યુઝરનો ઓથ ડેટા
  const [user, setUser] = useState<User | null>(null);
  // ડેટાબેઝમાંથી આવતો યુઝરનો લાઈવ પ્રોફાઈલ (role) ડેટા
  const [userProfile, setUserProfile] = useState<any>(null);
  // લોડિંગ સ્ટેટ
  const [loading, setLoading] = useState(true);

  const allCategories = [...CATEGORIES, ...customCategories];

  // 🚀 ૧. ઓથ સેશન લિસનર
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setView('dashboard');
      } else {
        setUser(null);
        setUserProfile(null);
        setView('landing');
      }
      setLoading(false);
    });

    return () => unsubscribeAuth();
  }, []);

  // 🚀 ૨. રિયલ-ટાઇમ પાસવર્ડ ડેટા ફાયરબેઝમાંથી મેળવવા માટે
  useEffect(() => {
    if (!user) {
      setPasswords([]); 
      return;
    }

    const userPasswordsRef = collection(db, 'users', user.uid, 'passwords');
    const unsubscribeSnapshot = onSnapshot(userPasswordsRef, (snapshot) => {
      const fetchedPasswords = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      })) as PasswordEntry[];
      
      setPasswords(fetchedPasswords);
    }, (error: Error) => {
      console.error("Firestore snapshot error:", error);
    });

    return () => unsubscribeSnapshot();
  }, [user]);

  // 🚀 ૩. યુઝરનો પ્રોફાઈલ ડેટા (role) ફાયરબેઝમાંથી લાઈવ મેળવવા માટે
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        setUserProfile(docSnap.data()); 
      }
    }, (error: Error) => {
      console.error("User profile snapshot error:", error);
    });

    return () => unsubscribeUser();
  }, [user]);

  // ગૂગલ લોગીન ફંક્શન
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

  // લોગઆઉટ ફંક્શન
  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth); 
      setUser(null);
      setUserProfile(null);
      setView('landing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Logout Error:", error);
    }
  }, []);

  // પાસવર્ડ એડ કરવાનું ફંક્શન
  const addPassword = useCallback(async (entry: Partial<PasswordEntry>) => {
    try {
      if (!user) return;
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
    } catch (error) {
      console.error("Error saving password:", error);
    }
  }, [user]);

  const updatePassword = useCallback((id: string, entry: Partial<PasswordEntry>) => {
    setPasswords((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...entry, updatedAt: new Date().toISOString() } : p))
    );
  }, []);

  
    const deletePassword = useCallback(async (id: string) => {
  try {
    if (!user) return;
    
    // ફાયરબેઝમાંથી તે પાસવર્ડ ડોક્યુમેન્ટ ડિલીટ કરો
    const passwordDocRef = doc(db, 'users', user.uid, 'passwords', id);
    await deleteDoc(passwordDocRef);
    
    // લોકલ સ્ટેટમાંથી પણ અપડેટ કરો (જેથી સ્ક્રીન પરથી તરત ગાયબ થઈ જાય)
    setPasswords((prev) => prev.filter((p) => p.id !== id));
    console.log("Password deleted successfully from Firebase!");
  } catch (error) {
    console.error("Error deleting password:", error);
  }
}, [user]);
    

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
      currentUser={userProfile} // 👈 'userProfile' પાસ કર્યું જેથી લાઈવ અપડેટ થાય!
    />
  );
}