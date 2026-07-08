import { motion } from 'framer-motion';

const companies = [
  'TechIn',
  'GlobalSol',
  'C-Hub',
  'NextGen',
  'Apex',
  'Summit',
];

export default function TrustedBy() {
  return (
    <section className="py-12 border-y border-slate-100 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center text-sm font-medium text-slate-400 uppercase tracking-wider mb-8"
        >
          Trusted by teams at
        </motion.p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {companies.map((company, i) => (
            <motion.div
              key={company}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-xl font-bold text-slate-300 hover:text-slate-400 transition-colors cursor-default select-none"
            >
              {company}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
