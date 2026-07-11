import {
  LayoutDashboard,
  Lock,
  Heart,
  FolderOpen,
  Wand2,
  ShieldCheck,
  ArrowLeftRight,
  StickyNote,
  User,
  Settings,
  LogOut,
  Shield,
  X,
} from 'lucide-react';
import type { ViewType } from '../../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (v: ViewType) => void;
  darkMode: boolean;
  onLogout: () => void;
  isMobile?: boolean;
  closeMobileMenu?: () => void;
}

const menuItems: { icon: React.ElementType; label: string; view: ViewType }[] = [
  { icon: LayoutDashboard, label: 'Dashboard', view: 'dashboard' },
  { icon: Lock, label: 'Vault', view: 'vault' },
  { icon: Heart, label: 'Favorites', view: 'favorites' },
  { icon: FolderOpen, label: 'Categories', view: 'categories' },
  { icon: Wand2, label: 'Password Generator', view: 'generator' },
  { icon: ShieldCheck, label: 'Security Center', view: 'security' },
  { icon: ArrowLeftRight, label: 'Import / Export', view: 'importexport' },
  { icon: StickyNote, label: 'Notes', view: 'notes' },
];

const bottomItems: { icon: React.ElementType; label: string; view: ViewType }[] = [
  { icon: User, label: 'Profile', view: 'profile' },
  { icon: Settings, label: 'Settings', view: 'settings' },
];

export default function Sidebar({ 
  currentView, 
  setView, 
  darkMode, 
  onLogout,
  isMobile = false,
  closeMobileMenu
}: SidebarProps) {
  const isActive = (view: ViewType) => currentView === view;

  const handleNavigation = (view: ViewType) => {
    setView(view);
    if (isMobile && closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <div className={`w-full h-full flex flex-col justify-between ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <div className="flex flex-col flex-1">
        {/* Header (Logo + Close Button) */}
        <div className="p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              VaultPass
            </span>
          </div>
          {isMobile && closeMobileMenu && (
            <button 
              onClick={closeMobileMenu}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Navigation Link Area */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {menuItems.map((item) => (
            <button
              key={item.view}
              onClick={() => handleNavigation(item.view)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive(item.view)
                  ? 'bg-primary-50 text-primary-700'
                  : darkMode
                  ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Bottom Option Area (Fix: No blue/black boxes anymore) */}
      <div className={`p-3 space-y-1 border-t ${darkMode ? 'border-slate-800 bg-slate-900' : 'border-slate-100 bg-white'}`}>
        {bottomItems.map((item) => (
          <button
            key={item.view}
            onClick={() => handleNavigation(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.view)
                ? 'bg-primary-50 text-primary-700'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-800'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </button>
        ))}
        <button
          onClick={onLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            darkMode
              ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800'
              : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </div>
  );
}