import { AuditBooking } from '../types';

export interface CalendarEventDetails {
  start: Date;
  end: Date;
  title: string;
  description: string;
  location: string;
  formattedDate: string;
  formattedTime: string;
}

/**
 * Parses booking details into concrete Start and End Dates for the 15-min diagnostic call.
 */
export function getCalendarEventDetails(booking: AuditBooking): CalendarEventDetails {
  let start: Date;

  if (booking.scheduledDate && booking.scheduledTimeSlot) {
    // Parse date (YYYY-MM-DD) and time (e.g., "09:30 AM")
    const dateParts = booking.scheduledDate.split('-').map(Number);
    const timeMatch = booking.scheduledTimeSlot.match(/(\d+):(\d+)\s*(AM|PM)?/i);

    if (dateParts.length === 3 && timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const modifier = timeMatch[3]?.toUpperCase();

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      // Note: dateParts[1] is 1-indexed month
      start = new Date(dateParts[0], dateParts[1] - 1, dateParts[2], hours, minutes, 0);
    } else {
      start = getFallbackDate(booking.preferredTime);
    }
  } else {
    start = getFallbackDate(booking.preferredTime);
  }

  // 15-minute diagnostic audit duration
  const end = new Date(start.getTime() + 15 * 60 * 1000);

  const title = `ApexRing Inbound Call Audit — ${booking.companyName}`;
  const description = [
    `15-Minute Diagnostic Call Audit with ApexRing Engineering for ${booking.companyName}.`,
    '',
    `• Target Line: ${booking.phone}`,
    `• Contact: ${booking.fullName}`,
    `• Trade: ${booking.tradeType}`,
    `• Estimated Recoverable Revenue: $${Math.round(booking.avgJobValue * booking.missedCallsWeekly * 4.33 * 0.3).toLocaleString()} / month`,
    `• Ticket Reference ID: ${booking.id}`,
    '',
    'Agenda:',
    '1. Carrier call trace & missed-ring drop latency review',
    '2. 14-second SMS recovery sequence walkthrough',
    '3. Custom trade dispatch routing blueprint',
  ].join('\n');

  const location = `Phone Dispatch: ${booking.phone}`;

  const formattedDate = start.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedTime = `${start.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })} – ${end.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })}`;

  return {
    start,
    end,
    title,
    description,
    location,
    formattedDate,
    formattedTime,
  };
}

function getFallbackDate(preferredWindow?: string): Date {
  const d = new Date();
  // Schedule for next day
  d.setDate(d.getDate() + 1);
  // Default to 10:00 AM
  let hours = 10;
  if (preferredWindow?.includes('Morning')) hours = 9;
  if (preferredWindow?.includes('Midday')) hours = 12;
  if (preferredWindow?.includes('Afternoon')) hours = 14;
  if (preferredWindow?.includes('Evening')) hours = 17;

  d.setHours(hours, 0, 0, 0);
  return d;
}

function formatUtcIso(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

/**
 * Generates direct URL to Google Calendar event creation
 */
export function getGoogleCalendarUrl(details: CalendarEventDetails): string {
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: details.title,
    dates: `${formatUtcIso(details.start)}/${formatUtcIso(details.end)}`,
    details: details.description,
    location: details.location,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/**
 * Generates direct URL for Outlook Live / Office 365
 */
export function getOutlookCalendarUrl(details: CalendarEventDetails): string {
  const params = new URLSearchParams({
    path: '/calendar/action/compose',
    rru: 'addevent',
    subject: details.title,
    startdt: details.start.toISOString(),
    enddt: details.end.toISOString(),
    body: details.description,
    location: details.location,
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/**
 * Generates direct URL for Yahoo Calendar
 */
export function getYahooCalendarUrl(details: CalendarEventDetails): string {
  const params = new URLSearchParams({
    v: '60',
    title: details.title,
    st: formatUtcIso(details.start),
    et: formatUtcIso(details.end),
    desc: details.description,
    in_loc: details.location,
  });
  return `https://calendar.yahoo.com/?${params.toString()}`;
}

/**
 * Generates standard RFC 5545 compliant iCalendar (.ics) content
 */
export function generateIcsContent(booking: AuditBooking, details: CalendarEventDetails): string {
  const now = new Date();
  const uid = `${booking.id}-${Date.now()}@apexring.com`;

  // Escape special characters in text fields per RFC 5545
  const cleanSummary = details.title.replace(/[,;\\]/g, '\\$&');
  const cleanDescription = details.description
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n');
  const cleanLocation = details.location.replace(/[,;\\]/g, '\\$&');

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ApexRing Systems//Inbound Call Audit//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    'ORGANIZER;CN=ApexRing Dispatch:mailto:ai.prajyot@gmail.com',
    `DTSTAMP:${formatUtcIso(now)}`,
    `DTSTART:${formatUtcIso(details.start)}`,
    `DTEND:${formatUtcIso(details.end)}`,
    `SUMMARY:${cleanSummary}`,
    `DESCRIPTION:${cleanDescription}`,
    `LOCATION:${cleanLocation}`,
    'STATUS:CONFIRMED',
    'TRANSP:OPAQUE',
    'SEQUENCE:0',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Reminder: ApexRing Call Audit starting in 15 minutes',
    'TRIGGER:-PT15M',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ];

  return lines.join('\r\n');
}

/**
 * Initiates direct download of the compliant .ics file
 */
export function downloadIcsFile(booking: AuditBooking, details: CalendarEventDetails): void {
  const ics = generateIcsContent(booking, details);
  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `apexring-audit-${booking.id}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}
