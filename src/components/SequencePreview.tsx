import React, { useState } from 'react';
import { Smartphone, Clock, CheckCheck, Play, RotateCcw, Wrench, Shield, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TradeMessageScript {
  tradeName: string;
  callerIssue: string;
  touch1Time: string;
  touch1Bot: string;
  callerReply: string;
  touch2Time: string;
  touch2Bot: string;
  callerConfirm: string;
  touch3Time: string;
  touch3Bot: string;
}

const SCRIPTS: Record<string, TradeMessageScript> = {
  plumbing: {
    tradeName: 'Plumbing & Drain',
    callerIssue: 'Main water line shutoff emergency & dripping fixture',
    touch1Time: '10:14 AM (18s after missed call)',
    touch1Bot:
      "Hey! This is Dave with Apex Plumbing. I'm currently on a service call and couldn't grab your ring. What's going on with your plumbing or water heater?",
    callerReply:
      'Hi Dave, water heater in the utility room is leaking into the hallway. Need someone out today if possible.',
    touch2Time: '10:15 AM (Instant qualification)',
    touch2Bot:
      'Got it — water leaks are top priority. Is the main shutoff valve closed right now? We have a tech near your zip code between 1:00 PM and 3:00 PM. Reply YES to reserve that window.',
    callerConfirm:
      'Yes, shutoff is turned off. 1:00 PM works great. Address is 418 Highland Dr.',
    touch3Time: '10:16 AM (Locked into dispatch)',
    touch3Bot:
      "You're locked in for 1–3 PM! Tech Marcus will text you 20 mins before arrival. Call or text Dave directly if anything changes.",
  },
  hvac: {
    tradeName: 'HVAC Heating & Air',
    callerIssue: 'AC blowing lukewarm air during 92° heat wave',
    touch1Time: '2:31 PM (15s after missed call)',
    touch1Bot:
      "Hi! This is Apex Heating & Air. Our dispatchers are assisting customers on other lines. What symptoms is your AC or heating unit showing?",
    callerReply:
      'AC unit outside is humming loudly and blowing room temperature air. House is 84 degrees.',
    touch2Time: '2:32 PM (Instant qualification)',
    touch2Bot:
      'We hear you — heat waves are brutal. Is the outside fan spinning at all? We have an emergency diagnostic slot open today at 4:30 PM. Would that work for you?',
    callerConfirm:
      'Fan is not spinning. Yes please lock in 4:30 PM! 102 Maple Ave.',
    touch3Time: '2:33 PM (Locked into dispatch)',
    touch3Bot:
      'Booked for 4:30 PM today with Tech Ryan. Service diagnostic fee is $89 (credited toward any repair). See you at 4:30!',
  },
  roofing: {
    tradeName: 'Roofing & Restoration',
    callerIssue: 'Storm leak after hail storm',
    touch1Time: '8:42 AM (12s after missed call)',
    touch1Bot:
      'Good morning from Apex Roofing! Our inspection crew is currently up on a roof. How can we help with your roof or gutters today?',
    callerReply:
      'We had hail last night and noticed a brown stain spreading on the second floor ceiling.',
    touch2Time: '8:43 AM (Instant qualification)',
    touch2Bot:
      'Understood. Active ceiling moisture needs fast photo documentation for insurance. What is your street address? We can have an inspector stop by between 11 AM and 1 PM for a free drone moisture check.',
    callerConfirm:
      'Address is 725 Cedar Ridge. 11 AM works, someone will be home.',
    touch3Time: '8:44 AM (Locked into dispatch)',
    touch3Bot:
      'Confirmed for 11 AM drone inspection with Senior Estimator Carlos. We will bring moisture sensors and take care of the insurance paperwork.',
  },
};

export const SequencePreview: React.FC = () => {
  const [activeTrade, setActiveTrade] = useState<'plumbing' | 'hvac' | 'roofing'>('plumbing');
  const [stepVisible, setStepVisible] = useState<number>(3); // 1, 2, or 3
  const script = SCRIPTS[activeTrade];

  return (
    <section id="preview" className="py-20 border-b border-[#F3EFE4]/10 bg-[#141617] scroll-mt-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-mono-code text-xs sm:text-sm text-[#E7A335] mb-2 tracking-wide uppercase">
              LIVE SMS SEQUENCE SIMULATION
            </div>
            <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE4]">
              See what your customer experiences in the first 60 seconds
            </h2>
            <p className="text-[#9A9D8F] text-base sm:text-lg mt-3 max-w-xl">
              Written in your authentic local voice, not robot corporate jargon. Customers immediately stop
              calling competitors and reply to your text.
            </p>
          </div>

          {/* Trade Selector Tabs */}
          <div className="flex flex-wrap gap-2 font-mono-code text-xs">
            <button
              onClick={() => {
                setActiveTrade('plumbing');
                setStepVisible(3);
              }}
              className={`px-3 py-2 rounded-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTrade === 'plumbing'
                  ? 'bg-[#E7A335] text-[#171412] font-semibold border-[#E7A335]'
                  : 'bg-[#1D201D] text-[#9A9D8F] border-[#F3EFE4]/20 hover:text-white'
              }`}
            >
              <Wrench className="w-3.5 h-3.5" /> Plumbing Example
            </button>
            <button
              onClick={() => {
                setActiveTrade('hvac');
                setStepVisible(3);
              }}
              className={`px-3 py-2 rounded-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTrade === 'hvac'
                  ? 'bg-[#E7A335] text-[#171412] font-semibold border-[#E7A335]'
                  : 'bg-[#1D201D] text-[#9A9D8F] border-[#F3EFE4]/20 hover:text-white'
              }`}
            >
              <Zap className="w-3.5 h-3.5" /> HVAC Example
            </button>
            <button
              onClick={() => {
                setActiveTrade('roofing');
                setStepVisible(3);
              }}
              className={`px-3 py-2 rounded-xs border transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeTrade === 'roofing'
                  ? 'bg-[#E7A335] text-[#171412] font-semibold border-[#E7A335]'
                  : 'bg-[#1D201D] text-[#9A9D8F] border-[#F3EFE4]/20 hover:text-white'
              }`}
            >
              <Shield className="w-3.5 h-3.5" /> Roofing Example
            </button>
          </div>
        </div>

        {/* The Phone Canvas */}
        <div className="max-w-2xl mx-auto bg-[#1A1C1D] border-2 border-[#F3EFE4]/20 rounded-2xl shadow-2xl p-4 sm:p-6 font-sans relative">
          {/* Top Speaker / Camera Notch */}
          <div className="flex flex-wrap items-center justify-between border-b border-[#F3EFE4]/10 pb-3 mb-4 gap-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#E7A335] text-[#171412] font-bold text-xs flex items-center justify-center font-mono-code">
                AR
              </div>
              <div>
                <div className="text-sm font-semibold text-[#F3EFE4] flex items-center gap-1.5">
                  <span>{script.tradeName} Dispatch</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" title="Online" />
                </div>
                <div className="text-[11px] font-mono-code text-[#9A9D8F]">
                  Auto-responder wired to existing line
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 font-mono-code text-xs">
              <span className="text-[11px] text-[#9A9D8F] hidden sm:inline">Steps:</span>
              {[1, 2, 3].map((stepNum) => (
                <button
                  key={stepNum}
                  onClick={() => setStepVisible(stepNum)}
                  className={`px-2 py-0.5 rounded text-[11px] cursor-pointer transition-colors ${
                    stepVisible === stepNum
                      ? 'bg-[#E7A335] text-[#171412] font-bold'
                      : 'bg-[#242725] text-[#9A9D8F] hover:text-white border border-[#F3EFE4]/15'
                  }`}
                  title={`Show up to Touch ${stepNum}`}
                >
                  T{stepNum}
                </button>
              ))}

              <button
                onClick={() => setStepVisible((prev) => (prev >= 3 ? 1 : prev + 1))}
                className="text-xs font-mono-code px-2.5 py-1 bg-[#242725] text-[#ECE6D6] hover:bg-[#323633] rounded border border-[#F3EFE4]/15 flex items-center gap-1 cursor-pointer ml-1"
              >
                {stepVisible >= 3 ? (
                  <>
                    <RotateCcw className="w-3 h-3 text-[#E7A335]" /> Replay
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#E7A335]" /> Next
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Missed call event notice */}
          <div className="my-3 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#D6553C]/15 border border-[#D6553C]/30 text-[#FBEDE8] text-xs font-mono-code">
              <Clock className="w-3 h-3 text-[#D6553C]" />
              <span>Missed Call from (555) 389-1024 • Instant sequence triggered</span>
            </div>
          </div>

          {/* Message Thread */}
          <div className="space-y-4 py-2 text-sm leading-relaxed min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTrade}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                {/* Touch 1: Bot */}
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-start max-w-[88%]"
                >
                  <span className="text-[10px] font-mono-code text-[#9A9D8F] mb-1">
                    ApexRing Bot • {script.touch1Time}
                  </span>
                  <div className="bg-[#242925] border border-[#F3EFE4]/15 text-[#ECE6D6] p-3.5 rounded-2xl rounded-tl-xs shadow">
                    {script.touch1Bot}
                  </div>
                </motion.div>

                {/* Touch 1: Customer Reply */}
                <motion.div 
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: 0.1 }}
                  className="flex flex-col items-end max-w-[88%] ml-auto"
                >
                  <span className="text-[10px] font-mono-code text-[#9A9D8F] mb-1">
                    Caller • 42s later
                  </span>
                  <div className="bg-[#3B4239] text-[#F3EFE4] p-3.5 rounded-2xl rounded-tr-xs shadow">
                    {script.callerReply}
                  </div>
                </motion.div>

                {/* Touch 2: Qualification (Step 2) */}
                {stepVisible >= 2 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-4"
                  >
                    <div className="flex flex-col items-start max-w-[88%]">
                      <span className="text-[10px] font-mono-code text-[#9A9D8F] mb-1">
                        ApexRing Bot • {script.touch2Time}
                      </span>
                      <div className="bg-[#242925] border border-[#F3EFE4]/15 text-[#ECE6D6] p-3.5 rounded-2xl rounded-tl-xs shadow">
                        {script.touch2Bot}
                      </div>
                    </div>

                    <div className="flex flex-col items-end max-w-[88%] ml-auto">
                      <span className="text-[10px] font-mono-code text-[#9A9D8F] mb-1">
                        Caller • 1 min later
                      </span>
                      <div className="bg-[#3B4239] text-[#F3EFE4] p-3.5 rounded-2xl rounded-tr-xs shadow">
                        {script.callerConfirm}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Touch 3: Locked in (Step 3) */}
                {stepVisible >= 3 && (
                  <motion.div 
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col items-start max-w-[88%]"
                  >
                    <span className="text-[10px] font-mono-code text-[#9A9D8F] mb-1">
                      ApexRing Bot • {script.touch3Time}
                    </span>
                    <div className="bg-[#20271E] border border-emerald-500/30 text-emerald-100 p-3.5 rounded-2xl rounded-tl-xs shadow flex items-start gap-2">
                      <CheckCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>{script.touch3Bot}</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Bottom status indicator */}
          <div className="mt-4 pt-3 border-t border-[#F3EFE4]/10 flex items-center justify-between text-xs font-mono-code text-[#9A9D8F]">
            <span className="text-[#E7A335]">
              {stepVisible === 3 ? '✓ Customer booked and off Google search' : 'Step ' + stepVisible + ' of 3 displayed'}
            </span>
            <span>Zero manual typing needed while on job</span>
          </div>
        </div>
      </div>
    </section>
  );
};
