import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alex Carter',
    role: 'Senior Frontend Developer',
    avatar: 'AC',
    color: 'bg-blue-500',
    review: 'VaultPass has become an essential part of my daily workflow. The interface is incredibly clean, and finding credentials takes just seconds.',
    rating: 4.5,
  },
  {
    name: 'Sophia Miller',
    role: 'IT Operations Manager',
    avatar: 'SM',
    color: 'bg-emerald-500',
    review: 'Managing hundreds of credentials across multiple projects used to be frustrating. VaultPass made everything organized and secure.',
    rating: 5,
  },
  {
    name: 'Emma Wilson',
    role: 'Product Designer',
    avatar: 'EW',
    color: 'bg-violet-500',
    review: 'Our team switched to VaultPass because of its simplicity. Sharing and organizing credentials has never been easier',
    rating: 5,
  },
];

export default function Testimonials() {
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
            Testimonials
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Loved by thousands of users
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            See what people are saying about VaultPass.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">{t.review}</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center`}>
                  <span className="text-xs font-bold text-white">{t.avatar}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
