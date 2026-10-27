import React, { useState } from 'react';
import { SatyakLogo } from './SatyakLogo';
import { UserRole } from '../../types';
import {
  Menu,
  X,
  ShieldCheck,
  UserCheck,
  Building2,
  FileSearch,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Workflow,
  CheckCircle2,
  Scale,
} from 'lucide-react';

export type NavigationPage =
  | 'home'
  | 'wizard'
  | 'results'
  | 'dashboard'
  | 'officer'
  | 'verification'
  | 'compliance'
  | 'process'
  | 'requirements'
  | 'faqs';

interface HeaderProps {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  activeRole: UserRole;
  setActiveRole: (role: UserRole) => void;
  onResetData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  activeRole,
  setActiveRole,
  onResetData,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Building2 className="w-4 h-4" /> },
    { id: 'wizard', label: 'Check Readiness', icon: <FileSearch className="w-4 h-4" /> },
    { id: 'dashboard', label: 'Institution Portal', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'officer', label: 'Officer Review', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'verification', label: 'Verification Registry', icon: <Scale className="w-4 h-4" /> },
    { id: 'compliance', label: 'Compliance Guide', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'process', label: 'Approval Process', icon: <Workflow className="w-4 h-4" /> },
    { id: 'faqs', label: 'Help & FAQs', icon: <HelpCircle className="w-4 h-4" /> },
  ];

  const handleNavClick = (page: NavigationPage) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  const toggleRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    setRoleDropdownOpen(false);
    if (newRole === 'Reviewing Officer') {
      setCurrentPage('officer');
    } else {
      setCurrentPage('dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#DCE4ED] shadow-xs">
      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            onClick={() => handleNavClick('home')}
            className="cursor-pointer select-none py-1"
          >
            <SatyakLogo size="md" />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-3 py-2 rounded-md text-xs font-semibold tracking-wide transition-all ${
                    isActive
                      ? 'bg-[#142B4A] text-white shadow-xs'
                      : 'text-[#172B42] hover:text-[#087F8C] hover:bg-[#F2F5F9]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Demonstration Role Switcher & Action */}
          <div className="hidden sm:flex items-center gap-2">
            <div className="relative">
              <button
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-[#DCE4ED] bg-[#F2F5F9] hover:bg-white text-xs font-semibold text-[#172B42] transition-colors"
              >
                {activeRole === 'Reviewing Officer' ? (
                  <ShieldCheck className="w-4 h-4 text-[#087F8C]" />
                ) : (
                  <UserCheck className="w-4 h-4 text-[#142B4A]" />
                )}
                <span>Role: <strong className="text-[#087F8C]">{activeRole}</strong></span>
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-1 w-56 bg-white border border-[#DCE4ED] rounded-lg shadow-lg py-1.5 z-50">
                  <div className="px-3 py-1.5 text-[11px] font-bold text-[#637287] border-b border-[#DCE4ED] uppercase">
                    Select Demo Role
                  </div>
                  <button
                    onClick={() => toggleRole('Institution User')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#F2F5F9] ${
                      activeRole === 'Institution User' ? 'font-bold text-[#087F8C] bg-[#E6F4F3]' : 'text-[#172B42]'
                    }`}
                  >
                    <Building2 className="w-4 h-4" />
                    <div>
                      <div>Institution User</div>
                      <div className="text-[10px] text-[#637287]">Prepare & check applications</div>
                    </div>
                  </button>
                  <button
                    onClick={() => toggleRole('Reviewing Officer')}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center gap-2 hover:bg-[#F2F5F9] ${
                      activeRole === 'Reviewing Officer' ? 'font-bold text-[#087F8C] bg-[#E6F4F3]' : 'text-[#172B42]'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <div>
                      <div>Reviewing Officer</div>
                      <div className="text-[10px] text-[#637287]">Scrutinize, verify & record actions</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('wizard')}
              className="px-3.5 py-1.5 rounded-md text-xs font-semibold bg-[#087F8C] hover:bg-[#076b77] text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <FileSearch className="w-3.5 h-3.5" />
              <span>Validate App</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => handleNavClick('wizard')}
              className="px-2.5 py-1 rounded text-xs font-semibold bg-[#087F8C] text-white"
            >
              Validate
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#142B4A] hover:bg-[#F2F5F9] focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-[#DCE4ED] px-4 pt-2 pb-5 space-y-2 shadow-lg">
          <div className="pb-2 border-b border-[#DCE4ED] flex items-center justify-between">
            <span className="text-xs font-bold text-[#637287] uppercase">Current Demo Role:</span>
            <div className="flex gap-1">
              <button
                onClick={() => toggleRole('Institution User')}
                className={`px-2 py-1 text-xs rounded font-medium ${
                  activeRole === 'Institution User' ? 'bg-[#087F8C] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Institution
              </button>
              <button
                onClick={() => toggleRole('Reviewing Officer')}
                className={`px-2 py-1 text-xs rounded font-medium ${
                  activeRole === 'Reviewing Officer' ? 'bg-[#142B4A] text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                Officer
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`flex items-center gap-2.5 w-full text-left px-3 py-2 rounded-md text-sm font-semibold ${
                  currentPage === item.id
                    ? 'bg-[#142B4A] text-white'
                    : 'text-[#172B42] hover:bg-[#F2F5F9]'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-[#DCE4ED] flex justify-between items-center text-xs text-[#637287]">
            <span>Prototype Environment</span>
            <button
              onClick={() => {
                onResetData();
                setMobileMenuOpen(false);
              }}
              className="text-[#C43D4B] font-semibold hover:underline flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset Demo Data
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
