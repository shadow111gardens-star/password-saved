{/*import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, AlertTriangle, Trash2, Check } from 'lucide-react';

// ફાયરબેઝ મોડ્યુલ્સ
import { auth, db } from '../../firebase'; 
import { deleteUser } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface SettingsPageProps {
  autoLock: boolean;
  setAutoLock: (v: boolean) => void;
  timeoutMinutes: number;
  setTimeoutMinutes: (v: number) => void;
  onLogout: () => void; // App.tsx માંથી રીડાયરેક્ટ માટે
}

export default function SettingsPage({
  autoLock,
  setAutoLock,
  timeoutMinutes,
  setTimeoutMinutes,
  onLogout,
}: SettingsPageProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 🚀 ૧. સેવિંગ પ્રોસેસ શરૂ થાય એટલે લોડિંગ ચાલુ કરો
    setIsDeleting(true); // તમે આ સ્ટેટનો અથવા નવો [isSaving, setIsSaving] નો ઉપયોગ કરી શકો

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      // ડેટાબેઝમાં સેવ કરો
      await updateDoc(userDocRef, {
        autoLock: autoLock,
        timeoutMinutes: timeoutMinutes,
        updatedAt: new Date().toISOString()
      });

      // 🚀 ૨. સેવ થઈ ગયા પછી જ "Saved!" મેસેજ બતાવો
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings to Firebase:", error);
    } finally {
      // 🚀 ૩. પ્રોસેસ પૂરી થતાં લોડિંગ બંધ કરો
      setIsDeleting(false); 
    }
  };

  // 🚀 કોઈ મેસેજ કે પોપ-અપ વગર ડાયરેક્ટ ડીલીટ અને રીડાયરેક્ટ કરવાનું ફંક્શન
  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsDeleting(true);

    try {
      // ૧. ફાયરસ્ટોરમાંથી બધો ડેટા સાફ કરવો (કોઈ પૂછપરછ વગર)
      const userPasswordsRef = collection(db, 'users', currentUser.uid, 'passwords');
      const querySnapshot = await getDocs(userPasswordsRef);
      
      const deletePromises = querySnapshot.docs.map((document) => 
        deleteDoc(doc(db, 'users', currentUser.uid, 'passwords', document.id))
      );
      await Promise.all(deletePromises);

      // ૨. ફાયરબેઝમાંથી એકાઉન્ટ ડીલીટ કરવું
      await deleteUser(currentUser);
      
      // ૩. સીધા હોમ પેજ પર ઓટોમેટિક રીડાયરેક્ટ કરો
      onLogout();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      
      // જો સેશન બહુ જૂનું હોય તો જ બાયપાસ કરવા માટે ડાયરેક્ટ લોગઆઉટ કરી દેવું જેથી યુઝર અટકે નહીં
      if (error.code === 'auth/requires-recent-login') {
        onLogout(); 
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-sm text-slate-500 mt-1">Customize your VaultPass experience.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Security Section *
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="text-sm font-medium text-slate-900">Auto Lock</p>
                  <p className="text-xs text-slate-500">Lock vault after inactivity</p>
                </div>
              </div>
              <button
                onClick={() => setAutoLock(!autoLock)}
                className={`relative w-12 h-7 rounded-full transition-colors ${autoLock ? 'bg-primary-600' : 'bg-slate-200'}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    autoLock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            {autoLock && (
              <div className="pl-8">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Session Timeout</label>
                <select
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone Section *
        <div className="bg-white rounded-2xl border border-red-200 p-6">
          <h3 className="text-sm font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Danger Zone
          </h3>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-red-600">Are you sure? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount} // 🚀 ક્લિક કરતાં જ સીધું ડીલીટ
                  disabled={isDeleting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button *
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={isDeleting} // સેવિંગ વખતે બટન ડીસેબલ થઈ જશે
            className="flex items-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? 'Saved!' : isDeleting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}*/}

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings, Clock, AlertTriangle, Trash2, Check, ArrowRight } from 'lucide-react'; // Fix: ArrowRight missing icon imports match

// ફાયરબેઝ મોડ્યુલ્સ
import { auth, db } from '../../firebase'; 
import { deleteUser } from 'firebase/auth';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

