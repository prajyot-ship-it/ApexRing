import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, TrendingDown } from 'lucide-react';
import { TRADE_PRESETS } from '../data/mockData';
import { CalculatorState, TradeType } from '../types';

interface RevenueCalculatorProps {
  initialState?: Partial<CalculatorState>;
  onClaimAudit: (state: CalculatorState) => void;
}

export const RevenueCalculator: React.FC<RevenueCalculatorProps> = ({
  initialState,
  onClaimAudit,
}) => {
  const [jobValue, setJobValue] = useState<number>(initialState?.jobValue ?? 280);
  const [missedCalls, setMissedCalls] = useState<number>(initialState?.missedCalls ?? 9);
  const [tradeType, setTradeType] = useState<TradeType>(initialState?.tradeType ?? 'Plumbing');
  const [bookRate, setBookRate] = useState<number>(initialState?.bookRate ?? 0.30);
  const [timeHorizon, setTimeHorizon] = useState<'monthly' | 'annual'>('monthly');

  const WEEKS_PER_MONTH = 4.33;
  const monthlyLoss = jobValue * missedCalls * WEEKS_PER_MONTH * bookRate;
  const annualLoss = monthlyLoss * 12;
  const displayLoss = timeHorizon === 'monthly' ? monthlyLoss : annualLoss;
  const recoveredJobsCount = Math.round(missedCalls * WEEKS_PER_MONTH * bookRate);

  const handleSelectPreset = (preset: typeof TRADE_PRESETS[0]) => {
    setTradeType(preset.type);
    setJobValue(preset.defaultJobValue);
    setMissedCalls(preset.defaultMissedCalls);
  };

  const formatCurrency = (val: number) => {
    return '$' + Math.round(val).toLocaleString('en-US');
  };

  return (
    <div id="calculator" className="ticket-paper p-6 sm:p-8 pt-8 sm:pt-9 shadow-2xl relative">
      {/* Ticket Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-[#B9B2A0] border-dashed pb-3 mb-5 text-xs font-mono-code text-[#6B6E5F]">
        <div className="flex items-center gap-2">
          <Calculator className="w-3.5 h-3.5 text-[#D6553C]" />
          <span className="font-semibold tracking-wider">CALL LOG — LOSS WORKSHEET</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-[#DCD5C0] px-2 py-0.5 rounded text-[11px] text-[#39392F]">FORM AR-0417</span>
          <span className="text-[#8B8D7C]">ACTIVE DISPATCH</span>
        </div>
      </div>

      {/* Trade Quick Presets */}
      <div className="mb-5">
        <label className="block text-[11px] font-mono-code text-[#6B6E5F] uppercase tracking-wider mb-2">
          Select Trade Benchmark:
        </label>
        <div className="flex flex-wrap gap-1.5">
          {TRADE_PRESETS.map((preset) => {
            const isSelected = tradeType === preset.type;
            return (
              <button
                key={preset.type}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-2.5 py-1 text-xs font-mono-code rounded-xs border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#171412] text-[#ECE6D6] border-[#171412] font-semibold'
                    : 'bg-[#F5F1E5] text-[#4A4B42] border-[#B9B2A0] hover:bg-[#E2DAC3]'
                }`}
              >
                {preset.label} (${preset.defaultJobValue})
              </button>
            );
          })}
        </div>
      </div>

      {/* Input Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        {/* Average Job Value */}
        <div className="flex flex-col">
          <label htmlFor="jobValueInput" className="font-mono-code text-xs text-[#6B6E5F] mb-1.5 flex justify-between">
            <span>Average job ticket</span>
            <span className="text-[11px] text-[#8B8D7C]">Per completed call</span>
          </label>
          <div className="flex items-center border border-[#B9B2A0] rounded-xs bg-[#F5F1E5] focus-within:border-[#D6553C] focus-within:ring-1 focus-within:ring-[#D6553C] transition-all">
            <span className="font-mono-code text-sm text-[#6B6E5F] pl-3 font-semibold">$</span>
            <input
              id="jobValueInput"
              type="number"
              min={10}
              max={50000}
              step={10}
              value={jobValue || ''}
              onChange={(e) => setJobValue(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent font-mono-code text-base sm:text-lg font-semibold text-[#1B1D18] py-2 px-2.5 focus:outline-none"
            />
          </div>
        </div>

        {/* Missed Calls per Week */}
        <div className="flex flex-col">
          <label htmlFor="missedCallsInput" className="font-mono-code text-xs text-[#6B6E5F] mb-1.5 flex justify-between">
            <span>Missed calls / week</span>
            <span className="text-[11px] text-[#8B8D7C]">Voicemails + rings</span>
          </label>
          <div className="flex items-center border border-[#B9B2A0] rounded-xs bg-[#F5F1E5] focus-within:border-[#D6553C] focus-within:ring-1 focus-within:ring-[#D6553C] transition-all">
            <span className="font-mono-code text-sm text-[#6B6E5F] pl-3 font-semibold">#</span>
            <input
              id="missedCallsInput"
              type="number"
              min={1}
              max={500}
              value={missedCalls || ''}
              onChange={(e) => setMissedCalls(Math.max(0, Number(e.target.value)))}
              className="w-full bg-transparent font-mono-code text-base sm:text-lg font-semibold text-[#1B1D18] py-2 px-2.5 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Advanced benchmark toggle (Conversion rate) */}
      <div className="mb-5 bg-[#E4DDCE] rounded p-2.5 flex items-center justify-between text-xs font-mono-code text-[#4A4B42]">
        <div className="flex items-center gap-2">
          <span>Booking rate assumed:</span>
          <span className="font-bold text-[#1B1D18]">{Math.round(bookRate * 100)}%</span>
        </div>
        <div className="flex gap-1">
          {[0.20, 0.30, 0.40].map((rate) => (
            <button
              key={rate}
              type="button"
              onClick={() => setBookRate(rate)}
              className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                bookRate === rate
                  ? 'bg-[#171412] text-white font-semibold'
                  : 'bg-[#D6CDB8] hover:bg-[#C8BEA5] text-[#2D2E28]'
              }`}
            >
              {Math.round(rate * 100)}%
            </button>
          ))}
        </div>
      </div>

      {/* Output Panel */}
      <div className="pt-4 border-t border-[#B9B2A0] border-dashed">
        <div className="flex items-center justify-between mb-1">
          <span className="font-mono-code text-xs uppercase tracking-wider text-[#6B6E5F] flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5 text-[#D6553C]" />
            Estimated revenue walking away:
          </span>
          <div className="flex gap-1 text-[11px] font-mono-code">
            <button
              type="button"
              onClick={() => setTimeHorizon('monthly')}
              className={`px-1.5 py-0.5 rounded ${
                timeHorizon === 'monthly' ? 'bg-[#D6553C] text-white font-bold' : 'text-[#6B6E5F]'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => setTimeHorizon('annual')}
              className={`px-1.5 py-0.5 rounded ${
                timeHorizon === 'annual' ? 'bg-[#D6553C] text-white font-bold' : 'text-[#6B6E5F]'
              }`}
            >
              Year
            </button>
          </div>
        </div>

        <div className="font-display font-bold text-5xl sm:text-6xl text-[#D6553C] leading-none my-1 tracking-tight">
          {formatCurrency(displayLoss)}
        </div>

        <div className="flex items-center justify-between text-xs font-mono-code text-[#47483C] bg-[#DFD8C4] px-3 py-1.5 rounded-xs mt-3">
          <span>
            Equivalent to: <strong className="text-[#171412]">~{recoveredJobsCount} lost jobs/mo</strong>
          </span>
          <span className="text-[#6B6E5F]">Based on {missedCalls} calls/wk</span>
        </div>

        <p className="font-mono-code text-[11.5px] text-[#787B6A] leading-relaxed mt-3">
          Assumes ~{Math.round(bookRate * 100)}% of unanswered calls would have booked at your ticket size — an
          accepted trade industry benchmark, not a promise. The audit measures your exact line.
        </p>

        {/* Claim Audit CTA Button with pre-filled state */}
        <button
          id="calculator-claim-audit-btn"
          type="button"
          onClick={() =>
            onClaimAudit({
              jobValue,
              missedCalls,
              tradeType,
              bookRate,
            })
          }
          className="mt-4 w-full bg-[#171412] hover:bg-[#2B2721] text-[#ECE6D6] font-mono-code text-xs sm:text-sm font-semibold py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md group"
        >
          <Sparkles className="w-4 h-4 text-[#E7A335]" />
          <span>Audit my line with these figures</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );
};
