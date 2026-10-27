import React, { useState } from 'react';
import { Application, DocumentMetadata, UserRole } from '../../types';
import { AppStorageService } from '../../services/storage';
import { NavigationPage } from '../common/Header';
import {
  Building2,
  FileCheck,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Clock,
  RotateCcw,
  FileText,
  Upload,
  ArrowRight,
  History,
  X,
  Eye,
} from 'lucide-react';

interface InstitutionDashboardProps {
  applications: Application[];
  setCurrentPage: (page: NavigationPage) => void;
  onSelectApplication: (app: Application) => void;
  activeRole: UserRole;
  refreshApplications: () => void;
}

export const InstitutionDashboard: React.FC<InstitutionDashboardProps> = ({
  applications,
  setCurrentPage,
  onSelectApplication,
  activeRole,
  refreshApplications,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [sortField, setSortField] = useState<'updatedAt' | 'readinessScore' | 'refNumber'>('updatedAt');

  // Modal to add document to an existing application
  const [targetAppForUpload, setTargetAppForUpload] = useState<Application | null>(null);
  const [newDocCategory, setNewDocCategory] = useState<DocumentMetadata['category']>('Infrastructure Certificate');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocRef, setNewDocRef] = useState('');
  const [newDocExpiry, setNewDocExpiry] = useState('2027-05-30');

  // Modal for audit history
  const [viewHistoryApp, setViewHistoryApp] = useState<Application | null>(null);

  // Filter and sort applications
  const filteredApps = applications
    .filter((app) => {
      if (categoryFilter !== 'ALL' && app.category !== categoryFilter) return false;
      if (statusFilter !== 'ALL' && app.readinessStatus !== statusFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const match = `${app.refNumber} ${app.institutionName} ${app.institutionCode} ${app.state}`.toLowerCase();
        if (!match.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (sortField === 'readinessScore') return b.readinessScore - a.readinessScore;
      if (sortField === 'refNumber') return a.refNumber.localeCompare(b.refNumber);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  const handleAddDocumentToApp = () => {
    if (!targetAppForUpload) return;

    const doc: DocumentMetadata = {
      id: `doc-${Date.now()}`,
      name: newDocTitle.trim() || `${newDocCategory.replace(/\s+/g, '_')}_Uploaded.pdf`,
      category: newDocCategory,
      fileSize: 340000,
      fileType: 'application/pdf',
      uploadDate: new Date().toISOString().split('T')[0],
      sha256Hash: `hash-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      docNumber: newDocRef || `REF-${Math.floor(1000 + Math.random() * 9000)}`,
      issueDate: '2026-06-01',
      expiryDate: newDocExpiry || undefined,
      issuingAuthority: 'Competent Regulatory Authority',
      extractedFields: {
        institutionName: targetAppForUpload.institutionName,
        institutionCode: targetAppForUpload.institutionCode,
      },
      extractionMode: 'manual',
      status: 'valid',
    };

    AppStorageService.addDocument(targetAppForUpload.id, doc, activeRole);
    refreshApplications();
    setTargetAppForUpload(null);
    setNewDocTitle('');
    setNewDocRef('');
  };

  const handleQuickRevalidate = (appId: string) => {
    AppStorageService.revalidateApplication(appId, activeRole);
    refreshApplications();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DCE4ED] pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
              <Building2 className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#142B4A]">
              Institution Portal & Application Workspace
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#637287] mt-1">
            Track multi-category approval filings, resolve deficiencies, replace certificates, and rerun validation.
          </p>
        </div>

        <button
          onClick={() => setCurrentPage('wizard')}
          className="px-4 py-2.5 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors self-start"
        >
          <Plus className="w-4 h-4" />
          <span>Prepare New Application</span>
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-[#DCE4ED] shadow-xs">
          <div className="text-xs text-[#637287] font-semibold uppercase">Total Applications</div>
          <div className="text-2xl font-extrabold text-[#142B4A] mt-1">{applications.length}</div>
          <div className="text-[11px] text-[#637287] mt-1">Demonstration records</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4ED] shadow-xs">
          <div className="text-xs text-[#637287] font-semibold uppercase">Ready For Submission</div>
          <div className="text-2xl font-extrabold text-[#16805D] mt-1">
            {applications.filter((a) => a.readinessStatus === 'Ready for Submission').length}
          </div>
          <div className="text-[11px] text-emerald-700 mt-1">Compliant preliminary inventory</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4ED] shadow-xs">
          <div className="text-xs text-[#637287] font-semibold uppercase">Attention Needed</div>
          <div className="text-2xl font-extrabold text-[#B7791F] mt-1">
            {applications.filter((a) => a.readinessStatus === 'Attention Required').length}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">Expiring or partial docs</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#DCE4ED] shadow-xs">
          <div className="text-xs text-[#637287] font-semibold uppercase">Deficiencies Identified</div>
          <div className="text-2xl font-extrabold text-[#C43D4B] mt-1">
            {applications.filter((a) => a.readinessStatus === 'Substantial Deficiencies').length}
          </div>
          <div className="text-[11px] text-rose-700 mt-1">Action required before filing</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl border border-[#DCE4ED] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="relative w-full md:w-72">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
          <input
            type="text"
            placeholder="Search by college, PID or Ref..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-lg border border-[#DCE4ED] bg-[#F2F5F9]/50 focus:bg-white outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Ready for Submission">Ready for Submission</option>
            <option value="Attention Required">Attention Required</option>
            <option value="Substantial Deficiencies">Substantial Deficiencies</option>
          </select>

          <select
            value={sortField}
            onChange={(e) => setSortField(e.target.value as any)}
            className="p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
          >
            <option value="updatedAt">Sort: Recently Updated</option>
            <option value="readinessScore">Sort: Readiness Score</option>
            <option value="refNumber">Sort: Reference ID</option>
          </select>
        </div>
      </div>

      {/* Applications Cards / Responsive Table */}
      <div className="space-y-4">
        {filteredApps.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-dashed border-[#DCE4ED] text-[#637287]">
            No applications match the search criteria.
          </div>
        ) : (
          filteredApps.map((app) => {
            const isSubstantial = app.readinessStatus === 'Substantial Deficiencies';
            const isReady = app.readinessStatus === 'Ready for Submission';
            const findingsCount = app.findings.length;
            const actionCount = app.findings.filter((f) => f.status === 'Action Required').length;

            return (
              <div
                key={app.id}
                className="bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs hover:border-[#087F8C] transition-all"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Info */}
                  <div className="space-y-1.5 max-w-xl">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#087F8C] bg-[#E6F4F3] px-2 py-0.5 rounded">
                        {app.refNumber}
                      </span>
                      <span className="text-[10px] font-mono text-[#637287] bg-slate-100 px-1.5 py-0.5 rounded">
                        PID: {app.institutionCode}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
                          isReady
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                            : isSubstantial
                            ? 'bg-rose-50 text-rose-800 border-rose-300'
                            : 'bg-amber-50 text-amber-800 border-amber-300'
                        }`}
                      >
                        {app.readinessStatus} ({app.readinessScore}%)
                      </span>
                      <span className="text-[10px] font-semibold text-[#142B4A] bg-slate-100 px-2 py-0.5 rounded">
                        Officer: {app.reviewerStatus}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#142B4A]">
                      {app.institutionName}
                    </h3>

                    <div className="text-xs text-[#637287] flex flex-wrap gap-3">
                      <span>Category: <strong className="text-[#172B42]">{app.category}</strong></span>
                      <span>•</span>
                      <span>State: <strong className="text-[#172B42]">{app.state}</strong></span>
                      <span>•</span>
                      <span>Session: <strong className="text-[#172B42]">{app.academicYear}</strong></span>
                    </div>

                    <div className="text-xs text-[#172B42] pt-1 flex flex-wrap items-center gap-2">
                      <span className="text-[#637287]">Audit Snapshot:</span>
                      <span className="font-semibold text-slate-700">
                        {app.documents.length} Files Attached
                      </span>
                      <span>•</span>
                      {actionCount > 0 ? (
                        <span className="font-bold text-[#C43D4B]">
                          {actionCount} Action Required Deficiencies
                        </span>
                      ) : (
                        <span className="font-semibold text-[#16805D]">
                          0 Blocking Issues
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex flex-wrap items-center gap-2 border-t lg:border-t-0 pt-3 lg:pt-0">
                    <button
                      onClick={() => {
                        onSelectApplication(app);
                        setCurrentPage('results');
                      }}
                      className="px-3.5 py-2 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Audit Report</span>
                    </button>

                    <button
                      onClick={() => setTargetAppForUpload(app)}
                      className="px-3 py-2 rounded-lg border border-[#DCE4ED] hover:bg-slate-50 text-xs font-semibold text-[#142B4A] flex items-center gap-1.5 transition-colors"
                      title="Upload missing or renewed document"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>Add Document</span>
                    </button>

                    <button
                      onClick={() => handleQuickRevalidate(app.id)}
                      className="px-3 py-2 rounded-lg border border-[#DCE4ED] hover:bg-slate-50 text-xs font-semibold text-[#142B4A] flex items-center gap-1.5 transition-colors"
                      title="Re-run validation engine"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Re-validate</span>
                    </button>

                    <button
                      onClick={() => setViewHistoryApp(app)}
                      className="px-3 py-2 rounded-lg border border-[#DCE4ED] hover:bg-slate-50 text-xs font-semibold text-[#637287] flex items-center gap-1.5 transition-colors"
                      title="View audit trail"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Audit Trail</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MODAL: ADD / REPLACE DOCUMENT */}
      {targetAppForUpload && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DCE4ED] shadow-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE4ED] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#142B4A]">
                  Add Document to {targetAppForUpload.refNumber}
                </h3>
                <p className="text-xs text-[#637287]">
                  Upload renewed certificate or missing mandatory document.
                </p>
              </div>
              <button
                onClick={() => setTargetAppForUpload(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-[#142B4A] mb-1">Document Category</label>
                <select
                  value={newDocCategory}
                  onChange={(e) => setNewDocCategory(e.target.value as any)}
                  className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                >
                  <option value="Infrastructure Certificate">Infrastructure Certificate</option>
                  <option value="Accreditation or Certification">Accreditation or Certification</option>
                  <option value="NOC or Permission">NOC or Permission</option>
                  <option value="Faculty-Related Evidence">Faculty-Related Evidence</option>
                  <option value="Affidavit or Undertaking">Affidavit or Undertaking</option>
                  <option value="Previous Approval or EoA">Previous Approval or EoA</option>
                  <option value="Institutional Records">Institutional Records</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-[#142B4A] mb-1">File Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fire_Safety_NOC_Renewal_2026.pdf"
                  value={newDocTitle}
                  onChange={(e) => setNewDocTitle(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#142B4A] mb-1">Dispatch / Certificate Reference</label>
                <input
                  type="text"
                  placeholder="e.g. FS/KL/NOC-2026-RENEWED"
                  value={newDocRef}
                  onChange={(e) => setNewDocRef(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-[#142B4A] mb-1">Validity Expiry Date</label>
                <input
                  type="date"
                  value={newDocExpiry}
                  onChange={(e) => setNewDocExpiry(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#DCE4ED] bg-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#DCE4ED]">
              <button
                onClick={() => setTargetAppForUpload(null)}
                className="px-4 py-2 border border-[#DCE4ED] rounded-lg text-xs font-semibold text-[#142B4A]"
              >
                Cancel
              </button>
              <button
                onClick={handleAddDocumentToApp}
                className="px-5 py-2 bg-[#087F8C] hover:bg-[#076b77] text-white rounded-lg text-xs font-semibold shadow-xs"
              >
                Attach & Re-Evaluate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: AUDIT TRAIL TIMELINE */}
      {viewHistoryApp && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DCE4ED] shadow-2xl max-w-xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#DCE4ED] pb-3">
              <div>
                <h3 className="text-base font-bold text-[#142B4A]">
                  Audit Trail — {viewHistoryApp.refNumber}
                </h3>
                <p className="text-xs text-[#637287]">
                  Append-only chronological record of all system and user events.
                </p>
              </div>
              <button
                onClick={() => setViewHistoryApp(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {viewHistoryApp.auditLog.map((event) => (
                <div key={event.id} className="relative flex items-start gap-3 pl-2 text-xs">
                  <div className="w-3.5 h-3.5 rounded-full bg-[#087F8C] border-2 border-white shadow-xs shrink-0 mt-1 z-10" />
                  <div className="bg-[#F2F5F9] p-3 rounded-lg border border-[#DCE4ED] w-full">
                    <div className="flex items-center justify-between text-[11px] text-[#637287] mb-1">
                      <span className="font-semibold text-[#142B4A]">{event.actor}</span>
                      <span>{new Date(event.timestamp).toLocaleString()}</span>
                    </div>
                    <div className="font-medium text-[#172B42]">{event.description}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-[#DCE4ED]">
              <button
                onClick={() => setViewHistoryApp(null)}
                className="px-4 py-1.5 bg-[#142B4A] text-white rounded text-xs font-semibold"
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
