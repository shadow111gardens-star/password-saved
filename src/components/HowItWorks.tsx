import { motion } from 'framer-motion';
import { LogIn, Plus, Globe, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: LogIn,
    step: 'Step 1',
    title: 'Login with Google',
    description: 'Sign in securely with your Google account in one click. No passwords to remember.',
    color: 'bg-blue-50 text-blue-600 border-blue-100',
  },
  {
    icon: Plus,
    step: 'Step 2',
    title: 'Add Website Credentials',
    description: 'Save your usernames and passwords for any website. We handle the encryption.',
    color: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  },
  {
    icon: Globe,
    step: 'Step 3',
    title: 'Access Anywhere',
    description: 'Your passwords sync across all your devices instantly and securely.',
    color: 'bg-violet-50 text-violet-600 border-violet-100',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-4">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Get started in three simple steps
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            From signup to secure storage in under a minute.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          {steps.map((step, i) => (
            <div key={step.step}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`flex items-start gap-5 p-6 rounded-2xl border ${step.color} bg-opacity-50`}
              >
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${step.color.split(' ')[0]}`}>
                  <step.icon className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-semibold uppercase tracking-wider opacity-70">{step.step}</span>
                  <h3 className="text-lg font-semibold mt-1">{step.title}</h3>
                  <p className="text-sm mt-1.5 opacity-80 leading-relaxed">{step.description}</p>
                </div>
              </motion.div>
              {i < steps.length - 1 && (
                <div className="flex justify-center py-4">
                  <ArrowDown className="w-5 h-5 text-slate-300 animate-bounce" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
