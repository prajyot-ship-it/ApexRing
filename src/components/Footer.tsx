import React from 'react';
import { Shield, Mail, Phone, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="py-12 bg-[#121414] text-[#9A9D8F] border-t border-[#F3EFE4]/10 text-xs font-mono-code">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-[#F3EFE4]/10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="font-display font-bold text-2xl text-[#F3EFE4] tracking-wide">
                ApexRing<span className="text-[#E7A335]">.</span>
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-[#20231F] border border-[#F3EFE4]/10 text-[#ECE6D6]">
                Trades Recovery Engine
              </span>
            </div>
            <p className="text-[#9A9D8F] max-w-md">
              Instant missed-call text-back and qualification sequences for plumbers, HVAC technicians,
              electricians, and emergency home trades.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-8">
            <a
              href="mailto:audit@apexring.com"
              className="flex items-center gap-2 text-[#ECE6D6] hover:text-[#E7A335] transition-colors"
            >
              <Mail className="w-4 h-4 text-[#E7A335]" />
              <span>audit@apexring.com</span>
            </a>
            <div className="flex items-center gap-2 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Network Status: 100% Operational</span>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[#6B6E5F]">
          <div>
            © {new Date().getFullYear()} ApexRing Systems LLC. All rights reserved. Built for trade contractors.
          </div>
          <div className="flex items-center gap-6">
            <a href="#problem" className="hover:text-[#ECE6D6] transition-colors">
              Problem
            </a>
            <a href="#calculator" className="hover:text-[#ECE6D6] transition-colors">
              Loss Calculator
            </a>
            <a href="#how" className="hover:text-[#ECE6D6] transition-colors">
              Process
            </a>
            <a href="#pricing" className="hover:text-[#ECE6D6] transition-colors">
              Pricing
            </a>
            <a href="#faq" className="hover:text-[#ECE6D6] transition-colors">
              FAQ
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
