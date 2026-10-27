import { ComplianceRule } from '../types';

export const COMPLIANCE_RULES: ComplianceRule[] = [
  {
    id: 'RULE-FAC-01',
    category: 'Extension of Approval (EoA)',
    title: 'Faculty to Student Ratio (Cadre Ratio 1:20 for Engineering)',
    plainLanguage:
      'Institutions must maintain a minimum faculty to student ratio of 1:20 in degree engineering and 1:25 in diploma programmes, with cadre proportion of 1 Professor : 2 Associate Professors : 6 Assistant Professors.',
    evidenceRequired: 'Board of Governors approved staff muster, 7th CPC salary bank advice, PF deposit receipts.',
    validationLogicDescription:
      'Cross-checks faculty count in roster against total approved student intake multiplied by programme duration.',
    normSource: 'AICTE Approval Process Handbook (APH) Appendix 7',
    isMandatory: true,
    requiresManualReview: true,
  },
  {
    id: 'RULE-INF-02',
    category: 'Extension of Approval (EoA)',
    title: 'Structural Stability and Fire Safety Certification',
    plainLanguage:
      'Every educational building must have an active structural safety certificate by a PWD/Registered Municipal Structural Engineer and valid Fire NOC from State Fire Services.',
    evidenceRequired: 'Fire Safety Clearance NOC & Structural Stability Certificate with live validity period.',
    validationLogicDescription:
      'Parses issue and expiry date; verifies against current academic year benchmark date (2026-10-27).',
    normSource: 'AICTE APH Clause 2.14 & National Building Code of India',
    isMandatory: true,
    requiresManualReview: false,
  },
  {
    id: 'RULE-LND-03',
    category: 'New Institution Approval',
    title: 'Contiguous Land Ownership and Clear Title Deed',
    plainLanguage:
      'For setting up a new technical college, land must be contiguous, free from encumbrances, registered in the name of the Trust/Society, and not on short-term lease (minimum 30 years if leased from Govt).',
    evidenceRequired: 'Registered Sale Deed / Gift Deed, Non-Encumbrance Certificate (NEC) for 30 years, Land Use Certificate.',
    validationLogicDescription:
      'Verifies land parcel area (minimum 7.5 acres rural / 2.5 acres urban) and perpetual educational zoning classification.',
    normSource: 'AICTE APH Appendix 4: Land Requirements',
    isMandatory: true,
    requiresManualReview: true,
  },
  {
    id: 'RULE-NOC-04',
    category: 'New Institution Approval',
    title: 'State Government NOC and Affiliating University Consent',
    plainLanguage:
      'Prior to granting letter of approval, the State Directorate of Technical Education and the affiliating state technical university must grant formal consent or in-principle NOC.',
    evidenceRequired: 'Official dispatch letter from State DTE and University Academic Registrar resolution.',
    validationLogicDescription:
      'Validates reference number against State Technical University Affiliation database records.',
    normSource: 'AICTE APH Chapter 1, Section 1.5',
    isMandatory: true,
    requiresManualReview: true,
  },
  {
    id: 'RULE-ACCR-05',
    category: 'Change in Approved Intake',
    title: 'Mandatory NBA Accreditation for Intake Augmentation',
    plainLanguage:
      'To increase intake or start a second shift in an existing engineering branch, the department must hold a valid Tier-1 or Tier-2 NBA accreditation score for at least 3 years.',
    evidenceRequired: 'NBA Official Accreditation Letter with validity covering the prospective academic term.',
    validationLogicDescription:
      'Verifies department accreditation against NBA national registry; flags applications attempting expansion without accreditation.',
    normSource: 'AICTE APH Chapter 2, Section 2.8',
    isMandatory: true,
    requiresManualReview: false,
  },
  {
    id: 'RULE-PROG-06',
    category: 'Addition or Change of Programme',
    title: 'Instructional and Laboratory Readiness for Emerging Areas',
    plainLanguage:
      'Introducing new courses such as Artificial Intelligence & Data Science or Cyber Security requires specialized computing hardware, licensed developer environments, and qualified doctorate faculty in the specialization.',
    evidenceRequired: 'High-performance computing lab layout plan, invoice receipts for software packages, PhD faculty profiles.',
    validationLogicDescription:
      'Evaluates computing terminal ratio (minimum 1 terminal per 2 students) and specialized lab floor area.',
    normSource: 'AICTE APH Appendix 5: Essential Infrastructure Norms',
    isMandatory: true,
    requiresManualReview: true,
  },
  {
    id: 'RULE-AFFID-07',
    category: 'Other Approval-Related Change',
    title: 'Comprehensive Compliance Affidavit and Anti-Ragging Mechanism',
    plainLanguage:
      'Affidavit sworn before a First Class Judicial Magistrate swearing compliance with UGC/AICTE anti-ragging regulations, internal complaints committee (ICC) constitution, and prohibition of capitation fee.',
    evidenceRequired: 'Stamped judicial paper affidavit bearing notary seal, advocate registration stamp, and institute sign-off.',
    validationLogicDescription:
      'Checks presence of notarized affidavit document and validates non-future issue stamp.',
    normSource: 'AICTE APH Appendix 17 & Supreme Court Directives',
    isMandatory: true,
    requiresManualReview: false,
  },
  {
    id: 'RULE-BARRIER-08',
    category: 'Extension of Approval (EoA)',
    title: 'Barrier-Free Environment & Accessible Facilities for Divyangjan',
    plainLanguage:
      'Mandatory provision of continuous access ramps with handrails, Braille-signage lifts, accessible restrooms, and dedicated wheelchairs for physically challenged students.',
    evidenceRequired: 'Architectural compliance certificate and geo-tagged photographic evidence of lifts/ramps.',
    validationLogicDescription:
      'Evaluates barrier-free access declaration in building plan certificate.',
    normSource: 'Rights of Persons with Disabilities Act, 2016 & AICTE APH Clause 2.19',
    isMandatory: true,
    requiresManualReview: true,
  },
];
