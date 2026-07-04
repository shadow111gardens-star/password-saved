import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How does VaultPass keep my passwords secure?',
    answer: 'VaultPass uses AES-256 encryption to encrypt your passwords before they ever leave your device. We operate on a zero-knowledge architecture, meaning we cannot access your passwords even if we wanted to.',
  },
  {
    question: 'Can I access my passwords on multiple devices?',
    answer: 'Yes! VaultPass syncs your encrypted vault across all your devices in real-time. Whether you are on desktop, tablet, or mobile, your passwords are always available.',
  },
  {
    question: 'What happens if I forget my Google account password?',
    answer: 'Since VaultPass uses Google OAuth for authentication, you can recover access through Google\'s account recovery process. Your vault remains secure and intact.',
  },
  {
    question: 'Is there a limit to how many passwords I can store?',
    answer: 'No! Both Free and Pro plans include unlimited password storage. We believe you should never have to worry about running out of space.',
  },
  {
    question: 'Can I share passwords with my team?',
    answer: 'Shared vaults are available on the Pro plan. You can create shared vaults for your team or family and control who has access to what.',
  },
  {
    question: 'Does VaultPass have a browser extension?',
    answer: 'Yes, the Pro plan includes our browser extension for Chrome, Firefox, and Safari. It can auto-fill passwords and generate new ones on the fly.',
  },
  {
    question: 'Can I import passwords from another manager?',
    answer: 'Pro users can import passwords from CSV files exported from other password managers like LastPass, 1Password, and Bitwarden.',
  },
  {
    question: 'Is my data backed up?',
    answer: 'Absolutely. Your encrypted vault is automatically backed up to multiple secure locations. Even if one server fails, your data remains safe.',
  },
  {
    question: 'What encryption standard do you use?',
    answer: 'We use AES-256 encryption, the same standard trusted by governments, militaries, and financial institutions worldwide.',
  },
  {
    question: 'How do I cancel my Pro subscription?',
    answer: 'You can cancel anytime from your account settings. Your Pro features will remain active until the end of your billing period.',
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-3 py-1 text-xs font-semibold text-primary-700 bg-primary-50 rounded-full mb-4">
            FAQ
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Frequently asked questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Everything you need to know about VaultPass.
          </p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="rounded-xl bg-white border border-slate-200 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="text-sm font-medium text-slate-900 pr-4">{faq.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-4">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
