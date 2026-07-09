import React from 'react';
import { Link } from 'react-router-dom'; // Link ઇમ્પોર્ટ કર્યું
import { Shield, Lock, Eye, FileText, Server, ShieldCheck, UserCheck, Mail, ArrowLeft } from 'lucide-react';

export default function Privacy() {
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
                <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
                <p className="text-sm text-slate-500 mt-1">VaultPass</p>
              </div>
            </div>
            <div className="text-sm text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 self-start sm:self-center">
              Last Updated: July 9, 2026
            </div>
          </div>

          {/* Introduction */}
          <p className="text-slate-600 leading-relaxed mb-8 text-lg font-normal">
            At VaultPass, your privacy is our highest priority. We are committed to protecting your personal information and ensuring that your data remains secure.
          </p>

          {/* Content Sections */}
          <div className="space-y-8 text-slate-600 leading-relaxed">
            
            {/* Information We Collect */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <Eye className="w-5 h-5 text-primary-600" /> Information We Collect
              </h2>
              <p className="mb-3">When you use VaultPass, we may collect:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Google account information used for authentication</li>
                <li>Your email address</li>
                <li>Password entries you choose to store</li>
                <li>Device and browser information</li>
                <li>Usage analytics to improve our service</li>
              </ul>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <FileText className="w-5 h-5 text-primary-600" /> How We Use Your Information
              </h2>
              <p className="mb-3">We use your information to:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Authenticate your account</li>
                <li>Securely store your passwords</li>
                <li>Improve product performance</li>
                <li>Provide customer support</li>
                <li>Detect fraud and unauthorized access</li>
              </ul>
            </section>

            {/* Data Security */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <Lock className="w-5 h-5 text-primary-600" /> Data Security
              </h2>
              <p>All password data is securely stored using industry-standard encryption. We implement security best practices to protect your information from unauthorized access.</p>
            </section>

            {/* Third Party Services */}
            <section>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <Server className="w-5 h-5 text-primary-600" /> Third Party Services
              </h2>
              <p className="mb-3">VaultPass uses trusted third-party services including:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Firebase Authentication</li>
                <li>Google Sign-In</li>
                <li>Firebase Firestore</li>
                <li>Google Analytics (if enabled)</li>
              </ul>
              <p className="mt-3 text-sm text-slate-400 italic">These providers have their own privacy policies governing how they process your data.</p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <ShieldCheck className="w-5 h-5 text-primary-600" /> Data Retention
              </h2>
              <p>Your data remains in your account until you delete it or request account removal.</p>
            </section>

            {/* Your Rights */}
            <section className="bg-slate-50/50 p-5 rounded-xl border border-slate-100">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-3">
                <UserCheck className="w-5 h-5 text-primary-600" /> Your Rights
              </h2>
              <p className="mb-3">You may:</p>
              <ul className="list-disc pl-5 space-y-1.5 text-sm text-slate-600">
                <li>Access your stored data</li>
                <li>Update your information</li>
                <li>Delete your passwords</li>
                <li>Request permanent account deletion</li>
              </ul>
            </section>

            {/* Contact */}
            <section className="pt-4">
              <h2 className="flex items-center gap-2.5 text-lg font-semibold text-slate-900 mb-2">
                <Mail className="w-5 h-5 text-primary-600" /> Contact
              </h2>
              <p className="mb-2">If you have any questions regarding this Privacy Policy, please contact us.</p>
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