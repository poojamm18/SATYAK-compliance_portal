import React from 'react';
import { NavigationPage } from '../common/Header';
import { Application, UserRole } from '../../types';
import {
  FileCheck,
  ShieldCheck,
  BookOpen,
  History,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Layers,
  Search,
  Scale,
  Sparkles,
  Fingerprint,
  Building,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: NavigationPage) => void;
  onSelectApplication: (app: Application) => void;
  applications: Application[];
  setActiveRole: (role: UserRole) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  setCurrentPage,
  onSelectApplication,
  applications,
  setActiveRole,
}) => {
  return (
    <div className="space-y-16 py-6 sm:py-10">
      {/* SECTION B: HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Text & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F3] text-[#087F8C] border border-[#087F8C]/30 tracking-wide uppercase">
              <ShieldCheck className="w-4 h-4" />
              <span>Application Validation & Compliance Assistance</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#142B4A] tracking-tight leading-[1.15]">
              Know what's missing <br className="hidden sm:inline" />
              <span className="text-[#087F8C]">before your application</span> is reviewed.
            </h1>

            <p className="text-base sm:text-lg text-[#637287] leading-relaxed max-w-2xl">
              SATYAK helps technical institutions validate application details, check document completeness, identify inconsistencies and understand which items require further verification before formal regulatory submission.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => setCurrentPage('wizard')}
                className="px-6 py-3.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-sm shadow-md transition-all flex items-center justify-center gap-2 group"
              >
                <span>Check Application Readiness</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setCurrentPage('process')}
                className="px-6 py-3.5 rounded-lg bg-white hover:bg-slate-50 text-[#142B4A] border border-[#DCE4ED] font-semibold text-sm shadow-xs transition-all flex items-center justify-center gap-2"
              >
                <span>Explore the Approval Process</span>
              </button>
            </div>

            {/* Disclaimer & Trust Note */}
            <div className="pt-2 text-xs text-[#637287] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#16805D]" />
              <span>Independent prototype using synthetic demonstration data. Not an official AICTE portal.</span>
            </div>
          </div>

          {/* Right Column: Stylized Application Summary & Document Verification Panel */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-xl border border-[#DCE4ED] shadow-lg p-5 relative overflow-hidden">
              {/* Header card preview */}
              <div className="border-b border-[#DCE4ED] pb-4 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-[#087F8C] bg-[#E6F4F3] px-2 py-0.5 rounded">
                    SATYAK-2026-APP-101
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#16805D] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3 h-3" /> Readiness: 88%
                  </span>
                </div>
                <h3 className="text-sm font-bold text-[#142B4A] mt-2">
                  Apex Institute of Technology, Bengaluru
                </h3>
                <p className="text-xs text-[#637287]">
                  Category: Extension of Approval (EoA) • Academic Year 2026–27
                </p>
              </div>

              {/* Status Indicators breakdown */}
              <div className="grid grid-cols-3 gap-2 mb-4 text-center">
                <div className="bg-[#F2F5F9] p-2 rounded-lg border border-[#DCE4ED]">
                  <div className="text-base font-bold text-[#16805D]">12</div>
                  <div className="text-[10px] text-[#637287] font-medium uppercase">Passed</div>
                </div>
                <div className="bg-[#F2F5F9] p-2 rounded-lg border border-[#DCE4ED]">
                  <div className="text-base font-bold text-[#B7791F]">1</div>
                  <div className="text-[10px] text-[#637287] font-medium uppercase">Attention</div>
                </div>
                <div className="bg-[#F2F5F9] p-2 rounded-lg border border-[#DCE4ED]">
                  <div className="text-base font-bold text-[#142B4A]">0</div>
                  <div className="text-[10px] text-[#637287] font-medium uppercase">Blocking</div>
                </div>
              </div>

              {/* Verified Documents Sample List */}
              <div className="space-y-2 mb-4">
                <div className="text-xs font-bold text-[#142B4A] flex items-center justify-between">
                  <span>Audited Document Inventory</span>
                  <span className="text-[10px] text-[#637287]">5 Verified Files</span>
                </div>

                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-[#087F8C]" />
                    <span className="font-medium text-[#172B42] truncate">AICTE_EoA_Order_2025_26.pdf</span>
                  </div>
                  <span className="text-[10px] text-[#16805D] font-bold shrink-0">Valid (2026-11)</span>
                </div>

                <div className="p-2 rounded bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileText className="w-3.5 h-3.5 text-[#087F8C]" />
                    <span className="font-medium text-[#172B42] truncate">FireSafety_Certificate.pdf</span>
                  </div>
                  <span className="text-[10px] text-[#16805D] font-bold shrink-0">Valid (2027-03)</span>
                </div>

                <div className="p-2 rounded bg-amber-50/70 border border-amber-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <AlertTriangle className="w-3.5 h-3.5 text-[#B7791F]" />
                    <span className="font-medium text-amber-900 truncate">Faculty_Cadre_Roster.pdf</span>
                  </div>
                  <span className="text-[10px] text-[#B7791F] font-bold shrink-0">Manual Check</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => {
                  const demoApp = applications.find((a) => a.id === 'app-001') || applications[0];
                  if (demoApp) {
                    onSelectApplication(demoApp);
                    setCurrentPage('results');
                  }
                }}
                className="w-full py-2 px-3 rounded bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Inspect Full Validation Findings Report</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK BENCHMARK TEST LAUNCHER (Evaluator Sandbox) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white border border-[#DCE4ED] rounded-xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 border-b border-[#DCE4ED] pb-3">
            <div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#087F8C]" />
                <h2 className="text-sm sm:text-base font-bold text-[#142B4A]">
                  Pre-configured Test Scenarios for Hackathon Evaluators
                </h2>
              </div>
              <p className="text-xs text-[#637287] mt-0.5">
                Inspect 5 realistic compliance situations with different discrepancies and findings in 1-click.
              </p>
            </div>
            <span className="text-[11px] font-mono text-[#087F8C] bg-[#E6F4F3] px-2.5 py-1 rounded">
              5 Demonstration Cases Loaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {applications.map((app, idx) => {
              const caseBadges = [
                { title: 'Case 1: Complete', tag: 'High Readiness', color: 'border-emerald-300 bg-emerald-50 text-emerald-800' },
                { title: 'Case 2: Missing Docs', tag: '2 Missing Docs', color: 'border-rose-300 bg-rose-50 text-rose-800' },
                { title: 'Case 3: Expired Cert', tag: 'Expired Fire NOC', color: 'border-rose-300 bg-rose-50 text-rose-800' },
                { title: 'Case 4: Inconsistency', tag: 'PID & Intake Mismatch', color: 'border-amber-300 bg-amber-50 text-amber-800' },
                { title: 'Case 5: Duplicate', tag: 'Duplicate SHA-256', color: 'border-purple-300 bg-purple-50 text-purple-800' },
              ];
              const badge = caseBadges[idx] || { title: `Case ${idx + 1}`, tag: app.category, color: 'border-slate-300 bg-slate-50 text-slate-800' };

              return (
                <div
                  key={app.id}
                  onClick={() => {
                    onSelectApplication(app);
                    setCurrentPage('results');
                  }}
                  className="group cursor-pointer p-3 rounded-lg border border-[#DCE4ED] hover:border-[#087F8C] hover:shadow-md transition-all bg-white flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-[#142B4A]">{badge.title}</span>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${badge.color}`}>
                        {badge.tag}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-[#172B42] line-clamp-1 group-hover:text-[#087F8C]">
                      {app.institutionName}
                    </div>
                    <div className="text-[10px] text-[#637287] mt-1 flex items-center justify-between">
                      <span>{app.refNumber}</span>
                      <span className="font-semibold text-[#142B4A]">{app.readinessScore}% Score</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-[#087F8C] font-semibold">
                    <span>View Audit</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SECTION C: 4 FUNCTIONAL SERVICE CARDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A]">
            Core SATYAK Capabilities
          </h2>
          <p className="text-sm text-[#637287] mt-2">
            Every feature is designed around deterministic verification rules, explainable findings, and traceable accountability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: Application Validation */}
          <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F3] text-[#087F8C] flex items-center justify-center">
                <FileCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#142B4A]">
                Application Validation
              </h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                Identify missing fields, incomplete submissions, expired documents, and inconsistent records across multi-year approvals.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('wizard')}
              className="mt-6 w-full py-2.5 px-3 rounded-md bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Validate an Application</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 2: Document Verification */}
          <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F3] text-[#087F8C] flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#142B4A]">
                Document Verification
              </h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                Check document references against configured demonstration registries (State DTE, NBA, Affiliating Universities, Fire Services).
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('verification')}
              className="mt-6 w-full py-2.5 px-3 rounded-md bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Explore Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 3: Compliance Assistance */}
          <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F3] text-[#087F8C] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#142B4A]">
                Compliance Assistance
              </h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                Review configurable statutory requirements relevant to EoA, New Institutions, Intake Changes, and New Programmes in plain language.
              </p>
            </div>
            <button
              onClick={() => setCurrentPage('compliance')}
              className="mt-6 w-full py-2.5 px-3 rounded-md bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>View Requirements</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Card 4: Review & Audit Trail */}
          <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#E6F4F3] text-[#087F8C] flex items-center justify-center">
                <History className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-[#142B4A]">
                Review & Audit Trail
              </h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                Understand findings, reviewer observations, inspection referrals, and append-only audit logs recorded for every application.
              </p>
            </div>
            <button
              onClick={() => {
                setActiveRole('Reviewing Officer');
                setCurrentPage('officer');
              }}
              className="mt-6 w-full py-2.5 px-3 rounded-md bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Open Review Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* SECTION D: HOW SATYAK WORKS (5-STEP PROCESS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#DCE4ED] p-6 sm:p-10 shadow-sm">
          <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
              Systematic Scrutiny
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#142B4A] mt-1">
              How SATYAK Works
            </h2>
            <p className="text-xs sm:text-sm text-[#637287] mt-1">
              An evidence-first, five-phase verification lifecycle from drafting to officer scrutiny.
            </p>
          </div>

          {/* Desktop Horizontal Process / Mobile Vertical Stepper */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6 relative">
            {/* Step 1 */}
            <div className="flex md:flex-col items-start gap-4 p-4 rounded-xl bg-[#F2F5F9] border border-[#DCE4ED]">
              <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                1
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A]">
                  Select Category
                </h4>
                <p className="text-[11px] text-[#637287] mt-1 leading-normal">
                  Choose EoA, New College, Intake Expansion, or Programme Addition to tailor the checklist.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex md:flex-col items-start gap-4 p-4 rounded-xl bg-[#F2F5F9] border border-[#DCE4ED]">
              <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                2
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A]">
                  Enter & Upload
                </h4>
                <p className="text-[11px] text-[#637287] mt-1 leading-normal">
                  Input PID and details, then attach statutory PDFs (NOCs, Affidavits, Cadre rosters).
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex md:flex-col items-start gap-4 p-4 rounded-xl bg-[#F2F5F9] border border-[#DCE4ED]">
              <div className="w-8 h-8 rounded-full bg-[#087F8C] text-white flex items-center justify-center font-bold text-xs shrink-0">
                3
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A]">
                  Run Validation
                </h4>
                <p className="text-[11px] text-[#637287] mt-1 leading-normal">
                  Deterministic engine checks mandatory completeness, expiry, duplicate hashes, and PID matches.
                </p>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex md:flex-col items-start gap-4 p-4 rounded-xl bg-[#F2F5F9] border border-[#DCE4ED]">
              <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                4
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A]">
                  Review Findings
                </h4>
                <p className="text-[11px] text-[#637287] mt-1 leading-normal">
                  Inspect evidence-linked discrepancies, expected vs observed parameters, and remedies.
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex md:flex-col items-start gap-4 p-4 rounded-xl bg-[#F2F5F9] border border-[#DCE4ED]">
              <div className="w-8 h-8 rounded-full bg-[#142B4A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                5
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#142B4A]">
                  Resolve or Route
                </h4>
                <p className="text-[11px] text-[#637287] mt-1 leading-normal">
                  Upload corrections or route for Reviewing Officer scrutiny, verification, or inspection.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION E: WHAT SATYAK CHECKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#142B4A] rounded-2xl p-6 sm:p-10 text-white shadow-lg">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider bg-white/10 px-2 py-0.5 rounded">
              Comprehensive Checkpoint Matrix
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
              What SATYAK Checks
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Deterministic, explainable rules replace black-box assumptions with verified evidence trails.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-[#203C5B] border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-[#087F8C] font-semibold text-xs">
                <FileText className="w-4 h-4" />
                <span className="text-white">Missing & Incomplete Docs</span>
              </div>
              <p className="text-xs text-slate-300">
                Audits uploaded document inventory against mandatory regulatory checklists for each category.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#203C5B] border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-[#087F8C] font-semibold text-xs">
                <Clock className="w-4 h-4" />
                <span className="text-white">Expired Certificates</span>
              </div>
              <p className="text-xs text-slate-300">
                Calculates remaining validity against the academic year benchmark; flags lapsed Fire Safety and NOCs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#203C5B] border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-[#087F8C] font-semibold text-xs">
                <AlertCircle className="w-4 h-4" />
                <span className="text-white">Inconsistent Information</span>
              </div>
              <p className="text-xs text-slate-300">
                Cross-compares Permanent Institute ID (PID), college title, and sanctioned intake across documents.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#203C5B] border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-[#087F8C] font-semibold text-xs">
                <Fingerprint className="w-4 h-4" />
                <span className="text-white">Duplicate File Hashes</span>
              </div>
              <p className="text-xs text-slate-300">
                Computes cryptographic SHA-256 hashes to detect when the exact same file is reused across different requirements.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#203C5B] border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-[#087F8C] font-semibold text-xs">
                <Scale className="w-4 h-4" />
                <span className="text-white">Issuer Verification</span>
              </div>
              <p className="text-xs text-slate-300">
                Cross-references reference IDs against synthetic registries for State DTE, NBA, and Universities.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#203C5B] border border-slate-700/80 space-y-1.5">
              <div className="flex items-center gap-2 text-[#087F8C] font-semibold text-xs">
                <Building className="w-4 h-4" />
                <span className="text-white">Inspection Escalation</span>
              </div>
              <p className="text-xs text-slate-300">
                Routes high-severity discrepancies and infrastructure deficits for physical expert committee inspection.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION F: TRUST AND TRANSPARENCY PRINCIPLES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#E6F4F3]/50 border border-[#087F8C]/20 rounded-2xl p-6 sm:p-8">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-xs font-bold text-[#087F8C] uppercase tracking-wider">
              Governance & Ethics
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#142B4A] mt-1">
              Trust & Transparency Principles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-xl border border-[#DCE4ED]">
              <div className="text-xs font-bold text-[#087F8C] uppercase mb-1">Principle 1</div>
              <h3 className="text-sm font-bold text-[#142B4A] mb-2">Evidence-Linked Findings</h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                No opaque scoring. Every finding explicitly cites the source document, line number or metadata, expected vs observed values, and governing rule.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#DCE4ED]">
              <div className="text-xs font-bold text-[#087F8C] uppercase mb-1">Principle 2</div>
              <h3 className="text-sm font-bold text-[#142B4A] mb-2">Traceable Verification & Actions</h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                All document uploads, validation runs, issuer checks, and reviewer observations are recorded in an append-only audit trail with timestamps.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-[#DCE4ED]">
              <div className="text-xs font-bold text-[#087F8C] uppercase mb-1">Principle 3</div>
              <h3 className="text-sm font-bold text-[#142B4A] mb-2">Human Review Decides Final Status</h3>
              <p className="text-xs text-[#637287] leading-relaxed">
                Automated checks are strictly decision-support tools. Adverse regulatory conclusions always require scrutiny and approval by authorized human officers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
