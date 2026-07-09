/*import { useState, useCallback, useEffect } from 'react';
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import { Routes, Route } from 'react-router-dom';
import Privacy from './components/Privacy';

// Firebase માંથી જરૂરી ફંક્શન્સ અને કન્ફિગરેશન ઇમ્પોર્ટ કરો
import { signInWithGoogle, auth, db } from './firebase'; 
import { signOut, User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, DocumentSnapshot, deleteDoc, updateDoc, getDoc } from 'firebase/firestore';

export default function App() {
  const [view, setView] = useState<ViewType>(() => {
  const savedView = localStorage.getItem('currentView');
  return (savedView as ViewType) || 'landing';
  });
  useEffect(() => {
  if (view && view !== 'landing') {
    localStorage.setItem('currentView', view);
  }
}, [view]);
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
        const savedView = localStorage.getItem('currentView');
        if (savedView && savedView !== 'landing') {
        setView(savedView as ViewType);
          } else {
        setView('dashboard');
          }
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
  // 🚀 ૩. યુઝરનો પ્રોફાઈલ ડેટા (role) ફાયરબેઝમાંથી લાઈવ મેળવવા માટે
  useEffect(() => {
    if (!user) {
      setUserProfile(null);
      return;
    }

    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        // ✅ સાચો ફિક્સ: ડેટાને અહીં 'as any' તરીકે સીધો મેળવો
        const data = docSnap.data() as any; 
        
        // પ્રોફાઇલ સ્ટેટ અપડેટ કરો
        setUserProfile(data); 

        // ઓટો-લોકના સેટિંગ્સ સ્ટેટ અપડેટ કરો
        if (data.autoLock !== undefined) setAutoLock(data.autoLock);
        if (data.timeoutMinutes !== undefined) setTimeoutMinutes(data.timeoutMinutes);
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
      localStorage.removeItem('currentView');
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

  /*const updatePassword = useCallback(async (id: string, entry: Partial<PasswordEntry>) => {
  try {
    if (!user) return;

    // ફાયરબેઝમાં આ ચોક્કસ પાસવર્ડના ડોક્યુમેન્ટનો રેફરન્સ લો
    const passwordDocRef = doc(db, 'users', user.uid, 'passwords', id);

    // ફાયરબેઝમાં ડેટા અપડેટ કરો
    await updateDoc(passwordDocRef, {
      websiteName: entry.websiteName || '',
      websiteUrl: entry.websiteUrl || '',
      username: entry.username || '',
      email: entry.email || '',
      password: entry.password || '',
      category: entry.category || 'Personal',
      tags: entry.tags || [],
      notes: entry.notes || '',
      favorite: entry.favorite ?? false,
      updatedAt: new Date().toISOString(),
    });

    console.log("Password updated successfully in Firebase!");
  } catch (error) {
    console.error("Error updating password in Firebase:", error);
  }
}, [user]);*/

/*const updatePassword = useCallback(async (id: string, entry: Partial<PasswordEntry>) => {
  try {
    if (!user) return;

    // ફાયરબેઝમાં આ ચોક્કસ પાસવર્ડના ડોક્યુમેન્ટનો રેફરન્સ લો
    const passwordDocRef = doc(db, 'users', user.uid, 'passwords', id);

    // 🚀 ફિક્સ: ફક્ત જે ડેટા બદલાયો છે (જેમ કે ફક્ત notes) તેને જ અપડેટ કરો, બાકીનું બધું સુરક્ષિત રહેશે
    await updateDoc(passwordDocRef, {
      ...entry,
      updatedAt: new Date().toISOString(),
    });

    console.log("Password updated successfully in Firebase!");
  } catch (error) {
    console.error("Error updating password in Firebase:", error);
  }
}, [user]);

  
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
    <Routes>
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/" element={
        view === 'landing' ? (
          <LandingPage onGetStarted={handleGoogleLogin} />
        ) : (
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
            currentUser={userProfile}
          />
        )
      } />
    </Routes>
  );
}*/

