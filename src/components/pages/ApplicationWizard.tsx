import React, { useState } from 'react';
import {
  Application,
  ApplicationCategory,
  DocumentCategory,
  DocumentMetadata,
  UserRole,
} from '../../types';
import {
  CATEGORY_REQUIRED_DOCUMENTS,
  computeFileHash,
  REFERENCE_DATE,
} from '../../services/validationEngine';
import { AppStorageService } from '../../services/storage';
import { NavigationPage } from '../common/Header';
import {
  CheckCircle2,
  AlertTriangle,
  Upload,
  Trash2,
  FileText,
  FileCheck,
  Building2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
  Calendar,
  ShieldCheck,
  Hash,
  FileCode,
  Loader2,
} from 'lucide-react';

interface ApplicationWizardProps {
  setCurrentPage: (page: NavigationPage) => void;
  onValidationComplete: (app: Application) => void;
  activeRole: UserRole;
}

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Assam',
  'Bihar',
  'Delhi (NCT)',
  'Gujarat',
  'Haryana',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Tamil Nadu',
  'Telangana',
  'Uttar Pradesh',
  'West Bengal',
];

export const ApplicationWizard: React.FC<ApplicationWizardProps> = ({
  setCurrentPage,
  onValidationComplete,
  activeRole,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Form State
  const [category, setCategory] = useState<ApplicationCategory>('Extension of Approval (EoA)');
  const [institutionName, setInstitutionName] = useState('Apex Institute of Technology, Bengaluru');
  const [institutionCode, setInstitutionCode] = useState('1-3489102');
  const [state, setState] = useState('Karnataka');
  const [academicYear, setAcademicYear] = useState('2026-2027');
  const [applicationDate, setApplicationDate] = useState('2026-10-27');
  const [refNumber, setRefNumber] = useState(`SATYAK-2026-APP-${Math.floor(100 + Math.random() * 900)}`);
  const [contactEmail, setContactEmail] = useState('principal@apextech.edu.in');
  const [headOfInstitute, setHeadOfInstitute] = useState('Dr. Ramesh Narayan Rao');

  // Documents State
  const [documents, setDocuments] = useState<DocumentMetadata[]>([]);

  // Manual doc entry modal / state
  const [selectedDocCategory, setSelectedDocCategory] = useState<DocumentCategory>('Previous Approval or EoA');
  const [customDocName, setCustomDocName] = useState('');
  const [customDocNumber, setCustomDocNumber] = useState('');
  const [customIssueDate, setCustomIssueDate] = useState('2025-06-10');
  const [customExpiryDate, setCustomExpiryDate] = useState('2026-11-30');
  const [customAuthority, setCustomAuthority] = useState('AICTE Regional Office');
  const [extractedIntake, setExtractedIntake] = useState<number | ''>(420);

  // Validation Simulation state
  const [isValidating, setIsValidating] = useState(false);
  const [validationProgressMessage, setValidationProgressMessage] = useState('');

  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Quick preset templates
  const loadPresetTemplate = (preset: 'clean' | 'missing' | 'expired' | 'mismatch') => {
    if (preset === 'clean') {
      setCategory('Extension of Approval (EoA)');
      setInstitutionName('Apex Institute of Technology, Bengaluru');
      setInstitutionCode('1-3489102');
      setState('Karnataka');
      setDocuments([
        {
          id: `doc-${Date.now()}-1`,
          name: 'AICTE_EoA_Previous_Order.pdf',
          category: 'Previous Approval or EoA',
          fileSize: 450000,
          fileType: 'application/pdf',
          uploadDate: '2026-10-27',
          sha256Hash: 'a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f61111',
          docNumber: 'AICTE-SW-EOA-2025-8812',
          issueDate: '2025-06-10',
          expiryDate: '2026-11-30',
          issuingAuthority: 'AICTE South-West Regional Office',
          extractedFields: { institutionName: 'Apex Institute of Technology, Bengaluru', institutionCode: '1-3489102', intakeCapacity: 420 },
          extractionMode: 'extracted',
          status: 'valid',
        },
        {
          id: `doc-${Date.now()}-2`,
          name: 'Compliance_Affidavit_2026.pdf',
          category: 'Affidavit or Undertaking',
          fileSize: 220000,
          fileType: 'application/pdf',
          uploadDate: '2026-10-27',
          sha256Hash: 'b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f62222',
          docNumber: 'NOTARY/BLR/2026/8921',
          issueDate: '2026-09-20',
          expiryDate: '2027-09-19',
          issuingAuthority: 'Judicial Magistrate / Notary',
          extractedFields: { institutionName: 'Apex Institute of Technology, Bengaluru', institutionCode: '1-3489102' },
          extractionMode: 'extracted',
          status: 'valid',
        },
        {
          id: `doc-${Date.now()}-3`,
          name: 'Faculty_Cadre_Roster_2026.pdf',
          category: 'Faculty-Related Evidence',
          fileSize: 520000,
          fileType: 'application/pdf',
          uploadDate: '2026-10-27',
          sha256Hash: 'c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f63333',
          docNumber: 'AIT/FAC/2026/ROSTER',
          issueDate: '2026-09-01',
          expiryDate: '2027-08-31',
          issuingAuthority: 'Board of Governors',
          extractedFields: { institutionName: 'Apex Institute of Technology, Bengaluru', institutionCode: '1-3489102', intakeCapacity: 420 },
          extractionMode: 'extracted',
          status: 'valid',
        },
        {
          id: `doc-${Date.now()}-4`,
          name: 'Fire_Safety_Occupancy_Certificate.pdf',
          category: 'Infrastructure Certificate',
          fileSize: 310000,
          fileType: 'application/pdf',
          uploadDate: '2026-10-27',
          sha256Hash: 'd4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f64444',
          docNumber: 'KSFES/BLR/NOC/2026-781',
          issueDate: '2026-03-15',
          expiryDate: '2027-03-14',
          issuingAuthority: 'Karnataka State Fire Services',
          extractedFields: { institutionName: 'Apex Institute of Technology, Bengaluru', builtUpAreaSqm: 18500 },
          extractionMode: 'extracted',
          status: 'valid',
        },
      ]);
    } else if (preset === 'expired') {
      setCategory('Extension of Approval (EoA)');
      setInstitutionName('Malabar Institute of Technology, Kochi');
      setInstitutionCode('1-5901234');
      setState('Kerala');
      setDocuments([
        {
          id: `doc-${Date.now()}-1`,
          name: 'AICTE_EoA_Previous_Order.pdf',
          category: 'Previous Approval or EoA',
          fileSize: 450000,
          fileType: 'application/pdf',
          uploadDate: '2026-10-27',
          sha256Hash: 'e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f65555',
          docNumber: 'F.No. South/1-5901234/2025/EOA',
          issueDate: '2025-05-30',
          expiryDate: '2026-11-30',
          issuingAuthority: 'AICTE Southern Regional Office',
          extractedFields: { institutionName: 'Malabar Institute of Technology, Kochi', institutionCode: '1-5901234' },
          extractionMode: 'extracted',
          status: 'valid',
        },
        {
          id: `doc-${Date.now()}-2`,
          name: 'Fire_Safety_NOC_Ernakulam.pdf',
          category: 'Infrastructure Certificate',
          fileSize: 280000,
          fileType: 'application/pdf',
          uploadDate: '2026-10-27',
          sha256Hash: 'f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f6a1b2c3d4e5f66666',
          docNumber: 'FS/KL/NOC-5821/2023',
          issueDate: '2023-05-10',
          expiryDate: '2026-05-09', // Expired!
          issuingAuthority: 'Kerala State Fire & Rescue Services',
          extractedFields: { institutionName: 'Malabar Institute of Technology, Kochi' },
          extractionMode: 'extracted',
          status: 'expired',
        },
      ]);
    }
  };

  // Step 2 validation
  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (!institutionName.trim() || institutionName.length < 4) {
      newErrors.institutionName = 'Legal institution name is required (min 4 characters).';
    }
    const pidRegex = /^1-\d{7,10}$/;
    if (!institutionCode.trim() || !pidRegex.test(institutionCode.trim())) {
      newErrors.institutionCode = 'Permanent Institute ID must match format "1-XXXXXXXX" (e.g., 1-3489102).';
    }
    if (!state) {
      newErrors.state = 'State selection is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // File Upload Handler (Simulated / Custom files)
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const hash = await computeFileHash(file);

    const newDoc: DocumentMetadata = {
      id: `doc-upload-${Date.now()}`,
      name: file.name,
      category: selectedDocCategory,
      fileSize: file.size,
      fileType: file.type || 'application/pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      sha256Hash: hash,
      docNumber: customDocNumber || `DOC-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: customIssueDate || '2025-06-15',
      expiryDate: customExpiryDate || undefined,
      issuingAuthority: customAuthority || 'Regulatory Authority',
      extractedFields: {
        institutionName,
        institutionCode,
        intakeCapacity: typeof extractedIntake === 'number' ? extractedIntake : undefined,
      },
      extractionMode: 'extracted',
      status: 'valid',
    };

    setDocuments((prev) => [...prev, newDoc]);
    setCustomDocName('');
    setCustomDocNumber('');
    // reset input
    event.target.value = '';
  };

  const handleManualAddDoc = () => {
    const newDoc: DocumentMetadata = {
      id: `doc-manual-${Date.now()}`,
      name: customDocName.trim() || `${selectedDocCategory.replace(/\s+/g, '_')}_Document.pdf`,
      category: selectedDocCategory,
      fileSize: 320000,
      fileType: 'application/pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      sha256Hash: `hash-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      docNumber: customDocNumber || `DOC/MANUAL/${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: customIssueDate,
      expiryDate: customExpiryDate || undefined,
      issuingAuthority: customAuthority || 'Competent Authority',
      extractedFields: {
        institutionName,
        institutionCode,
        intakeCapacity: typeof extractedIntake === 'number' ? extractedIntake : undefined,
      },
      extractionMode: 'manual',
      status: 'valid',
    };

    setDocuments((prev) => [...prev, newDoc]);
    setCustomDocName('');
    setCustomDocNumber('');
  };

  const handleRemoveDoc = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  // Run validation engine
  const handleExecuteValidation = () => {
    setCurrentStep(5);
    setIsValidating(true);
    setValidationProgressMessage('Initializing SATYAK compliance verification engine...');

    const steps = [
      'Checking mandatory institution fields and Permanent Institute ID...',
      'Auditing document inventory against category checklist...',
      'Evaluating certificate expiry against academic benchmark (2026-10-27)...',
      'Executing cross-document consistency checks (PID, Name, Intake)...',
      'Computing cryptographic SHA-256 hashes for duplicate file screening...',
      'Compiling evidence-linked findings and calculating readiness status...',
    ];

    let stepIdx = 0;
    const interval = setInterval(() => {
      if (stepIdx < steps.length) {
        setValidationProgressMessage(steps[stepIdx]);
        stepIdx++;
      } else {
        clearInterval(interval);

        // Build Application Object and persist
        const newApp: Application = {
          id: `app-wizard-${Date.now()}`,
          refNumber,
          institutionName,
          institutionCode,
          state,
          academicYear,
          category,
          applicationDate,
          contactEmail,
          headOfInstitute,
          documents,
          findings: [],
          readinessScore: 0,
          readinessStatus: 'Insufficient Information',
          reviewerStatus: 'Awaiting Review',
          reviewerObservations: [],
          auditLog: [
            {
              id: `aud-wiz-${Date.now()}-1`,
              applicationId: `app-wizard-${Date.now()}`,
              eventType: 'APPLICATION_CREATED',
              timestamp: new Date().toISOString(),
              actor: activeRole,
              description: `Application ${refNumber} prepared and submitted for automated validation.`,
            },
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        // Save & trigger validation in storage
        AppStorageService.saveApplication(newApp);
        const validatedApp = AppStorageService.revalidateApplication(newApp.id, activeRole);

        setIsValidating(false);
        if (validatedApp) {
          onValidationComplete(validatedApp);
          setCurrentPage('results');
        }
      }
    }, 450);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title & Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE4ED] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
              <FileCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#142B4A]">
              Check Application Readiness
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#637287] mt-1">
            Validate document completeness, verify certificate validity dates, and detect discrepancies prior to regional committee scrutiny.
          </p>
        </div>

        {/* Quick Demo Pre-fill */}
        <div className="flex items-center gap-2 bg-[#F2F5F9] p-2 rounded-lg border border-[#DCE4ED] self-start">
          <Sparkles className="w-4 h-4 text-[#087F8C]" />
          <span className="text-xs font-semibold text-[#142B4A]">Load Demo Template:</span>
          <button
            onClick={() => loadPresetTemplate('clean')}
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-slate-700 transition-colors"
          >
            Clean EoA
          </button>
          <button
            onClick={() => loadPresetTemplate('expired')}
            className="px-2 py-1 bg-white hover:bg-slate-50 border border-slate-200 rounded text-[11px] font-medium text-rose-700 transition-colors"
          >
            Expired Cert
          </button>
        </div>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="bg-white rounded-xl border border-[#DCE4ED] p-4 shadow-xs">
        <div className="grid grid-cols-5 gap-2 text-center">
          {[
            { num: 1, label: 'Category' },
            { num: 2, label: 'Institution' },
            { num: 3, label: 'Documents' },
            { num: 4, label: 'Review' },
            { num: 5, label: 'Validation' },
          ].map((st) => {
            const isCompleted = currentStep > st.num;
            const isCurrent = currentStep === st.num;
            return (
              <div
                key={st.num}
                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${
                  isCurrent
                    ? 'border-[#087F8C] bg-[#E6F4F3]/60 text-[#087F8C] font-bold'
                    : isCompleted
                    ? 'border-[#16805D] bg-emerald-50 text-[#16805D]'
                    : 'border-transparent text-[#637287]'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mb-1 ${
                    isCurrent
                      ? 'bg-[#087F8C] text-white'
                      : isCompleted
                      ? 'bg-[#16805D] text-white'
                      : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {isCompleted ? '✓' : st.num}
                </div>
                <span className="text-xs truncate max-w-full">{st.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* STEP 1: SELECT APPLICATION CATEGORY */}
      {currentStep === 1 && (
        <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#DCE4ED] pb-4">
            <h2 className="text-lg font-bold text-[#142B4A]">
              Step 1: Select Application Category
            </h2>
            <p className="text-xs text-[#637287] mt-1">
              Select the intended regulatory approval category. SATYAK will configure the required statutory checklist accordingly.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              {
                id: 'Extension of Approval (EoA)',
                title: 'Extension of Approval (EoA)',
                desc: 'Annual continuation of approval for existing institutions running technical programmes.',
              },
              {
                id: 'New Institution Approval',
                title: 'New Institution Approval',
                desc: 'Establishment of a new technical institution offering engineering, management, or technology courses.',
              },
              {
                id: 'Change in Approved Intake',
                title: 'Change in Approved Intake',
                desc: 'Augmentation or reduction of sanctioned seats in existing approved programmes.',
              },
              {
                id: 'Addition or Change of Programme',
                title: 'Addition or Change of Programme',
                desc: 'Introducing emerging tech branches (AI, Data Science, Cyber) or converting courses.',
              },
              {
                id: 'Other Approval-Related Change',
                title: 'Other Approval-Related Change',
                desc: 'Change of site/location, change of trust name, or closure of courses.',
              },
            ].map((cat) => (
              <div
                key={cat.id}
                onClick={() => setCategory(cat.id as ApplicationCategory)}
                className={`cursor-pointer p-4 rounded-xl border transition-all ${
                  category === cat.id
                    ? 'border-[#087F8C] bg-[#E6F4F3]/40 ring-2 ring-[#087F8C]/30'
                    : 'border-[#DCE4ED] hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-[#142B4A]">{cat.title}</span>
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      category === cat.id ? 'border-[#087F8C] bg-[#087F8C]' : 'border-slate-300'
                    }`}
                  >
                    {category === cat.id && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                  </div>
                </div>
                <p className="text-xs text-[#637287] mt-2">{cat.desc}</p>
              </div>
            ))}
          </div>

          {/* Category checklist preview */}
          <div className="bg-[#F2F5F9] p-4 rounded-xl border border-[#DCE4ED]">
            <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-2">
              Configured Demonstration Checklist for "{category}":
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {CATEGORY_REQUIRED_DOCUMENTS[category].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-[#172B42]">
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      item.mandatory ? 'bg-[#087F8C]' : 'bg-slate-400'
                    }`}
                  />
                  <span>{item.label}</span>
                  {item.mandatory && (
                    <span className="text-[10px] font-bold text-[#C43D4B] ml-auto">Mandatory</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[11px] text-[#637287] mt-3">
              Note: Exact checklist requirements depend on applicable statutory norms and must be verified against authorized AICTE handbooks.
            </p>
          </div>

          <div className="flex justify-end pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-6 py-2.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <span>Continue to Institution Details</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: INSTITUTION DETAILS */}
      {currentStep === 2 && (
        <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#DCE4ED] pb-4">
            <h2 className="text-lg font-bold text-[#142B4A]">
              Step 2: Institutional Identification & Reference
            </h2>
            <p className="text-xs text-[#637287] mt-1">
              Enter registered college name, AICTE Permanent Institute ID, and academic session information.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                Institution Legal Entity Name *
              </label>
              <input
                type="text"
                value={institutionName}
                onChange={(e) => setInstitutionName(e.target.value)}
                placeholder="e.g. Apex Institute of Technology, Bengaluru"
                className={`w-full text-xs p-2.5 rounded-lg border bg-[#F2F5F9]/50 focus:bg-white transition-colors focus:ring-1 focus:ring-[#087F8C] outline-none ${
                  errors.institutionName ? 'border-[#C43D4B]' : 'border-[#DCE4ED]'
                }`}
              />
              {errors.institutionName && (
                <p className="text-[11px] text-[#C43D4B] mt-1">{errors.institutionName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                AICTE Permanent Institute ID (PID) *
              </label>
              <input
                type="text"
                value={institutionCode}
                onChange={(e) => setInstitutionCode(e.target.value)}
                placeholder="1-3489102"
                className={`w-full text-xs p-2.5 rounded-lg border bg-[#F2F5F9]/50 focus:bg-white transition-colors focus:ring-1 focus:ring-[#087F8C] outline-none ${
                  errors.institutionCode ? 'border-[#C43D4B]' : 'border-[#DCE4ED]'
                }`}
              />
              {errors.institutionCode && (
                <p className="text-[11px] text-[#C43D4B] mt-1">{errors.institutionCode}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                State / Union Territory *
              </label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#DCE4ED] bg-[#F2F5F9]/50 focus:bg-white outline-none"
              >
                {INDIAN_STATES.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                Application Reference Number
              </label>
              <input
                type="text"
                value={refNumber}
                onChange={(e) => setRefNumber(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#DCE4ED] bg-slate-100 text-[#172B42] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                Academic Session
              </label>
              <select
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              >
                <option value="2026-2027">2026–2027</option>
                <option value="2027-2028">2027–2028</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                Application Benchmark Date
              </label>
              <input
                type="date"
                value={applicationDate}
                onChange={(e) => setApplicationDate(e.target.value)}
                className="w-full text-xs p-2.5 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                Head of Institute / Principal
              </label>
              <input
                type="text"
                value={headOfInstitute}
                onChange={(e) => setHeadOfInstitute(e.target.value)}
                placeholder="Dr. Full Name"
                className="w-full text-xs p-2.5 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#142B4A] mb-1">
                Institutional Contact Email
              </label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="admin@college.edu.in"
                className="w-full text-xs p-2.5 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              />
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(1)}
              className="px-4 py-2.5 rounded-lg border border-[#DCE4ED] hover:bg-slate-50 text-xs font-semibold text-[#142B4A] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => {
                if (validateStep2()) {
                  setCurrentStep(3);
                }
              }}
              className="px-6 py-2.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <span>Continue to Documents</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: DOCUMENT UPLOAD & INVENTORY */}
      {currentStep === 3 && (
        <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#DCE4ED] pb-4">
            <h2 className="text-lg font-bold text-[#142B4A]">
              Step 3: Document Upload & Metadata
            </h2>
            <p className="text-xs text-[#637287] mt-1">
              Attach statutory documents in PDF, PNG, or JPEG format. SATYAK screens documents against the category checklist.
            </p>
          </div>

          {/* Upload Controls Box */}
          <div className="bg-[#F2F5F9] p-5 rounded-xl border border-[#DCE4ED] space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#142B4A] mb-1">
                  Document Category *
                </label>
                <select
                  value={selectedDocCategory}
                  onChange={(e) => setSelectedDocCategory(e.target.value as DocumentCategory)}
                  className="w-full text-xs p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                >
                  <option value="Previous Approval or EoA">Previous Approval or EoA</option>
                  <option value="Affidavit or Undertaking">Affidavit or Undertaking</option>
                  <option value="Faculty-Related Evidence">Faculty-Related Evidence</option>
                  <option value="Infrastructure Certificate">Infrastructure Certificate</option>
                  <option value="Accreditation or Certification">Accreditation or Certification</option>
                  <option value="NOC or Permission">NOC or Permission</option>
                  <option value="Institutional Records">Institutional Records</option>
                  <option value="Other Supporting Document">Other Supporting Document</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#142B4A] mb-1">
                  Certificate Ref / Dispatch No.
                </label>
                <input
                  type="text"
                  value={customDocNumber}
                  onChange={(e) => setCustomDocNumber(e.target.value)}
                  placeholder="e.g. NOC-2026/892"
                  className="w-full text-xs p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                >
                </input>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#142B4A] mb-1">
                  Issue Date
                </label>
                <input
                  type="date"
                  value={customIssueDate}
                  onChange={(e) => setCustomIssueDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#142B4A] mb-1">
                  Expiry Date (if applicable)
                </label>
                <input
                  type="date"
                  value={customExpiryDate}
                  onChange={(e) => setCustomExpiryDate(e.target.value)}
                  className="w-full text-xs p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>
            </div>

            {/* File Dropzone & Manual Action */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-slate-200">
              <label className="w-full sm:w-auto cursor-pointer px-4 py-2.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors">
                <Upload className="w-4 h-4" />
                <span>Upload PDF/Image File</span>
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Or enter title to add synthetic file..."
                  value={customDocName}
                  onChange={(e) => setCustomDocName(e.target.value)}
                  className="text-xs p-2 rounded-lg border border-[#DCE4ED] bg-white w-full sm:w-64 outline-none"
                />
                <button
                  type="button"
                  onClick={handleManualAddDoc}
                  className="px-3 py-2 rounded-lg bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold shrink-0"
                >
                  + Add Item
                </button>
              </div>
            </div>
          </div>

          {/* Current Document Inventory */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider">
                Attached Documents Inventory ({documents.length} files)
              </h3>
              {documents.length > 0 && (
                <button
                  onClick={() => setDocuments([])}
                  className="text-[11px] text-[#C43D4B] hover:underline"
                >
                  Clear All
                </button>
              )}
            </div>

            {documents.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-[#DCE4ED] rounded-xl text-[#637287]">
                <FileText className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs font-medium">No documents uploaded yet.</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Upload PDF certificates above or use the "Clean EoA" demo preset button at the top.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-3 rounded-lg border border-[#DCE4ED] bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-start gap-2.5">
                      <FileText className="w-4 h-4 text-[#087F8C] shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-[#142B4A]">{doc.name}</div>
                        <div className="text-[11px] text-[#637287] flex flex-wrap gap-2 mt-0.5">
                          <span className="font-medium text-[#087F8C] bg-[#E6F4F3] px-1.5 py-0.2 rounded">
                            {doc.category}
                          </span>
                          <span>Ref: {doc.docNumber || 'N/A'}</span>
                          <span>•</span>
                          <span>{(doc.fileSize / 1024).toFixed(1)} KB</span>
                          <span>•</span>
                          <span>
                            Valid: {doc.issueDate || 'N/A'} to {doc.expiryDate || 'Unspecified'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRemoveDoc(doc.id)}
                      className="text-[#C43D4B] hover:text-red-700 p-1.5 rounded hover:bg-rose-50 self-end sm:self-center"
                      title="Remove document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(2)}
              className="px-4 py-2.5 rounded-lg border border-[#DCE4ED] hover:bg-slate-50 text-xs font-semibold text-[#142B4A] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
            <button
              onClick={() => setCurrentStep(4)}
              className="px-6 py-2.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-xs transition-colors flex items-center gap-2"
            >
              <span>Review Submission</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: REVIEW BEFORE VALIDATION */}
      {currentStep === 4 && (
        <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-sm space-y-6">
          <div className="border-b border-[#DCE4ED] pb-4">
            <h2 className="text-lg font-bold text-[#142B4A]">
              Step 4: Review Submission Details
            </h2>
            <p className="text-xs text-[#637287] mt-1">
              Verify all entered information and document inventory before running the deterministic validation engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-[#F2F5F9] p-4 rounded-xl border border-[#DCE4ED] text-xs">
            <div>
              <span className="text-[#637287] block text-[11px]">Institution Legal Name:</span>
              <strong className="text-[#142B4A] text-sm">{institutionName}</strong>
            </div>
            <div>
              <span className="text-[#637287] block text-[11px]">AICTE Permanent Institute ID:</span>
              <strong className="text-[#087F8C] font-mono">{institutionCode}</strong>
            </div>
            <div>
              <span className="text-[#637287] block text-[11px]">Category:</span>
              <strong className="text-[#142B4A]">{category}</strong>
            </div>
            <div>
              <span className="text-[#637287] block text-[11px]">State & Academic Year:</span>
              <strong className="text-[#142B4A]">{state} • {academicYear}</strong>
            </div>
            <div>
              <span className="text-[#637287] block text-[11px]">Reference Benchmark Date:</span>
              <strong className="text-[#142B4A]">{applicationDate}</strong>
            </div>
            <div>
              <span className="text-[#637287] block text-[11px]">Attached Documents:</span>
              <strong className="text-[#142B4A]">{documents.length} files attached</strong>
            </div>
          </div>

          {/* Checklist Completeness Preview */}
          <div>
            <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-2">
              Mandatory Checklist Status for {category}:
            </h4>
            <div className="space-y-1.5">
              {CATEGORY_REQUIRED_DOCUMENTS[category].map((item, idx) => {
                const isAttached = documents.some((d) => d.category === item.category);
                return (
                  <div
                    key={idx}
                    className={`p-2 rounded border flex items-center justify-between text-xs ${
                      isAttached
                        ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                        : item.mandatory
                        ? 'border-rose-200 bg-rose-50 text-rose-900'
                        : 'border-slate-200 bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isAttached ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                      )}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-bold">
                      {isAttached
                        ? 'Enclosed'
                        : item.mandatory
                        ? 'Missing Mandatory Item'
                        : 'Optional Not Enclosed'}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between pt-2">
            <button
              onClick={() => setCurrentStep(3)}
              className="px-4 py-2.5 rounded-lg border border-[#DCE4ED] hover:bg-slate-50 text-xs font-semibold text-[#142B4A] flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Documents</span>
            </button>
            <button
              onClick={handleExecuteValidation}
              className="px-7 py-3 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-xs shadow-md transition-all flex items-center gap-2"
            >
              <FileCheck className="w-4 h-4" />
              <span>Execute SATYAK Validation Engine</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: VALIDATION PROGRESS SIMULATOR */}
      {currentStep === 5 && (
        <div className="bg-white rounded-xl border border-[#DCE4ED] p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[#E6F4F3] text-[#087F8C] flex items-center justify-center mx-auto">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-extrabold text-[#142B4A]">
              Running Deterministic Compliance Engine
            </h2>
            <p className="text-xs sm:text-sm text-[#087F8C] font-mono font-medium">
              {validationProgressMessage}
            </p>
          </div>

          <div className="max-w-md mx-auto bg-slate-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#087F8C] h-full w-3/4 animate-pulse" />
          </div>

          <p className="text-[11px] text-[#637287]">
            Auditing Permanent Institute ID, cryptographic hashes, expiry periods, and mandatory checklists...
          </p>
        </div>
      )}
    </div>
  );
};
