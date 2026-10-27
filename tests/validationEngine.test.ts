import test from 'node:test';
import assert from 'node:assert/strict';
import { executeApplicationValidation } from '../src/services/validationEngine';
import { querySyntheticIssuer } from '../src/services/issuerVerification';
import { Application } from '../src/types';

test('Validation Engine flags missing mandatory documents for Extension of Approval', () => {
  const dummyApp: Pick<
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
  > = {
    id: 'test-app-1',
    refNumber: 'TEST-APP-001',
    institutionName: 'Test College of Engineering',
    institutionCode: '1-9988776',
    state: 'Karnataka',
    academicYear: '2026-2027',
    category: 'Extension of Approval (EoA)',
    applicationDate: '2026-10-27',
    documents: [], // 0 documents
  };

  const summary = executeApplicationValidation(dummyApp);
  assert.equal(summary.readinessStatus, 'Insufficient Information');
  assert.ok(summary.findings.some((f) => f.checkName.includes('Missing Mandatory Document')));
});

test('Validation Engine detects expired certificate against reference date', () => {
  const dummyApp: Pick<
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
  > = {
    id: 'test-app-2',
    refNumber: 'TEST-APP-002',
    institutionName: 'Apex Institute of Technology, Bengaluru',
    institutionCode: '1-3489102',
    state: 'Karnataka',
    academicYear: '2026-2027',
    category: 'Extension of Approval (EoA)',
    applicationDate: '2026-10-27',
    documents: [
      {
        id: 'doc-expired-1',
        name: 'Fire_Safety_Expired.pdf',
        category: 'Infrastructure Certificate',
        fileSize: 150000,
        fileType: 'application/pdf',
        uploadDate: '2026-10-27',
        sha256Hash: 'dummyhash1',
        issueDate: '2023-01-01',
        expiryDate: '2026-05-01', // Expired relative to 2026-10-27
        extractionMode: 'extracted',
        status: 'expired',
      },
    ],
  };

  const summary = executeApplicationValidation(dummyApp);
  const expiredFinding = summary.findings.find((f) => f.checkName.includes('Expired Certificate'));
  assert.ok(expiredFinding, 'Should generate an expired certificate finding');
  assert.equal(expiredFinding?.severity, 'High');
  assert.equal(expiredFinding?.status, 'Action Required');
});

test('Validation Engine detects duplicate cryptographic file hashes', () => {
  const dummyApp: Pick<
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
  > = {
    id: 'test-app-3',
    refNumber: 'TEST-APP-003',
    institutionName: 'Apex Institute of Technology, Bengaluru',
    institutionCode: '1-3489102',
    state: 'Karnataka',
    academicYear: '2026-2027',
    category: 'Extension of Approval (EoA)',
    applicationDate: '2026-10-27',
    documents: [
      {
        id: 'doc-dup-1',
        name: 'Building_Plan.pdf',
        category: 'Infrastructure Certificate',
        fileSize: 200000,
        fileType: 'application/pdf',
        uploadDate: '2026-10-27',
        sha256Hash: 'same-identical-hash-1234567890',
        extractionMode: 'extracted',
        status: 'valid',
      },
      {
        id: 'doc-dup-2',
        name: 'Fire_NOC.pdf',
        category: 'Infrastructure Certificate',
        fileSize: 200000,
        fileType: 'application/pdf',
        uploadDate: '2026-10-27',
        sha256Hash: 'same-identical-hash-1234567890', // Exact match
        extractionMode: 'extracted',
        status: 'valid',
      },
    ],
  };

  const summary = executeApplicationValidation(dummyApp);
  const duplicateFinding = summary.findings.find((f) =>
    f.checkName.includes('Duplicate File Payload Detected')
  );
  assert.ok(duplicateFinding, 'Should detect duplicate SHA-256 payload');
  assert.equal(duplicateFinding?.severity, 'High');
});

test('Issuer verification queries correctly return Verified, Mismatch, Expired, and Unavailable', () => {
  // Verified
  const verifiedRes = querySyntheticIssuer(
    'National Board of Accreditation (NBA)',
    'NBA/ACCR-7482/2024',
    '1-3489102',
    240
  );
  assert.equal(verifiedRes.outcome, 'Verified Against Demo Record');

  // Mismatch in intake
  const mismatchRes = querySyntheticIssuer(
    'Affiliating State Technical University',
    'RGPV/AFFIL/2026/3891',
    '1-3920198',
    240 // Registry only sanctioned 180 seats!
  );
  assert.equal(mismatchRes.outcome, 'Mismatch Detected');

  // Expired
  const expiredRes = querySyntheticIssuer(
    'State Fire & Emergency Services',
    'FS/KL/NOC-5821/2023',
    '1-5901234'
  );
  assert.equal(expiredRes.outcome, 'Expired');

  // Source unavailable
  const unavailRes = querySyntheticIssuer(
    'State Directorate of Technical Education (DTE)',
    'DTE-TIMEOUT-UNAVAILABLE'
  );
  assert.equal(unavailRes.outcome, 'Source Unavailable');
});
