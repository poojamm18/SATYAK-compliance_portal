import React, { useState, useEffect } from 'react';
import { Application, UserRole } from './types';
import { AppStorageService } from './services/storage';
import { Header, NavigationPage } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './components/pages/HomePage';
import { ApplicationWizard } from './components/pages/ApplicationWizard';
import { ValidationResultsReport } from './components/pages/ValidationResultsReport';
import { InstitutionDashboard } from './components/pages/InstitutionDashboard';
import { OfficerWorkspace } from './components/pages/OfficerWorkspace';
import { VerificationServicesPage } from './components/pages/VerificationServicesPage';
import { ComplianceGuidePage } from './components/pages/ComplianceGuidePage';
import { ApplicationProcessPage } from './components/pages/ApplicationProcessPage';
import { DocumentRequirementsPage } from './components/pages/DocumentRequirementsPage';
import { HelpFaqsPage } from './components/pages/HelpFaqsPage';
import { CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('home');
  const [activeRole, setActiveRole] = useState<UserRole>('Institution User');
  const [applications, setApplications] = useState<Application[]>([]);
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize data on mount
  useEffect(() => {
    const apps = AppStorageService.getApplications();
    setApplications(apps);
    const role = AppStorageService.getActiveRole();
    setActiveRole(role);

    const savedAppId = AppStorageService.getCurrentAppId();
    if (savedAppId) {
      const match = apps.find((a) => a.id === savedAppId || a.refNumber === savedAppId);
      if (match) setSelectedApplication(match);
    } else if (apps.length > 0) {
      setSelectedApplication(apps[0]);
    }
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const refreshApplications = () => {
    const updated = AppStorageService.getApplications();
    setApplications(updated);
    if (selectedApplication) {
      const match = updated.find((a) => a.id === selectedApplication.id);
      if (match) setSelectedApplication(match);
    }
  };

  const handleSelectApplication = (app: Application) => {
    setSelectedApplication(app);
    AppStorageService.setCurrentAppId(app.id);
  };

  const handleValidationComplete = (app: Application) => {
    refreshApplications();
    setSelectedApplication(app);
    AppStorageService.setCurrentAppId(app.id);
    showToast(`Validation complete for ${app.refNumber} (${app.readinessScore}% Readiness).`);
  };

  const handleResetData = () => {
    const fresh = AppStorageService.resetDemoData();
    setApplications(fresh);
    setSelectedApplication(fresh[0]);
    AppStorageService.setCurrentAppId(fresh[0].id);
    showToast('Demonstration data restored to pristine initial state (5 seeded applications).');
  };

  const handleSetRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    AppStorageService.setActiveRole(newRole);
    showToast(`Switched demonstration role to: ${newRole}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F5F9] text-[#172B42]">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#142B4A] text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-medium animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-[#087F8C]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Shared Header */}
      <Header
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        activeRole={activeRole}
        setActiveRole={handleSetRole}
        onResetData={handleResetData}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage
            setCurrentPage={setCurrentPage}
            onSelectApplication={handleSelectApplication}
            applications={applications}
            setActiveRole={handleSetRole}
          />
        )}

        {currentPage === 'wizard' && (
          <ApplicationWizard
            setCurrentPage={setCurrentPage}
            onValidationComplete={handleValidationComplete}
            activeRole={activeRole}
          />
        )}

        {currentPage === 'results' && (
          <ValidationResultsReport
            application={selectedApplication}
            setCurrentPage={setCurrentPage}
            onSelectApplication={handleSelectApplication}
            activeRole={activeRole}
            setActiveRole={handleSetRole}
          />
        )}

        {currentPage === 'dashboard' && (
          <InstitutionDashboard
            applications={applications}
            setCurrentPage={setCurrentPage}
            onSelectApplication={handleSelectApplication}
            activeRole={activeRole}
            refreshApplications={refreshApplications}
          />
        )}

        {currentPage === 'officer' && (
          <OfficerWorkspace
            applications={applications}
            setCurrentPage={setCurrentPage}
            onSelectApplication={handleSelectApplication}
            refreshApplications={refreshApplications}
          />
        )}

        {currentPage === 'verification' && <VerificationServicesPage />}

        {currentPage === 'compliance' && <ComplianceGuidePage />}

        {currentPage === 'process' && (
          <ApplicationProcessPage setCurrentPage={setCurrentPage} />
        )}

        {currentPage === 'requirements' && (
          <DocumentRequirementsPage setCurrentPage={setCurrentPage} />
        )}

        {currentPage === 'faqs' && <HelpFaqsPage />}
      </main>

      {/* Shared Footer */}
      <Footer setCurrentPage={setCurrentPage} onResetData={handleResetData} />
    </div>
  );
}
