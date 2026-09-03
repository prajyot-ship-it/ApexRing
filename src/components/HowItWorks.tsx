import React from 'react';
import { Search, Terminal, FileSpreadsheet, Trophy } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'We audit your call flow',
      desc: 'We analyze your last 30 days of carrier call logs and pinpoint precisely where revenue is leaking — peak drop hours, unreturned voicemails, and line conflicts.',
      badge: 'Day 1',
    },
    {
      num: '02',
      icon: Terminal,
      title: 'We install recovery scripts',
      desc: 'An instant text-back fires within 18 seconds of any missed ring, followed by a 3-touch qualification sequence calibrated for your services and dispatch rules.',
      badge: 'Days 2–3',
    },
    {
      num: '03',
      icon: FileSpreadsheet,
      title: 'We hand you the tracker',
      desc: 'A clear weekly summary: missed calls detected, texts delivered, and jobs booked. No clunky software to log into — the report lands right in your email inbox.',
      badge: 'Day 4',
    },
    {
      num: '04',
      icon: Trophy,
      title: 'You keep the wins',
      desc: 'No lock-in or proprietary traps. You can keep our ongoing monitoring retainer or run solo — the recovery configuration is yours permanently.',
      badge: 'Permanent',
    },
  ];

  return (
    <section id="how" className="py-20 sm:py-24 border-b border-[#F3EFE4]/10 bg-[#17191A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        <div className="max-w-xl mb-14">
          <div className="font-mono-code text-xs sm:text-sm text-[#E7A335] mb-2 tracking-wide uppercase">
            HOW SETUP WORKS
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE4]">
            Four steps, wired to the number you already use
          </h2>
          <p className="text-[#9A9D8F] text-base sm:text-lg mt-3">
            Zero disruption to your crew in the field. We do the heavy technical wiring behind the scenes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-[#F3EFE4]/15 border border-[#F3EFE4]/15">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.num} className="bg-[#17191A] p-7 flex flex-col justify-between group hover:bg-[#1C1F1D] transition-colors">
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className="font-mono-code font-bold text-lg text-[#E7A335]">
                      {step.num}
                    </span>
                    <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#20231F] text-[#9A9D8F] border border-[#F3EFE4]/10">
                      {step.badge}
                    </span>
                  </div>
                  <Icon className="w-6 h-6 text-[#ECE6D6] mb-4 group-hover:text-[#E7A335] transition-colors" />
                  <h3 className="font-sans font-semibold text-lg text-[#F3EFE4] mb-2">
                    {step.title}
                  </h3>
                  <p className="text-[#9A9D8F] text-sm leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
