import { SyntheticIssuerRecord } from '../types';
import { SYNTHETIC_ISSUER_RECORDS } from '../data/syntheticIssuerRegistry';
import { REFERENCE_DATE } from './validationEngine';

export interface VerificationQueryResult {
  sourceName: string;
  sourceType: string;
  isSyntheticSource: boolean;
  queryTimestamp: string;
  submittedReference: string;
  submittedInstitutionCode?: string;
  outcome:
    | 'Verified Against Demo Record'
    | 'Mismatch Detected'
    | 'Expired'
    | 'Verification Pending'
    | 'Source Unavailable'
    | 'Manual Verification Required';
  outcomeSeverity: 'success' | 'warning' | 'error' | 'info';
  details: string;
  comparisonPoints?: {
    field: string;
    submittedValue: string;
    issuerRecordValue: string;
    isMatch: boolean;
  }[];
  issuerRecord?: SyntheticIssuerRecord;
  recommendedAction: string;
}

export function querySyntheticIssuer(
  issuerType: SyntheticIssuerRecord['issuerType'],
  docRef: string,
  institutionCode?: string,
  expectedIntake?: number
): VerificationQueryResult {
  const cleanRef = docRef.trim().toUpperCase();
  const cleanCode = institutionCode ? institutionCode.trim().toUpperCase() : undefined;

  // Check for test trigger for "Source Unavailable"
  if (cleanRef.includes('UNAVAILABLE') || cleanRef.includes('TIMEOUT')) {
    return {
      sourceName: issuerType,
      sourceType: 'Simulated State Gateway API',
      isSyntheticSource: true,
      queryTimestamp: new Date().toISOString(),
      submittedReference: docRef,
      submittedInstitutionCode: institutionCode,
      outcome: 'Source Unavailable',
      outcomeSeverity: 'warning',
      details: 'Connection to the remote state portal timed out after 3 retries (HTTP 503 Gateway Timeout).',
      recommendedAction: 'Retry verification during off-peak hours or request certified counter-signed hardcopy from institution.',
    };
  }

  // Search synthetic registry
  const match = SYNTHETIC_ISSUER_RECORDS.find(
    (rec) => rec.docRef.toUpperCase() === cleanRef || (cleanRef.length > 5 && rec.docRef.toUpperCase().includes(cleanRef))
  );

  if (!match) {
    return {
      sourceName: issuerType,
      sourceType: 'Synthetic Demonstration Registry',
      isSyntheticSource: true,
      queryTimestamp: new Date().toISOString(),
      submittedReference: docRef,
      submittedInstitutionCode: institutionCode,
      outcome: 'Manual Verification Required',
      outcomeSeverity: 'error',
      details: `No dispatch or certificate record found in the synthetic repository under reference "${docRef}".`,
      recommendedAction: 'Direct the institution to provide proof of dispatch or order copy with verifiable QR code.',
    };
  }

  // Evaluate matching record
  const comparisons: {
    field: string;
    submittedValue: string;
    issuerRecordValue: string;
    isMatch: boolean;
  }[] = [];

  let isMismatch = false;

  // Code comparison
  if (cleanCode && cleanCode !== match.institutionCode.toUpperCase()) {
    isMismatch = true;
    comparisons.push({
      field: 'Institution PID',
      submittedValue: cleanCode,
      issuerRecordValue: match.institutionCode,
      isMatch: false,
    });
  } else if (cleanCode) {
    comparisons.push({
      field: 'Institution PID',
      submittedValue: cleanCode,
      issuerRecordValue: match.institutionCode,
      isMatch: true,
    });
  }

  // Intake comparison if provided
  if (expectedIntake && match.payloadSummary.approvedIntake) {
    const intakeMatch = expectedIntake === match.payloadSummary.approvedIntake;
    if (!intakeMatch) {
      isMismatch = true;
    }
    comparisons.push({
      field: 'Sanctioned Intake Capacity',
      submittedValue: `${expectedIntake} seats`,
      issuerRecordValue: `${match.payloadSummary.approvedIntake} seats`,
      isMatch: intakeMatch,
    });
  }

  // Expiry check against REFERENCE_DATE
  const isLapsed = match.validTill < REFERENCE_DATE || match.status === 'Expired';
  if (isLapsed) {
    return {
      sourceName: match.issuerType,
      sourceType: 'Synthetic Demonstration Registry',
      isSyntheticSource: true,
      queryTimestamp: new Date().toISOString(),
      submittedReference: docRef,
      submittedInstitutionCode: institutionCode,
      outcome: 'Expired',
      outcomeSeverity: 'error',
      details: `The synthetic registry reflects that this certificate expired on ${match.validTill}. Current status: Expired.`,
      comparisonPoints: comparisons,
      issuerRecord: match,
      recommendedAction: 'Procure renewed certification before processing approval.',
    };
  }

  if (isMismatch) {
    return {
      sourceName: match.issuerType,
      sourceType: 'Synthetic Demonstration Registry',
      isSyntheticSource: true,
      queryTimestamp: new Date().toISOString(),
      submittedReference: docRef,
      submittedInstitutionCode: institutionCode,
      outcome: 'Mismatch Detected',
      outcomeSeverity: 'warning',
      details: `Discrepancy detected between application submission data and the synthetic issuer archive.`,
      comparisonPoints: comparisons,
      issuerRecord: match,
      recommendedAction: 'Flag for Reviewing Officer scrutiny. Request clarification regarding conflicting parameters.',
    };
  }

  return {
    sourceName: match.issuerType,
    sourceType: 'Synthetic Demonstration Registry',
    isSyntheticSource: true,
    queryTimestamp: new Date().toISOString(),
    submittedReference: docRef,
    submittedInstitutionCode: institutionCode,
    outcome: 'Verified Against Demo Record',
    outcomeSeverity: 'success',
    details: `Authenticity confirmed against synthetic issuer database. Issued to ${match.institutionName} on ${match.issueDate}. Valid till ${match.validTill}.`,
    comparisonPoints: comparisons,
    issuerRecord: match,
    recommendedAction: 'Record verified status in the application audit log.',
  };
}