import { useState, useCallback, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom'; // 1. Routing imports
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import Privacy from './components/Privacy'; // 2. Privacy Component
import Terms from './components/Terms'; // 2. Terms Component
import Support from './components/Support'; // 2. Support Component

import { signInWithGoogle, auth, db } from './firebase'; 
import { signOut, User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, DocumentSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  // 🚀 ફિક્સ: અહીં <ViewType | 'landing'> ઉમેર્યું જેથી TypeScript એરર દૂર થઈ જાય
  const [view, setView] = useState<ViewType | 'landing'>(() => {
    const savedView = localStorage.getItem('currentView');
    return (savedView as ViewType) || 'landing';
  });
  
  useEffect(() => {
    if (view && view !== 'landing') {
      localStorage.setItem('currentView', view);
    }
  }, [view]);

  const [passwords, setPasswords] = useState<PasswordEntry[]>([]);
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  const [darkMode] = useState(false);
  const [autoLock, setAutoLock] = useState(true);
  const [timeoutMinutes, setTimeoutMinutes] = useState(15);
  
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const allCategories = [...CATEGORIES, ...customCategories];

  // --- તમારા ફાયરબેઝ અને ઓથ લિસનર્સ ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const savedView = localStorage.getItem('currentView');
        setView(savedView && savedView !== 'landing' ? (savedView as ViewType) : 'dashboard');
      } else {
        setUser(null);
        setUserProfile(null);
        setView('landing');
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) { setPasswords([]); return; }
    const userPasswordsRef = collection(db, 'users', user.uid, 'passwords');
    const unsubscribeSnapshot = onSnapshot(userPasswordsRef, (snapshot) => {
      setPasswords(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as PasswordEntry[]);
    });
    return () => unsubscribeSnapshot();
  }, [user]);

  useEffect(() => {
    if (!user) { setUserProfile(null); return; }
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        setUserProfile(data);
        if (data.autoLock !== undefined) setAutoLock(data.autoLock);
        if (data.timeoutMinutes !== undefined) setTimeoutMinutes(data.timeoutMinutes);
      }
    });
    return () => unsubscribeUser();
  }, [user]);

  const handleGoogleLogin = useCallback(async () => {
    try {
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser) {
        setUser(loggedInUser);
        setView('dashboard');
      }
    } catch (error) { console.error("Google Auth Error:", error); }
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('currentView');
      setView('landing');
    } catch (error) { console.error("Logout Error:", error); }
  }, []);

  const addPassword = useCallback(async (entry: Partial<PasswordEntry>) => {
    if (!user) return;
    const userPasswordsRef = collection(db, 'users', user.uid, 'passwords');
    await addDoc(userPasswordsRef, { ...entry, createdAt: new Date().toISOString() });
  }, [user]);

  const updatePassword = useCallback(async (id: string, entry: Partial<PasswordEntry>) => {
    if (!user) return;
    await updateDoc(doc(db, 'users', user.uid, 'passwords', id), { ...entry, updatedAt: new Date().toISOString() });
  }, [user]);

  const deletePassword = useCallback(async (id: string) => {
    if (!user) return;
    await deleteDoc(doc(db, 'users', user.uid, 'passwords', id));
    setPasswords((prev) => prev.filter((p) => p.id !== id));
  }, [user]);
  
  const toggleFavorite = useCallback((id: string) => {
    setPasswords((prev) => prev.map((p) => (p.id === id ? { ...p, favorite: !p.favorite } : p)));
  }, []);

  const addCustomCategory = useCallback((category: string) => {
    setCustomCategories((prev) => (prev.includes(category) || CATEGORIES.includes(category) ? prev : [...prev, category]));
  }, []);

  const removeCustomCategory = useCallback((category: string) => {
    setCustomCategories((prev) => prev.filter((c) => c !== category));
    setPasswords((prev) => prev.map((p) => (p.category === category ? { ...p, category: 'Other' } : p)));
  }, []);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;

  // 3. Routing Implementation
  return (
    <Routes>
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/support" element={<Support />} />
      <Route path="/" element={
        view === 'landing' ? (
          <LandingPage onGetStarted={handleGoogleLogin} />
        ) : (
          <Dashboard
            view={view as ViewType} // 🚀 ફિક્સ: સેફ કાસ્ટિંગ જેથી ડેશબોર્ડમાં પણ એરર ન આવે
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
            currentUser={userProfile}
          />
        )
      } />
    </Routes>
  );
}
