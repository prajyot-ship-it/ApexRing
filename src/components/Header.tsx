import React, { useState } from 'react';
import { Menu, X, PhoneCall, ShieldCheck, ArrowRight } from 'lucide-react';

interface HeaderProps {
  onOpenAuditModal: (plan?: 'blueprint' | 'core' | 'audit_only') => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuditModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#17191A]/95 backdrop-blur-md border-b border-[#F3EFE4]/15">
      {/* Top Offer Banner Strip */}
      <div className="bg-[#D6553C] border-b border-black/20 text-[#FBEDE8]">
        <div className="max-w-6xl mx-auto px-4 sm:px-7 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm font-mono-code">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-white animate-pulse" />
            <span className="font-medium">
              Launch pricing is live — save up to $600 off done-with-you setup
            </span>
          </div>
          <a
            href="#pricing"
            className="underline underline-offset-4 hover:text-white font-semibold flex items-center gap-1 ml-auto sm:ml-0"
          >
            See offer tiers <ArrowRight className="w-3.5 h-3.5 inline" />
          </a>
        </div>
      </div>

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

        {/* CTA Button and Mobile Trigger */}
        <div className="flex items-center gap-3">
          <button
            id="header-cta-btn"
            onClick={() => onOpenAuditModal('audit_only')}
            className="bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-xs transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#171412]" />
            <span>Book a call audit</span>
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

          <div className="pt-3 border-t border-[#F3EFE4]/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAuditModal('audit_only');
              }}
              className="w-full bg-[#E7A335] text-[#171412] font-mono-code text-sm font-semibold py-3 rounded-xs flex items-center justify-center gap-2"
            >
              <PhoneCall className="w-4 h-4" /> Book a call audit
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
