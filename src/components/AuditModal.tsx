import React, { useState } from 'react';
import { X, PhoneCall, CheckCircle2, Calendar, FileText, Download, Copy, Check } from 'lucide-react';
import { AuditBooking, CalculatorState, TradeType } from '../types';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
  calculatorState: CalculatorState;
  initialPlan?: 'blueprint' | 'core' | 'audit_only';
}

export const AuditModal: React.FC<AuditModalProps> = ({
  isOpen,
  onClose,
  calculatorState,
  initialPlan = 'core',
}) => {
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tradeType, setTradeType] = useState<TradeType>(calculatorState.tradeType || 'Plumbing');
  const [missedCallsWeekly, setMissedCallsWeekly] = useState(calculatorState.missedCalls || 9);
  const [avgJobValue, setAvgJobValue] = useState(calculatorState.jobValue || 280);
  const [preferredTime, setPreferredTime] = useState('Morning (8:00 AM – 11:00 AM)');
  const [notes, setNotes] = useState('');
  const [planInterest, setPlanInterest] = useState<'blueprint' | 'core' | 'audit_only'>(initialPlan);

  const [submittedBooking, setSubmittedBooking] = useState<AuditBooking | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !email || !companyName) return;

    const booking: AuditBooking = {
      id: 'AR-' + Math.floor(1000 + Math.random() * 9000),
      fullName,
      companyName,
      phone,
      email,
      tradeType,
      avgJobValue,
      missedCallsWeekly,
      preferredTime,
      notes,
      planInterest,
      createdAt: new Date().toISOString(),
    };

    setSubmittedBooking(booking);

    // Persist to localStorage for user review
    try {
      const existing = JSON.parse(localStorage.getItem('apexring_bookings') || '[]');
      existing.unshift(booking);
      localStorage.setItem('apexring_bookings', JSON.stringify(existing));
    } catch {
      // ignore
    }
  };

  const handleCopyCode = () => {
    if (!submittedBooking) return;
    navigator.clipboard.writeText(submittedBooking.id);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadIcs = () => {
    if (!submittedBooking) return;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ApexRing//Call Audit Session//EN',
      'BEGIN:VEVENT',
      `UID:${submittedBooking.id}@apexring.com`,
      `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      `SUMMARY:ApexRing Inbound Call Audit - ${submittedBooking.companyName}`,
      `DESCRIPTION:15-minute diagnostic call audit session with ApexRing technician for ${submittedBooking.companyName}. Reviewing missed call logs and recovery sequence.`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `apexring-audit-${submittedBooking.id}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const estMonthlyRecovery = Math.round(avgJobValue * missedCallsWeekly * 4.33 * 0.3);

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
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
          <span>APEXRING • DISPATCH AUDIT REGISTRY</span>
          <span>ENTRY FORM</span>
        </div>

        {submittedBooking ? (
          /* Confirmation State Ticket */
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="font-display font-bold text-3xl text-[#171412] mb-1">
                Call Audit Confirmed
              </h3>
              <p className="font-mono-code text-xs text-[#6B6E5F]">
                Reference ID: <strong className="text-[#171412] text-sm">{submittedBooking.id}</strong>
              </p>
            </div>

            <div className="bg-[#DFD8C4] p-4 sm:p-5 rounded-xs space-y-3 font-mono-code text-xs text-[#2E2F27]">
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
                <span className="text-[#6B6E5F]">Preferred Time:</span>
                <span>{submittedBooking.preferredTime}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-[#6B6E5F]">Est. Monthly Recovery:</span>
                <span className="font-bold text-[#D6553C] text-sm">
                  ${estMonthlyRecovery.toLocaleString()} / mo
                </span>
              </div>
            </div>

            <div className="bg-[#F5F1E5] p-4 rounded-xs border border-[#B9B2A0] text-xs font-mono-code text-[#47483C] leading-relaxed">
              <strong>What happens next:</strong> Our dispatch engineer is analyzing local call benchmark
              data for your area. We will text a calendar invite to <strong>{submittedBooking.phone}</strong>{' '}
              and email a 30-day preliminary report to <strong>{submittedBooking.email}</strong>.
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleDownloadIcs}
                className="flex-1 bg-[#171412] hover:bg-[#2B2721] text-[#ECE6D6] font-mono-code text-xs font-semibold py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#E7A335]" />
                <span>Add to calendar (.ics)</span>
              </button>
              <button
                type="button"
                onClick={handleCopyCode}
                className="bg-[#E2DAC3] hover:bg-[#D4CBB0] text-[#171412] font-mono-code text-xs font-semibold py-3 px-4 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                {copiedCode ? <Check className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCode ? 'Copied ID' : 'Copy Ticket ID'}</span>
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="w-full text-center font-mono-code text-xs text-[#6B6E5F] hover:text-[#171412] mt-2 underline"
            >
              Done / Return to website
            </button>
          </div>
        ) : (
          /* Audit Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
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

            <div>
              <label className="block text-xs font-mono-code text-[#47483C] mb-1 font-medium">
                Preferred Call Window
              </label>
              <select
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full bg-[#F5F1E5] border border-[#B9B2A0] rounded-xs px-3 py-2 text-xs font-mono-code text-[#171412] focus:outline-none focus:border-[#D6553C]"
              >
                <option value="Morning (8:00 AM – 11:00 AM)">Morning (8:00 AM – 11:00 AM)</option>
                <option value="Midday (11:00 AM – 2:00 PM)">Midday (11:00 AM – 2:00 PM)</option>
                <option value="Afternoon (2:00 PM – 5:00 PM)">Afternoon (2:00 PM – 5:00 PM)</option>
                <option value="Evening (5:00 PM – 7:00 PM)">Evening (5:00 PM – 7:00 PM)</option>
              </select>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                id="submit-audit-btn"
                className="w-full bg-[#171412] hover:bg-[#2B2721] text-[#ECE6D6] font-mono-code text-sm font-semibold py-3.5 px-6 rounded-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <PhoneCall className="w-4 h-4 text-[#E7A335]" />
                <span>Confirm Call Audit Slot</span>
              </button>
            </div>

            <p className="text-[11px] font-mono-code text-[#787B6A] text-center pt-1">
              Zero spam guarantee. Your carrier records are strictly analyzed for missed call recovery.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
