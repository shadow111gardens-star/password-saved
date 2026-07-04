import { motion } from 'framer-motion';
import {
  Lock,
  LogIn,
  Shield,
  Search,
  Wand2,
  Monitor,
  Tablet,
  Smartphone,
  StickyNote,
  Globe,
  FolderOpen,
  Briefcase,
  Users,
  CreditCard,
  ShoppingBag,
  MessageCircle,
  Server,
  Code,
} from 'lucide-react';

const features = [
  {
    icon: Lock,
    title: 'Secure Password Vault',
    description: 'Save unlimited passwords in your personal encrypted vault.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    icon: LogIn,
    title: 'Google Sign In',
    description: 'One-click authentication with your Google account.',
    color: 'bg-red-50 text-red-600',
  },
  {
    icon: Shield,
    title: 'Military Grade Encryption',
    description: 'Passwords encrypted with AES-256 before storage.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    icon: Search,
    title: 'Instant Search',
    description: 'Find passwords instantly with powerful search.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    icon: Wand2,
    title: 'Password Generator',
    description: 'Generate secure, random passwords on demand.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    icon: Monitor,
    title: 'Cross Device Access',
    description: 'Access from Desktop, Tablet, and Mobile.',
    color: 'bg-cyan-50 text-cyan-600',
    extraIcons: [Tablet, Smartphone],
  },
  {
    icon: StickyNote,
    title: 'Notes',
    description: 'Store additional secure notes alongside passwords.',
    color: 'bg-orange-50 text-orange-600',
  },
  {
    icon: Globe,
    title: 'Website Preview',
    description: 'Display website favicon for quick identification.',
    color: 'bg-indigo-50 text-indigo-600',
  },
];

const categories = [
  { icon: FolderOpen, label: 'Personal' },
  { icon: Briefcase, label: 'Work' },
  { icon: Users, label: 'Clients' },
  { icon: CreditCard, label: 'Finance' },
  { icon: ShoppingBag, label: 'Shopping' },
  { icon: MessageCircle, label: 'Social' },
  { icon: Server, label: 'Hosting' },
  { icon: Code, label: 'Development' },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-4">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Everything you need to manage passwords
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Powerful features designed to keep your credentials safe and accessible.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-primary-200 hover:shadow-lg hover:shadow-primary-50 transition-all duration-300"
            >
              <div className={`w-11 h-11 rounded-xl ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900 mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{feature.description}</p>
              {feature.extraIcons && (
                <div className="mt-3 flex gap-2">
                  {feature.extraIcons.map((Icon, j) => (
                    <div key={j} className="w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h3 className="text-center text-lg font-semibold text-slate-900 mb-8">Organize by Categories</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 hover:border-primary-200 hover:bg-primary-50 transition-colors cursor-default"
              >
                <cat.icon className="w-4 h-4 text-slate-500" />
                <span className="text-sm font-medium text-slate-700">{cat.label}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
