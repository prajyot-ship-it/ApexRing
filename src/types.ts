export type TradeType = 
  | 'HVAC'
  | 'Plumbing'
  | 'Electrical'
  | 'Roofing'
  | 'Restoration'
  | 'Dental & Clinic'
  | 'Other Trade';

export type PlanType = 'blueprint' | 'core' | 'audit_only';

export type ClientStatus = 
  | 'new'
  | 'contacted'
  | 'audit_scheduled'
  | 'onboarding'
  | 'completed'
  | 'cancelled';

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
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  notes?: string;
  planInterest?: PlanType;
  planName?: string;
  planPrice?: string;
  status?: ClientStatus;
  tags?: string[];
  estMonthlyLoss?: number;
  notificationDispatched?: boolean;
  notificationTarget?: string;
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

export type UserRole = 'admin' | 'client' | 'visitor';

export interface UserAccount {
  id: string;
  email: string;
  fullName: string;
  companyName?: string;
  role: UserRole;
  tradeType?: TradeType;
  phone?: string;
  ticketId?: string;
  planInterest?: PlanType;
  createdAt: string;
  lastLoginAt: string;
  loginCount: number;
}

export interface ActivityLog {
  id: string;
  type: 'visit' | 'login' | 'signup' | 'calculator_use' | 'plan_click' | 'booking_submitted' | 'admin_action';
  description: string;
  userName?: string;
  userRole?: UserRole;
  timestamp: string;
  ipLocation?: string;
  device?: string;
}

export interface TrafficSource {
  source: string;
  visitors: number;
  percentage: number;
  color: string;
}

export interface VisitorAnalytics {
  totalPageViews: number;
  uniqueVisitors: number;
  totalLogins: number;
  registeredUsersCount: number;
  activeSessionsNow: number;
  calculatorEngagements: number;
  conversionRate: number; // percentage
  trafficSources: TrafficSource[];
  recentActivity: ActivityLog[];
  dailyVisits: { date: string; visitors: number; logins: number; signups: number }[];
  deviceBreakdown: { device: string; count: number; percentage: number }[];
  geoBreakdown: { region: string; visitors: number }[];
}

