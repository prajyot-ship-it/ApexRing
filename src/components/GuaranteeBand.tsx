import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

export const GuaranteeBand: React.FC = () => {
  return (
    <section id="guarantee" className="bg-[#E7A335] text-[#171412] py-14 sm:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
          <div className="md:col-span-3 flex items-center gap-4">
            <span className="font-display font-bold text-7xl sm:text-8xl leading-none text-[#171412]/85">
              01
            </span>
            <div className="border-l-2 border-[#171412]/30 pl-4 font-mono-code text-xs uppercase font-bold tracking-wider">
              PAYBACK<br />GUARANTEE
            </div>
          </div>

          <div className="md:col-span-9">
            <h2 className="font-display font-bold text-2xl sm:text-3xl lg:text-4xl leading-tight mb-3 text-[#171412]">
              If it doesn&apos;t recover a job&apos;s worth of revenue in 30 days, we keep working for free
            </h2>
            <p className="text-[#2B2721] text-base leading-relaxed max-w-3xl">
              We measure against your own average job value established during your call audit. If Core
              hasn&apos;t paid for itself in verified, booked work within your first 30 days live, our engineers
              continue re-tuning your recovery sequences and scripts at zero charge until it does.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
