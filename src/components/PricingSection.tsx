import React from 'react';
import { Check, ShieldCheck, ArrowRight, Zap, Award } from 'lucide-react';

interface PricingSectionProps {
  onSelectPlan: (plan: 'blueprint' | 'core') => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onSelectPlan }) => {
  return (
    <section id="pricing" className="py-20 sm:py-24 border-b border-[#F3EFE4]/10 bg-[#17191A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="font-mono-code text-xs sm:text-sm text-[#E7A335] mb-2 tracking-wide uppercase">
            THE OFFER
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE4]">
            Two ways in, one way to keep it running
          </h2>
          <p className="text-[#9A9D8F] text-base sm:text-lg mt-3">
            Most shops start with Core — it&apos;s the setup we handle with you, not one you have to figure
            out on your own between crawling crawlspaces and service appointments.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
          {/* Blueprint Ticket */}
          <div className="ticket-paper p-7 sm:p-9 pt-9 shadow-xl relative flex flex-col justify-between h-full">
            <div>
              <div className="flex justify-between items-center border-b border-[#B9B2A0] border-dashed pb-2.5 mb-5 font-mono-code text-xs text-[#6B6E5F]">
                <span>BLUEPRINT SPECIFICATION</span>
                <span>TICKET A</span>
              </div>

              <div className="font-display font-bold text-3xl sm:text-4xl text-[#171412] mb-1">
                Blueprint
              </div>
              <div className="font-mono-code text-xs sm:text-sm text-[#6B6E5F] mb-5">
                Self-install version for DIY tech-forward shops
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono-code text-2xl text-[#9A9484] line-through decoration-[#B04A38]">
                  $859
                </span>
                <span className="font-display font-bold text-5xl sm:text-6xl text-[#171412] leading-none">
                  $499
                </span>
                <span className="font-mono-code text-xs sm:text-sm text-[#6B6E5F]">one-time</span>
              </div>

              <div className="inline-block font-mono-code text-xs font-semibold text-[#171412] bg-[#E7A335] px-2.5 py-1 rounded-xs mb-6">
                Launch offer — save $360
              </div>

              {/* Deliverables List */}
              <ul className="space-y-3 pt-4 border-t border-[#B9B2A0] border-dashed text-sm text-[#39392F] mb-8">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B97A20] flex-shrink-0 mt-0.5" />
                  <span>Battle-tested text-back script templates, ready to copy</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B97A20] flex-shrink-0 mt-0.5" />
                  <span>Full 3-touch follow-up sequence, pre-written for your trade</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B97A20] flex-shrink-0 mt-0.5" />
                  <span>Step-by-step carrier & VOIP wiring PDF checklist</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-[#B97A20] flex-shrink-0 mt-0.5" />
                  <span>45-minute detailed setup walkthrough video</span>
                </li>
                <li className="flex items-start gap-2.5 text-[#6B6E5F] italic">
                  <span className="font-mono-code font-bold">—</span>
                  <span>You connect it to your phone system yourself</span>
                </li>
              </ul>
            </div>

            <button
              id="pricing-blueprint-cta"
              onClick={() => onSelectPlan('blueprint')}
              className="w-full bg-transparent hover:bg-[#171412] hover:text-[#ECE6D6] text-[#171412] border-2 border-[#171412] font-mono-code font-semibold text-sm py-3 px-5 rounded-xs transition-colors text-center cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Get the blueprint</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Core Setup Ticket (Most Booked) */}
          <div className="ticket-paper p-7 sm:p-9 pt-9 shadow-2xl relative flex flex-col justify-between h-full ring-2 ring-[#E7A335]/70">
            {/* Rubber Stamp */}
            <div className="absolute top-6 right-6 font-mono-code text-xs font-bold text-[#D6553C] border-2 border-[#D6553C] rounded-xs px-2.5 py-1 rotate-6 select-none uppercase tracking-wider bg-[#ECE6D6]">
              MOST BOOKED
            </div>

            <div>
              <div className="flex justify-between items-center border-b border-[#B9B2A0] border-dashed pb-2.5 mb-5 font-mono-code text-xs text-[#6B6E5F]">
                <span>CORE IMPLEMENTATION</span>
                <span>TICKET B</span>
              </div>

              <div className="font-display font-bold text-3xl sm:text-4xl text-[#171412] mb-1 flex items-center gap-2">
                <span>Core Setup</span>
                <span className="text-xs font-mono-code font-normal bg-[#171412] text-white px-2 py-0.5 rounded">
                  Done-With-You
                </span>
              </div>
              <div className="font-mono-code text-xs sm:text-sm text-[#6B6E5F] mb-5">
                Full installation live on your line in 3–5 business days
              </div>

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-3">
                <span className="font-mono-code text-2xl text-[#9A9484] line-through decoration-[#B04A38]">
                  $1,599
                </span>
                <span className="font-display font-bold text-5xl sm:text-6xl text-[#171412] leading-none">
                  $999
                </span>
                <span className="font-mono-code text-xs sm:text-sm text-[#6B6E5F]">one-time</span>
              </div>

              <div className="inline-block font-mono-code text-xs font-semibold text-[#171412] bg-[#E7A335] px-2.5 py-1 rounded-xs mb-6">
                Launch offer — save $600
              </div>

              {/* Deliverables List */}
              <ul className="space-y-3 pt-4 border-t border-[#B9B2A0] border-dashed text-sm text-[#1B1D18] mb-8 font-medium">
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span><strong>Everything in Blueprint</strong>, fully executed for you</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>We configure the 15-second text-back on your actual carrier line</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>We customize and test your 3-touch qualification sequence</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>Recovered-call tracker delivered straight to your email every week</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Check className="w-4 h-4 text-emerald-700 flex-shrink-0 mt-0.5" />
                  <span>1-on-1 30-minute kickoff & strategy call with a dedicated technician</span>
                </li>
              </ul>
            </div>

            <button
              id="pricing-core-cta"
              onClick={() => onSelectPlan('core')}
              className="w-full bg-[#171412] hover:bg-[#2B2721] text-[#ECE6D6] font-mono-code font-semibold text-sm sm:text-base py-3.5 px-6 rounded-xs transition-colors text-center cursor-pointer flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Book Core setup</span>
              <ArrowRight className="w-4 h-4 text-[#E7A335]" />
            </button>
          </div>
        </div>

        {/* Retainer Band */}
        <div className="border border-[#F3EFE4]/20 rounded-xs p-6 sm:p-8 bg-[#1D201D] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-1.5">
              <Zap className="w-4 h-4 text-[#E7A335]" />
              <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#F3EFE4]">
                Recovery Retainer — keeps your line bulletproof
              </h3>
            </div>
            <p className="text-[#9A9D8F] text-sm leading-relaxed">
              Added after setup, optional to start. We watch for phone carrier changes, update scripts as your
              seasonal pricing fluctuates (summer AC vs winter freeze), and send your weekly recovered-revenue
              audit log.
            </p>
          </div>

          <div className="text-left md:text-right font-mono-code flex-shrink-0">
            <div className="text-2xl sm:text-3xl font-bold text-[#E7A335] leading-none">
              $99–$199
            </div>
            <div className="text-xs text-[#9A9D8F] mt-1">
              / month • cancel anytime with zero lock-in
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
