import React, { useState } from 'react';
import { SyntheticIssuerRecord } from '../../types';
import { SYNTHETIC_ISSUER_RECORDS } from '../../data/syntheticIssuerRegistry';
import { querySyntheticIssuer, VerificationQueryResult } from '../../services/issuerVerification';
import {
  Scale,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  HelpCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Building2,
  FileCheck,
} from 'lucide-react';

export const VerificationServicesPage: React.FC = () => {
  const [issuerType, setIssuerType] = useState<SyntheticIssuerRecord['issuerType']>(
    'National Board of Accreditation (NBA)'
  );
  const [docRef, setDocRef] = useState('NBA/ACCR-7482/2024');
  const [institutionCode, setInstitutionCode] = useState('1-3489102');
  const [expectedIntake, setExpectedIntake] = useState<number | ''>(240);

  const [queryResult, setQueryResult] = useState<VerificationQueryResult | null>(null);
  const [isQuerying, setIsQuerying] = useState(false);

  const handleRunQuery = () => {
    setIsQuerying(true);
    setTimeout(() => {
      const res = querySyntheticIssuer(
        issuerType,
        docRef,
        institutionCode,
        typeof expectedIntake === 'number' ? expectedIntake : undefined
      );
      setQueryResult(res);
      setIsQuerying(false);
    }, 350);
  };

  // Quick preset loader
  const loadPreset = (
    type: SyntheticIssuerRecord['issuerType'],
    ref: string,
    code: string,
    intake?: number
  ) => {
    setIssuerType(type);
    setDocRef(ref);
    setInstitutionCode(code);
    setExpectedIntake(intake ?? '');
    setQueryResult(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="border-b border-[#DCE4ED] pb-6">
        <div className="flex items-center gap-2">
          <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
            <Scale className="w-5 h-5" />
          </span>
          <h1 className="text-2xl font-bold text-[#142B4A]">
            Issuer Verification Registry & Cross-Authentication Simulator
          </h1>
        </div>
        <p className="text-xs sm:text-sm text-[#637287] mt-1 max-w-3xl">
          Simulate authoritative cross-checks against state directorates, affiliating universities, accreditation bodies, and municipal land authorities using synthetic demonstration repositories.
        </p>
      </div>

      {/* Explanatory Grid: Supported Issuer Verification Channels */}
      <div className="bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs">
        <h3 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-3">
          Supported Verification Channels in SATYAK Architecture
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#F2F5F9] border border-[#DCE4ED]">
            <span className="font-bold text-[#142B4A] block mb-1">Authorized Issuer APIs</span>
            <p className="text-[11px] text-[#637287]">
              Direct REST/SOAP microservices with State Technical Directorates and National Boards.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#F2F5F9] border border-[#DCE4ED]">
            <span className="font-bold text-[#142B4A] block mb-1">Cryptographic QR Codes</span>
            <p className="text-[11px] text-[#637287]">
              Digitally signed payload parsing with public key verification for tamper detection.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#F2F5F9] border border-[#DCE4ED]">
            <span className="font-bold text-[#142B4A] block mb-1">Digital Repositories</span>
            <p className="text-[11px] text-[#637287]">
              Integration with National Academic Depository (NAD) and DigiLocker state pools.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#F2F5F9] border border-[#DCE4ED]">
            <span className="font-bold text-[#142B4A] block mb-1">Dispatch Cross-Check</span>
            <p className="text-[11px] text-[#637287]">
              Validation of unique reference IDs against synthetic demonstration registries.
            </p>
          </div>
        </div>
      </div>

      {/* Simulator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form: Query inputs & Quick Presets (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs space-y-4">
          <div className="border-b border-[#DCE4ED] pb-3">
            <h2 className="text-sm font-bold text-[#142B4A]">
              Query Demonstration Registry
            </h2>
            <p className="text-xs text-[#637287] mt-0.5">
              Select or test edge cases against pre-configured synthetic issuer records.
            </p>
          </div>

          {/* Quick Presets for Hackathon Judges */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-bold text-[#637287] uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#087F8C]" /> 1-Click Test Scenarios:
            </span>
            <div className="grid grid-cols-2 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() =>
                  loadPreset(
                    'National Board of Accreditation (NBA)',
                    'NBA/ACCR-7482/2024',
                    '1-3489102',
                    240
                  )
                }
                className="p-2 text-left rounded bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 transition-colors"
              >
                <div className="font-bold text-[11px]">1. Verified Match</div>
                <div className="text-[10px] text-emerald-700">NBA Active Accreditation</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  loadPreset(
                    'Affiliating State Technical University',
                    'RGPV/AFFIL/2026/3891',
                    '1-3920198',
                    240 // Note: Registry has 180 seats! Triggers Mismatch
                  )
                }
                className="p-2 text-left rounded bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 transition-colors"
              >
                <div className="font-bold text-[11px]">2. Intake Mismatch</div>
                <div className="text-[10px] text-amber-700">RGPV 180 vs 240 seats</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  loadPreset(
                    'State Fire & Emergency Services',
                    'FS/KL/NOC-5821/2023',
                    '1-5901234'
                  )
                }
                className="p-2 text-left rounded bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-900 transition-colors"
              >
                <div className="font-bold text-[11px]">3. Expired Record</div>
                <div className="text-[10px] text-rose-700">Fire NOC lapsed May 2026</div>
              </button>

              <button
                type="button"
                onClick={() =>
                  loadPreset(
                    'State Directorate of Technical Education (DTE)',
                    'DTE-TIMEOUT-UNAVAILABLE',
                    '1-3489102'
                  )
                }
                className="p-2 text-left rounded bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 transition-colors"
              >
                <div className="font-bold text-[11px]">4. Source Unavailable</div>
                <div className="text-[10px] text-slate-600">Simulate API gateway timeout</div>
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="space-y-3 text-xs pt-2">
            <div>
              <label className="block font-bold text-[#142B4A] mb-1">
                Issuing Regulatory Authority *
              </label>
              <select
                value={issuerType}
                onChange={(e) => setIssuerType(e.target.value as any)}
                className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              >
                <option value="National Board of Accreditation (NBA)">
                  National Board of Accreditation (NBA)
                </option>
                <option value="Affiliating State Technical University">
                  Affiliating State Technical University
                </option>
                <option value="State Directorate of Technical Education (DTE)">
                  State Directorate of Technical Education (DTE)
                </option>
                <option value="State Fire & Emergency Services">
                  State Fire & Emergency Services
                </option>
                <option value="Town Planning & Municipal Land Registry">
                  Town Planning & Municipal Land Registry
                </option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-[#142B4A] mb-1">
                Document / Certificate Reference No. *
              </label>
              <input
                type="text"
                value={docRef}
                onChange={(e) => setDocRef(e.target.value)}
                placeholder="e.g. NBA/ACCR-7482/2024"
                className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#142B4A] mb-1">
                Institution Permanent Institute ID (PID)
              </label>
              <input
                type="text"
                value={institutionCode}
                onChange={(e) => setInstitutionCode(e.target.value)}
                placeholder="1-3489102"
                className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none font-mono"
              />
            </div>

            <div>
              <label className="block font-bold text-[#142B4A] mb-1">
                Expected Intake Seats (Optional Cross-Check)
              </label>
              <input
                type="number"
                value={expectedIntake}
                onChange={(e) => setExpectedIntake(e.target.value ? parseInt(e.target.value) : '')}
                placeholder="240"
                className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleRunQuery}
              disabled={isQuerying || !docRef.trim()}
              className="w-full py-2.5 bg-[#087F8C] hover:bg-[#076b77] text-white rounded-lg font-semibold text-xs transition-colors flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              <span>{isQuerying ? 'Querying Issuer Database...' : 'Execute Registry Cross-Check'}</span>
            </button>
          </div>
        </div>

        {/* Right Panel: Verification Output Results (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs space-y-4">
          <div className="border-b border-[#DCE4ED] pb-3 flex items-center justify-between">
            <h2 className="text-sm font-bold text-[#142B4A]">
              Verification Query Result & Comparison
            </h2>
            <span className="text-[10px] text-[#087F8C] font-mono bg-[#E6F4F3] px-2 py-0.5 rounded">
              Synthetic Sandbox Output
            </span>
          </div>

          {queryResult ? (
            <div className="space-y-4 text-xs">
              {/* Outcome Banner */}
              <div
                className={`p-4 rounded-xl border ${
                  queryResult.outcome === 'Verified Against Demo Record'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                    : queryResult.outcome === 'Mismatch Detected'
                    ? 'bg-amber-50 border-amber-200 text-amber-950'
                    : queryResult.outcome === 'Source Unavailable'
                    ? 'bg-slate-100 border-slate-300 text-slate-800'
                    : 'bg-rose-50 border-rose-200 text-rose-950'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  {queryResult.outcome === 'Verified Against Demo Record' ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  ) : queryResult.outcome === 'Mismatch Detected' ? (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600" />
                  )}
                  <h3 className="text-base font-bold">
                    Outcome: {queryResult.outcome}
                  </h3>
                </div>
                <p className="text-xs leading-relaxed mt-1">
                  {queryResult.details}
                </p>
              </div>

              {/* Source Metadata */}
              <div className="grid grid-cols-2 gap-3 bg-[#F2F5F9] p-3 rounded-lg border border-[#DCE4ED]">
                <div>
                  <span className="text-[10px] text-[#637287] uppercase block">Queried Authority:</span>
                  <span className="font-semibold text-[#142B4A]">{queryResult.sourceName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#637287] uppercase block">Database Type:</span>
                  <span className="font-medium text-[#172B42]">{queryResult.sourceType}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#637287] uppercase block">Timestamp:</span>
                  <span className="text-[#637287]">{new Date(queryResult.queryTimestamp).toLocaleTimeString()}</span>
                </div>
                <div>
                  <span className="text-[10px] text-[#637287] uppercase block">Submitted Reference:</span>
                  <span className="font-mono text-[#087F8C]">{queryResult.submittedReference}</span>
                </div>
              </div>

              {/* Field Comparison Points */}
              {queryResult.comparisonPoints && queryResult.comparisonPoints.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-2">
                    Parameter Comparison Check:
                  </h4>
                  <div className="space-y-1.5">
                    {queryResult.comparisonPoints.map((cp, idx) => (
                      <div
                        key={idx}
                        className={`p-2.5 rounded border flex items-center justify-between text-xs ${
                          cp.isMatch ? 'border-emerald-200 bg-emerald-50/50' : 'border-rose-200 bg-rose-50/60'
                        }`}
                      >
                        <div>
                          <span className="font-semibold text-[#142B4A] block">{cp.field}</span>
                          <span className="text-[11px] text-[#637287]">
                            Application: <strong>{cp.submittedValue}</strong> vs Issuer Record: <strong>{cp.issuerRecordValue}</strong>
                          </span>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            cp.isMatch ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {cp.isMatch ? 'MATCH' : 'MISMATCH'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommended Action */}
              <div className="bg-[#E6F4F3]/60 p-3.5 rounded-lg border border-[#087F8C]/30">
                <span className="text-[10px] font-bold text-[#087F8C] uppercase tracking-wider block mb-0.5">
                  Remediation & Next Steps:
                </span>
                <p className="text-xs text-[#142B4A] font-medium leading-relaxed">
                  {queryResult.recommendedAction}
                </p>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-[#637287] border border-dashed border-[#DCE4ED] rounded-xl">
              <Scale className="w-8 h-8 mx-auto text-slate-300 mb-2" />
              <p className="text-xs font-semibold text-[#142B4A]">No Query Executed Yet</p>
              <p className="text-[11px] text-[#637287] mt-1 max-w-sm mx-auto">
                Select one of the 1-click test scenarios on the left or enter a reference to test the synthetic verification engine.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
