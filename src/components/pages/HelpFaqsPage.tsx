import React, { useState } from 'react';
import { HelpCircle, Search, ChevronDown, ChevronUp, ShieldCheck, Scale, AlertTriangle } from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'General' | 'Validation Rules' | 'Security & Legal' | 'Remediation';
}

const FAQS: FaqItem[] = [
  {
    id: 'faq-01',
    category: 'General',
    question: 'What is SATYAK?',
    answer:
      'SATYAK stands for Smart Application Tracking, Authentication & Knowledge System. It is an AI-assisted and rule-based validation prototype created to help technical institutions verify application completeness and document consistency, and assist authorized reviewing officers in identifying missing items, expired permissions, and regulatory anomalies.',
  },
  {
    id: 'faq-02',
    category: 'General',
    question: 'Can SATYAK grant AICTE approval?',
    answer:
      'No. SATYAK is an advisory decision-support prototype. It has no statutory authority to grant, reject, or modify formal AICTE regulatory approvals. Final approval decisions are strictly the prerogative of authorized regional scrutiny committees, the Executive Committee, and the Council.',
  },
  {
    id: 'faq-03',
    category: 'General',
    question: 'Is SATYAK connected to live AICTE or Government servers?',
    answer:
      'No. SATYAK operates in an independent demonstration sandbox with synthetic records. It does not scrape live restricted government portals, access confidential national databases, or bypass official authentication.',
  },
  {
    id: 'faq-04',
    category: 'Validation Rules',
    question: 'What is "Application Readiness"?',
    answer:
      'Application Readiness is an internal prototype indicator (scored from 0% to 100%) that measures how closely an uploaded application bundle conforms to the configured checklist and consistency rules for its category. It is an advisory readiness check to help colleges fix issues prior to formal submission.',
  },
  {
    id: 'faq-05',
    category: 'Validation Rules',
    question: 'Does a failed check or anomaly flag prove that a document is forged?',
    answer:
      'Absolutely not. An anomaly flag (such as mismatched dates, typographical errors in institution codes, or low resolution) indicates a clerical or structural discrepancy requiring human examination. It does not establish fraud or forgery. In technical education workflows, innocent clerical mistakes and scan issues are common and must be reviewed with procedural fairness.',
  },
  {
    id: 'faq-06',
    category: 'Validation Rules',
    question: 'What does "Verification Pending" mean?',
    answer:
      '"Verification Pending" indicates that a statutory certificate (such as NBA accreditation, State DTE NOC, or University affiliation) has been uploaded but has not yet been cross-referenced against the issuer registry or that an external automated registry was unreachable.',
  },
  {
    id: 'faq-07',
    category: 'Remediation',
    question: 'What should I do if a certificate has expired?',
    answer:
      'When a regulatory document (such as a Fire Safety NOC or Structural Stability certificate) has expired relative to the application evaluation benchmark date, the institution must upload a certified renewal order or official extension from the issuing municipal or state authority.',
  },
  {
    id: 'faq-08',
    category: 'Validation Rules',
    question: 'What happens when an issuer source is unavailable?',
    answer:
      'When a simulated or live issuer API is unreachable (e.g. gateway timeout), SATYAK flags the record as "Source Unavailable" without penalizing the institution. The case is queued for manual verification or off-peak re-query.',
  },
  {
    id: 'faq-09',
    category: 'Validation Rules',
    question: 'When is manual verification required?',
    answer:
      'Manual verification is mandated whenever automated heuristics detect conflicting parameters across documents, when an unparsed scan is uploaded, or when qualitative physical criteria (such as faculty cadre rosters or building accessibility) require human judgment.',
  },
  {
    id: 'faq-10',
    category: 'Security & Legal',
    question: 'How is institutional data handled in SATYAK?',
    answer:
      'In this hackathon demonstration environment, all application records, document metadata, and reviewer audit logs are held in local browser sandbox storage. No real personal identities or confidential college property deeds are uploaded or transmitted to external third parties.',
  },
];

export const HelpFaqsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-01');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  const filteredFaqs = FAQS.filter((f) => {
    if (activeCategory !== 'ALL' && f.category !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${f.question} ${f.answer} ${f.category}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-[#DCE4ED] pb-6">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
            <HelpCircle className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-[#142B4A]">
            Help, Documentation & Frequently Asked Questions
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#637287] mt-1">
          Non-technical guidance on application readiness, anomaly flags, issuer verification, and prototype boundaries.
        </p>
      </div>

      {/* Search and Category Filter */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder="Search FAQs (e.g., 'forged', 'expired', 'readiness', 'AICTE approval')..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#DCE4ED] bg-white text-xs focus:ring-1 focus:ring-[#087F8C] outline-none shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {['ALL', 'General', 'Validation Rules', 'Remediation', 'Security & Legal'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
                activeCategory === cat
                  ? 'bg-[#142B4A] text-white'
                  : 'bg-white border border-[#DCE4ED] text-[#172B42] hover:bg-[#F2F5F9]'
              }`}
            >
              {cat === 'ALL' ? 'All Questions' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs Accordion */}
      <div className="space-y-3">
        {filteredFaqs.map((faq) => {
          const isOpen = expandedFaq === faq.id;

          return (
            <div
              key={faq.id}
              className="bg-white rounded-xl border border-[#DCE4ED] shadow-xs overflow-hidden transition-all hover:border-[#087F8C]"
            >
              <button
                onClick={() => setExpandedFaq(isOpen ? null : faq.id)}
                className="w-full p-4 text-left flex items-start justify-between gap-3 select-none"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#087F8C] bg-[#E6F4F3] px-1.5 py-0.2 rounded">
                    {faq.category}
                  </span>
                  <h3 className="text-sm font-bold text-[#142B4A] mt-1.5">
                    {faq.question}
                  </h3>
                </div>
                <div className="p-1 text-slate-400 shrink-0">
                  {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-[#DCE4ED] text-xs text-[#172B42] leading-relaxed bg-[#F2F5F9]/40">
                  {faq.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Trust & Transparency Note */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-300 text-xs text-[#637287] flex items-start gap-2.5">
        <ShieldCheck className="w-5 h-5 text-[#087F8C] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Key Takeaway:</strong> Automated checks in SATYAK are decision-support tools designed to identify what needs attention, explain why, and link every observation to evidence—without replacing human regulatory judgment.
        </p>
      </div>
    </div>
  );
};
