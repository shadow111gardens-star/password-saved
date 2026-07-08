import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
        </div>

        {/* Content */}
        <div className="space-y-8 text-slate-600 leading-relaxed">
          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-3">
              <Eye className="w-5 h-5 text-primary-600" /> Introduction
            </h2>
            <p>At VaultPass, your privacy is our top priority. We are committed to protecting your personal information and being transparent about what we do with it. This policy explains how we handle your data.</p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-3">
              <Lock className="w-5 h-5 text-primary-600" /> Data Security
            </h2>
            <p>We use a zero-knowledge architecture. This means your passwords are encrypted on your device using AES-256 before they ever reach our servers. Even we cannot access your data; you are the only one who holds the decryption keys.</p>
          </section>

          <section>
            <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 mb-3">
              <FileText className="w-5 h-5 text-primary-600" /> Information We Collect
            </h2>
            <p>We only collect the absolute minimum information required to provide our service, primarily your email address through Google Authentication to manage your account.</p>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            Last updated: July 6, 2026. For questions, contact us at support@vaultpass.app.
          </p>
        </div>
      </div>
    </div>
  );
}