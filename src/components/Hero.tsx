import React from 'react';
import { PhoneMissed, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { RevenueCalculator } from './RevenueCalculator';
import { CalculatorState, AuditBooking } from '../types';

interface HeroProps {
  onOpenAuditModal: (plan?: 'blueprint' | 'core' | 'audit_only') => void;
  onClaimAuditWithState: (state: CalculatorState) => void;
  registeredBooking?: AuditBooking | null;
}

export const Hero: React.FC<HeroProps> = ({
  onOpenAuditModal,
  onClaimAuditWithState,
  registeredBooking,
}) => {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="pt-10 sm:pt-14 pb-16 sm:pb-24 border-b border-[#F3EFE4]/10 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left Column: Value Proposition */}
          <motion.div 
            className="lg:col-span-6 flex flex-col justify-center"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Status callout badge */}
            <div className="inline-flex items-center gap-2.5 font-mono-code text-xs sm:text-sm text-[#D6553C] bg-[#D6553C]/10 border border-[#D6553C]/35 px-3 py-1.5 rounded-xs w-fit mb-6">
              <span className="w-2 h-2 rounded-full bg-[#D6553C] animate-ping" />
              <PhoneMissed className="w-3.5 h-3.5 text-[#D6553C]" />
              <span>37 unanswered trade calls last week across sample audit lines</span>
            </div>

            {/* Display Headline */}
            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-[#F3EFE4] leading-[1.04] tracking-tight mb-5">
              The phone rang. Nobody picked up.{' '}
              <span className="text-[#E7A335]">The job went to the next name on Google.</span>
            </h1>

            {/* Lede Body */}
            <p className="text-[#9A9D8F] text-base sm:text-lg leading-relaxed max-w-xl mb-8">
              ApexRing catches every call your crew can&apos;t get to — an instant 15-second text-back,
              a 3-touch follow-up sequence, and a weekly report of what it recovered. Built for plumbers,
              HVAC crews, electricians, and clinics who are busy doing the actual work.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button
                id="hero-primary-cta"
                onClick={() => onOpenAuditModal('core')}
                className="bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code font-semibold text-sm sm:text-base px-6 sm:px-7 py-3.5 rounded-xs transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/10"
              >
                <span>{registeredBooking ? `View waitlist ticket (#${registeredBooking.id})` : 'Book a free call audit'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href="#how"
                className="font-mono-code text-sm text-[#9A9D8F] hover:text-[#F3EFE4] border-b border-[#F3EFE4]/25 hover:border-[#F3EFE4] pb-0.5 transition-colors"
              >
                See how 4-step setup works
              </a>
            </div>

            {/* Micro assurances */}
            <div className="pt-6 border-t border-[#F3EFE4]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono-code text-xs text-[#9A9D8F]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7A335] flex-shrink-0" />
                <span>Zero new phone numbers needed</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7A335] flex-shrink-0" />
                <span>Live on your lines in 3–5 days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#E7A335] flex-shrink-0" />
                <span>30-day payback guarantee</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E7A335] flex-shrink-0" />
                <span>No long-term contracts or lock-in</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Interactive Worksheet Ticket */}
          <motion.div 
            className="lg:col-span-6 w-full"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          >
            <RevenueCalculator onClaimAudit={onClaimAuditWithState} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};
