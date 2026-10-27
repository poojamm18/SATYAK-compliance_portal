import React, { useState } from 'react';
import { Application, Finding, FindingCategory, FindingSeverity, FindingStatus, UserRole } from '../../types';
import { AppStorageService } from '../../services/storage';
import { NavigationPage } from '../common/Header';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  FileText,
  Download,
  RotateCcw,
  Search,
  Filter,
  Eye,
  X,
  ExternalLink,
  Printer,
  Scale,
  Calendar,
  Building2,
  ArrowRight,
  UserCheck,
  Info,
} from 'lucide-react';

interface ValidationResultsReportProps {
  application: Application | null;
  setCurrentPage: (page: NavigationPage) => void;
  onSelectApplication: (app: Application) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
}

export const ValidationResultsReport: React.FC<ValidationResultsReportProps> = ({
  application,
  setCurrentPage,
  onSelectApplication,
  activeRole,
  setActiveRole,
}) => {
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  if (!application) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <FileText className="w-12 h-12 mx-auto text-slate-300" />
        <h2 className="text-xl font-bold text-[#142B4A]">No Application Selected for Audit</h2>
        <p className="text-xs text-[#637287]">
          Please run a readiness check or choose an application from the institution dashboard.
        </p>
        <button
          onClick={() => setCurrentPage('wizard')}
          className="px-4 py-2 bg-[#087F8C] text-white rounded-lg text-xs font-semibold"
        >
          Check Application Readiness
        </button>
      </div>
    );
  }

  const findings = application.findings || [];

  // Filter findings
  const filteredFindings = findings.filter((f) => {
    if (statusFilter !== 'ALL' && f.status !== statusFilter) return false;
    if (severityFilter !== 'ALL' && f.severity !== severityFilter) return false;
    if (categoryFilter !== 'ALL' && f.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchText = `${f.checkName} ${f.description} ${f.affectedFieldOrDoc} ${f.evidence}`.toLowerCase();
      if (!matchText.includes(q)) return false;
    }
    return true;
  });

  // Calculate Metrics
  const totalChecks = findings.length;
  const passedChecks = findings.filter((f) => f.status === 'Passed').length;
  const actionRequiredCount = findings.filter((f) => f.status === 'Action Required').length;
  const attentionCount = findings.filter((f) => f.status === 'Attention Required').length;
  const verificationPendingCount = findings.filter((f) => f.status === 'Verification Pending').length;
  const manualReviewCount = findings.filter((f) => f.humanReviewRequired).length;

  // Revalidate action
  const handleRevalidate = () => {
    const updated = AppStorageService.revalidateApplication(application.id, activeRole);
    if (updated) {
      onSelectApplication(updated);
    }
  };

  // Download official validation report
  const handleDownloadReport = () => {
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>SATYAK Validation Report - ${application.refNumber}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; margin: 40px; color: #172B42; line-height: 1.5; font-size: 13px; }
          .header { border-bottom: 2px solid #142B4A; padding-bottom: 15px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
          .title { font-size: 22px; font-weight: 800; color: #142B4A; }
          .meta-box { background: #F2F5F9; border: 1px solid #DCE4ED; padding: 15px; border-radius: 6px; margin-bottom: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .metric-cards { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; margin-bottom: 20px; }
          .metric-card { border: 1px solid #DCE4ED; padding: 10px; border-radius: 6px; text-align: center; }
          .metric-num { font-size: 18px; font-weight: 800; }
          table { width: 100%; border-collapse: collapse; margin-top: 15px; }
          th { background: #142B4A; color: white; text-align: left; padding: 8px; font-size: 11px; }
          td { border-bottom: 1px solid #DCE4ED; padding: 8px; vertical-align: top; }
          .badge-high { color: #C43D4B; font-weight: bold; }
          .badge-med { color: #B7791F; font-weight: bold; }
          .badge-pass { color: #16805D; font-weight: bold; }
          .disclaimer { margin-top: 30px; padding: 12px; background: #FFF8E6; border: 1px solid #FFE08A; font-size: 11px; border-radius: 4px; color: #7A5B00; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <div class="title">SATYAK Compliance Audit & Validation Report</div>
            <div>Smart Application Tracking, Authentication & Knowledge System</div>
          </div>
          <div style="text-align: right; font-size: 11px; color: #637287;">
            <div>Report Date: ${new Date().toLocaleDateString()}</div>
            <div>Evaluation Benchmark: ${application.applicationDate}</div>
          </div>
        </div>

        <div class="meta-box">
          <div><strong>Application Ref:</strong> ${application.refNumber}</div>
          <div><strong>Permanent Institute ID:</strong> ${application.institutionCode}</div>
          <div><strong>Institution Name:</strong> ${application.institutionName}</div>
          <div><strong>State / Territory:</strong> ${application.state}</div>
          <div><strong>Application Category:</strong> ${application.category}</div>
          <div><strong>Academic Session:</strong> ${application.academicYear}</div>
        </div>

        <div class="metric-cards">
          <div class="metric-card">
            <div class="metric-num" style="color: #087F8C;">${application.readinessScore}%</div>
            <div>Readiness Indicator</div>
          </div>
          <div class="metric-card">
            <div class="metric-num" style="color: #16805D;">${passedChecks} / ${totalChecks}</div>
            <div>Passed Checks</div>
          </div>
          <div class="metric-card">
            <div class="metric-num" style="color: #C43D4B;">${actionRequiredCount}</div>
            <div>Action Required</div>
          </div>
          <div class="metric-card">
            <div class="metric-num" style="color: #B7791F;">${manualReviewCount}</div>
            <div>Requires Scrutiny</div>
          </div>
        </div>

        <h3>Detailed Findings & Discrepancies</h3>
        <table>
          <thead>
            <tr>
              <th style="width: 15%;">Finding ID</th>
              <th style="width: 25%;">Check / Target</th>
              <th style="width: 15%;">Status</th>
              <th style="width: 25%;">Evidence / Observation</th>
              <th style="width: 20%;">Recommended Action</th>
            </tr>
          </thead>
          <tbody>
            ${findings
              .map(
                (f) => `
              <tr>
                <td><strong>${f.id}</strong><br><span style="font-size: 10px; color: #637287;">${f.category}</span></td>
                <td><strong>${f.checkName}</strong><br><span style="font-size: 10px;">${f.affectedFieldOrDoc}</span></td>
                <td><span class="${f.status === 'Passed' ? 'badge-pass' : f.severity === 'High' ? 'badge-high' : 'badge-med'}">${f.status} (${f.severity})</span></td>
                <td>${f.evidence}<br><em style="font-size: 10px; color: #637287;">Observed: ${f.observedValue || 'N/A'}</em></td>
                <td>${f.recommendedAction}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div class="disclaimer">
          <strong>Prototype Disclaimer:</strong> SATYAK is an independent hackathon prototype. All validation rules and synthetic records are for demonstration. This readiness report is an advisory pre-submission check and does not guarantee formal AICTE approval.
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SATYAK_Validation_Report_${application.refNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  // Readiness badge color
  const getReadinessBadge = () => {
    if (application.readinessStatus === 'Ready for Submission') {
      return {
        bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
        label: 'Ready for Scrutiny',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
      };
    }
    if (application.readinessStatus === 'Attention Required') {
      return {
        bg: 'bg-amber-50 text-amber-800 border-amber-300',
        label: 'Attention Required',
        icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
      };
    }
    if (application.readinessStatus === 'Substantial Deficiencies') {
      return {
        bg: 'bg-rose-50 text-rose-800 border-rose-300',
        label: 'Substantial Deficiencies',
        icon: <AlertCircle className="w-4 h-4 text-rose-600" />,
      };
    }
    return {
      bg: 'bg-slate-50 text-slate-800 border-slate-300',
      label: 'Insufficient Information to calculate readiness',
      icon: <Info className="w-4 h-4 text-slate-600" />,
    };
  };

  const readinessBadge = getReadinessBadge();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#DCE4ED] pb-6 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-[#E6F4F3] text-[#087F8C]">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-bold text-[#142B4A]">
              Validation Findings & Compliance Audit
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-[#637287] mt-1">
            Application <span className="font-mono font-semibold text-[#142B4A]">{application.refNumber}</span> • {application.institutionName}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleRevalidate}
            className="px-3 py-2 rounded-lg border border-[#DCE4ED] hover:bg-white bg-[#F2F5F9] text-xs font-semibold text-[#142B4A] flex items-center gap-1.5 transition-colors"
            title="Re-run validation engine against current documents"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Re-run Validation</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-2 rounded-lg border border-[#DCE4ED] hover:bg-white bg-[#F2F5F9] text-xs font-semibold text-[#142B4A] flex items-center gap-1.5 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleDownloadReport}
            className="px-4 py-2 rounded-lg bg-[#087F8C] hover:bg-[#076b77] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Validation Report</span>
          </button>

          <button
            onClick={() => {
              setActiveRole('Reviewing Officer');
              setCurrentPage('officer');
            }}
            className="px-3 py-2 rounded-lg bg-[#142B4A] hover:bg-[#203C5B] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Officer View</span>
          </button>
        </div>
      </div>

      {/* Overview Metadata Card */}
      <div className="bg-white rounded-xl border border-[#DCE4ED] p-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Readiness Score dial */}
          <div className="flex items-center gap-4 border-b md:border-b-0 md:border-r border-[#DCE4ED] pb-4 md:pb-0 md:pr-4">
            <div className="relative w-20 h-20 rounded-full bg-[#F2F5F9] border-4 border-[#087F8C] flex items-center justify-center shrink-0">
              <span className="text-xl font-extrabold text-[#142B4A]">
                {application.readinessScore}%
              </span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#637287]">
                Readiness Indicator
              </span>
              <div className="mt-1">
                <span className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded border ${readinessBadge.bg}`}>
                  {readinessBadge.icon}
                  <span>{readinessBadge.label}</span>
                </span>
              </div>
              <p className="text-[10px] text-[#637287] mt-1.5">
                Internal advisory measure. Does not guarantee statutory AICTE approval.
              </p>
            </div>
          </div>

          {/* Institutional info */}
          <div className="space-y-1 text-xs md:col-span-2">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <span className="text-[10px] text-[#637287] uppercase block">AICTE PID</span>
                <span className="font-mono font-bold text-[#087F8C]">{application.institutionCode}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#637287] uppercase block">Category</span>
                <span className="font-semibold text-[#142B4A]">{application.category}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#637287] uppercase block">State & Session</span>
                <span className="font-semibold text-[#142B4A]">{application.state} • {application.academicYear}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#637287] uppercase block">Last Validated</span>
                <span className="text-[#142B4A]">{new Date(application.updatedAt).toLocaleTimeString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-[#DCE4ED] flex flex-wrap gap-2 text-xs">
              <span className="text-[#637287]">Attached Documents:</span>
              <strong className="text-[#142B4A]">{application.documents.length} statutory files</strong>
              <span className="text-[#637287] ml-2">Review Status:</span>
              <span className="font-semibold text-[#087F8C]">{application.reviewerStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 6 Key Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#142B4A]">{totalChecks}</div>
          <div className="text-[11px] font-medium text-[#637287] uppercase mt-0.5">Total Checks</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#16805D]">{passedChecks}</div>
          <div className="text-[11px] font-medium text-[#637287] uppercase mt-0.5">Passed Checks</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#C43D4B]">{actionRequiredCount}</div>
          <div className="text-[11px] font-medium text-[#637287] uppercase mt-0.5">Action Required</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#B7791F]">{attentionCount}</div>
          <div className="text-[11px] font-medium text-[#637287] uppercase mt-0.5">Attention Needed</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#087F8C]">{verificationPendingCount}</div>
          <div className="text-[11px] font-medium text-[#637287] uppercase mt-0.5">Issuer Pending</div>
        </div>

        <div className="bg-white p-3.5 rounded-lg border border-[#DCE4ED] text-center shadow-xs">
          <div className="text-xl font-bold text-[#203C5B]">{manualReviewCount}</div>
          <div className="text-[11px] font-medium text-[#637287] uppercase mt-0.5">Manual Review</div>
        </div>
      </div>

      {/* Filterable Findings Interface */}
      <div className="bg-white rounded-xl border border-[#DCE4ED] p-5 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-[#DCE4ED] pb-4">
          <div>
            <h2 className="text-base font-bold text-[#142B4A]">
              Detailed Audit Findings ({filteredFindings.length} of {findings.length})
            </h2>
            <p className="text-xs text-[#637287] mt-0.5">
              Click any finding to inspect evidence extracts, regulatory rules, and recommended remediation.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
            <input
              type="text"
              placeholder="Search check or evidence..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-2 rounded-lg border border-[#DCE4ED] bg-[#F2F5F9]/50 focus:bg-white outline-none"
            />
          </div>
        </div>

        {/* Filter Badges */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-[#637287] font-semibold flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs p-1.5 rounded border border-[#DCE4ED] bg-white outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="Action Required">Action Required</option>
            <option value="Attention Required">Attention Required</option>
            <option value="Verification Pending">Verification Pending</option>
            <option value="Passed">Passed</option>
          </select>

          <select
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
            className="text-xs p-1.5 rounded border border-[#DCE4ED] bg-white outline-none"
          >
            <option value="ALL">All Severities</option>
            <option value="High">High Severity</option>
            <option value="Medium">Medium Severity</option>
            <option value="Low">Low Severity</option>
          </select>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs p-1.5 rounded border border-[#DCE4ED] bg-white outline-none"
          >
            <option value="ALL">All Check Categories</option>
            <option value="Completeness">Completeness</option>
            <option value="Validity & Expiry">Validity & Expiry</option>
            <option value="Cross-Record Consistency">Cross-Record Consistency</option>
            <option value="Document Integrity & Anomaly">Document Integrity & Anomaly</option>
            <option value="Issuer Verification">Issuer Verification</option>
          </select>

          {(statusFilter !== 'ALL' || severityFilter !== 'ALL' || categoryFilter !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter('ALL');
                setSeverityFilter('ALL');
                setCategoryFilter('ALL');
                setSearchQuery('');
              }}
              className="text-[11px] text-[#087F8C] hover:underline ml-auto font-medium"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* Findings List */}
        <div className="space-y-2 pt-2">
          {filteredFindings.length === 0 ? (
            <div className="p-8 text-center border border-dashed border-[#DCE4ED] rounded-lg text-[#637287]">
              No findings match your filter selection.
            </div>
          ) : (
            filteredFindings.map((finding) => {
              const isHigh = finding.severity === 'High';
              const isAction = finding.status === 'Action Required';
              const isPassed = finding.status === 'Passed';

              return (
                <div
                  key={finding.id}
                  onClick={() => setSelectedFinding(finding)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all hover:shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                    isAction
                      ? 'border-rose-200 bg-rose-50/40 hover:bg-rose-50'
                      : isPassed
                      ? 'border-slate-200 bg-white hover:bg-slate-50'
                      : 'border-amber-200 bg-amber-50/30 hover:bg-amber-50'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[10px] font-bold text-[#637287]">
                        {finding.id}
                      </span>
                      <span
                        className={`font-semibold px-2 py-0.5 rounded text-[10px] ${
                          isAction
                            ? 'bg-rose-100 text-[#C43D4B]'
                            : isPassed
                            ? 'bg-emerald-100 text-[#16805D]'
                            : 'bg-amber-100 text-[#B7791F]'
                        }`}
                      >
                        {finding.status}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase ${
                          isHigh ? 'text-[#C43D4B]' : 'text-[#637287]'
                        }`}
                      >
                        {finding.severity} Severity
                      </span>
                      <span className="text-[10px] text-[#637287] bg-slate-100 px-1.5 py-0.2 rounded">
                        {finding.category}
                      </span>
                    </div>

                    <h3 className="text-xs font-bold text-[#142B4A]">
                      {finding.checkName}
                    </h3>

                    <p className="text-xs text-[#172B42] line-clamp-2">
                      {finding.description}
                    </p>

                    <div className="text-[11px] text-[#637287]">
                      <strong>Affected:</strong> {finding.affectedFieldOrDoc}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 sm:self-center shrink-0">
                    {finding.humanReviewRequired && (
                      <span className="text-[10px] font-semibold text-[#142B4A] bg-[#DCE4ED] px-2 py-0.5 rounded">
                        Review Required
                      </span>
                    )}
                    <button className="text-xs font-semibold text-[#087F8C] flex items-center gap-1 hover:underline">
                      <span>Inspect Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* DETAIL MODAL / DRAWER WHEN A FINDING IS SELECTED */}
      {selectedFinding && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-[#DCE4ED] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-start justify-between border-b border-[#DCE4ED] pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#087F8C]">
                    {selectedFinding.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      selectedFinding.severity === 'High'
                        ? 'bg-rose-100 text-rose-800'
                        : selectedFinding.status === 'Passed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {selectedFinding.status} • {selectedFinding.severity} Severity
                  </span>
                </div>
                <h3 className="text-base font-bold text-[#142B4A] mt-1">
                  {selectedFinding.checkName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedFinding(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 1. What was detected */}
            <div>
              <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-1">
                1. What Was Detected
              </h4>
              <p className="text-xs text-[#172B42] leading-relaxed bg-[#F2F5F9] p-3 rounded-lg border border-[#DCE4ED]">
                {selectedFinding.description}
              </p>
            </div>

            {/* 2. Why it matters */}
            <div>
              <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-1">
                2. Regulatory Rationale & Why It Matters
              </h4>
              <p className="text-xs text-[#637287] leading-relaxed">
                {selectedFinding.reason}
              </p>
            </div>

            {/* 3. Expected vs Observed Values */}
            {(selectedFinding.expectedValue || selectedFinding.observedValue) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                <div>
                  <span className="text-[10px] font-bold text-[#637287] uppercase block">
                    Expected Regulatory Value:
                  </span>
                  <span className="font-medium text-[#16805D]">
                    {selectedFinding.expectedValue || 'Conforming parameters'}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-[#637287] uppercase block">
                    Observed Submission Value:
                  </span>
                  <span className="font-medium text-[#C43D4B]">
                    {selectedFinding.observedValue || 'Non-conforming'}
                  </span>
                </div>
              </div>
            )}

            {/* 4. Supporting Evidence */}
            <div>
              <h4 className="text-xs font-bold text-[#142B4A] uppercase tracking-wider mb-1">
                4. Supporting Evidence
              </h4>
              <p className="text-xs font-mono text-[#142B4A] bg-slate-100 p-2.5 rounded border border-slate-200">
                {selectedFinding.evidence}
              </p>
            </div>

            {/* 5. Recommended Corrective Action */}
            <div className="bg-[#E6F4F3]/60 p-3.5 rounded-lg border border-[#087F8C]/30">
              <h4 className="text-xs font-bold text-[#087F8C] uppercase tracking-wider mb-1">
                5. Recommended Next Action
              </h4>
              <p className="text-xs text-[#142B4A] font-medium leading-relaxed">
                {selectedFinding.recommendedAction}
              </p>
            </div>

            {/* 6. Human Review Required Note */}
            <div className="flex items-center justify-between text-xs text-[#637287] pt-2 border-t border-[#DCE4ED]">
              <span>
                Human Review Mandated: <strong>{selectedFinding.humanReviewRequired ? 'Yes (Scrutiny Officer)' : 'Automated Verification'}</strong>
              </span>
              <button
                onClick={() => setSelectedFinding(null)}
                className="px-4 py-1.5 bg-[#142B4A] text-white rounded text-xs font-semibold"
              >
                Close Finding
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
