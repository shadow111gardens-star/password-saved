import { motion } from 'framer-motion';
import { Lock, Search, Plus, Moon, Sun, Key, FileText, Settings, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const sidebarItems = [
  { icon: Lock, label: 'All Passwords', active: true },
  { icon: Key, label: 'Generator' },
  { icon: FileText, label: 'Notes' },
  { icon: Settings, label: 'Settings' },
];

const passwords = [
  { name: 'GitHub', url: 'github.com', color: 'bg-slate-800', category: 'Development' },
  { name: 'Google', url: 'google.com', color: 'bg-red-500', category: 'Personal' },
  { name: 'Netflix', url: 'netflix.com', color: 'bg-red-600', category: 'Entertainment' },
  { name: 'Spotify', url: 'spotify.com', color: 'bg-green-500', category: 'Entertainment' },
  { name: 'Slack', url: 'slack.com', color: 'bg-purple-500', category: 'Work' },
  { name: 'AWS', url: 'aws.amazon.com', color: 'bg-amber-500', category: 'Hosting' },
];

export default function DashboardPreview() {
  const [darkMode, setDarkMode] = useState(false);

  return (
    <section className="py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-4">
            Dashboard
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            A beautiful interface for your passwords
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Intuitive design that makes password management effortless.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          {/* Browser Frame */}
          <div className={`rounded-2xl border shadow-2xl overflow-hidden transition-colors duration-500 ${darkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
            {/* Browser Header */}
            <div className={`flex items-center gap-3 px-4 py-3 border-b ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-slate-50/50'}`}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className={`flex-1 max-w-md mx-auto px-4 py-1.5 rounded-lg text-xs text-center ${darkMode ? 'bg-slate-700 text-slate-400' : 'bg-white text-slate-400 border border-slate-200'}`}>
                vaultpass.app/dashboard
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-1.5 rounded-lg transition-colors ${darkMode ? 'hover:bg-slate-700 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </div>

            {/* Dashboard Body */}
            <div className="flex" style={{ minHeight: '400px' }}>
              {/* Sidebar */}
              <div className={`w-56 border-r p-4 hidden sm:block ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-100 bg-slate-50/30'}`}>
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl mb-6 ${darkMode ? 'bg-slate-700' : 'bg-white border border-slate-200'}`}>
                  <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-white" />
                  </div>
                  <span className={`text-sm font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>VaultPass</span>
                </div>
                <div className="space-y-1">
                  {sidebarItems.map((item) => (
                    <div
                      key={item.label}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium cursor-default ${
                        item.active
                          ? 'bg-primary-50 text-primary-700'
                          : darkMode
                          ? 'text-slate-400 hover:bg-slate-700'
                          : 'text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content */}
              <div className="flex-1 p-4 sm:p-6">
                {/* Search Bar */}
                <div className="flex items-center gap-3 mb-6">
                  <div className={`flex-1 flex items-center gap-2 px-4 py-2.5 rounded-xl ${darkMode ? 'bg-slate-800 border border-slate-700' : 'bg-slate-50 border border-slate-200'}`}>
                    <Search className={`w-4 h-4 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
                    <span className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>Search passwords...</span>
                  </div>
                  <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-colors">
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Add Password</span>
                  </button>
                </div>

                {/* Password List */}
                <div className="space-y-2">
                  {passwords.map((pwd, i) => (
                    <motion.div
                      key={pwd.name}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-4 px-4 py-3 rounded-xl border transition-colors cursor-default ${
                        darkMode
                          ? 'border-slate-700 hover:border-slate-600 bg-slate-800/50'
                          : 'border-slate-100 hover:border-slate-200 bg-white'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg ${pwd.color} flex items-center justify-center flex-shrink-0`}>
                        <span className="text-xs font-bold text-white">{pwd.name[0]}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{pwd.name}</p>
                        <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>{pwd.url}</p>
                      </div>
                      <span className={`hidden sm:inline-flex px-2.5 py-1 rounded-lg text-xs font-medium ${darkMode ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'}`}>
                        {pwd.category}
                      </span>
                      <ChevronRight className={`w-4 h-4 flex-shrink-0 ${darkMode ? 'text-slate-600' : 'text-slate-300'}`} />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Highlight Badges */}
          <div className="absolute -top-3 -right-3 bg-primary-600 text-white text-xs font-semibold px-3 py-1.5 rounded-lg shadow-lg">
            Dark Mode
          </div>
        </motion.div>
      </div>
    </section>
  );
}
