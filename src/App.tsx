{/*import { useState, useCallback, useEffect } from 'react';
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
}*/}

import { useState, useCallback, useEffect } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom'; 
import type { ViewType, PasswordEntry } from './types';
import { CATEGORIES } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/dashboard/Dashboard';
import Privacy from './components/Privacy'; 
import Terms from './components/Terms'; 
import Support from './components/Support';
import { Menu } from 'lucide-react'; 
import Sidebar from './components/dashboard/Sidebar'; // આ લાઇન ઉમેરો

import { signInWithGoogle, auth, db } from './firebase'; 
import { signOut, User, onAuthStateChanged } from 'firebase/auth';
import { collection, onSnapshot, addDoc, doc, DocumentSnapshot, deleteDoc, updateDoc } from 'firebase/firestore';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

  // --- ફાયરબેઝ ઓથ લિસનર્સ ---
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const savedView = localStorage.getItem('currentView');
        setView(savedView && savedView !== 'landing' ? (savedView as ViewType) : 'dashboard');
        
        if (location.pathname === '/') {
          navigate('/');
        }
      } else {
        setUser(null);
        setUserProfile(null);
        setView('landing');
      }
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, [navigate, location.pathname]);

  useEffect(() => {
    if (!user) { setPasswords([]); return; }
    const userPasswordsRef = collection(db, 'users', user.uid, 'passwords');
    const unsubscribeSnapshot = onSnapshot(userPasswordsRef, (snapshot) => {
      setPasswords(snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() })) as PasswordEntry[]);
    });
    return () => unsubscribeSnapshot();
  }, [user]);

  // 🚀 ફિક્સ: ફાયરબેઝમાંથી કસ્ટમ કેટેગરીઝ પણ રિયલ-ટાઇમ લોડ થશે
  useEffect(() => {
    if (!user) { setUserProfile(null); return; }
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribeUser = onSnapshot(userDocRef, (docSnap: DocumentSnapshot) => {
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        setUserProfile(data);
        if (data.autoLock !== undefined) setAutoLock(data.autoLock);
        if (data.timeoutMinutes !== undefined) setTimeoutMinutes(data.timeoutMinutes);
        // ફાયરબેઝમાંથી એરે લોડ કરીને સ્ટેટમાં સેટ કરો
        if (data.customCategories !== undefined) setCustomCategories(data.customCategories);
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
      navigate('/');
    } catch (error) { console.error("Logout Error:", error); }
  }, [navigate]);

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
  
  const toggleFavorite = useCallback(async (id: string) => {
    if (!user) return;
    
    const currentPassword = passwords.find(p => p.id === id);
    if (!currentPassword) return;

    try {
      const passwordDocRef = doc(db, 'users', user.uid, 'passwords', id);
      await updateDoc(passwordDocRef, {
        favorite: !currentPassword.favorite,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  }, [user, passwords]);

  // 🚀 ફિક્સ: કસ્ટમ કેટેગરી ફાયરબેઝમાં કાયમ માટે સ્ટોર થશે
  const addCustomCategory = useCallback(async (category: string) => {
    if (!user) return;
    if (customCategories.includes(category) || CATEGORIES.includes(category)) return;

    const updatedCategories = [...customCategories, category];
    
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { customCategories: updatedCategories });
    } catch (error) {
      console.error("Error adding custom category:", error);
    }
  }, [user, customCategories]);

  // 🚀 ફિક્સ: ફાયરબેઝમાંથી કસ્ટમ કેટેગરી રીમુવ થશે
  const removeCustomCategory = useCallback(async (category: string) => {
    if (!user) return;

    const updatedCategories = customCategories.filter((c) => c !== category);

    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, { customCategories: updatedCategories });
      
      // જે પાસવર્ડ આ કેટેગરીમાં હતા તેને ટેમ્પરરી 'Other' કરી દો
      setPasswords((prev) => prev.map((p) => (p.category === category ? { ...p, category: 'Other' } : p)));
    } catch (error) {
      console.error("Error removing custom category:", error);
    }
  }, [user, customCategories]);

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>;

  return (
    <Routes>
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/support" element={<Support />} />
      <Route path="/*" element={
        view === 'landing' ? (
          <LandingPage onGetStarted={handleGoogleLogin} />
        ) : (
          <div className="flex h-screen overflow-hidden bg-slate-50">
            {/* મોબાઈલ ઓવરલે: સાઇડબાર બહાર ક્લિક કરવાથી બંધ થશે */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 z-40 bg-black/50 lg:hidden" 
                onClick={() => setIsSidebarOpen(false)} 
              />
            )}

            
            {/* સાઇડબાર કન્ટેનર: h-screen અને h-full ઉમેર્યા */}
            <div className={`fixed inset-y-0 left-0 z-50 w-64 h-screen bg-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
              
              <Sidebar 
                currentView={view as ViewType} 
                setView={(v: ViewType) => { setView(v); setIsSidebarOpen(false); }} 
                darkMode={darkMode} 
                onLogout={handleLogout}
                isMobile={true}
                closeMobileMenu={() => setIsSidebarOpen(false)}
              />
            </div>

            {/* મુખ્ય કન્ટેન્ટ */}
            <main className="flex-1 flex flex-col overflow-hidden">
              {/* મોબાઈલ હેડર: મેનૂ બટન */}
              <div className="lg:hidden p-4 bg-white border-b border-slate-200">
                <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
                  <Menu className="w-6 h-6" />
                </button>
              </div>

              {/* ડેશબોર્ડ કન્ટેન્ટ */}
              <div className="flex-1 overflow-y-auto">
                <Dashboard
                  view={view as ViewType} 
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
              </div>
            </main>
          </div>
        )
      } />
    </Routes>
  );
}