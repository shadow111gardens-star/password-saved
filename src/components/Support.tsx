import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft, HelpCircle, Key, Lock, EyeOff, UserMinus, Mail, Clock } from 'lucide-react';

export default function Support() {
  const faqs = [
    {
      question: "How do I reset my account?",
      answer: "Simply sign in again using your Google account. Since we use secure authentication, you do not need a separate password to access your vault.",
      icon: <Key className="w-5 h-5 text-primary-600" />
    },
    {
      question: "How secure is VaultPass?",
      answer: "We use secure authentication and encrypted cloud storage to help protect your password data. Your security and privacy are our highest priorities.",
      icon: <Lock className="w-5 h-5 text-primary-600" />
    },
    {
      question: "Can I export my passwords?",
      answer: "This feature is currently in our roadmap and may be available in future product updates to help you manage your data seamlessly.",
      icon: <EyeOff className="w-5 h-5 text-primary-600" />
    },
    {
      question: "Can I delete my account?",
      answer: "Yes, absolutely. Please contact our support team via email for permanent account and data deletion from our servers.",
      icon: <UserMinus className="w-5 h-5 text-primary-600" />
    }
  ];

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
                <HelpCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Support Center</h1>
                <p className="text-sm text-slate-500 mt-1">Need help? We're here for you.</p>
              </div>
            </div>
          </div>

          {/* FAQs Section */}
          <div className="mb-10">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Frequently Asked Questions</h2>
            <div className="grid gap-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-slate-50/60 p-5 rounded-xl border border-slate-200/60">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 shrink-0 bg-white p-1.5 rounded-lg border border-slate-100 shadow-sm">
                      {faq.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-1.5">{faq.question}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Support Box */}
          <div className="pt-6 border-t border-slate-100">
            <div className="bg-primary-50/50 rounded-xl p-6 border border-primary-100/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 mb-1">
                  <Mail className="w-5 h-5 text-primary-600" /> Contact Support
                </h2>
                <p className="text-sm text-slate-600">If you experience any issues, please contact us.</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>We aim to respond within 24–48 business hours.</span>
                </div>
              </div>
              
              <a 
                href="mailto:solankiabhay722@gmail.com" 
                className="w-full sm:w-auto text-center bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium px-5 py-2.5 rounded-xl shadow-sm transition-colors"
              >
                solankiabhay722@gmail.com
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}