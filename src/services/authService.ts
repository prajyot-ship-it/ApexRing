import { UserAccount, PlanType, TradeType } from '../types';
import { logActivity } from './analyticsService';

const USERS_STORAGE_KEY = 'apexring_auth_users_v2';
const CURRENT_USER_KEY = 'apexring_auth_current_user_v2';

const PRE_SEEDED_USERS: UserAccount[] = [
  {
    id: 'usr-admin-prajyot',
    email: 'ai.prajyot@gmail.com',
    fullName: 'Prajyot (Admin Dispatch)',
    companyName: 'ApexRing Systems LLC',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 1,
  },
  {
    id: 'usr-admin-01',
    email: 'admin@apexring.com',
    fullName: 'Chief Dispatch Admin',
    companyName: 'ApexRing Systems LLC',
    role: 'admin',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 1,
  },
];

/**
 * Fetch all registered users
 */
export function getAllUsers(): UserAccount[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(PRE_SEEDED_USERS));
      return PRE_SEEDED_USERS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to get auth users:', err);
    return PRE_SEEDED_USERS;
  }
}

/**
 * Get the currently logged in user session
 */
export function getCurrentUser(): UserAccount | null {
  try {
    const raw = localStorage.getItem(CURRENT_USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

/**
 * Log in a user by email and optional password
 */
export function loginUser(email: string, password?: string): { success: boolean; user?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  
  if (!cleanEmail) {
    return { success: false, error: 'Please enter a valid email address.' };
  }

  const isAdminEmail = cleanEmail === 'ai.prajyot@gmail.com' || cleanEmail === 'admin@apexring.com';

  // Strict password validation for admin accounts
  if (isAdminEmail) {
    if (!password || password.trim() !== 'prajyot1908') {
      return {
        success: false,
        error: 'Invalid administrator credentials. Access denied.',
      };
    }
  }

  const users = getAllUsers();
  let user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    if (isAdminEmail) {
      user = {
        id: `usr-admin-${Date.now().toString().slice(-4)}`,
        email: cleanEmail,
        fullName: cleanEmail === 'ai.prajyot@gmail.com' ? 'Prajyot (Admin Dispatch)' : 'Chief Dispatch Admin',
        companyName: 'ApexRing Systems LLC',
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
      };
    } else {
      user = {
        id: `usr-${Date.now().toString().slice(-6)}`,
        email: cleanEmail,
        fullName: cleanEmail.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        companyName: 'Field Service Contractor',
        role: 'client',
        tradeType: 'HVAC',
        planInterest: 'core',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        loginCount: 1,
      };
    }
    users.push(user);
  } else {
    if (isAdminEmail) {
      user.role = 'admin';
    }
    user.lastLoginAt = new Date().toISOString();
    user.loginCount = (user.loginCount || 0) + 1;
  }

  // Save updated user list and session
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));

  // Log analytics activity
  logActivity({
    type: 'login',
    description: `User "${user.fullName}" (${user.role}) logged in to the dashboard`,
    userName: user.fullName,
    userRole: user.role,
  });

  return { success: true, user };
}

/**
 * Sign up a new contractor account
 */
export function signupUser(params: {
  fullName: string;
  email: string;
  companyName: string;
  tradeType: TradeType;
  phone?: string;
  planInterest?: PlanType;
}): { success: boolean; user: UserAccount } {
  const users = getAllUsers();
  const cleanEmail = params.email.trim().toLowerCase();

  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    existing.fullName = params.fullName;
    existing.companyName = params.companyName;
    existing.tradeType = params.tradeType;
    existing.phone = params.phone || existing.phone;
    existing.planInterest = params.planInterest || existing.planInterest;
    existing.lastLoginAt = new Date().toISOString();
    existing.loginCount += 1;

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(existing));

    logActivity({
      type: 'login',
      description: `Existing user "${existing.fullName}" logged in via signup form`,
      userName: existing.fullName,
      userRole: existing.role,
    });

    return { success: true, user: existing };
  }

  const newUser: UserAccount = {
    id: `usr-${Date.now().toString().slice(-6)}`,
    email: cleanEmail,
    fullName: params.fullName,
    companyName: params.companyName,
    role: 'client',
    tradeType: params.tradeType,
    phone: params.phone,
    planInterest: params.planInterest || 'core',
    ticketId: `AR-${Math.floor(1000 + Math.random() * 9000)}`,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    loginCount: 1,
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));

  logActivity({
    type: 'signup',
    description: `New contractor "${newUser.fullName}" (${newUser.companyName} - ${newUser.tradeType}) created an account for [${newUser.planInterest}]`,
    userName: newUser.fullName,
    userRole: newUser.role,
  });

  return { success: true, user: newUser };
}

/**
 * Log out the current user session
 */
export function logoutUser(): void {
  const current = getCurrentUser();
  if (current) {
    logActivity({
      type: 'visit',
      description: `User "${current.fullName}" logged out`,
      userName: current.fullName,
      userRole: current.role,
    });
  }
  localStorage.removeItem(CURRENT_USER_KEY);
}

/**
 * Link a booking ticket to user account
 */
export function linkBookingToUser(ticketId: string, email: string): void {
  const users = getAllUsers();
  const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    user.ticketId = ticketId;
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    
    const current = getCurrentUser();
    if (current && current.email.toLowerCase() === email.toLowerCase()) {
      current.ticketId = ticketId;
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(current));
    }
  }
}
