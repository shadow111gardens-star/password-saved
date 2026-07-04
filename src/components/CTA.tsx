import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface CTAProps {
  onGetStarted?: () => void;
}

export default function CTA({ onGetStarted }: CTAProps) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-3xl bg-primary-600 px-8 py-16 sm:px-16 sm:py-20 text-center"
        >
          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 opacity-50" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 opacity-50" />

          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Ready to Secure Your Passwords?
            </h2>
            <p className="mt-4 text-lg text-primary-100 max-w-xl mx-auto">
              Join thousands of users who trust VaultPass to keep their credentials safe. Start for free today.
            </p>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onGetStarted}
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 text-sm font-semibold text-primary-700 bg-white hover:bg-primary-50 rounded-xl transition-colors shadow-xl"
            >
              Start Free
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
