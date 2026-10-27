import React, { useState } from 'react';
import { CATEGORY_REQUIRED_DOCUMENTS } from '../../services/validationEngine';
import { ApplicationCategory } from '../../types';
import { NavigationPage } from '../common/Header';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  FileCheck,
} from 'lucide-react';

interface DocumentRequirementsPageProps {
  setCurrentPage: (page: NavigationPage) => void;
}

export const DocumentRequirementsPage: React.FC<DocumentRequirementsPageProps> = ({
  setCurrentPage,
}) => {
  const [selectedCat, setSelectedCat] = useState<ApplicationCategory>('Extension of Approval (EoA)');

  const categories: ApplicationCategory[] = [
    'Extension of Approval (EoA)',
    'New Institution Approval',
    'Change in Approved Intake',
    'Addition or Change of Programme',
    'Other Approval-Related Change',
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#DCE4ED] pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
              <FileText className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#142B4A]">
              Document Enclosure Requirements by Category
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#637287] mt-1">
            Check prescribed statutory attachments, acceptable validity periods, and common scrutiny hurdles.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('wizard')}
          className="px-4 py-2.5 bg-[#087F8C] hover:bg-[#076b77] text-white rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start"
        >
          <FileCheck className="w-4 h-4" />
          <span>Validate Documents</span>
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCat(cat)}
            className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
              selectedCat === cat
                ? 'bg-[#142B4A] text-white shadow-xs'
                : 'bg-white border border-[#DCE4ED] text-[#172B42] hover:bg-[#F2F5F9]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Selected Category Details */}
      <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-xs space-y-6">
        <div className="border-b border-[#DCE4ED] pb-3">
          <h2 className="text-base font-bold text-[#142B4A]">
            Mandatory & Recommended Enclosures for: <span className="text-[#087F8C]">{selectedCat}</span>
          </h2>
          <p className="text-xs text-[#637287] mt-0.5">
            AICTE Approval Process Handbook compliance criteria for this category.
          </p>
        </div>

        <div className="space-y-3">
          {CATEGORY_REQUIRED_DOCUMENTS[selectedCat].map((doc, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                doc.mandatory
                  ? 'border-slate-200 bg-[#F2F5F9]/60'
                  : 'border-slate-200 bg-white'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-[#142B4A]">{doc.label}</span>
                  {doc.mandatory ? (
                    <span className="text-[10px] font-bold text-[#C43D4B] bg-rose-50 border border-rose-200 px-1.5 py-0.2 rounded">
                      Mandatory
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold text-[#637287] bg-slate-100 px-1.5 py-0.2 rounded">
                      Optional / Facilitative
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#637287]">
                  Category: <strong>{doc.category}</strong>
                </div>
              </div>

              <div className="text-right sm:max-w-xs text-[11px] text-[#172B42]">
                <span className="text-slate-400 block text-[10px]">Acceptable formats:</span>
                PDF, JPG, PNG (Max 15MB)
              </div>
            </div>
          ))}
        </div>

        {/* Technical Guidance */}
        <div className="p-4 rounded-lg bg-[#E6F4F3]/60 border border-[#087F8C]/30 text-xs text-[#142B4A] space-y-1.5">
          <div className="font-bold text-[#087F8C] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>Common Scrutiny Hurdles to Avoid</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-[11px] text-[#172B42]">
            <li>Ensure the Permanent Institute ID (PID) in all certificates exactly matches your college PID.</li>
            <li>Verify that Fire Safety and Structural Stability certificates do not lapse before the academic session start date.</li>
            <li>Ensure affidavits carry legitimate Notary seals, registration numbers, and advocate counter-signatures.</li>
            <li>Do not upload duplicate PDF scans under distinct required categories.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
