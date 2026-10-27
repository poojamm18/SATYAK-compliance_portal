import { SyntheticIssuerRecord } from '../types';

export const SYNTHETIC_ISSUER_RECORDS: SyntheticIssuerRecord[] = [
  // 1. NBA Accreditation - Apex Institute (Active / Verified)
  {
    id: 'REG-NBA-001',
    issuerType: 'National Board of Accreditation (NBA)',
    docRef: 'NBA/ACCR-7482/2024',
    institutionCode: '1-3489102',
    institutionName: 'Apex Institute of Technology, Bengaluru',
    issueDate: '2024-07-01',
    validTill: '2027-06-30',
    status: 'Active / Verified',
    payloadSummary: {
      programmeName: 'B.Tech Computer Science & Engineering, Electronics & Comm.',
      approvedIntake: 240,
      remarks: 'Tier-I Washington Accord Accredited for 3 academic years.',
    },
  },

  // 2. State DTE NOC - Saraswati College (Record Not Found / Missing)
  {
    id: 'REG-DTE-002',
    issuerType: 'State Directorate of Technical Education (DTE)',
    docRef: 'DTE/MH/NOC-2026/9999',
    institutionCode: '1-4820199',
    institutionName: 'Saraswati College of Engineering, Pune',
    issueDate: '2026-01-15',
    validTill: '2027-01-14',
    status: 'Record Not Found',
    payloadSummary: {
      remarks: 'No NOC dispatch record exists in Maharashtra DTE portal under this reference number.',
    },
  },

  // 3. State Fire & Emergency Services - Malabar Institute (Expired)
  {
    id: 'REG-FIRE-003',
    issuerType: 'State Fire & Emergency Services',
    docRef: 'FS/KL/NOC-5821/2023',
    institutionCode: '1-5901234',
    institutionName: 'Malabar Institute of Technology, Kochi',
    issueDate: '2023-05-10',
    validTill: '2026-05-09',
    status: 'Expired',
    payloadSummary: {
      fireNocNo: 'KL-FES-EKM-5821',
      remarks: 'Fire Safety Certificate lapsed on 09-May-2026. Renewal inspection not completed.',
    },
  },

  // 4. Affiliating State Technical University - Vindhya Engineering (Mismatch Detected)
  {
    id: 'REG-UNIV-004',
    issuerType: 'Affiliating State Technical University',
    docRef: 'RGPV/AFFIL/2026/3891',
    institutionCode: '1-3920198',
    institutionName: 'Vindhya Engineering Academy, Bhopal',
    issueDate: '2026-02-10',
    validTill: '2027-02-09',
    status: 'Active / Verified',
    payloadSummary: {
      programmeName: 'B.Tech Information Technology & Data Science',
      approvedIntake: 180, // Note: Application requested 240! Mismatch!
      remarks: 'University Academic Senate sanctioned intake capped at 180 seats due to faculty deficit.',
    },
  },

  // 5. Town Planning Land Registry - Nalanda Technical Campus (Active / Verified)
  {
    id: 'REG-TOWN-005',
    issuerType: 'Town Planning & Municipal Land Registry',
    docRef: 'TP/PATNA/LU-89210/2021',
    institutionCode: '1-7291044',
    institutionName: 'Nalanda Technical Campus, Patna',
    issueDate: '2021-08-15',
    validTill: '2041-08-14',
    status: 'Active / Verified',
    payloadSummary: {
      landExtentAcres: 7.5,
      remarks: 'Educational Zone Land Use Title verified with perpetual institutional lease.',
    },
  },

  // 6. University Affiliation - Apex Institute
  {
    id: 'REG-UNIV-006',
    issuerType: 'Affiliating State Technical University',
    docRef: 'VTU/ACA/2026-27/8812',
    institutionCode: '1-3489102',
    institutionName: 'Apex Institute of Technology, Bengaluru',
    issueDate: '2026-04-12',
    validTill: '2027-04-11',
    status: 'Active / Verified',
    payloadSummary: {
      programmeName: 'UG Engineering Programmes (CSE, ECE, ME, CV, AI&DS)',
      approvedIntake: 420,
      remarks: 'Permanent affiliation granted for eligible undergraduate branches.',
    },
  },
];
