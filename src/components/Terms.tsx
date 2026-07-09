import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, UserCheck, ShieldAlert, Key, ServerCrash, Ban, RefreshCw, Mail } from 'lucide-react';

export default function Terms() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        
        {/* 🔙 Back to Home Button */}
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-primary-600 mb-6 transition-colors bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 sm:p-12">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary-600 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Terms of Service</h1>
                <p className="text-sm text-slate-500 mt-1">VaultPass</p>
              </div>
            </div>
            <div className="text-sm text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-center">
              Last Updated: July 9, 2026
            </div>
          </div>

          {/* Introduction */}
          <div className="text-slate-600 leading-relaxed mb-8 text-base">
            <p className="font-semibold text-slate-900 mb-2">Welcome to VaultPass.</p>
            <p>By using our services, you agree to comply with and be bound by these Terms of Service. Please read them carefully.</p>
          </div>

          {/* Content Sections */}
          <div className="space-y-8 text-slate-600 leading-relaxed">
            
            {/* Account Responsibility */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <UserCheck className="w-5 h-5 text-primary-600" /> Account Responsibility
              </h2>
              <p>You are solely responsible for maintaining the security and confidentiality of your account and login credentials. VaultPass cannot recover data if you lose your master credentials.</p>
            </section>

            {/* Acceptable Use */}
            <section>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <Ban className="w-5 h-5 text-primary-600" /> Acceptable Use
              </h2>
              <p className="mb-3">You explicitly agree not to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Attempt unauthorized access to any part of the service</li>
                <li>Use the service for any illegal or unauthorized activities</li>
                <li>Distribute malware, viruses, or malicious software</li>
                <li>Abuse, disrupt, or interfere with our platform's infrastructure</li>
              </ul>
            </section>

            {/* User Data */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <Key className="w-5 h-5 text-primary-600" /> User Data
              </h2>
              <p>You retain full ownership and intellectual property rights of all passwords, data, and information you choose to store within VaultPass. We claim no ownership over your data.</p>
            </section>

            {/* Service Availability */}
            <section>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <ServerCrash className="w-5 h-5 text-primary-600" /> Service Availability
              </h2>
              <p>We strive to provide highly reliable and continuous service, but we cannot guarantee uninterrupted or error-free availability at all times due to maintenance or external factors.</p>
            </section>

            {/* Limitation of Liability */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <ShieldAlert className="w-5 h-5 text-primary-600" /> Limitation of Liability
              </h2>
              <p>VaultPass is provided on an <strong>"as is"</strong> and <strong>"as available"</strong> basis without warranties of any kind. We are not responsible for any losses resulting from misuse, forgotten credentials, or service interruptions.</p>
            </section>

            {/* Termination */}
            <section>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <Ban className="w-5 h-5 text-primary-600" /> Termination
              </h2>
              <p>We reserve the right to suspend or permanently terminate accounts that violate these Terms or engage in fraudulent activities without prior notice.</p>
            </section>

            {/* Changes */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <RefreshCw className="w-5 h-5 text-primary-600" /> Changes to Terms
              </h2>
              <p>These Terms may be updated periodically. Continued use of the service after any modifications indicates your explicit acceptance of the updated changes.</p>
            </section>

            {/* Contact */}
            <section className="pt-4">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-2">
                <Mail className="w-5 h-5 text-primary-600" /> Contact
              </h2>
              <p className="mb-2">For any legal or technical questions regarding these Terms, please contact us:</p>
              <a 
                href="mailto:solankiabhay722@gmail.com" 
                className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
              >
                solankiabhay722@gmail.com
              </a>
            </section>

          </div>
        </div>
      </div>
    </div>
  );
}