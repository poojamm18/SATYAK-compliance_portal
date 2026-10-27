import React from 'react';
import { NavigationPage } from '../common/Header';
import {
  Workflow,
  ArrowRight,
  FileCheck,
  ShieldCheck,
  Eye,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';

interface ApplicationProcessPageProps {
  setCurrentPage: (page: NavigationPage) => void;
}

export const ApplicationProcessPage: React.FC<ApplicationProcessPageProps> = ({
  setCurrentPage,
}) => {
  const steps = [
    {
      num: 1,
      title: 'Institutional Application Preparation',
      actor: 'Institution Administrator',
      assistedBySatyak: true,
      desc: 'Institution compiles academic statistics, faculty cadre rosters, student intake requirements, and collects statutory NOC certificates.',
      satyakRole: 'Pre-submission checklist guides required documents for chosen category.',
    },
    {
      num: 2,
      title: 'Document Upload & Category Mapping',
      actor: 'Institution Administrator',
      assistedBySatyak: true,
      desc: 'Statutory PDF documents (Affidavits, PWD/Fire Safety certificates, University NOCs) are uploaded into the workspace.',
      satyakRole: 'Automatic file type, size, and cryptographic SHA-256 hash calculation.',
    },
    {
      num: 3,
      title: 'SATYAK Automated Preliminary Validation',
      actor: 'SATYAK Deterministic Engine',
      assistedBySatyak: true,
      desc: 'System audits inventory against mandatory rules, checks certificate expiration dates, flags PID mismatches, and detects duplicate files.',
      satyakRole: 'Produces structured Readiness Report with clear, evidence-linked findings.',
    },
    {
      num: 4,
      title: 'Demonstration Issuer Verification',
      actor: 'Issuing Authorities (DTE / University / NBA)',
      assistedBySatyak: true,
      desc: 'Cross-checks unique document dispatch numbers and accreditation identifiers against synthetic demonstration databases.',
      satyakRole: 'Displays match, mismatch, expired, or source-unavailable status indicators.',
    },
    {
      num: 5,
      title: 'Authorized Officer Scrutiny',
      actor: 'Regional Scrutiny Committee Officers',
      assistedBySatyak: false,
      desc: 'Human reviewing officers examine findings, verify original counter-signed documents, and record observations.',
      satyakRole: 'Provides officer queue, evidence side-by-side viewer, and audit log.',
    },
    {
      num: 6,
      title: 'Additional Evidence / EVC Inspection',
      actor: 'Expert Visit Committee (EVC)',
      assistedBySatyak: false,
      desc: 'If high-severity anomalies or infrastructure disputes persist, physical inspection of campus premises is ordered.',
      satyakRole: 'Cases flagged with "Referred for Inspection" and documented in audit log.',
    },
    {
      num: 7,
      title: 'Final Statutory Decision',
      actor: 'Competent Authority (AICTE Council / Executive Committee)',
      assistedBySatyak: false,
      desc: 'Formal grant or refusal of Extension of Approval, New College Approval, or Intake Revision.',
      satyakRole: 'Not performed by SATYAK. Exclusively the prerogative of authorized council.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title */}
      <div className="border-b border-[#DCE4ED] pb-6">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
            <Workflow className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-[#142B4A]">
            Technical Education Approval Journey & Workflow
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#637287] mt-1 max-w-3xl">
          Understand the end-to-end regulatory process: from pre-submission document readiness check to scrutiny committee review and statutory decisions.
        </p>
      </div>

      {/* Responsibility Split Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-[#E6F4F3]/60 p-4 rounded-xl border border-[#087F8C]/30 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#087F8C]">
            <CheckCircle2 className="w-4 h-4" />
            <span>What SATYAK Assists With</span>
          </div>
          <p className="text-[#142B4A] leading-relaxed">
            Automated completeness validation, certificate expiry calculation, cross-record consistency checking, duplicate detection, and structured evidence logging.
          </p>
        </div>

        <div className="bg-slate-100 p-4 rounded-xl border border-slate-300 text-xs space-y-1">
          <div className="flex items-center gap-2 font-bold text-[#142B4A]">
            <ShieldCheck className="w-4 h-4" />
            <span>Statutory Human Prerogative</span>
          </div>
          <p className="text-[#637287] leading-relaxed">
            Final regulatory sanction, policy exemptions, physical premise measurement, and formal executive council orders remain with authorized officials.
          </p>
        </div>
      </div>

      {/* 7-Step Process Stepper */}
      <div className="space-y-4">
        {steps.map((st) => (
          <div
            key={st.num}
            className="p-5 rounded-xl border border-[#DCE4ED] bg-white shadow-xs flex flex-col md:flex-row md:items-start justify-between gap-4 text-xs"
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                  st.assistedBySatyak
                    ? 'bg-[#087F8C] text-white'
                    : 'bg-[#142B4A] text-white'
                }`}
              >
                {st.num}
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-bold text-[#142B4A]">
                    {st.title}
                  </h3>
                  <span className="text-[10px] font-semibold bg-slate-100 text-[#637287] px-2 py-0.5 rounded">
                    Actor: {st.actor}
                  </span>
                  {st.assistedBySatyak ? (
                    <span className="text-[10px] font-bold text-[#087F8C] bg-[#E6F4F3] px-2 py-0.5 rounded">
                      SATYAK Assisted
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#142B4A] bg-slate-200 px-2 py-0.5 rounded">
                      Human Authority
                    </span>
                  )}
                </div>

                <p className="text-xs text-[#172B42] leading-relaxed">
                  {st.desc}
                </p>

                <div className="text-[11px] text-[#087F8C] font-medium pt-1">
                  <strong>Role of SATYAK:</strong> {st.satyakRole}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Next Action Banner */}
      <div className="bg-[#142B4A] text-white p-6 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold">Ready to test an application?</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Run an instant pre-submission readiness check using synthetic data.
          </p>
        </div>
        <button
          onClick={() => setCurrentPage('wizard')}
          className="px-5 py-2.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-xs shadow-xs transition-colors shrink-0"
        >
          Check Application Readiness
        </button>
      </div>
    </div>
  );
};
