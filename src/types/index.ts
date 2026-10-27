export type ApplicationCategory =
  | 'Extension of Approval (EoA)'
  | 'New Institution Approval'
  | 'Change in Approved Intake'
  | 'Addition or Change of Programme'
  | 'Other Approval-Related Change';

export type DocumentCategory =
  | 'Affidavit or Undertaking'
  | 'Accreditation or Certification'
  | 'NOC or Permission'
  | 'Faculty-Related Evidence'
  | 'Infrastructure Certificate'
  | 'Institutional Records'
  | 'Previous Approval or EoA'
  | 'Other Supporting Document';

export type FindingStatus =
  | 'Passed'
  | 'Attention Required'
  | 'Action Required'
  | 'Verification Pending'
  | 'Manual Review Required';

export type FindingSeverity = 'Low' | 'Medium' | 'High';

export type FindingCategory =
  | 'Completeness'
  | 'Validity & Expiry'
  | 'Cross-Record Consistency'
  | 'Document Integrity & Anomaly'
  | 'Issuer Verification'
  | 'Infrastructure Compliance';

export interface DocumentMetadata {
  id: string;
  name: string;
  category: DocumentCategory;
  fileSize: number; // in bytes
  fileType: string;
  uploadDate: string;
  sha256Hash: string;
  docNumber?: string;
  issueDate?: string;
  expiryDate?: string;
  issuingAuthority?: string;
  extractedFields?: {
    institutionName?: string;
    institutionCode?: string;
    academicYear?: string;
    intakeCapacity?: number;
    programmeName?: string;
    landAreaAcres?: number;
    builtUpAreaSqm?: number;
    architectRegNo?: string;
  };
  extractionMode: 'extracted' | 'manual' | 'synthetic_demo' | 'failed';
  issuerRef?: string;
  issuerType?: string;
  status: 'valid' | 'expired' | 'expiring_soon' | 'mismatch' | 'unverified';
}

export interface Finding {
  id: string;
  checkName: string;
  category: FindingCategory;
  status: FindingStatus;
  severity: FindingSeverity;
  description: string;
  reason: string;
  affectedFieldOrDoc: string;
  expectedValue?: string;
  observedValue?: string;
  evidence: string;
  recommendedAction: string;
  humanReviewRequired: boolean;
  issuerRef?: string;
  timestamp: string;
}

export type ReviewerCaseStatus =
  | 'Awaiting Review'
  | 'Deficiencies Identified'
  | 'Verification Pending'
  | 'Additional Evidence Requested'
  | 'Referred for Inspection'
  | 'Review Completed';

export interface ReviewerObservation {
  id: string;
  applicationId: string;
  timestamp: string;
  authorRole: 'Reviewing Officer';
  officerName: string;
  noteType:
    | 'Observation'
    | 'Evidence Request'
    | 'Manual Verification'
    | 'Inspection Referral'
    | 'Review Completed'
    | 'Action Reversal';
  note: string;
  actionTaken?: string;
}

export interface AuditEvent {
  id: string;
  applicationId: string;
  eventType:
    | 'APPLICATION_CREATED'
    | 'DETAILS_UPDATED'
    | 'DOCUMENT_ADDED'
    | 'DOCUMENT_REMOVED'
    | 'VALIDATION_STARTED'
    | 'VALIDATION_COMPLETED'
    | 'FINDING_GENERATED'
    | 'ISSUER_VERIFICATION_ATTEMPTED'
    | 'REVIEWER_OBSERVATION_ADDED'
    | 'ADDITIONAL_EVIDENCE_REQUESTED'
    | 'REFERRED_FOR_INSPECTION'
    | 'REVIEW_STATE_CHANGED';
  timestamp: string;
  actor: 'Institution User' | 'Reviewing Officer' | 'System Validation Engine';
  actorName?: string;
  description: string;
  relatedFindingId?: string;
  relatedDocId?: string;
}

export interface Application {
  id: string;
  refNumber: string;
  institutionName: string;
  institutionCode: string; // e.g. "1-3489102"
  state: string;
  academicYear: string; // e.g. "2026-2027"
  category: ApplicationCategory;
  applicationDate: string; // YYYY-MM-DD
  contactEmail: string;
  headOfInstitute: string;
  documents: DocumentMetadata[];
  findings: Finding[];
  readinessScore: number; // 0 to 100
  readinessStatus:
    | 'Substantial Deficiencies'
    | 'Attention Required'
    | 'Ready for Submission'
    | 'Insufficient Information';
  reviewerStatus: ReviewerCaseStatus;
  reviewerObservations: ReviewerObservation[];
  auditLog: AuditEvent[];
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'Institution User' | 'Reviewing Officer';

export interface SyntheticIssuerRecord {
  id: string;
  issuerType:
    | 'State Directorate of Technical Education (DTE)'
    | 'Affiliating State Technical University'
    | 'National Board of Accreditation (NBA)'
    | 'State Fire & Emergency Services'
    | 'Town Planning & Municipal Land Registry'
    | 'Council of Architecture';
  docRef: string;
  institutionCode: string;
  institutionName: string;
  issueDate: string;
  validTill: string;
  status: 'Active / Verified' | 'Revoked' | 'Expired' | 'Record Not Found';
  payloadSummary: {
    approvedIntake?: number;
    programmeName?: string;
    landExtentAcres?: number;
    fireNocNo?: string;
    remarks?: string;
  };
}

export interface ComplianceRule {
  id: string;
  category: ApplicationCategory;
  title: string;
  plainLanguage: string;
  evidenceRequired: string;
  validationLogicDescription: string;
  normSource: string;
  isMandatory: boolean;
  requiresManualReview: boolean;
}
