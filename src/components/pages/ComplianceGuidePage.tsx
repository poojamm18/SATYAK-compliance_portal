import React, { useState } from 'react';
import { COMPLIANCE_RULES } from '../../data/complianceRules';
import { ApplicationCategory } from '../../types';
import {
  BookOpen,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Building,
  Layers,
  ChevronDown,
  ChevronUp,
  FileText,
  ShieldCheck,
  Camera,
  Compass,
} from 'lucide-react';

export const ComplianceGuidePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'rules' | 'infrastructure'>('rules');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [expandedRuleId, setExpandedRuleId] = useState<string | null>(null);

  // Infrastructure Simulation state
  const [infraItems, setInfraItems] = useState([
    {
      id: 'inf-01',
      category: 'Classrooms & Smart Halls',
      requiredNorm: 'Minimum 66 sqm carpet area per classroom for 60 students with ICT projection.',
      observedEvidence: 'Architect Certificate confirms 18 Classrooms of 72 sqm each with interactive panels.',
      status: 'Compliant',
      photoEvidence: 'Audited Floor Plan DWG-A102.pdf & Geo-tagged photo bundle.',
    },
    {
      id: 'inf-02',
      category: 'Computer & Emerging Tech Labs',
      requiredNorm: 'Minimum 1 terminal per 2 students with Gigabit LAN & licensed software suites.',
      observedEvidence: '320 High-Performance Workstations installed for 420 approved student intake.',
      status: 'Compliant',
      photoEvidence: 'Purchase invoice & CISCO network topology diagram.',
    },
    {
      id: 'inf-03',
      category: 'Central Digital Library',
      requiredNorm: 'Minimum 400 sqm reading area with IEEE / Springer e-journal subscriptions.',
      observedEvidence: '520 sqm library area reported. Delnet & IEEE transaction invoice enclosed.',
      status: 'Compliant',
      photoEvidence: 'Library seating layout with RFID barrier gate photo.',
    },
    {
      id: 'inf-04',
      category: 'Barrier-Free Divyangjan Facilities',
      requiredNorm: 'Continuous gradient ramps (1:12), tactile paths, accessible lift with Braille.',
      observedEvidence: 'Ramp present on Ground Floor; 2nd floor accessible lift certificate pending municipal inspection.',
      status: 'Manual Inspection Recommended',
      photoEvidence: 'Lift installation notice & architect barrier-free declaration.',
    },
  ]);

  const filteredRules = COMPLIANCE_RULES.filter((rule) => {
    if (categoryFilter !== 'ALL' && rule.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${rule.title} ${rule.plainLanguage} ${rule.evidenceRequired} ${rule.normSource}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE4ED] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#142B4A]">
              Regulatory Compliance Guide & Norms Assistant
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#637287] mt-1">
            Plain-language explanations of technical education norms, evidence requirements, and infrastructure audit criteria.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex items-center bg-[#F2F5F9] p-1 rounded-lg border border-[#DCE4ED] self-start">
          <button
            onClick={() => setActiveTab('rules')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'rules' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-[#637287] hover:text-[#142B4A]'
            }`}
          >
            Regulatory Rules ({COMPLIANCE_RULES.length})
          </button>
          <button
            onClick={() => setActiveTab('infrastructure')}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-colors ${
              activeTab === 'infrastructure' ? 'bg-[#142B4A] text-white shadow-xs' : 'text-[#637287] hover:text-[#142B4A]'
            }`}
          >
            Infrastructure Compliance Assistance
          </button>
        </div>
      </div>

      {activeTab === 'rules' ? (
        <div className="space-y-6">
          {/* Search & Category Filter */}
          <div className="bg-white p-4 rounded-xl border border-[#DCE4ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
            <div className="relative w-full md:w-80">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              <input
                type="text"
                placeholder="Search norms by keyword, cadre ratio, land..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#DCE4ED] bg-[#F2F5F9]/60 focus:bg-white outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#637287] font-semibold flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Category:
              </span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              >
                <option value="ALL">All Categories</option>
                <option value="Extension of Approval (EoA)">Extension of Approval (EoA)</option>
                <option value="New Institution Approval">New Institution Approval</option>
                <option value="Change in Approved Intake">Change in Approved Intake</option>
                <option value="Addition or Change of Programme">Addition or Change of Programme</option>
                <option value="Other Approval-Related Change">Other Approval-Related Change</option>
              </select>
            </div>
          </div>

          {/* Rules Cards */}
          <div className="space-y-3">
            {filteredRules.map((rule) => {
              const isExpanded = expandedRuleId === rule.id;

              return (
                <div
                  key={rule.id}
                  className="bg-white rounded-xl border border-[#DCE4ED] shadow-xs overflow-hidden transition-all hover:border-[#087F8C]"
                >
                  <div
                    onClick={() => setExpandedRuleId(isExpanded ? null : rule.id)}
                    className="p-4 cursor-pointer flex items-start justify-between gap-3 select-none"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-[#087F8C] bg-[#E6F4F3] px-1.5 py-0.5 rounded">
                          {rule.id}
                        </span>
                        <span className="text-[10px] font-semibold bg-slate-100 text-[#142B4A] px-2 py-0.5 rounded">
                          {rule.category}
                        </span>
                        {rule.isMandatory && (
                          <span className="text-[10px] font-bold text-[#C43D4B] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                            Mandatory Norm
                          </span>
                        )}
                        {rule.requiresManualReview && (
                          <span className="text-[10px] font-semibold text-[#142B4A] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            Scrutiny Review Mandated
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm font-bold text-[#142B4A] mt-1">
                        {rule.title}
                      </h3>

                      <p className="text-xs text-[#637287] line-clamp-2">
                        {rule.plainLanguage}
                      </p>
                    </div>

                    <button className="text-slate-400 hover:text-slate-600 p-1 shrink-0">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-4 pb-4 pt-2 border-t border-[#DCE4ED] bg-[#F2F5F9]/50 text-xs space-y-3">
                      <div>
                        <span className="text-[10px] font-bold text-[#142B4A] uppercase block mb-1">
                          Plain-Language Requirement:
                        </span>
                        <p className="text-xs text-[#172B42] leading-relaxed">
                          {rule.plainLanguage}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-3 rounded-lg border border-[#DCE4ED]">
                        <div>
                          <span className="text-[10px] font-bold text-[#637287] uppercase block">
                            Evidence Normally Required:
                          </span>
                          <span className="font-medium text-[#172B42]">
                            {rule.evidenceRequired}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] font-bold text-[#637287] uppercase block">
                            Regulatory Source Benchmark:
                          </span>
                          <span className="font-semibold text-[#087F8C]">
                            {rule.normSource}
                          </span>
                        </div>
                      </div>

                      <div className="bg-[#E6F4F3]/60 p-3 rounded-lg border border-[#087F8C]/20">
                        <span className="text-[10px] font-bold text-[#087F8C] uppercase block mb-0.5">
                          Deterministic Validation Logic:
                        </span>
                        <p className="text-xs text-[#142B4A]">
                          {rule.validationLogicDescription}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* INFRASTRUCTURE COMPLIANCE ASSISTANCE SECTION (Section 12) */
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-xs space-y-4">
            <div className="border-b border-[#DCE4ED] pb-3">
              <h2 className="text-base font-bold text-[#142B4A]">
                Infrastructure Evidence Inventory & Rule-Based Review
              </h2>
              <p className="text-xs text-[#637287] mt-1">
                Review submitted architectural drawings, geo-tagged photographs, and equipment invoices against statutory floor area and facility standards.
              </p>
            </div>

            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong>Statutory Transparency Notice:</strong> Submitted photographs, floor plans, and digital certificates are decision-support items and cannot independently replace an authorized on-site Expert Visit Committee (EVC) inspection.
            </div>

            {/* Infrastructure Evidence Cards */}
            <div className="space-y-3 pt-2">
              {infraItems.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-[#DCE4ED] bg-white shadow-xs space-y-2 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <span className="font-bold text-sm text-[#142B4A]">
                      {item.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border self-start sm:self-auto ${
                        item.status === 'Compliant'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-[#F2F5F9] p-3 rounded-lg border border-[#DCE4ED]">
                    <div>
                      <span className="text-[10px] font-bold text-[#637287] uppercase block">
                        Prescribed Regulatory Norm:
                      </span>
                      <p className="text-xs text-[#172B42] mt-0.5">{item.requiredNorm}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-[#637287] uppercase block">
                        Observed Submission Evidence:
                      </span>
                      <p className="text-xs text-[#172B42] mt-0.5">{item.observedEvidence}</p>
                    </div>
                  </div>

                  <div className="text-[11px] text-[#087F8C] flex items-center gap-1.5 font-medium">
                    <Camera className="w-3.5 h-3.5 shrink-0" />
                    <span>Evidence Attached: {item.photoEvidence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
