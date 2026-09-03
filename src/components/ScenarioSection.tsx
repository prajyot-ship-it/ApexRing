import React, { useState } from 'react';
import { WORKED_SCENARIOS } from '../data/mockData';
import { WorkedScenario } from '../types';

export const ScenarioSection: React.FC = () => {
  const [selectedScenarioIndex, setSelectedScenarioIndex] = useState(0);
  const scenario: WorkedScenario = WORKED_SCENARIOS[selectedScenarioIndex];

  return (
    <section id="scenario" className="py-20 sm:py-24 border-b border-[#F3EFE4]/10 bg-[#17191A]">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        <div className="max-w-2xl mb-12">
          <div className="font-mono-code text-xs sm:text-sm text-[#E7A335] mb-2 tracking-wide uppercase">
            WHAT RECOVERY LOOKS LIKE
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE4]">
            A worked example, not a promise
          </h2>
          <p className="text-[#9A9D8F] text-base sm:text-lg mt-3">
            This is illustrative math based on documented contractor metrics — see how different trades
            and fleet sizes translate into recovered revenue.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 mb-6 font-mono-code text-xs">
          {WORKED_SCENARIOS.map((sc, idx) => (
            <button
              key={sc.trade}
              onClick={() => setSelectedScenarioIndex(idx)}
              className={`px-4 py-2 rounded-xs border transition-colors cursor-pointer ${
                selectedScenarioIndex === idx
                  ? 'bg-[#E7A335] text-[#171412] font-semibold border-[#E7A335]'
                  : 'bg-[#20231F] text-[#9A9D8F] border-[#F3EFE4]/15 hover:text-white'
              }`}
            >
              {sc.trade}: {sc.fleetSize}
            </button>
          ))}
        </div>

        {/* Scenario Display Card */}
        <div className="border border-[#F3EFE4]/15 rounded-xs p-6 sm:p-9 bg-[#20231F]">
          <div className="font-mono-code text-xs text-[#9A9D8F] uppercase tracking-wider mb-2 flex items-center justify-between">
            <span>Case Study Profile</span>
            <span className="text-[#E7A335]">{scenario.fleetSize}</span>
          </div>

          <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#F3EFE4] mb-4">
            {scenario.title}
          </h3>

          <p className="text-[#9A9D8F] text-base leading-relaxed max-w-3xl mb-8">
            {scenario.description}
          </p>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#F3EFE4]/15 border-dashed">
            <div>
              <div className="font-mono-code text-xs text-[#9A9D8F] mb-1.5 uppercase">
                CALLS MISSED / WK
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#F3EFE4]">
                {scenario.missedCallsWk}
              </div>
            </div>

            <div>
              <div className="font-mono-code text-xs text-[#9A9D8F] mb-1.5 uppercase">
                AVG. TICKET SIZE
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#F3EFE4]">
                ${scenario.avgTicket}
              </div>
            </div>

            <div>
              <div className="font-mono-code text-xs text-[#9A9D8F] mb-1.5 uppercase">
                EST. RECOVERED / WK
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#E7A335]">
                {scenario.recoveredWk}
              </div>
            </div>

            <div>
              <div className="font-mono-code text-xs text-[#9A9D8F] mb-1.5 uppercase">
                EST. VALUE / MONTH
              </div>
              <div className="font-display font-bold text-3xl sm:text-4xl text-[#D6553C]">
                {scenario.estMonthlyRecovery}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
