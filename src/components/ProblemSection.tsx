import React from 'react';
import { PhoneMissed, PhoneForwarded, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';

export const ProblemSection: React.FC = () => {
  return (
    <section id="problem" className="py-20 sm:py-24 border-b border-[#F3EFE4]/10 bg-[#17191A] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        {/* Section Header */}
        <div className="max-w-2xl mb-14">
          <div className="font-mono-code text-xs sm:text-sm text-[#E7A335] mb-3 tracking-wide">
            WHAT&apos;S ACTUALLY HAPPENING ON YOUR LINE
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE4] leading-[1.06] mb-4">
            Every ring you miss is a booked job for someone else
          </h2>
          <p className="text-[#9A9D8F] text-base sm:text-lg leading-relaxed">
            None of this is a staffing failure. It&apos;s what happens on any crew that&apos;s on roofs,
            under sinks, or with a patient instead of standing next to a phone desk.
          </p>
        </div>

        {/* The 3 Log Entries */}
        <div className="border-t border-[#F3EFE4]/15 divide-y divide-[#F3EFE4]/15 mb-16">
          {/* Row 1 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
            <div className="md:col-span-3">
              <span className="font-display font-bold text-4xl sm:text-5xl text-[#E7A335] leading-none">
                20–30%
              </span>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#F3EFE4] mb-2">
                of inbound calls go unanswered during peak business hours
              </h3>
              <p className="text-[#9A9D8F] text-base leading-relaxed max-w-2xl">
                Most of them hit voicemail during peak job hours — mid-morning and late afternoon —
                exactly when your crew is heads-down, carrying ladders, and can&apos;t step away to take notes.
              </p>
            </div>
          </div>

          {/* Row 2 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
            <div className="md:col-span-3">
              <span className="font-display font-bold text-4xl sm:text-5xl text-[#D6553C] leading-none">
                80%
              </span>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#F3EFE4] mb-2">
                of callers who hit voicemail simply hang up and call the next result
              </h3>
              <p className="text-[#9A9D8F] text-base leading-relaxed max-w-2xl">
                They don&apos;t leave a message. They don&apos;t wait for a 4-hour callback. They tap the
                very next contractor on Google Maps, and that $300–$1,500 ticket is gone before you even know
                it was ringing.
              </p>
            </div>
          </div>

          {/* Row 3 */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline">
            <div className="md:col-span-3">
              <span className="font-display font-bold text-4xl sm:text-5xl text-[#ECE6D6] leading-none">
                0
              </span>
            </div>
            <div className="md:col-span-9">
              <h3 className="font-sans font-semibold text-lg sm:text-xl text-[#F3EFE4] mb-2">
                automated systems most trade businesses have for catching that gap
              </h3>
              <p className="text-[#9A9D8F] text-base leading-relaxed max-w-2xl">
                An answering service costs $300–$800/month and still can&apos;t quote or schedule. A missed
                call log in your phone app doesn&apos;t recover anything — it just tells you what you already lost.
              </p>
            </div>
          </div>
        </div>

        {/* Visual Call Flow Comparison Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#1D201D] border border-[#F3EFE4]/15 p-6 sm:p-8 rounded-xs">
          {/* Old Way */}
          <div className="border-b md:border-b-0 md:border-r border-[#F3EFE4]/15 pb-6 md:pb-0 md:pr-8">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#D6553C] uppercase tracking-wider mb-4">
              <AlertTriangle className="w-4 h-4" />
              <span>Default Phone Behavior (Voicemail Void)</span>
            </div>
            <ol className="space-y-4 font-mono-code text-xs sm:text-sm text-[#9A9D8F]">
              <li className="flex items-start gap-3">
                <span className="text-[#D6553C] font-bold">1.</span>
                <span>Customer rings at 10:14 AM with urgent leak or AC breakdown</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D6553C] font-bold">2.</span>
                <span>Phone rings 5 times, goes to default carrier voicemail</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D6553C] font-bold">3.</span>
                <span>Customer hangs up after beep, taps competitor #2 on Google</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D6553C] font-bold">4.</span>
                <span className="text-[#D6553C]">Result: Job lost permanently. You call back at 4:30 PM: &ldquo;We already found someone.&rdquo;</span>
              </li>
            </ol>
          </div>

          {/* ApexRing Way */}
          <div className="pt-4 md:pt-0 md:pl-2">
            <div className="flex items-center gap-2 text-xs font-mono-code text-[#E7A335] uppercase tracking-wider mb-4">
              <CheckCircle className="w-4 h-4" />
              <span>ApexRing Recovery Flow (Under 18 Seconds)</span>
            </div>
            <ol className="space-y-4 font-mono-code text-xs sm:text-sm text-[#ECE6D6]">
              <li className="flex items-start gap-3">
                <span className="text-[#E7A335] font-bold">1.</span>
                <span>Customer rings at 10:14 AM while you&apos;re under a sink</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E7A335] font-bold">2.</span>
                <span>At 10:14:18 AM, customer receives personalized SMS in your voice</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E7A335] font-bold">3.</span>
                <span>Customer texts back emergency details + address within 45 seconds</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#E7A335] font-bold">4.</span>
                <span className="text-[#E7A335] font-semibold">Result: Customer stops searching. Dispatch holds the job for your afternoon route.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
