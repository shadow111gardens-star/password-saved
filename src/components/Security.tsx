import { motion } from 'framer-motion';
import {
  Lock,
  EyeOff,
  ShieldCheck,
  Globe,
  Database,
  CloudBackup,
  Timer,
} from 'lucide-react';

const securityFeatures = [
  {
    icon: Lock,
    title: 'AES Encryption',
    description: 'All passwords are encrypted with AES-256, the same standard used by governments and militaries worldwide.',
  },
  {
    icon: EyeOff,
    title: 'Zero Knowledge Architecture',
    description: 'We never see your passwords. Only you hold the keys to decrypt your vault.',
  },
  {
    icon: ShieldCheck,
    title: 'Google Authentication',
    description: 'Secure OAuth 2.0 login with Google. No separate passwords to manage for your vault.',
  },
  {
    icon: Globe,
    title: 'HTTPS Everywhere',
    description: 'All data transmitted between your device and our servers is protected with TLS 1.3 encryption.',
  },
  {
    icon: Database,
    title: 'Private Database',
    description: 'Your data is stored in isolated, encrypted databases with strict access controls.',
  },
  {
    icon: CloudBackup,
    title: 'Automatic Backup',
    description: 'Your vault is automatically backed up to multiple secure locations for redundancy.',
  },
  {
    icon: Timer,
    title: 'Secure Sessions',
    description: 'Sessions automatically expire after inactivity. You control how long you stay logged in.',
  },
];

export default function Security() {
  return (
    <section id="security" className="py-24 bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-300 bg-primary-900/50 rounded-full mb-4 border border-primary-800">
            Security
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Bank-grade security for your passwords
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            We take security seriously. Your data is protected at every layer.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {securityFeatures.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="group p-6 rounded-2xl bg-slate-800/50 border border-slate-700 hover:border-primary-700/50 hover:bg-slate-800 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary-900/50 border border-primary-800 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="w-5 h-5 text-primary-400" />
              </div>
              <h3 className="text-base font-semibold text-white mb-1.5">{feature.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
