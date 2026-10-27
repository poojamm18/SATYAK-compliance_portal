import {
  Application,
  ApplicationCategory,
  DocumentCategory,
  DocumentMetadata,
  Finding,
  FindingSeverity,
  FindingStatus,
} from '../types';

export const REFERENCE_DATE = '2026-10-27';

// Checklist rules for each category
export const CATEGORY_REQUIRED_DOCUMENTS: Record<
  ApplicationCategory,
  { category: DocumentCategory; label: string; mandatory: boolean }[]
> = {
  'Extension of Approval (EoA)': [
    { category: 'Previous Approval or EoA', label: 'Previous Year AICTE EoA Letter', mandatory: true },
    { category: 'Affidavit or Undertaking', label: 'Compliance Affidavit (Anti-Ragging, Grievance, Fee)', mandatory: true },
    { category: 'Faculty-Related Evidence', label: 'Faculty Cadre Ratio & Pay Commission Roster', mandatory: true },
    { category: 'Infrastructure Certificate', label: 'Fire Safety & Building Occupancy Certificate', mandatory: true },
    { category: 'Accreditation or Certification', label: 'NBA / NAAC Accreditation Letter (if applicable)', mandatory: false },
  ],
  'New Institution Approval': [
    { category: 'Institutional Records', label: 'Trust / Society Registration & Land Ownership Deed', mandatory: true },
    { category: 'NOC or Permission', label: 'State Government NOC & University Affiliation In-Principle', mandatory: true },
    { category: 'Infrastructure Certificate', label: 'Approved Master Building Plan & Barrier-Free Certificate', mandatory: true },
    { category: 'Affidavit or Undertaking', label: 'Legal Undertaking & Endowment Fund Fixed Deposit Receipt', mandatory: true },
    { category: 'Faculty-Related Evidence', label: 'Principal / Director & Core Teaching Staff Selection Minutes', mandatory: true },
  ],
  'Change in Approved Intake': [
    { category: 'Previous Approval or EoA', label: 'Current Academic Year Approval Order', mandatory: true },
    { category: 'Accreditation or Certification', label: 'Valid NBA Accreditation Certificate (Mandatory for Intake Expansion)', mandatory: true },
    { category: 'Faculty-Related Evidence', label: 'Augmented Faculty Cadre Matrix for Proposed Intake', mandatory: true },
    { category: 'Infrastructure Certificate', label: 'Additional Classroom & Instructional Area Certificate', mandatory: true },
    { category: 'Affidavit or Undertaking', label: 'Affidavit for Non-Capitation Fee & Infrastructure Sufficiency', mandatory: true },
  ],
  'Addition or Change of Programme': [
    { category: 'Previous Approval or EoA', label: 'Existing Approved Programme EoA', mandatory: true },
    { category: 'NOC or Permission', label: 'State Technical University Syllabus & Affiliation NOC', mandatory: true },
    { category: 'Faculty-Related Evidence', label: 'Specialized Subject Faculty Appointments Roster', mandatory: true },
    { category: 'Infrastructure Certificate', label: 'Departmental Lab Equipment & Library Titles Verification', mandatory: true },
    { category: 'Affidavit or Undertaking', label: 'Statutory Compliance Affidavit', mandatory: true },
  ],
  'Other Approval-Related Change': [
    { category: 'Previous Approval or EoA', label: 'Latest Approval Certificate', mandatory: true },
    { category: 'Institutional Records', label: 'Resolution of Governing Council / Trust Deed Amendment', mandatory: true },
    { category: 'Affidavit or Undertaking', label: 'Sworn Affidavit for Requested Change', mandatory: true },
    { category: 'NOC or Permission', label: 'Competent Authority Approval / University Consent', mandatory: false },
  ],
};

// Helper: Calculate days difference between two ISO date strings (YYYY-MM-DD)
export function getDaysDifference(dateStr1: string, dateStr2: string): number {
  const d1 = new Date(dateStr1).getTime();
  const d2 = new Date(dateStr2).getTime();
  return Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
}

// Calculate SHA-256 helper for client-uploaded files or fallback
export async function computeFileHash(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Deterministic fallback based on file attributes
    return `hash-${file.name}-${file.size}-${file.lastModified}`;
  }
}

export interface ValidationSummary {
  totalChecks: number;
  passedChecks: number;
  attentionCount: number;
  actionRequiredCount: number;
  verificationPendingCount: number;
  manualReviewCount: number;
  readinessScore: number;
  readinessStatus: Application['readinessStatus'];
  findings: Finding[];
}