interface SettingsPageProps {
  autoLock: boolean;
  setAutoLock: (v: boolean) => void;
  timeoutMinutes: number;
  setTimeoutMinutes: (v: number) => void;
  onLogout: () => void; // App.tsx માંથી રીડાયરેક્ટ માટે
}

export default function SettingsPage({
  autoLock,
  setAutoLock,
  timeoutMinutes,
  setTimeoutMinutes,
  onLogout,
}: SettingsPageProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleSave = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsDeleting(true); 

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);

      await updateDoc(userDocRef, {
        autoLock: autoLock,
        timeoutMinutes: timeoutMinutes,
        updatedAt: new Date().toISOString()
      });

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error("Error saving settings to Firebase:", error);
    } finally {
      setIsDeleting(false); 
    }
  };

  const handleDeleteAccount = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    setIsDeleting(true);

    try {
      const userPasswordsRef = collection(db, 'users', currentUser.uid, 'passwords');
      const querySnapshot = await getDocs(userPasswordsRef);
      
      const deletePromises = querySnapshot.docs.map((document) => 
        deleteDoc(doc(db, 'users', currentUser.uid, 'passwords', document.id))
      );
      await Promise.all(deletePromises);

      await deleteUser(currentUser);
      onLogout();
    } catch (error: any) {
      console.error("Error deleting account:", error);
      if (error.code === 'auth/requires-recent-login') {
        onLogout(); 
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    // 🚀 રિસ્પોન્સિવ ચેન્જ: મોબાઈલમાં p-4 અને ડેસ્કટોપમાં p-8 આપોઆપ થઈ જશે
    <div className="p-4 sm:p-6 lg:p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
          <Settings className="w-5 h-5 text-slate-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Settings</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Customize your VaultPass experience.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 sm:space-y-6"
      >
        {/* Security Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold text-slate-900 mb-4">Security</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <Clock className="w-5 h-5 text-slate-500 shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">Auto Lock</p>
                  <p className="text-xs text-slate-500 truncate">Lock vault after inactivity</p>
                </div>
              </div>
              <button
                onClick={() => setAutoLock(!autoLock)}
                className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${autoLock ? 'bg-primary-600' : 'bg-slate-200'}`}
              >
                <div
                  className={`absolute top-1 w-5 h-5 rounded-full bg-white shadow-sm transition-transform ${
                    autoLock ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
            
            {autoLock && (
              // 🚀 મોબાઈલમાં પેડિંગ થોડું ઓછું કર્યું જેથી ડ્રોપડાઉન સરસ ફિટ થાય
              <div className="pl-0 sm:pl-8 mt-2">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">Session Timeout</label>
                <select
                  value={timeoutMinutes}
                  onChange={(e) => setTimeoutMinutes(Number(e.target.value))}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                >
                  <option value={1}>1 minute</option>
                  <option value={5}>5 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Danger Zone Section */}
        <div className="bg-white rounded-2xl border border-red-200 p-4 sm:p-6">
          <h3 className="text-xs sm:text-sm font-semibold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            Danger Zone
          </h3>
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              Delete Account
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-xs sm:text-sm text-red-600">Are you sure? This action cannot be undone.</p>
              {/* 🚀 રિસ્પોન્સિવ ચેન્જ: મોબાઈલમાં બટનો એકની નીચે એક (flex-col) અને ડેસ્કટોપ પર બાજુ-બાજુમાં (sm:flex-row) */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-xl hover:bg-red-700 disabled:opacity-50"
                >
                  {isDeleting ? 'Deleting...' : 'Yes, Delete Account'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Save Button */}
        {/* 🚀 રિસ્પોન્સિવ ચેન્જ: મોબાઈલમાં આખું મોટું બટન (w-full) થઈ જશે, જેથી આંગળીથી ક્લિક કરવું ઈઝી રહે */}
        <div className="flex justify-end w-full">
          <button
            onClick={handleSave}
            disabled={isDeleting}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors disabled:opacity-50"
          >
            {saved ? <Check className="w-4 h-4" /> : null}
            {saved ? 'Saved!' : isDeleting ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}