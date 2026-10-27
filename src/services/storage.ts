import { Application, AuditEvent, DocumentMetadata, ReviewerCaseStatus, ReviewerObservation, UserRole } from '../types';
import { getSeededApplications } from '../data/seedApplications';
import { executeApplicationValidation } from './validationEngine';

const STORAGE_KEY_APPS = 'satyak_applications_v1';
const STORAGE_KEY_ROLE = 'satyak_active_role_v1';
const STORAGE_KEY_CURRENT_APP = 'satyak_current_app_id_v1';

export class AppStorageService {
  static getApplications(): Application[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY_APPS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('Storage read failed, using seeded defaults', e);
    }
    const seeds = getSeededApplications();
    this.saveApplications(seeds);
    return seeds;
  }

  static saveApplications(apps: Application[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(apps));
    } catch (e) {
      console.error('Storage write error', e);
    }
  }

  static getApplicationById(id: string): Application | undefined {
    const apps = this.getApplications();
    return apps.find((a) => a.id === id || a.refNumber === id);
  }

  static saveApplication(app: Application): void {
    const apps = this.getApplications();
    const index = apps.findIndex((a) => a.id === app.id);
    if (index >= 0) {
      apps[index] = { ...app, updatedAt: new Date().toISOString() };
    } else {
      apps.unshift({ ...app, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }
    this.saveApplications(apps);
  }

  static resetDemoData(): Application[] {
    const freshSeeds = getSeededApplications();
    this.saveApplications(freshSeeds);
    return freshSeeds;
  }

  static getActiveRole(): UserRole {
    try {
      const role = localStorage.getItem(STORAGE_KEY_ROLE);
      if (role === 'Institution User' || role === 'Reviewing Officer') {
        return role;
      }
    } catch {
      // ignore
    }
    return 'Institution User';
  }

  static setActiveRole(role: UserRole): void {
    try {
      localStorage.setItem(STORAGE_KEY_ROLE, role);
    } catch {
      // ignore
    }
  }

  static getCurrentAppId(): string | null {
    try {
      return localStorage.getItem(STORAGE_KEY_CURRENT_APP);
    } catch {
      return null;
    }
  }

  static setCurrentAppId(id: string): void {
    try {
      localStorage.setItem(STORAGE_KEY_CURRENT_APP, id);
    } catch {
      // ignore
    }
  }

  // Re-run validation for an existing application and append audit log
  static revalidateApplication(appId: string, actor: UserRole = 'Institution User'): Application | undefined {
    const app = this.getApplicationById(appId);
    if (!app) return undefined;

    const summary = executeApplicationValidation(app);
    const newAudit: AuditEvent = {
      id: `aud-reval-${Date.now()}`,
      applicationId: app.id,
      eventType: 'VALIDATION_COMPLETED',
      timestamp: new Date().toISOString(),
      actor: actor === 'Institution User' ? 'Institution User' : 'Reviewing Officer',
      description: `Re-ran validation engine: ${summary.passedChecks} passed, ${summary.actionRequiredCount} action required, readiness score ${summary.readinessScore}%.`,
    };

    const updated: Application = {
      ...app,
      findings: summary.findings,
      readinessScore: summary.readinessScore,
      readinessStatus: summary.readinessStatus,
      updatedAt: new Date().toISOString(),
      auditLog: [...app.auditLog, newAudit],
    };

    this.saveApplication(updated);
    return updated;
  }

  // Add a document to an existing application
  static addDocument(appId: string, doc: DocumentMetadata, actor: UserRole = 'Institution User'): Application | undefined {
    const app = this.getApplicationById(appId);
    if (!app) return undefined;

    const newDocs = [...app.documents, doc];
    const audit: AuditEvent = {
      id: `aud-adddoc-${Date.now()}`,
      applicationId: app.id,
      eventType: 'DOCUMENT_ADDED',
      timestamp: new Date().toISOString(),
      actor,
      description: `Uploaded document "${doc.name}" under category "${doc.category}".`,
      relatedDocId: doc.id,
    };

    const updatedApp = {
      ...app,
      documents: newDocs,
      auditLog: [...app.auditLog, audit],
      updatedAt: new Date().toISOString(),
    };

    const summary = executeApplicationValidation(updatedApp);
    const finalApp: Application = {
      ...updatedApp,
      findings: summary.findings,
      readinessScore: summary.readinessScore,
      readinessStatus: summary.readinessStatus,
    };

    this.saveApplication(finalApp);
    return finalApp;
  }

  // Remove a document from an existing application
  static removeDocument(appId: string, docId: string, actor: UserRole = 'Institution User'): Application | undefined {
    const app = this.getApplicationById(appId);
    if (!app) return undefined;

    const removedDoc = app.documents.find((d) => d.id === docId);
    const newDocs = app.documents.filter((d) => d.id !== docId);

    const audit: AuditEvent = {
      id: `aud-remdoc-${Date.now()}`,
      applicationId: app.id,
      eventType: 'DOCUMENT_REMOVED',
      timestamp: new Date().toISOString(),
      actor,
      description: `Removed document "${removedDoc?.name || docId}".`,
      relatedDocId: docId,
    };

    const updatedApp = {
      ...app,
      documents: newDocs,
      auditLog: [...app.auditLog, audit],
      updatedAt: new Date().toISOString(),
    };

    const summary = executeApplicationValidation(updatedApp);
    const finalApp: Application = {
      ...updatedApp,
      findings: summary.findings,
      readinessScore: summary.readinessScore,
      readinessStatus: summary.readinessStatus,
    };

    this.saveApplication(finalApp);
    return finalApp;
  }

  // Reviewing Officer Action: record observation or change status
  static recordReviewerAction(
    appId: string,
    observation: Omit<ReviewerObservation, 'id' | 'applicationId' | 'timestamp'>,
    newStatus?: ReviewerCaseStatus
  ): Application | undefined {
    const app = this.getApplicationById(appId);
    if (!app) return undefined;

    const obs: ReviewerObservation = {
      ...observation,
      id: `obs-${Date.now()}`,
      applicationId: app.id,
      timestamp: new Date().toISOString(),
    };

    const auditEventMap: Record<ReviewerObservation['noteType'], AuditEvent['eventType']> = {
      Observation: 'REVIEWER_OBSERVATION_ADDED',
      'Evidence Request': 'ADDITIONAL_EVIDENCE_REQUESTED',
      'Manual Verification': 'REVIEW_STATE_CHANGED',
      'Inspection Referral': 'REFERRED_FOR_INSPECTION',
      'Review Completed': 'REVIEW_STATE_CHANGED',
      'Action Reversal': 'REVIEW_STATE_CHANGED',
    };

    const audit: AuditEvent = {
      id: `aud-rev-${Date.now()}`,
      applicationId: app.id,
      eventType: auditEventMap[observation.noteType] || 'REVIEW_STATE_CHANGED',
      timestamp: new Date().toISOString(),
      actor: 'Reviewing Officer',
      actorName: observation.officerName,
      description: `[${observation.noteType}] ${observation.note}${
        newStatus ? ` (Status transitioned to: ${newStatus})` : ''
      }`,
    };

    const updatedApp: Application = {
      ...app,
      reviewerStatus: newStatus || app.reviewerStatus,
      reviewerObservations: [...app.reviewerObservations, obs],
      auditLog: [...app.auditLog, audit],
      updatedAt: new Date().toISOString(),
    };

    this.saveApplication(updatedApp);
    return updatedApp;
  }
}
