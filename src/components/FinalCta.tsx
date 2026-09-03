import React from 'react';
import { PhoneCall, Mail, Clock, ArrowRight } from 'lucide-react';

interface FinalCtaProps {
  onOpenAuditModal: () => void;
}

export const FinalCta: React.FC<FinalCtaProps> = ({ onOpenAuditModal }) => {
  return (
    <section id="book" className="py-24 sm:py-32 bg-[#17191A] text-center border-b border-[#F3EFE4]/10">
      <div className="max-w-4xl mx-auto px-4 sm:px-7">
        <div className="inline-flex items-center gap-2 font-mono-code text-xs sm:text-sm text-[#E7A335] bg-[#E7A335]/10 border border-[#E7A335]/30 px-3 py-1.5 rounded-xs mb-6">
          <Clock className="w-4 h-4" />
          <span>15-minute diagnostic session • No slide decks</span>
        </div>

        <h2 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#F3EFE4] leading-tight mb-5 max-w-2xl mx-auto">
          Find out what your call log is costing you
        </h2>

        <p className="text-[#9A9D8F] text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          We pull your last 30 days of inbound calls, isolate missed peak-hour rings, and calculate your
          exact recoverable revenue — then you decide if Core setup makes financial sense.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            id="final-cta-btn"
            onClick={onOpenAuditModal}
            className="w-full sm:w-auto bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code font-semibold text-base px-8 py-4 rounded-xs transition-colors flex items-center justify-center gap-2 shadow-xl cursor-pointer"
          >
            <span>Book your free call audit</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <a
            href="tel:+18005553746"
            className="font-mono-code text-sm text-[#9A9D8F] hover:text-[#F3EFE4] border border-[#F3EFE4]/20 hover:border-[#F3EFE4]/40 px-6 py-4 rounded-xs transition-colors flex items-center gap-2"
          >
            <PhoneCall className="w-4 h-4 text-[#E7A335]" />
            <span>Call audit line: (800) 555-RING</span>
          </a>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-mono-code text-[#6B6E5F]">
          <span>• 100% confidential call log review</span>
          <span>• Non-destructive integration</span>
          <span>• Live in under 5 days</span>
        </div>
      </div>
    </section>
  );
};