export function executeApplicationValidation(
  app: Pick<
    Application,
    | 'id'
    | 'refNumber'
    | 'institutionName'
    | 'institutionCode'
    | 'state'
    | 'academicYear'
    | 'category'
    | 'applicationDate'
    | 'documents'
  >
): ValidationSummary {
  const findings: Finding[] = [];
  const refDate = app.applicationDate || REFERENCE_DATE;
  const docs = app.documents || [];
  let checkCounter = 1;

  const nextId = () => `CHK-${String(checkCounter++).padStart(3, '0')}`;

  // 1. Mandatory Field Validation
  if (!app.institutionName || app.institutionName.trim().length < 4) {
    findings.push({
      id: nextId(),
      checkName: 'Institution Legal Entity Name',
      category: 'Completeness',
      status: 'Action Required',
      severity: 'High',
      description: 'Institution legal entity name is missing or insufficiently detailed.',
      reason: 'Every AICTE application must state the exact legal registered name as per the Society / Trust deed.',
      affectedFieldOrDoc: 'Application Header: Institution Name',
      expectedValue: 'Complete registered legal entity name',
      observedValue: app.institutionName || 'Empty',
      evidence: `Provided value: "${app.institutionName || 'null'}"`,
      recommendedAction: 'Enter the complete registered institution name matching state council records.',
      humanReviewRequired: false,
      timestamp: new Date().toISOString(),
    });
  } else {
    findings.push({
      id: nextId(),
      checkName: 'Institution Legal Entity Name',
      category: 'Completeness',
      status: 'Passed',
      severity: 'Low',
      description: 'Institution name conforms to formatting standards.',
      reason: 'Name is clearly defined and matches approved institutional pattern.',
      affectedFieldOrDoc: 'Application Header: Institution Name',
      observedValue: app.institutionName,
      evidence: `Registered Name: ${app.institutionName}`,
      recommendedAction: 'No action required.',
      humanReviewRequired: false,
      timestamp: new Date().toISOString(),
    });
  }

  // AICTE Permanent Institute ID check (Pattern e.g. 1-xxxxxxxxx)
  const aicteCodeRegex = /^1-\d{7,10}$/;
  if (!app.institutionCode || !aicteCodeRegex.test(app.institutionCode.trim())) {
    findings.push({
      id: nextId(),
      checkName: 'AICTE Permanent Institute ID Format',
      category: 'Completeness',
      status: 'Attention Required',
      severity: 'Medium',
      description: 'Institution Code does not match standard AICTE PID format (e.g., 1-12345678).',
      reason: 'AICTE portal assigns a standard Permanent Institute ID starting with "1-" followed by 7-10 digits.',
      affectedFieldOrDoc: 'Application Header: Institution Code',
      expectedValue: 'Pattern 1-XXXXXXXX (e.g. 1-3489102)',
      observedValue: app.institutionCode || 'Missing',
      evidence: `Supplied code: "${app.institutionCode}"`,
      recommendedAction: 'Confirm the AICTE Permanent Institute ID (PID) from previous approval orders or web portal profile.',
      humanReviewRequired: true,
      timestamp: new Date().toISOString(),
    });
  } else {
    findings.push({
      id: nextId(),
      checkName: 'AICTE Permanent Institute ID Format',
      category: 'Completeness',
      status: 'Passed',
      severity: 'Low',
      description: 'AICTE PID adheres to standard format.',
      reason: 'Correct Permanent Institute ID syntax detected.',
      affectedFieldOrDoc: 'Application Header: Institution Code',
      observedValue: app.institutionCode,
      evidence: `PID verified: ${app.institutionCode}`,
      recommendedAction: 'No action required.',
      humanReviewRequired: false,
      timestamp: new Date().toISOString(),
    });
  }

  // 2. Document Completeness against Category Requirements
  const checklist = CATEGORY_REQUIRED_DOCUMENTS[app.category] || [];
  checklist.forEach((item) => {
    const matchingDocs = docs.filter((d) => d.category === item.category);
    if (matchingDocs.length === 0) {
      if (item.mandatory) {
        findings.push({
          id: nextId(),
          checkName: `Missing Mandatory Document: ${item.label}`,
          category: 'Completeness',
          status: 'Action Required',
          severity: 'High',
          description: `Mandatory document category "${item.category}" (${item.label}) is missing from this submission.`,
          reason: `AICTE Approval Process Handbook mandates ${item.label} for ${app.category}.`,
          affectedFieldOrDoc: `Required Document Category: ${item.category}`,
          expectedValue: `At least 1 valid document under ${item.category}`,
          observedValue: '0 documents uploaded',
          evidence: `Checklist audit for "${app.category}" found 0 files under "${item.category}"`,
          recommendedAction: `Upload the official ${item.label} before submitting the application.`,
          humanReviewRequired: false,
          timestamp: new Date().toISOString(),
        });
      } else {
        findings.push({
          id: nextId(),
          checkName: `Optional Document Check: ${item.label}`,
          category: 'Completeness',
          status: 'Attention Required',
          severity: 'Low',
          description: `Recommended document category "${item.category}" (${item.label}) is not attached.`,
          reason: `Although optional for initial validation, providing ${item.label} accelerates the scrutiny review.`,
          affectedFieldOrDoc: `Optional Category: ${item.category}`,
          expectedValue: `Attached copy of ${item.label}`,
          observedValue: 'Not attached',
          evidence: `No files uploaded under "${item.category}"`,
          recommendedAction: `Consider attaching ${item.label} if available to prevent committee clarifications.`,
          humanReviewRequired: false,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      findings.push({
        id: nextId(),
        checkName: `Document Present: ${item.label}`,
        category: 'Completeness',
        status: 'Passed',
        severity: 'Low',
        description: `Required document "${item.label}" is attached (${matchingDocs.map((d) => d.name).join(', ')}).`,
        reason: 'Document meets preliminary inventory checklist criteria.',
        affectedFieldOrDoc: `Document: ${matchingDocs[0].name}`,
        evidence: `File ${matchingDocs[0].name} (${(matchingDocs[0].fileSize / 1024).toFixed(1)} KB) recorded under category ${item.category}`,
        recommendedAction: 'No immediate action required.',
        humanReviewRequired: false,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // 3. Expiry Validation
  docs.forEach((doc) => {
    if (doc.expiryDate) {
      const daysUntilExpiry = getDaysDifference(doc.expiryDate, refDate);
      if (daysUntilExpiry < 0) {
        findings.push({
          id: nextId(),
          checkName: `Expired Certificate: ${doc.name}`,
          category: 'Validity & Expiry',
          status: 'Action Required',
          severity: 'High',
          description: `Document "${doc.name}" expired ${Math.abs(daysUntilExpiry)} days prior to the application evaluation date.`,
          reason: `Certificates must remain valid on the date of application scrutiny (${refDate}). Expired permissions invalidate statutory compliance.`,
          affectedFieldOrDoc: `Document: ${doc.name} (Ref: ${doc.docNumber || 'N/A'})`,
          expectedValue: `Valid on or beyond ${refDate}`,
          observedValue: `Expired on ${doc.expiryDate} (${Math.abs(daysUntilExpiry)} days overdue)`,
          evidence: `Doc Expiry: ${doc.expiryDate} vs Reference Evaluation Date: ${refDate}`,
          recommendedAction: `Procure and upload an active renewal order or extension from ${doc.issuingAuthority || 'the issuing authority'}.`,
          humanReviewRequired: false,
          timestamp: new Date().toISOString(),
        });
      } else if (daysUntilExpiry <= 60) {
        findings.push({
          id: nextId(),
          checkName: `Expiring Soon: ${doc.name}`,
          category: 'Validity & Expiry',
          status: 'Attention Required',
          severity: 'Medium',
          description: `Document "${doc.name}" will expire in ${daysUntilExpiry} days (on ${doc.expiryDate}).`,
          reason: 'Regulatory certificates expiring during the upcoming academic cycle may trigger conditional approvals or inspections.',
          affectedFieldOrDoc: `Document: ${doc.name}`,
          expectedValue: `Validity extending throughout academic session (${app.academicYear})`,
          observedValue: `Expires on ${doc.expiryDate} (${daysUntilExpiry} days remaining)`,
          evidence: `Expiry Date: ${doc.expiryDate}, Remaining: ${daysUntilExpiry} days`,
          recommendedAction: 'Initiate renewal proceedings with the authority immediately to avoid mid-session compliance halts.',
          humanReviewRequired: true,
          timestamp: new Date().toISOString(),
        });
      } else {
        findings.push({
          id: nextId(),
          checkName: `Certificate Validity: ${doc.name}`,
          category: 'Validity & Expiry',
          status: 'Passed',
          severity: 'Low',
          description: `Document "${doc.name}" is valid until ${doc.expiryDate} (${daysUntilExpiry} days remaining).`,
          reason: 'Meets minimum active validity threshold.',
          affectedFieldOrDoc: `Document: ${doc.name}`,
          observedValue: `Valid until ${doc.expiryDate}`,
          evidence: `Active validity established for ${daysUntilExpiry} days beyond evaluation benchmark`,
          recommendedAction: 'No action required.',
          humanReviewRequired: false,
          timestamp: new Date().toISOString(),
        });
      }
    } else {
      // Expiry date unavailable
      if (
        doc.category === 'Infrastructure Certificate' ||
        doc.category === 'Accreditation or Certification' ||
        doc.category === 'NOC or Permission'
      ) {
        findings.push({
          id: nextId(),
          checkName: `Expiry Date Unavailable: ${doc.name}`,
          category: 'Validity & Expiry',
          status: 'Attention Required',
          severity: 'Medium',
          description: `No explicit expiry date could be parsed or supplied for "${doc.name}".`,
          reason: 'NOCs and Safety certificates routinely have term validity (1-3 years). System cannot silently assume lifetime validity.',
          affectedFieldOrDoc: `Document: ${doc.name}`,
          expectedValue: 'Explicit validity period or lifetime validity endorsement',
          observedValue: 'Expiry date not specified / text extraction unparsed',
          evidence: `Metadata check: doc.expiryDate is undefined for ${doc.category}`,
          recommendedAction: 'Manually specify the expiry date or verify whether the certificate carries an unconditional lifetime validity clause.',
          humanReviewRequired: true,
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  // 4. Cross-Document Consistency Checks
  const docsWithExtracted = docs.filter((d) => d.extractedFields);

  // Check institution name cross-consistency
  docsWithExtracted.forEach((doc) => {
    const extractedName = doc.extractedFields?.institutionName;
    if (extractedName && app.institutionName) {
      const cleanApp = app.institutionName.toLowerCase().replace(/[^a-z0-9]/g, '');
      const cleanDoc = extractedName.toLowerCase().replace(/[^a-z0-9]/g, '');
      if (cleanApp !== cleanDoc && !cleanApp.includes(cleanDoc) && !cleanDoc.includes(cleanApp)) {
        findings.push({
          id: nextId(),
          checkName: `Cross-Document Name Mismatch: ${doc.name}`,
          category: 'Cross-Record Consistency',
          status: 'Action Required',
          severity: 'High',
          description: `Institution name in document "${doc.name}" does not match the application title.`,
          reason: 'Discrepancies in registered trust/college name between uploaded NOCs and application header lead to rejection at regional scrutiny.',
          affectedFieldOrDoc: `Document: ${doc.name}`,
          expectedValue: app.institutionName,
          observedValue: extractedName,
          evidence: `Application states: "${app.institutionName}" vs Document text contains: "${extractedName}"`,
          recommendedAction: 'Ensure all supporting documents match the exact legal entity name or submit a Gazetted Name Change Affidavit.',
          humanReviewRequired: true,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Check institution code cross-consistency
    const extractedCode = doc.extractedFields?.institutionCode;
    if (extractedCode && app.institutionCode) {
      if (extractedCode.trim() !== app.institutionCode.trim()) {
        findings.push({
          id: nextId(),
          checkName: `Permanent Institute ID Mismatch: ${doc.name}`,
          category: 'Cross-Record Consistency',
          status: 'Action Required',
          severity: 'High',
          description: `AICTE Permanent Institute ID in "${doc.name}" (${extractedCode}) differs from application PID (${app.institutionCode}).`,
          reason: 'Application belongs to PID ' + app.institutionCode + ', but attached evidence cites PID ' + extractedCode + '.',
          affectedFieldOrDoc: `Document: ${doc.name}`,
          expectedValue: app.institutionCode,
          observedValue: extractedCode,
          evidence: `Application PID: "${app.institutionCode}" vs Document PID: "${extractedCode}"`,
          recommendedAction: 'Verify if document from another sister campus was mistakenly uploaded, and replace with the correct PID certificate.',
          humanReviewRequired: true,
          timestamp: new Date().toISOString(),
        });
      }
    }

    // Check intake capacity / faculty cadre consistency
    const extractedIntake = doc.extractedFields?.intakeCapacity;
    if (extractedIntake && app.category === 'Change in Approved Intake') {
      // Flag if cadre roster intake differs from requested intake
      // If there's another document stating a different intake
      const otherIntakeDoc = docsWithExtracted.find(
        (od) => od.id !== doc.id && od.extractedFields?.intakeCapacity && od.extractedFields.intakeCapacity !== extractedIntake
      );
      if (otherIntakeDoc) {
        findings.push({
          id: nextId(),
          checkName: `Approved Intake Discrepancy Across Documents`,
          category: 'Cross-Record Consistency',
          status: 'Attention Required',
          severity: 'Medium',
          description: `Conflicting intake capacity cited between "${doc.name}" (${extractedIntake} seats) and "${otherIntakeDoc.name}" (${otherIntakeDoc.extractedFields?.intakeCapacity} seats).`,
          reason: 'Course-wise intake numbers must match uniformly between university affiliation order and faculty strength calculations.',
          affectedFieldOrDoc: `Documents: ${doc.name} & ${otherIntakeDoc.name}`,
          expectedValue: `Uniform intake declaration across all submissions`,
          observedValue: `${doc.name}: ${extractedIntake} seats vs ${otherIntakeDoc.name}: ${otherIntakeDoc.extractedFields?.intakeCapacity} seats`,
          evidence: `Numerical discrepancy detected in extracted capacity metadata`,
          recommendedAction: 'Reconcile intake counts across University Affiliation order and Faculty Cadre calculations.',
          humanReviewRequired: true,
          timestamp: new Date().toISOString(),
        });
      }
    }
  });

  // 5. Duplicate File Detection (SHA-256 Hash Matching)
  const hashMap: Record<string, DocumentMetadata[]> = {};
  docs.forEach((doc) => {
    if (doc.sha256Hash) {
      if (!hashMap[doc.sha256Hash]) {
        hashMap[doc.sha256Hash] = [];
      }
      hashMap[doc.sha256Hash].push(doc);
    }
  });

  Object.entries(hashMap).forEach(([hash, matchingFiles]) => {
    if (matchingFiles.length > 1) {
      const names = matchingFiles.map((m) => `"${m.name}" (${m.category})`).join(' and ');
      findings.push({
        id: nextId(),
        checkName: 'Duplicate File Payload Detected (SHA-256 Match)',
        category: 'Document Integrity & Anomaly',
        status: 'Action Required',
        severity: 'High',
        description: `Identical binary file submitted under distinct document entries: ${names}.`,
        reason: 'Duplicate cryptographic hashes indicate that the exact same file was uploaded multiple times to satisfy separate required categories.',
        affectedFieldOrDoc: matchingFiles.map((m) => m.name).join(', '),
        expectedValue: 'Distinct certified document for each mandatory compliance category',
        observedValue: `Matching SHA-256 Hash: ${hash.slice(0, 16)}...`,
        evidence: `Exact cryptographic match between ${matchingFiles.length} uploaded files`,
        recommendedAction: 'Replace duplicate file with the authentic distinct certificate designated for each specific category.',
        humanReviewRequired: true,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // 6. Preliminary Anomaly Indicators (Explainable Heuristics)
  docs.forEach((doc) => {
    // Check issue date in the future
    if (doc.issueDate && doc.issueDate > refDate) {
      findings.push({
        id: nextId(),
        checkName: `Chronological Date Anomaly: ${doc.name}`,
        category: 'Document Integrity & Anomaly',
        status: 'Action Required',
        severity: 'High',
        description: `Certificate issue date (${doc.issueDate}) is post-dated beyond current reference evaluation date (${refDate}).`,
        reason: 'Official certificates cannot be issued on a future date.',
        affectedFieldOrDoc: `Document: ${doc.name}`,
        expectedValue: `Date on or before ${refDate}`,
        observedValue: doc.issueDate,
        evidence: `Issue Date: ${doc.issueDate} > Benchmark: ${refDate}`,
        recommendedAction: 'Inspect original seal and date stamp. Re-enter the accurate historical issue date.',
        humanReviewRequired: true,
        timestamp: new Date().toISOString(),
      });
    }

    // Check issue date after expiry date
    if (doc.issueDate && doc.expiryDate && doc.issueDate > doc.expiryDate) {
      findings.push({
        id: nextId(),
        checkName: `Inverted Validity Timeline: ${doc.name}`,
        category: 'Document Integrity & Anomaly',
        status: 'Action Required',
        severity: 'High',
        description: `Issue date (${doc.issueDate}) occurs after stated expiry date (${doc.expiryDate}).`,
        reason: 'Document contains an impossible chronological timeline.',
        affectedFieldOrDoc: `Document: ${doc.name}`,
        expectedValue: 'Issue Date strictly preceding Expiry Date',
        observedValue: `Issue: ${doc.issueDate} vs Expiry: ${doc.expiryDate}`,
        evidence: 'Timestamp inconsistency detected in certificate header metadata',
        recommendedAction: 'Review document metadata and correct typographical entries.',
        humanReviewRequired: true,
        timestamp: new Date().toISOString(),
      });
    }

    // File size anomaly (< 10KB might be corrupt or blank)
    if (doc.fileSize < 10240) {
      findings.push({
        id: nextId(),
        checkName: `Suspicious Low File Size: ${doc.name}`,
        category: 'Document Integrity & Anomaly',
        status: 'Attention Required',
        severity: 'Medium',
        description: `Document file size is unusually small (${(doc.fileSize / 1024).toFixed(1)} KB).`,
        reason: 'Certified multi-page regulatory documents or scanned certificates are typically larger than 50 KB. May indicate an incomplete or blank upload.',
        affectedFieldOrDoc: `Document: ${doc.name}`,
        expectedValue: 'Comprehensive multi-page PDF or legible high-resolution scan (> 50 KB)',
        observedValue: `${(doc.fileSize / 1024).toFixed(1)} KB`,
        evidence: `File payload size is ${doc.fileSize} bytes`,
        recommendedAction: 'Verify preview to confirm that the file is not truncated, blank, or low-resolution.',
        humanReviewRequired: true,
        timestamp: new Date().toISOString(),
      });
    }
  });

  // 7. Issuer Verification Pending Check
  const unverifiedIssuerDocs = docs.filter(
    (d) =>
      (d.category === 'NOC or Permission' ||
        d.category === 'Accreditation or Certification' ||
        d.category === 'Infrastructure Certificate') &&
      (!d.issuerRef || d.status === 'unverified')
  );

  if (unverifiedIssuerDocs.length > 0) {
    findings.push({
      id: nextId(),
      checkName: 'Synthetic Issuer Verification Pending',
      category: 'Issuer Verification',
      status: 'Verification Pending',
      severity: 'Medium',
      description: `${unverifiedIssuerDocs.length} regulatory document(s) have not yet been queried against the demonstration issuer registry.`,
      reason: 'Automated verification against university / state DTE / NBA database records confirms active accreditation numbers.',
      affectedFieldOrDoc: unverifiedIssuerDocs.map((d) => d.name).join(', '),
      expectedValue: 'Verification status confirmed against issuer source',
      observedValue: `${unverifiedIssuerDocs.length} certificates unverified`,
      evidence: `Unverified documents: ${unverifiedIssuerDocs.map((d) => `${d.name} (${d.category})`).join('; ')}`,
      recommendedAction: 'Execute issuer verification queries in the Verification Services workspace.',
      humanReviewRequired: false,
      timestamp: new Date().toISOString(),
    });
  }

  // 8. Calculate Readiness Metrics
  const totalChecks = findings.length;
  const passedChecks = findings.filter((f) => f.status === 'Passed').length;
  const actionRequiredCount = findings.filter((f) => f.status === 'Action Required').length;
  const attentionCount = findings.filter((f) => f.status === 'Attention Required').length;
  const verificationPendingCount = findings.filter((f) => f.status === 'Verification Pending').length;
  const manualReviewCount = findings.filter((f) => f.humanReviewRequired).length;

  let readinessScore = 0;
  let readinessStatus: Application['readinessStatus'] = 'Insufficient Information';

  if (docs.length === 0 || totalChecks === 0) {
    readinessScore = 0;
    readinessStatus = 'Insufficient Information';
  } else {
    // Scoring formula: passed + 0.5 * attention / totalChecks * 100, heavily penalized by Action Required
    const rawScore = Math.max(
      0,
      Math.min(
        100,
        Math.round(
          ((passedChecks * 1.0 + attentionCount * 0.4 + verificationPendingCount * 0.5) /
            Math.max(1, totalChecks)) *
            100 -
            actionRequiredCount * 12
        )
      )
    );
    readinessScore = rawScore;

    if (actionRequiredCount > 2 || readinessScore < 50) {
      readinessStatus = 'Substantial Deficiencies';
    } else if (actionRequiredCount > 0 || attentionCount > 2 || readinessScore < 75) {
      readinessStatus = 'Attention Required';
    } else {
      readinessStatus = 'Ready for Submission';
    }
  }

  return {
    totalChecks,
    passedChecks,
    attentionCount,
    actionRequiredCount,
    verificationPendingCount,
    manualReviewCount,
    readinessScore,
    readinessStatus,
    findings,
  };
}
