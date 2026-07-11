{/*import {
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
} from 'lucide-react';
import type { ViewType } from '../../types';

interface SidebarProps {
  currentView: ViewType;
  setView: (v: ViewType) => void;
  darkMode: boolean;
  onLogout: () => void;
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

export default function Sidebar({ currentView, setView, darkMode, onLogout }: SidebarProps) {
  const isActive = (view: ViewType) => currentView === view;

  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col border-r ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      {/* Logo *
      <div className="p-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            VaultPass
          </span>
        </div>
      </div>

      {/* Main Menu *
      <nav className="flex-1 px-3 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.view)
                ? 'bg-primary-50 text-primary-700'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Menu *
      <div className="p-3 space-y-1 border-t border-slate-100">
        {bottomItems.map((item) => (
          <button
            key={item.view}
            onClick={() => setView(item.view)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.view)
                ? 'bg-primary-50 text-primary-700'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
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
              ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700'
              : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}*/}

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
  isMobile,
  closeMobileMenu
}: SidebarProps) {
  const isActive = (view: ViewType) => currentView === view;

  return (
    <aside
      className={`h-screen flex flex-col w-64 border-r ${
        darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}
    >
      {/* Logo */}
      <div className="p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            VaultPass
          </span>
        </div>
        {isMobile && (
          <button onClick={closeMobileMenu} className="p-1 text-slate-500 lg:hidden">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Main Menu (flex-1 એ બધી વચ્ચેની ખાલી જગ્યા રોકી લેશે) */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {menuItems.map((item) => (
          <button
            key={item.view}
            onClick={() => { setView(item.view); if(isMobile && closeMobileMenu) closeMobileMenu(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.view)
                ? 'bg-primary-50 text-primary-700'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <item.icon className="w-4.5 h-4.5" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Bottom Menu (આ હંમેશા નીચે જ રહેશે) */}
      <div className={`p-3 space-y-1 border-t ${darkMode ? 'border-slate-700' : 'border-slate-100'}`}>
        {bottomItems.map((item) => (
          <button
            key={item.view}
            onClick={() => { setView(item.view); if(isMobile && closeMobileMenu) closeMobileMenu(); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              isActive(item.view)
                ? 'bg-primary-50 text-primary-700'
                : darkMode
                ? 'text-slate-400 hover:text-white hover:bg-slate-700'
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
              ? 'text-slate-400 hover:text-red-400 hover:bg-slate-700'
              : 'text-slate-600 hover:text-red-600 hover:bg-red-50'
          }`}
        >
          <LogOut className="w-4.5 h-4.5" />
          Logout
        </button>
      </div>
    </aside>
  );
}