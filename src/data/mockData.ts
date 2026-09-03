import { FaqItem, Testimonial, TradePreset, WorkedScenario } from '../types';

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

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    author: 'Dale MacIntyre',
    role: 'Owner & Master Tech',
    company: 'MacIntyre Heating & Cooling',
    trade: 'HVAC',
    location: 'Fort Collins, CO',
    fleet: '5 service vans',
    rating: 5,
    recoveredStats: {
      highlight: '+$5,800/mo',
      label: 'Average Recovered Revenue',
    },
    beforeAfter: {
      before: '22 missed calls sent to voicemail during peak summer rush',
      after: '16 confirmed jobs booked via 14-sec automatic text response',
    },
    quote:
      'We were spending $1,400 a month on Google Local Services Ads, but during peak July heat waves my guys and dispatchers just couldn’t catch every ring. ApexRing’s 14-second text-back caught 22 missed emergency calls in our very first month. 16 of them texted their address immediately instead of calling our competitor. That alone paid for the system ten times over.',
    verifiedPlan: 'Core Setup + Recovery Retainer',
    verifiedDate: 'Active Client · 14 Months',
  },
  {
    id: 'test-2',
    author: 'Travis Vance',
    role: 'Owner & Operator',
    company: 'BlueRidge Plumbing & Drain',
    trade: 'Plumbing',
    location: 'Asheville, NC',
    fleet: '3 vans / 4 techs',
    rating: 5,
    recoveredStats: {
      highlight: '4.8 jobs/wk',
      label: 'Rescued from Competitor Dialers',
    },
    beforeAfter: {
      before: 'Calling back 2 hours later to hear "Sorry, already found someone"',
      after: 'Immediate text grabs caller urgency & emergency photos instantly',
    },
    quote:
      'When you are under a crawlspace with greasy gloves, you literally cannot answer the phone. Voicemail used to mean a dead lead 90% of the time because homeowners in a leak emergency keep dialing down the Google search results. With ApexRing, the text fires while I’m still wiping off my hands. Customers even thank us for replying so fast.',
    verifiedPlan: 'Core Setup Client',
    verifiedDate: 'Active Client · 9 Months',
  },
  {
    id: 'test-3',
    author: 'Garrett Ross',
    role: 'Managing Partner',
    company: 'HighPoint Roofing & Restoration',
    trade: 'Roofing',
    location: 'Dallas-Fort Worth, TX',
    fleet: '4 field estimators',
    rating: 5,
    recoveredStats: {
      highlight: '+$28,400',
      label: 'High-Ticket Storm Season Bookings',
    },
    beforeAfter: {
      before: 'Hailstorm calls jamming lines after 5 PM went into voicemail void',
      after: 'Automated address capture scheduled 9 full insurance appraisals',
    },
    quote:
      'In storm restoration, if you don’t respond within two minutes, a door-knocker gets the contract. ApexRing captured 9 insurance roof appraisal bookings from calls that rolled over after 6 PM or on Saturday afternoons. Our average insurance ticket is $14,000+. That is revenue we would have permanently surrendered to competitors.',
    verifiedPlan: 'Core Setup + Recovery Retainer',
    verifiedDate: 'Active Client · 11 Months',
  },
  {
    id: 'test-4',
    author: 'Marcus Chen',
    role: 'Master Electrician & President',
    company: 'Chen Electric & Lighting',
    trade: 'Electrical',
    location: 'Phoenix, AZ',
    fleet: '6 licensed electricians',
    rating: 5,
    recoveredStats: {
      highlight: '91% Capture Rate',
      label: 'On After-Hours Commercial Calls',
    },
    beforeAfter: {
      before: 'Commercial facility managers hanging up on 3-ring voicemail',
      after: 'Smart triage asks if emergency outage or standard breaker panel project',
    },
    quote:
      'Our electricians are inside live main breaker panels and cannot touch a phone for safety reasons. ApexRing’s triage sequence asks whether it’s an urgent circuit loss or an EV charger estimate. By the time my technician walks back to his truck, the customer’s photos and service panel specs are already logged. Zero friction.',
    verifiedPlan: 'Core Setup Client',
    verifiedDate: 'Active Client · 7 Months',
  },
  {
    id: 'test-5',
    author: 'Sarah Lindqvist',
    role: 'Practice Operations Director',
    company: 'FrontRange Dental & Urgent Clinic',
    trade: 'Dental & Clinic',
    location: 'Denver, CO',
    fleet: '2 clinic locations',
    rating: 5,
    recoveredStats: {
      highlight: '19 Patients/mo',
      label: 'Emergency Intake Recoveries',
    },
    beforeAfter: {
      before: 'Front desk busy checking in patients while phone rolls over',
      after: 'Immediate reassurance text provides emergency intake link in 15s',
    },
    quote:
      'Our desk staff gets bottlenecked during morning check-ins and lines roll over. Patients with severe dental pain won’t leave a voicemail—they call the next clinic on Google Maps. ApexRing catches them with an immediate comforting text asking for their pain level and reserving a priority chair slot. It saved 19 emergency visits last month alone.',
    verifiedPlan: 'Core Setup Client',
    verifiedDate: 'Active Client · 8 Months',
  },
];
