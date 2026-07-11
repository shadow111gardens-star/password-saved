import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User as UserIcon, Mail, Shield, Check } from 'lucide-react';
import { User } from 'firebase/auth';

interface ProfilePageProps {
  currentUser: User | null;
}

export default function ProfilePage({ currentUser }: ProfilePageProps) {
  const [name, setName] = useState(currentUser?.displayName || 'Alex Smith');
  const [email, setEmail] = useState(currentUser?.email || 'alex.smith@gmail.com');
  const [editMode] = useState(false); // editMode જો જરૂર હોય તો જ રાખવું
  const [saved] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setName(currentUser.displayName || 'Alex Smith');
      setEmail(currentUser.email || 'alex.smith@gmail.com');
    }
  }, [currentUser]);

  const getInitials = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    if (parts.length > 1) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="p-4 sm:p-8 max-w-2xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6 sm:mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
          <UserIcon className="w-5 h-5 text-blue-600" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Profile</h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">Your account information.</p>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
      >
        {/* Avatar Banner */}
        <div className="h-24 sm:h-32 bg-gradient-to-r from-primary-500 to-primary-600" />
        
        <div className="px-4 sm:px-6 pb-6">
          <div className="relative -mt-10 sm:-mt-12 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white p-1 shadow-lg">
              {currentUser?.photoURL && !imageError ? (
                <img 
                  src={currentUser.photoURL} 
                  alt={name} 
                  referrerPolicy="no-referrer"
                  onError={() => setImageError(true)}
                  className="w-full h-full rounded-xl object-cover bg-slate-100"
                />
              ) : (
                <div className="w-full h-full rounded-xl bg-primary-100 flex items-center justify-center border border-primary-200">
                  <span className="text-xl sm:text-2xl font-bold text-primary-700">
                    {getInitials(name)}
                  </span>
                </div>
              )}
            </div>
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
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase">Name</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 pl-7 sm:pl-8 truncate">{name}</p>
            </div>

            {/* Email */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3 mb-2">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase">Email</span>
              </div>
              <p className="text-sm font-semibold text-slate-900 pl-7 sm:pl-8 truncate">{email}</p>
            </div>

            {/* Authentication */}
            <div className="p-3 sm:p-4 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400" />
                <div>
                  <span className="text-[10px] sm:text-xs font-medium text-slate-500 uppercase block">Authentication</span>
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