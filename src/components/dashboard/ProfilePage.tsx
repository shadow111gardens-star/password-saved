import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Shield, Pencil, Save, X, Check } from 'lucide-react';
import { User } from 'firebase/auth';

interface ProfilePageProps {
  currentUser: User | null;
}

export default function ProfilePage({ currentUser }: ProfilePageProps) {
  // નામ સેટ કરતી વખતે જો ખાલી 'abhay' હોય તો પણ પ્રોપર હેન્ડલ થશે
  const [name, setName] = useState(currentUser?.displayName || 'Alex Smith');
  const [email, setEmail] = useState(currentUser?.email || 'alex.smith@gmail.com');
  const [editMode, setEditMode] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // ⚡ ઈમેજ લોડ ન થાય તો અલ્ટરનેટિવ બોક્સ બતાવવા માટેનું સ્ટેટ
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || 'Alex Smith');
      setEmail(currentUser.email || 'alex.smith@gmail.com');
      setImageError(false); // નવો યુઝર આવે ત્યારે એરર રીસેટ કરો
    }
  }, [currentUser]);

  const handleSave = () => {
    setEditMode(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCancel = () => {
    setName(currentUser?.displayName || 'Alex Smith');
    setEmail(currentUser?.email || 'alex.smith@gmail.com');
    setEditMode(false);
  };

  // નામ પરથી Initials (અક્ષરો) મેળવવાનું ફંક્શન
  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase(); // દા.ત. Abhay Solanki -> AS
    }
    return parts[0].slice(0, 2).toUpperCase(); // દા.ત. abhay -> AB
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-sm text-slate-500 mt-1">Your account information.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        {/* Avatar Banner */}
        <div className="h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
        <div className="px-6 pb-6">
          <div className="relative -mt-12 mb-6 flex items-end justify-between">
            <div className="w-24 h-24 rounded-2xl bg-white p-1 shadow-lg">
              
              {/* ⚡ ઈમેજ લોડ થાય અને કોઈ એરર ન હોય તો જ ફોટો બતાવશે */}
              {currentUser?.photoURL && !imageError ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={name} 
                  referrerPolicy="no-referrer" // ગૂગલ ઈમેજ બ્લોક ન થાય તે માટે
                  onError={() => setImageError(true)} // જો ઈમેજ લોડ ન થાય તો આ ટ્રિગર થશે
                  className="w-full h-full rounded-xl object-cover bg-slate-100"
                />
              ) : (
                /* ⚡ જો ફોટો ન હોય અથવા લોડ થવામાં એરર આવે, તો આ સુંદર બ્લુ લેટર બોક્સ દેખાશે */
                <div className="w-full h-full rounded-xl bg-primary-100 flex items-center justify-center border border-primary-200">
                  <span className="text-2xl font-bold text-primary-700">
                    {getInitials(name)}
                  </span>
                </div>
              )}

            </div>
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 rounded-xl transition-colors"
              >
                <Pencil className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors"
                >
                  <Save className="w-4 h-4" />
                  Save
                </button>
              </div>
            )}
          </div>

          {saved && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center gap-2"
            >
              <Check className="w-4 h-4 text-emerald-600" />
              <span className="text-sm font-medium text-emerald-700">Profile saved successfully</span>
            </motion.div>
          )}

          <div className="space-y-4">
            {/* Name */}
            <div className="p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 uppercase">Name</span>
              </div>
              {editMode ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                  autoFocus
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 pl-8">{name}</p>
              )}
            </div>

            {/* Email */}
            <div className="p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-5 h-5 text-slate-400" />
                <span className="text-xs font-medium text-slate-500 uppercase">Email</span>
              </div>
              {editMode ? (
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 pl-8">{email}</p>
              )}
            </div>

            {/* Authentication (read-only) */}
            <div className="p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-slate-400" />
                <div>
                  <span className="text-xs font-medium text-slate-500 uppercase block">Authentication</span>
                  <p className="text-sm font-semibold text-slate-900 mt-0.5">Google OAuth 2.0</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}