import { FaqItem, TradePreset, WorkedScenario } from '../types';

export const TRADE_PRESETS: TradePreset[] = [
  { type: 'Plumbing', defaultJobValue: 280, defaultMissedCalls: 9, label: 'Plumbing' },
  { type: 'HVAC', defaultJobValue: 340, defaultMissedCalls: 12, label: 'HVAC' },
  { type: 'Electrical', defaultJobValue: 260, defaultMissedCalls: 8, label: 'Electrical' },
  { type: 'Roofing', defaultJobValue: 1250, defaultMissedCalls: 6, label: 'Roofing' },
  { type: 'Restoration', defaultJobValue: 1800, defaultMissedCalls: 4, label: 'Restoration' },
  { type: 'Dental & Clinic', defaultJobValue: 220, defaultMissedCalls: 15, label: 'Clinic / Practice' },
];

export const WORKED_SCENARIOS: WorkedScenario[] = [
  {
    title: '4-truck HVAC company, mid-size metro',
    trade: 'HVAC',
    fleetSize: '4 trucks / 6 technicians',
    missedCallsWk: 18,
    avgTicket: 310,
    recoveredWk: '4–6 jobs',
    estMonthlyRecovery: '$2,100+',
    description:
      'Missing roughly 18 calls a week during peak summer AC season and winter furnace swaps, at an average ticket of $310. After Core setup, the automated text-back recovers 4–6 jobs weekly that would have bounced to the next Google result within 30 seconds.',
  },
  {
    trade: 'Plumbing',
    title: '2-van Residential Plumbing shop',
    fleetSize: '2 vans / owner + 2 apprentices',
    missedCallsWk: 11,
    avgTicket: 290,
    recoveredWk: '3–4 jobs',
    estMonthlyRecovery: '$1,580+',
    description:
      'Owner was fielding calls under kitchen sinks and constantly clicking ignore to stop ringing. Installing the instant 15-second text-back holds emergency drain clears and water heater diagnostics while the crew is actively on site.',
  },
  {
    trade: 'Roofing',
    title: 'Storm Restoration & Roofing Contractor',
    fleetSize: '3 estimators in field',
    missedCallsWk: 7,
    avgTicket: 1450,
    recoveredWk: '2–3 inspections',
    estMonthlyRecovery: '$4,350+',
    description:
      'High-ticket jobs are lost almost instantaneously after storms if the phone goes to voicemail. ApexRing text-back immediately logs the property address and schedules insurance appraisal slots before competitors even dial back.',
  },
];

export const FAQ_LIST: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Do I need a new phone number?',
    answer:
      'No. ApexRing wires directly into the phone number you already advertise — on your trucks, your Google Business Profile, yard signs, and website. Nothing changes for your customers or dispatchers.',
  },
  {
    id: 'faq-2',
    question: 'I already pay for an answering service. Does this replace it?',
    answer:
      'It works alongside it or replaces expensive per-minute answering services entirely. An answering service only helps when they pick up in time; ApexRing instantly catches everything that slips to voicemail after hours, during lunch, or when lines are jammed with simultaneous callers.',
  },
  {
    id: 'faq-3',
    question: 'Is this a call center with people answering my phone?',
    answer:
      'No. It is an automated, lightning-fast text-back and follow-up sequence written specifically in your authentic shop voice. You and your crew still speak with the customer once they confirm details — no robotic IVR or offshore reps giving wrong pricing.',
  },
  {
    id: 'faq-4',
    question: 'Does this work with our existing phone provider?',
    answer:
      'Yes. ApexRing integrates seamlessly with RingCentral, Dialpad, Vonage, Verizon Business, AT&T, T-Mobile, Nextiva, Google Voice, Grasshopper, and standard landline/carrier call forwarding.',
  },
  {
    id: 'faq-5',
    question: 'How fast can this actually be live on our line?',
    answer:
      'Blueprint: As soon as you watch the 45-minute walkthrough video, typically same-day. Core Setup: 3 to 5 business days from your 30-minute strategy session, as our team builds, tests, and verifies the custom sequences on your actual numbers.',
  },
  {
    id: 'faq-6',
    question: 'Can I cancel the recovery retainer at any time?',
    answer:
      'Yes, anytime, with zero lock-in or penalties. The scripts and text-back sequences stay yours and remain fully operational. The monthly retainer simply covers ongoing script optimization, carrier uptime monitoring, seasonal price updates, and your weekly revenue recovery report.',
  },
];
