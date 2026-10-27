import React from 'react';
import { SatyakLogo } from './SatyakLogo';
import { NavigationPage } from './Header';
import { ShieldCheck, ExternalLink, AlertTriangle } from 'lucide-react';

interface FooterProps {
  setCurrentPage: (page: NavigationPage) => void;
  onResetData: () => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage, onResetData }) => {
  return (
    <footer className="bg-[#142B4A] text-slate-300 border-t border-[#203C5B] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-700/60">
          {/* Brand & Purpose */}
          <div className="lg:col-span-2 space-y-4">
            <div className="bg-white/10 p-2.5 rounded-lg inline-block">
              <SatyakLogo size="md" />
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-sm">
              <strong className="text-white">SATYAK</strong> (Smart Application Tracking, Authentication & Knowledge System) provides automated document completeness verification, consistency auditing, and regulatory assistance for technical educational institutions.
            </p>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Application Workflows
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('wizard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Check Application Readiness
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('dashboard')}
                  className="hover:text-white transition-colors text-left"
                >
                  Institution Dashboard
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('officer')}
                  className="hover:text-white transition-colors text-left"
                >
                  Reviewing Officer Workspace
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('verification')}
                  className="hover:text-white transition-colors text-left"
                >
                  Verification Services Registry
                </button>
              </li>
            </ul>
          </div>

          {/* Compliance & Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Compliance & Guidance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => setCurrentPage('compliance')}
                  className="hover:text-white transition-colors text-left"
                >
                  Regulatory Compliance Guide
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('process')}
                  className="hover:text-white transition-colors text-left"
                >
                  Approval Journey & Timelines
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('requirements')}
                  className="hover:text-white transition-colors text-left"
                >
                  Document Checklist by Category
                </button>
              </li>
              <li>
                <button
                  onClick={() => setCurrentPage('faqs')}
                  className="hover:text-white transition-colors text-left"
                >
                  Frequently Asked Questions
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Disclaimer Banner */}
        <div className="mt-8 p-4 rounded-lg bg-[#203C5B]/60 border border-slate-700/80 text-xs text-slate-300 flex flex-col sm:flex-row items-start sm:items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-[#B7791F] shrink-0" />
          <div className="leading-relaxed">
            <strong className="text-white">Statutory & Prototype Disclaimer:</strong> SATYAK is an independent hackathon prototype designed solely for demonstration and research purposes. All institutional applications, registration codes, certificate identifiers, and issuer database records are synthetic. SATYAK is not an official portal of the All India Council for Technical Education (AICTE) or Ministry of Education, Government of India, and does not replace statutory scrutiny by authorized committees.
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-2">
          <div>
            © 2026 SATYAK Project. Built for AICTE Validation & Document Verification Hackathon Challenge.
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">All data stored locally in browser sandbox</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
