import React, { useState, useEffect } from 'react';
import { X, PhoneCall, CheckCircle2, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AuditBooking, CalculatorState, TradeType } from '../types';
import { AddToCalendar } from './AddToCalendar';
import { saveClientToFirestore, getPlanDetails } from '../services/firestoreService';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorState: CalculatorState;
  initialPlan?: 'blueprint' | 'core' | 'audit_only';
  registeredBooking?: AuditBooking | null;
  onRegistered?: (booking: AuditBooking) => void;
}

const getTomorrowDateString = () => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
};

const getTodayDateString = () => {
  return new Date().toISOString().split('T')[0];
};

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  calculatorState,
  initialPlan = 'core',
  registeredBooking,
  onRegistered,
}) => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tradeType, setTradeType] = useState<TradeType>(calculatorState.tradeType || 'Plumbing');
  const [missedCallsWeekly, setMissedCallsWeekly] = useState(calculatorState.missedCalls || 9);
  const [avgJobValue, setAvgJobValue] = useState(calculatorState.jobValue || 280);
  const [scheduledDate, setScheduledDate] = useState(getTomorrowDateString());
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('09:30 AM');
  const [notes, setNotes] = useState('');
  const [planInterest, setPlanInterest] = useState<'blueprint' | 'core' | 'audit_only'>(initialPlan);

  const [submittedBooking, setSubmittedBooking] = useState<AuditBooking | null>(registeredBooking || null);
  const [copiedCode, setCopiedCode] = useState(false);

  // Sync state when modal opens with fresh calculator numbers or plan
  useEffect(() => {
    if (isOpen) {
      setTradeType(calculatorState.tradeType || 'Plumbing');
      setMissedCallsWeekly(calculatorState.missedCalls || 9);
      setAvgJobValue(calculatorState.jobValue || 280);
      setPlanInterest(initialPlan);
      if (registeredBooking) {
        setSubmittedBooking(registeredBooking);
      } else {
        setSubmittedBooking(null);
      }
    }
  }, [isOpen, calculatorState, initialPlan, registeredBooking]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !companyName) return;

    const planInfo = getPlanDetails(planInterest);
    const estLoss = Math.round(avgJobValue * missedCallsWeekly * 4.33 * 0.4);

    const booking: AuditBooking = {
      id: 'AR-' + Math.floor(1000 + Math.random() * 9000),
      fullName,
      companyName,
      phone,
      email,
      tradeType,
      avgJobValue,
      missedCallsWeekly,
      preferredTime: `${scheduledDate} (${scheduledTimeSlot})`,
      scheduledDate,
      scheduledTimeSlot,
      notes,
      planInterest,
      planName: planInfo.name,
      planPrice: planInfo.price,
      status: 'new',
      estMonthlyLoss: estLoss,
      tags: [planInfo.name, tradeType],
      notificationDispatched: true,
      notificationTarget: 'ai.prajyot@gmail.com',
      createdAt: new Date().toISOString(),
    };

    setSubmittedBooking(booking);
    if (onRegistered) {
      onRegistered(booking);
    }

    // Persist to Firestore / database collection
    saveClientToFirestore(booking);

  };

  const handleCopyCode = () => {
    if (!submittedBooking) return;
    navigator.clipboard.writeText(submittedBooking.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const estMonthlyRecovery = Math.round(avgJobValue * missedCallsWeekly * 4.33 * 0.3);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 12 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-xl my-8 bg-[#ECE6D6] text-[#171412] rounded-xs shadow-2xl p-6 sm:p-9 font-sans ticket-paper-modal"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#6B6E5F] hover:text-[#171412] transition-colors rounded cursor-pointer"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="border-b border-[#B9B2A0] border-dashed pb-3 mb-6 font-mono-code text-xs text-[#6B6E5F] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#D6553C] animate-pulse" />
            <span className="text-[#171412] font-bold">WAITLIST ACTIVE • FULL OF CLIENTS</span>
          </div>
          <span>INTAKE TICKET</span>
        </div>

        {submittedBooking ? (
          /* Confirmation State Ticket */
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="inline-flex items-center gap-1.5 font-mono-code text-[11px] text-[#D6553C] bg-[#D6553C]/10 border border-[#D6553C]/30 px-3 py-1 rounded-xs mb-2">
                <span className="w-2 h-2 rounded-full bg-[#D6553C] animate-pulse" />
                <span className="font-bold tracking-wider uppercase">WAITLIST STATUS: COMPLETELY PACKED</span>
              </div>
              <h3 className="font-display font-bold text-3xl text-[#171412] mb-1">
                You are registered on the waiting list!
              </h3>
              <p className="font-mono-code text-xs text-[#6B6E5F]">
                Priority Waitlist Ticket: <strong className="text-[#171412] text-sm">{submittedBooking.id}</strong>
              </p>
            </div>

            <div className="bg-[#DFD8C4] p-4 sm:p-5 rounded-xs space-y-3 font-mono-code text-xs text-[#2E2F27]">
              <div className="flex justify-between border-b border-[#B9B2A0] pb-2">
                <span className="text-[#6B6E5F]">Waitlist Status:</span>
                <span className="font-bold text-[#D6553C]">Completely Packed (Priority Queue)</span>
              </div>
              <div className="flex justify-between border-b border-[#B9B2A0] pb-2">
                <span className="text-[#6B6E5F]">Business Name:</span>
                <span className="font-bold text-[#171412]">{submittedBooking.companyName}</span>
              </div>
              <div className="flex justify-between border-b border-[#B9B2A0] pb-2">
                <span className="text-[#6B6E5F]">Contact Person:</span>
                <span>{submittedBooking.fullName}</span>
              </div>
              <div className="flex justify-between border-b border-[#B9B2A0] pb-2">
                <span className="text-[#6B6E5F]">Target Line:</span>
                <span>{submittedBooking.phone}</span>
              </div>
              <div className="flex justify-between border-b border-[#B9B2A0] pb-2">
                <span className="text-[#6B6E5F]">Preferred Time Window:</span>
                <span className="font-bold text-[#171412] text-right">
                  {submittedBooking.scheduledDate
                    ? `${submittedBooking.scheduledDate} (${submittedBooking.scheduledTimeSlot || '15 min'})`
                    : submittedBooking.preferredTime}
                </span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#6B6E5F]">Est. Monthly Missed Recovery:</span>
                <span className="font-bold text-[#D6553C] text-sm">
                  ${estMonthlyRecovery.toLocaleString()} / mo
                </span>
              </div>
            </div>

            {/* Dedicated Comprehensive Add to Calendar Component */}
            <AddToCalendar booking={submittedBooking} />

            <div className="bg-[#F5F1E5] p-4 rounded-xs border-2 border-[#D6553C]/30 text-xs font-mono-code text-[#47483C] leading-relaxed">
              <div className="font-bold text-[#D6553C] text-sm mb-1 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#D6553C] animate-pulse" />
                <span>Notice: We Are Completely Packed</span>
              </div>
              We are completely packed with clients right now. You are securely placed on our priority waitlist. We will reach out to you directly at <strong>{submittedBooking.phone}</strong> or <strong>{submittedBooking.email}</strong> as soon as we get an onboarding slot for your trade. You can also reach our dispatch team directly at <a href="mailto:ai.prajyot@gmail.com" className="underline font-bold text-[#171412] hover:text-[#D6553C]">ai.prajyot@gmail.com</a>.
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={handleCopyCode}
                className="flex-1 bg-[#E2DAC3] hover:bg-[#D4CBB0] text-[#171412] font-mono-code text-xs font-semibold py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer border border-[#B9B2A0]"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Ticket ID Copied' : `Copy Waitlist Ticket (${submittedBooking.id})`}</span>
              </button>

              <button
                type="button"
                onClick={() => setSubmittedBooking(null)}
                className="bg-[#DFD8C4] hover:bg-[#D4CBB0] text-[#47483C] hover:text-[#171412] font-mono-code text-xs py-3 px-4 rounded-xs transition-colors border border-[#B9B2A0] cursor-pointer"
              >
                Modify details / entry
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center font-mono-code text-xs text-[#6B6E5F] hover:text-[#171412] mt-2 underline cursor-pointer"
            >
              Done / Return to website
            </button>
          </div>
        ) : (
          /* Audit Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="inline-flex items-center gap-1.5 font-mono-code text-[11px] text-[#D6553C] bg-[#D6553C]/10 border border-[#D6553C]/30 px-2.5 py-1 rounded-xs mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6553C] animate-pulse" />
                <span className="font-semibold">LAUNCH OFFER • FREE 15-MIN CALL AUDIT</span>
              </div>
              <h3 className="font-display font-bold text-2xl sm:text-3xl text-[#171412] mb-1">
                Book your free 15-minute call audit
              </h3>
              <p className="text-xs font-mono-code text-[#6B6E5F]">
                No pitch deck. We isolate your line&apos;s unanswered calls and calculate recoverable revenue.
              </p>
            </div>

            {/* Plan selection badge pill */}
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                type="button"
                onClick={() => setPlanInterest('core')}
                className={`text-xs font-mono-code px-3 py-1 rounded-xs border cursor-pointer ${
                  planInterest === 'core'
                    ? 'bg-[#171412] text-white border-[#171412] font-semibold'
                    : 'bg-[#F5F1E5] text-[#4A4B42] border-[#B9B2A0]'
                }`}
              >
                Core Setup ($999)
              </button>
              <button
                type="button"
                onClick={() => setPlanInterest('blueprint')}
                className={`text-xs font-mono-code px-3 py-1 rounded-xs border cursor-pointer ${
                  planInterest === 'blueprint'
                    ? 'bg-[#171412] text-white border-[#171412] font-semibold'
                    : 'bg-[#F5F1E5] text-[#4A4B42] border-[#B9B2A0]'
                }`}
              >
                Blueprint ($499)
              </button>
              <button
                type="button"
                onClick={() => setPlanInterest('audit_only')}
                className={`text-xs font-mono-code px-3 py-1 rounded-xs border cursor-pointer ${
                  planInterest === 'audit_only'
                    ? 'bg-[#171412] text-white border-[#171412] font-semibold'
                    : 'bg-[#F5F1E5] text-[#4A4B42] border-[#B9B2A0]'
                }`}
              >
                Diagnostic Only (Free)
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marcus Vance"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-sm text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Company / Shop Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vance Heating & Air"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-sm text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Phone Number (to test SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="(555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-sm text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Work Email (for report) *
                </label>
                <input
                  type="email"
                  required
                  placeholder="owner@yourshop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-sm text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Trade Type
                </label>
                <select
                  value={tradeType}
                  onChange={(e) => setTradeType(e.target.value as TradeType)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-2.5 py-2 text-xs font-mono-code text-[#171412] focus:outline-none focus:border-[#D6553C]"
                >
                  <option value="Plumbing">Plumbing</option>
                  <option value="HVAC">HVAC</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Roofing">Roofing</option>
                  <option value="Restoration">Restoration</option>
                  <option value="Dental & Clinic">Clinic</option>
                  <option value="Other Trade">Other Trade</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Avg Ticket ($)
                </label>
                <input
                  type="number"
                  min="20"
                  value={avgJobValue}
                  onChange={(e) => setAvgJobValue(Number(e.target.value))}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-2.5 py-2 text-xs font-mono-code text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Missed / Wk
                </label>
                <input
                  type="number"
                  min="1"
                  value={missedCallsWeekly}
                  onChange={(e) => setMissedCallsWeekly(Number(e.target.value))}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-2.5 py-2 text-xs font-mono-code text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>
            </div>

            {/* Session Date & Slot Picker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Session Date *
                </label>
                <input
                  type="date"
                  required
                  min={getTodayDateString()}
                  value={scheduledDate}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-xs font-mono-code text-[#171412] focus:outline-none focus:border-[#D6553C]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                  Time Slot (15-Min Diagnostic) *
                </label>
                <select
                  value={scheduledTimeSlot}
                  onChange={(e) => setScheduledTimeSlot(e.target.value)}
                  className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-xs font-mono-code text-[#171412] focus:outline-none focus:border-[#D6553C]"
                >
                  <option value="08:30 AM">08:30 AM – 08:45 AM</option>
                  <option value="09:30 AM">09:30 AM – 09:45 AM</option>
                  <option value="11:00 AM">11:00 AM – 11:15 AM</option>
                  <option value="01:30 PM">01:30 PM – 01:45 PM</option>
                  <option value="03:00 PM">03:00 PM – 03:15 PM</option>
                  <option value="04:30 PM">04:30 PM – 04:45 PM</option>
                  <option value="06:00 PM">06:00 PM – 06:15 PM</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="submit-audit-btn"
                className="w-full bg-[#171412] hover:bg-[#2B2721] text-[#ECE6D6] font-mono-code text-sm font-semibold py-3.5 px-6 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <PhoneCall className="w-4 h-4 text-[#E7A335]" />
                <span>Register for Call Audit</span>
              </button>
            </div>

            <p className="text-[11px] font-mono-code text-[#787B6A] text-center pt-1">
              Zero spam guarantee. Questions or urgent inquiries? Direct email: <a href="mailto:ai.prajyot@gmail.com" className="underline font-semibold text-[#171412] hover:text-[#D6553C]">ai.prajyot@gmail.com</a>
            </p>
          </form>
        )}
      </motion.div>
    </motion.div>
  );
};
