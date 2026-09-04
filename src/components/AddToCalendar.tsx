import React, { useState } from 'react';
import { Calendar, Download, ExternalLink, Check, Clock, ChevronDown } from 'lucide-react';
import { AuditBooking } from '../types';
import {
  getCalendarEventDetails,
  getGoogleCalendarUrl,
  getOutlookCalendarUrl,
  getYahooCalendarUrl,
  downloadIcsFile,
} from '../utils/calendar';

interface AddToCalendarProps {
  booking: AuditBooking;
}

export const AddToCalendar: React.FC<AddToCalendarProps> = ({ booking }) => {
  const [downloadedIcs, setDownloadedIcs] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const eventDetails = getCalendarEventDetails(booking);
  const googleUrl = getGoogleCalendarUrl(eventDetails);
  const outlookUrl = getOutlookCalendarUrl(eventDetails);
  const yahooUrl = getYahooCalendarUrl(eventDetails);

  const handleDownloadIcs = () => {
    downloadIcsFile(booking, eventDetails);
    setDownloadedIcs(true);
    setTimeout(() => setDownloadedIcs(false), 3000);
  };

  return (
    <div className="bg-[#DFD8C4] border border-[#B9B2A0] rounded-xs p-4 sm:p-5 space-y-4 font-mono-code text-xs">
      {/* Scheduled Time Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#B9B2A0] pb-3">
        <div className="flex items-center gap-2 text-[#171412]">
          <Calendar className="w-4 h-4 text-[#D6553C] shrink-0" />
          <span className="font-bold text-sm tracking-tight">{eventDetails.formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[#5A5C4F]">
          <Clock className="w-3.5 h-3.5 text-[#E7A335]" />
          <span>{eventDetails.formattedTime} (15m)</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-[#5A5C4F] uppercase tracking-wider">
          Sync with your calendar:
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Google Calendar Direct Link */}
          <a
            href={googleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-[#171412] hover:bg-[#2A2621] text-[#ECE6D6] font-semibold py-2.5 px-3 rounded-xs transition-colors shadow-sm cursor-pointer"
          >
            {/* Google G icon representation */}
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
            </svg>
            <span>Google Calendar</span>
            <ExternalLink className="w-3 h-3 text-[#9A9D8F] ml-auto" />
          </a>

          {/* Apple Calendar / .ICS file */}
          <button
            type="button"
            onClick={handleDownloadIcs}
            className="flex items-center justify-center gap-2 bg-[#E9E3D3] hover:bg-[#DDD6C4] text-[#171412] border border-[#B9B2A0] font-semibold py-2.5 px-3 rounded-xs transition-colors cursor-pointer"
          >
            {downloadedIcs ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-700" />
                <span className="text-emerald-800">Downloaded (.ics)</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5 text-[#D6553C]" />
                <span>Apple / iCal (.ics)</span>
              </>
            )}
          </button>
        </div>

        {/* Secondary Options Dropdown (Outlook & Yahoo) */}
        <div className="pt-1">
          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between text-[11px] text-[#6B6E5F] hover:text-[#171412] py-1 transition-colors cursor-pointer"
          >
            <span>More calendar formats (Outlook, Yahoo)</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
          </button>

          {showDropdown && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 border-t border-[#C7C0AE]">
              <a
                href={outlookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#ECE6D6] hover:bg-[#E2DAC3] text-[#171412] px-3 py-2 rounded-xs border border-[#C7C0AE] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#0078D4]">O</span>
                  <span>Outlook.com / 365</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#8A8C7E]" />
              </a>

              <a
                href={yahooUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-[#ECE6D6] hover:bg-[#E2DAC3] text-[#171412] px-3 py-2 rounded-xs border border-[#C7C0AE] transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-[#6001D2]">Y!</span>
                  <span>Yahoo Calendar</span>
                </div>
                <ExternalLink className="w-3 h-3 text-[#8A8C7E]" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
