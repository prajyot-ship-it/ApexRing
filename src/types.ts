export type TradeType = 
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Roofing'
  | 'Restoration'
  | 'Dental & Clinic'
  | 'Other Trade';

export interface TradePreset {
  type: TradeType;
  defaultJobValue: number;
  defaultMissedCalls: number;
  label: string;
}

export interface CalculatorState {
  jobValue: number;
  missedCalls: number;
  tradeType: TradeType;
  bookRate: number; // e.g. 0.30
}

export interface AuditBooking {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  companyName: string;
  tradeType: TradeType;
  avgJobValue: number;
  missedCallsWeekly: number;
  preferredTime: string;
  notes?: string;
  planInterest?: 'blueprint' | 'core' | 'audit_only';
  createdAt: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface WorkedScenario {
  title: string;
  trade: string;
  fleetSize: string;
  missedCallsWk: number;
  avgTicket: number;
  recoveredWk: string;
  estMonthlyRecovery: string;
  description: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: string;
  company: string;
  trade: TradeType;
  location: string;
  fleet: string;
  rating: number;
  recoveredStats: {
    highlight: string;
    label: string;
  };
  beforeAfter: {
    before: string;
    after: string;
  };
  quote: string;
  verifiedPlan: string;
  verifiedDate: string;
}
