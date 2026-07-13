import { motion } from 'framer-motion';
import { Play, Lock, Globe, Cloud, ShieldCheck, Key, Search, FileText } from 'lucide-react';

const stats = [
  { icon: Key, label: '10,000+ Passwords Stored' },
  { icon: Lock, label: 'AES Encryption' },
  { icon: ShieldCheck, label: 'Google Authentication' },
  { icon: Cloud, label: 'Cloud Sync' },
];

const floatingCards = [
  { icon: Globe, label: 'github.com', user: 'alex@email.com', top: '15%', left: '8%', delay: 0 },
  { icon: Lock, label: 'netflix.com', user: 'alex@email.com', top: '60%', left: '5%', delay: 0.3 },
  { icon: Search, label: 'google.com', user: 'alex@email.com', top: '25%', right: '8%', delay: 0.6 },
  { icon: FileText, label: 'notion.so', user: 'alex@email.com', top: '65%', right: '5%', delay: 0.9 },
];

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 via-white to-white pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-primary-100/30 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-50 border border-primary-100 text-primary-700 text-xs font-medium mb-6"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse" />
              Trusted by 10,000+ users worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 tracking-tight leading-[1.1]"
            >
              Store Every Password{' '}
              <span className="text-primary-600">Securely.</span>{' '}
              Access <span className="text-primary-600">Anywhere.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0"
            >
              Never forget another password. Securely save, organize, and manage all your website credentials in one encrypted vault.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-8 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start"
            >
              <button 
                  onClick={onGetStarted} 
                  className="flex items-center justify-center gap-3 px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-200 hover:-translate-y-0.5"
                >
                  {/* Inline SVG - કોઈ પાથની જરૂર નથી */}
                  <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C33.7 4.5 29.2 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.1-2.7-.5-4z" fill="white"/>
                  </svg>
                  Login with Google
                </button>
              
              {/*<button onClick={onGetStarted} className="px-6 py-3 text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 rounded-xl transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:shadow-primary-200 hover:-translate-y-0.5">
                Login with Google
              </button>*/}
              {/*<button className="px-6 py-3 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2">
                <Play className="w-4 h-4" />
                Get Started 
              </button>*/}
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-10 grid grid-cols-2 gap-4"
            >
              {stats.map((stat, i) => (
                <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                  <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center flex-shrink-0">
                    <stat.icon className="w-4 h-4 text-primary-600" />
                  </div>
                  <span className="text-xs font-medium text-slate-700">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right - Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative"
          >
            {/* Main Dashboard Card */}
            <div className="relative bg-white rounded-2xl border border-slate-200 shadow-2xl shadow-slate-200/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-amber-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="flex-1 text-center">
                  <span className="text-xs text-slate-400 font-medium">vaultpass.app</span>
                </div>
              </div>

              {/* Dashboard Content */}
              <div className="p-4">
                <div className="flex gap-4">
                  {/* Sidebar */}
                  <div className="w-16 flex-shrink-0 space-y-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-600 flex items-center justify-center mx-auto">
                      <Lock className="w-5 h-5 text-white" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto">
                      <Search className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto">
                      <Key className="w-4 h-4 text-slate-400" />
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center mx-auto">
                      <FileText className="w-4 h-4 text-slate-400" />
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-slate-800">All Passwords</h3>
                      <div className="w-24 h-7 rounded-lg bg-slate-100" />
                    </div>
                    {/* Password Items */}
                    {[
                      { name: 'GitHub', color: 'bg-slate-800', email: 'alex@email.com' },
                      { name: 'Google', color: 'bg-red-500', email: 'alex@email.com' },
                      { name: 'Netflix', color: 'bg-red-600', email: 'alex@email.com' },
                      { name: 'Spotify', color: 'bg-green-500', email: 'alex@email.com' },
                      { name: 'Slack', color: 'bg-purple-500', email: 'alex@email.com' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50/80 border border-slate-100">
                        <div className={`w-8 h-8 rounded-lg ${item.color} flex items-center justify-center`}>
                          <span className="text-[10px] font-bold text-white">{item.name[0]}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-slate-800">{item.name}</p>
                          <p className="text-[10px] text-slate-400">{item.email}</p>
                        </div>
                        <div className="w-16 h-2 rounded-full bg-slate-200" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Floating Cards */}
            {floatingCards.map((card, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 + card.delay }}
                className="absolute hidden sm:block"
                //className={`absolute ${card.top ? '' : ''} hidden sm:block`}
                style={{
                  top: card.top,
                  left: card.left,
                  right: card.right,
                }}
              >
                <div className={`bg-white rounded-xl border border-slate-200 shadow-lg p-3 animate-float${i % 2 === 0 ? '' : '-delayed'}`}>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary-50 flex items-center justify-center">
                      <card.icon className="w-3.5 h-3.5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold text-slate-800">{card.label}</p>
                      <p className="text-[9px] text-slate-400">{card.user}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Lock Animation */}
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-4 -right-4 w-14 h-14 bg-primary-600 rounded-2xl flex items-center justify-center shadow-xl shadow-primary-200 animate-pulse-glow"
            >
              <Lock className="w-7 h-7 text-white" />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
