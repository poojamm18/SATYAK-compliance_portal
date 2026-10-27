import React, { useState } from 'react';
import { Application, DocumentMetadata, ReviewerCaseStatus, ReviewerObservation, UserRole } from '../../types';
import { AppStorageService } from '../../services/storage';
import { NavigationPage } from '../common/Header';
import {
  ShieldCheck,
  UserCheck,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  Eye,
  FileText,
  FileCheck,
  Send,
  Building,
  RotateCcw,
  Check,
  ArrowRight,
  X,
  History,
} from 'lucide-react';

interface OfficerWorkspaceProps {
  applications: Application[];
  setCurrentPage: (page: NavigationPage) => void;
  onSelectApplication: (app: Application) => void;
  refreshApplications: () => void;
}

export const OfficerWorkspace: React.FC<OfficerWorkspaceProps> = ({
  applications,
  setCurrentPage,
  onSelectApplication,
  refreshApplications,
}) => {
  const [selectedCase, setSelectedCase] = useState<Application>(applications[0] || null);
  const [selectedDocPreview, setSelectedDocPreview] = useState<DocumentMetadata | null>(
    applications[0]?.documents[0] || null
  );

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  // Reviewer Action Modal
  const [actionModalType, setActionModalType] = useState<
    ReviewerObservation['noteType'] | null
  >(null);
  const [actionNote, setActionNote] = useState('');
  const [officerName, setOfficerName] = useState('Senior Scrutiny Officer (Regional)');

  // Metrics calculation
  const totalApps = applications.length;
  const awaitingReview = applications.filter((a) => a.reviewerStatus === 'Awaiting Review').length;
  const deficienciesIdentified = applications.filter(
    (a) => a.reviewerStatus === 'Deficiencies Identified'
  ).length;
  const verificationPending = applications.filter(
    (a) => a.reviewerStatus === 'Verification Pending'
  ).length;
  const additionalEvidenceReq = applications.filter(
    (a) => a.reviewerStatus === 'Additional Evidence Requested'
  ).length;
  const referredForInspection = applications.filter(
    (a) => a.reviewerStatus === 'Referred for Inspection'
  ).length;

  const filteredQueue = applications.filter((app) => {
    if (statusFilter !== 'ALL' && app.reviewerStatus !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = `${app.refNumber} ${app.institutionName} ${app.institutionCode} ${app.state}`.toLowerCase();
      if (!match.includes(q)) return false;
    }
    return true;
  });

  const handleSelectCase = (app: Application) => {
    setSelectedCase(app);
    setSelectedDocPreview(app.documents[0] || null);
  };

  const handleExecuteReviewerAction = (
    noteType: ReviewerObservation['noteType'],
    targetStatus?: ReviewerCaseStatus
  ) => {
    if (!selectedCase || !actionNote.trim()) return;

    const updated = AppStorageService.recordReviewerAction(
      selectedCase.id,
      {
        authorRole: 'Reviewing Officer',
        officerName,
        noteType,
        note: actionNote.trim(),
        actionTaken: `Officer recorded: ${noteType}`,
      },
      targetStatus
    );

    if (updated) {
      setSelectedCase(updated);
      refreshApplications();
    }

    setActionModalType(null);
    setActionNote('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE4ED] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#142B4A] text-white">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#142B4A]">
              Officer Review Workspace & Case Scrutiny
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#637287] mt-1">
            Authoritative scrutiny queue: record observations, issue evidence notices, verify issuer records, and refer for inspection.
          </p>
        </div>

        <div className="bg-[#E6F4F3] border border-[#087F8C]/30 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#087F8C] flex items-center gap-2 self-start">
          <UserCheck className="w-4 h-4" />
          <span>Active Role: Reviewing Officer (Demo)</span>
        </div>
      </div>

      {/* Summary KPI Cards for Officers */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#142B4A]">{totalApps}</div>
          <div className="text-[10px] font-semibold text-[#637287] uppercase mt-0.5">Total Queue</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#087F8C]">{awaitingReview}</div>
          <div className="text-[10px] font-semibold text-[#637287] uppercase mt-0.5">Awaiting Review</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#C43D4B]">{deficienciesIdentified}</div>
          <div className="text-[10px] font-semibold text-[#637287] uppercase mt-0.5">Deficiencies</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#B7791F]">{verificationPending}</div>
          <div className="text-[10px] font-semibold text-[#637287] uppercase mt-0.5">Issuer Pending</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#203C5B]">{additionalEvidenceReq}</div>
          <div className="text-[10px] font-semibold text-[#637287] uppercase mt-0.5">Evidence Req.</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-purple-700">{referredForInspection}</div>
          <div className="text-[10px] font-semibold text-[#637287] uppercase mt-0.5">Inspection Flag</div>
        </div>
      </div>

      {/* Main Two-Column Layout: Queue on Left, Case Scrutiny on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Application Scrutiny Queue (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-[#DCE4ED] p-4 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#DCE4ED] pb-3">
            <h2 className="text-sm font-bold text-[#142B4A]">
              Scrutiny Queue ({filteredQueue.length})
            </h2>
            <span className="text-[10px] text-[#637287] uppercase">Click to open</span>
          </div>

          {/* Search & Status Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search PID, name, ref..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-[#DCE4ED] bg-[#F2F5F9]/60 focus:bg-white outline-none"
              />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full text-xs p-1.5 rounded-lg border border-[#DCE4ED] bg-white outline-none"
            >
              <option value="ALL">All Officer Statuses</option>
              <option value="Awaiting Review">Awaiting Review</option>
              <option value="Deficiencies Identified">Deficiencies Identified</option>
              <option value="Verification Pending">Verification Pending</option>
              <option value="Additional Evidence Requested">Additional Evidence Requested</option>
              <option value="Referred for Inspection">Referred for Inspection</option>
              <option value="Review Completed">Review Completed</option>
            </select>
          </div>

          {/* Queue List */}
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {filteredQueue.map((app) => {
              const isSelected = selectedCase?.id === app.id;
              const hasHighSeverity = app.findings.some((f) => f.severity === 'High');

              return (
                <div
                  key={app.id}
                  onClick={() => handleSelectCase(app)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all text-xs ${
                    isSelected
                      ? 'border-[#087F8C] bg-[#E6F4F3]/40 ring-1 ring-[#087F8C]'
                      : 'border-[#DCE4ED] hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-[11px] font-bold text-[#087F8C]">
                      {app.refNumber}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        app.reviewerStatus === 'Review Completed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.reviewerStatus === 'Referred for Inspection'
                          ? 'bg-purple-100 text-purple-800'
                          : app.reviewerStatus === 'Deficiencies Identified'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {app.reviewerStatus}
                    </span>
                  </div>

                  <h3 className="font-semibold text-[#142B4A] line-clamp-1">
                    {app.institutionName}
                  </h3>

                  <div className="text-[10px] text-[#637287] mt-1 flex items-center justify-between">
                    <span>PID: {app.institutionCode}</span>
                    <span className="font-medium text-[#172B42]">
                      {app.findings.length} findings
                      {hasHighSeverity && (
                        <span className="text-[#C43D4B] font-bold ml-1">● High</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Case Details & Reviewer Actions (8 cols) */}
        {selectedCase ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Case Header Card */}
            <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-[#DCE4ED] pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-[#087F8C] bg-[#E6F4F3] px-2 py-0.5 rounded">
                      {selectedCase.refNumber}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-[#142B4A]">
                      Category: {selectedCase.category}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-[#142B4A] mt-1.5">
                    {selectedCase.institutionName}
                  </h2>
                  <p className="text-xs text-[#637287]">
                    Permanent Institute ID: <strong className="text-[#142B4A]">{selectedCase.institutionCode}</strong> • State: {selectedCase.state} • Session: {selectedCase.academicYear}
                  </p>
                </div>

                <div className="flex flex-col items-end shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-[#637287] uppercase block">Readiness Score</span>
                    <span className="text-xl font-extrabold text-[#087F8C]">
                      {selectedCase.readinessScore}%
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      onSelectApplication(selectedCase);
                      setCurrentPage('results');
                    }}
                    className="text-[11px] font-semibold text-[#087F8C] hover:underline flex items-center gap-1 mt-1"
                  >
                    <span>Full Audit Report</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Functional Reviewer Action Bar */}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#637287] block mb-2">
                  Officer Decision & Actions
                </span>
                <div className="flex flex-wrap gap-2 text-xs">
                  <button
                    onClick={() => setActionModalType('Observation')}
                    className="px-3 py-1.5 rounded-lg bg-[#F2F5F9] hover:bg-slate-200 text-[#142B4A] font-semibold border border-[#DCE4ED] transition-colors"
                  >
                    + Record Observation
                  </button>

                  <button
                    onClick={() => setActionModalType('Evidence Request')}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold border border-amber-300 transition-colors"
                  >
                    Request Additional Evidence
                  </button>

                  <button
                    onClick={() => setActionModalType('Manual Verification')}
                    className="px-3 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-900 font-semibold border border-sky-300 transition-colors"
                  >
                    Mark for Manual Verification
                  </button>

                  <button
                    onClick={() => setActionModalType('Inspection Referral')}
                    className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-900 font-semibold border border-purple-300 transition-colors"
                  >
                    Refer for EVC Inspection
                  </button>

                  <button
                    onClick={() => setActionModalType('Review Completed')}
                    className="px-3 py-1.5 rounded-lg bg-[#16805D] hover:bg-emerald-700 text-white font-semibold shadow-xs transition-colors"
                  >
                    Mark Review Completed
                  </button>
                </div>
              </div>
            </div>

            {/* Document Inventory & Side-by-Side Finding Preview */}
            <div className="bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#142B4A]">
                Document Inspection & Attached Evidence
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Document List */}
                <div className="md:col-span-5 space-y-2">
                  <div className="text-[11px] font-bold text-[#637287] uppercase mb-1">
                    Uploaded Documents ({selectedCase.documents.length})
                  </div>
                  {selectedCase.documents.map((doc) => {
                    const isSelected = selectedDocPreview?.id === doc.id;
                    const isExpired = doc.status === 'expired';

                    return (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDocPreview(doc)}
                        className={`p-2.5 rounded-lg border cursor-pointer text-xs transition-all ${
                          isSelected
                            ? 'border-[#087F8C] bg-[#E6F4F3]/50'
                            : 'border-[#DCE4ED] bg-white hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-[#142B4A] truncate max-w-[180px]">
                            {doc.name}
                          </span>
                          {isExpired && (
                            <span className="text-[9px] font-bold text-[#C43D4B] bg-rose-50 px-1 rounded">
                              EXPIRED
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-[#637287] mt-0.5">
                          {doc.category}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Document Inspector Panel */}
                <div className="md:col-span-7 bg-[#F2F5F9] p-4 rounded-xl border border-[#DCE4ED] text-xs space-y-3">
                  {selectedDocPreview ? (
                    <>
                      <div className="flex items-center justify-between border-b border-[#DCE4ED] pb-2">
                        <span className="font-bold text-[#142B4A]">{selectedDocPreview.name}</span>
                        <span className="text-[10px] text-[#637287]">
                          {(selectedDocPreview.fileSize / 1024).toFixed(1)} KB
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="grid grid-cols-2 gap-2 text-[11px]">
                          <div>
                            <span className="text-[#637287] block">Dispatch / Ref No:</span>
                            <span className="font-medium text-[#142B4A]">
                              {selectedDocPreview.docNumber || 'Not specified'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[#637287] block">Validity:</span>
                            <span className="font-medium text-[#142B4A]">
                              {selectedDocPreview.issueDate || 'N/A'} to {selectedDocPreview.expiryDate || 'Unspecified'}
                            </span>
                          </div>
                        </div>

                        <div>
                          <span className="text-[#637287] text-[10px] block">Cryptographic SHA-256 Hash:</span>
                          <span className="font-mono text-[10px] text-slate-600 break-all">
                            {selectedDocPreview.sha256Hash}
                          </span>
                        </div>

                        {selectedDocPreview.extractedFields && (
                          <div className="pt-2 border-t border-slate-200">
                            <span className="text-[10px] font-bold text-[#087F8C] uppercase block mb-1">
                              Extracted Field Summary
                            </span>
                            <div className="grid grid-cols-2 gap-2 text-[11px] bg-white p-2 rounded border border-slate-200">
                              <div>
                                <span className="text-slate-400 block text-[10px]">Extracted Name:</span>
                                <span className="font-medium">{selectedDocPreview.extractedFields.institutionName || 'N/A'}</span>
                              </div>
                              <div>
                                <span className="text-slate-400 block text-[10px]">Extracted PID:</span>
                                <span className="font-mono font-medium">{selectedDocPreview.extractedFields.institutionCode || 'N/A'}</span>
                              </div>
                              {selectedDocPreview.extractedFields.intakeCapacity && (
                                <div>
                                  <span className="text-slate-400 block text-[10px]">Intake Seats:</span>
                                  <span className="font-medium">{selectedDocPreview.extractedFields.intakeCapacity}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8 text-[#637287]">
                      Select a document on the left to inspect metadata.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Officer Observation & Scrutiny Log */}
            <div className="bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs space-y-4">
              <h3 className="text-sm font-bold text-[#142B4A]">
                Reviewer Observations & Recorded History
              </h3>

              {selectedCase.reviewerObservations.length === 0 ? (
                <p className="text-xs text-[#637287]">
                  No officer observations recorded yet. Use the action buttons above to record observations.
                </p>
              ) : (
                <div className="space-y-3">
                  {selectedCase.reviewerObservations.map((obs) => (
                    <div
                      key={obs.id}
                      className="p-3 rounded-lg border border-[#DCE4ED] bg-[#F2F5F9] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-bold text-[#142B4A]">{obs.officerName}</span>
                        <span className="text-[#637287]">{new Date(obs.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#E6F4F3] text-[#087F8C]">
                        {obs.noteType}
                      </div>
                      <p className="text-[#172B42] mt-1">{obs.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 p-12 text-center bg-white rounded-xl border border-[#DCE4ED] text-[#637287]">
            Select an application from the queue to start scrutiny.
          </div>
        )}
      </div>

      {/* MODAL: EXECUTE REVIEWER ACTION */}
      {actionModalType && selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DCE4ED] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE4ED] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#142B4A]">
                  Record Action: {actionModalType}
                </h3>
                <p className="text-xs text-[#637287]">
                  Case: {selectedCase.refNumber} ({selectedCase.institutionName})
                </p>
              </div>
              <button
                onClick={() => setActionModalType(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#142B4A] mb-1">Officer Name / Designation</label>
                <input
                  type="text"
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#142B4A] mb-1">
                  Scrutiny Findings & Mandatory Note *
                </label>
                <textarea
                  rows={4}
                  placeholder={`Enter specific reasoning for "${actionModalType}"...`}
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>

              {actionModalType === 'Review Completed' && (
                <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
                  <strong>Important Notice:</strong> "Review Completed" indicates that preliminary demonstration scrutiny is finished. It does not replace formal regulatory sanction or committee orders.
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE4ED]">
              <button
                onClick={() => setActionModalType(null)}
                className="px-4 py-2 border border-[#DCE4ED] rounded-lg text-xs font-semibold text-[#142B4A]"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  let targetStatus: ReviewerCaseStatus | undefined;
                  if (actionModalType === 'Evidence Request') targetStatus = 'Additional Evidence Requested';
                  if (actionModalType === 'Manual Verification') targetStatus = 'Verification Pending';
                  if (actionModalType === 'Inspection Referral') targetStatus = 'Referred for Inspection';
                  if (actionModalType === 'Review Completed') targetStatus = 'Review Completed';
                  handleExecuteReviewerAction(actionModalType, targetStatus);
                }}
                disabled={!actionNote.trim()}
                className="px-5 py-2 bg-[#142B4A] hover:bg-[#203C5B] text-white rounded-lg text-xs font-semibold shadow-xs disabled:opacity-50"
              >
                Commit Action to Audit Trail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
