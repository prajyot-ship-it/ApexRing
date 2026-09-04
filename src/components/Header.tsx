import React, { useState } from 'react';
import { Menu, X, PhoneCall, ShieldCheck, ArrowRight, Mail, CheckCircle2, Lock, User, LogOut, ShieldAlert } from 'lucide-react';
import { AuditBooking, UserAccount } from '../types';

interface HeaderProps {
  onOpenAuditModal: (plan?: 'blueprint' | 'core' | 'audit_only') => void;
  registeredBooking?: AuditBooking | null;
  onClearRegistration?: () => void;
  onOpenAdmin?: () => void;
  currentUser?: UserAccount | null;
  onOpenAuthModal?: () => void;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenAuditModal,
  registeredBooking,
  onClearRegistration,
  onOpenAdmin,
  currentUser,
  onOpenAuthModal,
  onLogout,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#17191A]/95 backdrop-blur-md border-b border-[#F3EFE4]/15">
      {/* Top Banner Strip: Shows Launch Pricing initially, then flips to Waitlist Status once registered for any ticket */}
      {registeredBooking ? (
        /* Status AFTER client registers / buys any ticket */
        <div className="bg-[#E7A335] text-[#171412] border-b border-black/25 transition-all shadow-md">
          <div className="max-w-6xl mx-auto px-4 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm font-mono-code">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#171412] animate-pulse" />
              <span className="font-bold tracking-wider uppercase text-[10px] sm:text-[11px] bg-[#171412] text-[#E7A335] px-2.5 py-0.5 rounded-xs">
                WAITLIST STATUS: COMPLETELY PACKED
              </span>
              <span className="font-semibold text-[#171412]">
                We are completely packed with clients right now. You are in the waitlist (Ticket #{registeredBooking.id}) — we will reach out as soon as an onboarding slot opens.
              </span>
            </div>
            {onClearRegistration && (
              <button
                type="button"
                onClick={onClearRegistration}
                className="text-[11px] text-[#171412]/80 hover:text-[#171412] underline font-semibold ml-auto cursor-pointer"
                title="Register another ticket or clear session"
              >
                New registration
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Default banner for all visitors before registration */
        <div className="bg-[#D6553C] border-b border-black/20 text-[#FBEDE8] transition-all">
          <div className="max-w-6xl mx-auto px-4 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm font-mono-code">
            <div className="flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="font-medium">
                Launch pricing is live — save up to $600 off done-with-you setup
              </span>
            </div>
            <div className="flex items-center gap-3.5 ml-auto sm:ml-0">
              <a
                href="#pricing"
                className="underline underline-offset-4 hover:text-white font-semibold flex items-center gap-1"
              >
                See offer tiers <ArrowRight className="w-3.5 h-3.5 inline" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-7 py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-display font-bold text-2xl sm:text-3xl tracking-wide text-[#F3EFE4]">
            ApexRing<span className="text-[#E7A335]">.</span>
          </span>
          <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-mono-code px-2 py-0.5 rounded border border-[#F3EFE4]/15 text-[#9A9D8F]">
            <ShieldCheck className="w-3 h-3 text-[#E7A335]" /> Trade Line Recovery
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-[#9A9D8F]">
          <a href="#calculator" className="hover:text-[#F3EFE4] transition-colors">
            Calculator
          </a>
          <a href="#preview" className="hover:text-[#F3EFE4] transition-colors">
            Live Text-Back Demo
          </a>
          <a href="#how" className="hover:text-[#F3EFE4] transition-colors">
            How It Works
          </a>
          <a href="#testimonials" className="hover:text-[#F3EFE4] transition-colors flex items-center gap-1.5">
            <span>Reviews</span>
            <span className="text-[10px] bg-[#E7A335]/20 text-[#E7A335] px-1.5 py-0.2 border border-[#E7A335]/30">4.9★</span>
          </a>
          <a href="#pricing" className="hover:text-[#F3EFE4] transition-colors">
            Pricing
          </a>
          <a href="#guarantee" className="hover:text-[#F3EFE4] transition-colors">
            30-Day Payback
          </a>
          <a href="#faq" className="hover:text-[#F3EFE4] transition-colors">
            FAQ
          </a>
        </nav>

        {/* CTA Button, User Auth, and Mobile Trigger */}
        <div className="flex items-center gap-2.5">
          {/* User Account / Login Button */}
          {currentUser ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="bg-[#222527] hover:bg-[#2C3033] text-[#ECE6D6] border border-[#F3EFE4]/20 font-mono-code text-xs px-3 py-2 rounded-xs transition-colors flex items-center gap-2 cursor-pointer"
                title="Your contractor account"
              >
                <div className="w-5 h-5 rounded-full bg-[#E7A335] text-[#171412] flex items-center justify-center font-bold text-[10px]">
                  {currentUser.fullName.charAt(0).toUpperCase()}
                </div>
                <span className="hidden sm:inline font-semibold max-w-[110px] truncate">{currentUser.fullName}</span>
                <span className={`text-[9px] px-1.5 py-0.2 rounded-xs font-bold ${
                  currentUser.role === 'admin' 
                    ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' 
                    : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                }`}>
                  {currentUser.role.toUpperCase()}
                </span>
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-60 bg-[#1A1C1D] border border-[#F3EFE4]/20 rounded-xs shadow-xl py-2 z-50 font-mono-code text-xs">
                  <div className="px-3.5 py-2 border-b border-[#F3EFE4]/10">
                    <div className="font-bold text-[#F3EFE4]">{currentUser.fullName}</div>
                    <div className="text-[11px] text-[#9A9D8F] truncate">{currentUser.email}</div>
                    {currentUser.companyName && (
                      <div className="text-[10px] text-[#E7A335] mt-0.5">{currentUser.companyName} ({currentUser.tradeType})</div>
                    )}
                  </div>

                  {currentUser.role === 'admin' && onOpenAdmin && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full text-left px-3.5 py-2 text-[#E7A335] hover:bg-[#25282A] flex items-center gap-2 cursor-pointer font-bold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Admin Operations Portal</span>
                    </button>
                  )}

                  {onLogout && (
                    <button
                      type="button"
                      onClick={() => {
                        setUserDropdownOpen(false);
                        onLogout();
                      }}
                      className="w-full text-left px-3.5 py-2 text-red-400 hover:bg-[#25282A] flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={onOpenAuthModal}
              className="bg-[#222527] hover:bg-[#2C3033] text-[#ECE6D6] hover:text-[#E7A335] border border-[#F3EFE4]/20 font-mono-code text-xs px-3 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Contractor login / account tracking"
            >
              <User className="w-3.5 h-3.5 text-[#E7A335]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}

          <button
            id="header-cta-btn"
            onClick={() => onOpenAuditModal('audit_only')}
            className="bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2.5 rounded-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            {registeredBooking ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-[#171412]" />
                <span>Waitlist: #{registeredBooking.id}</span>
              </>
            ) : (
              <>
                <PhoneCall className="w-3.5 h-3.5 text-[#171412]" />
                <span>Book a call audit</span>
              </>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#9A9D8F] hover:text-[#F3EFE4] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#1D201D] border-b border-[#F3EFE4]/15 px-6 py-5 space-y-4">
          {/* Mobile User Status */}
          {currentUser ? (
            <div className="bg-[#141617] p-3 rounded-xs border border-[#F3EFE4]/15 font-mono-code text-xs space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-[#F3EFE4]">{currentUser.fullName}</div>
                  <div className="text-[11px] text-[#9A9D8F]">{currentUser.email}</div>
                </div>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <div className="flex gap-2 pt-1 border-t border-[#F3EFE4]/10">
                {currentUser.role === 'admin' && onOpenAdmin && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAdmin();
                    }}
                    className="text-[#E7A335] text-[11px] font-bold"
                  >
                    Open Admin
                  </button>
                )}
                {onLogout && (
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onLogout();
                    }}
                    className="text-red-400 text-[11px] ml-auto"
                  >
                    Sign Out
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuthModal?.();
              }}
              className="w-full bg-[#222527] border border-[#E7A335]/40 text-[#E7A335] font-mono-code text-xs py-2.5 rounded-xs flex items-center justify-center gap-2 font-bold"
            >
              <User className="w-3.5 h-3.5" />
              <span>Contractor Sign In / Account</span>
            </button>
          )}
          <div className="flex flex-col space-y-3 font-mono-code text-sm text-[#9A9D8F]">
            <a
              href="#calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • Loss Calculator
            </a>
            <a
              href="#preview"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • Live Text-Back Demo
            </a>
            <a
              href="#how"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • How Setup Works
            </a>
            <a
              href="#testimonials"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 text-[#E7A335] hover:text-[#F0B355]"
            >
              • Contractor Reviews (4.9★)
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • Pricing & Tiers
            </a>
            <a
              href="#guarantee"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • 30-Day Guarantee
            </a>
            <a
              href="#scenario"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • Worked Examples
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1 hover:text-[#F3EFE4]"
            >
              • FAQ
            </a>
          </div>

          <div className="pt-3 border-t border-[#F3EFE4]/10 space-y-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuditModal('audit_only');
              }}
              className="w-full bg-[#E7A335] text-[#171412] font-mono-code text-sm font-semibold py-3 rounded-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {registeredBooking ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#171412]" />
                  <span>Waitlist Ticket #{registeredBooking.id}</span>
                </>
              ) : (
                <>
                  <PhoneCall className="w-4 h-4" />
                  <span>Book a call audit</span>
                </>
              )}
            </button>
            <a
              href="mailto:ai.prajyot@gmail.com"
              className="w-full border border-[#F3EFE4]/20 hover:border-[#E7A335] text-[#ECE6D6] font-mono-code text-xs py-2.5 rounded-xs flex items-center justify-center gap-2 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#E7A335]" />
              <span>ai.prajyot@gmail.com</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
};
