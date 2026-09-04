import { AuditBooking, PlanType, ClientStatus, TradeType } from '../types';
import * as XLSX from 'xlsx';

export const FIRESTORE_COLLECTION = 'client_registrations';
const LOCAL_STORAGE_KEY = 'apexring_firestore_clients_v2';

export function getPlanDetails(planId?: PlanType) {
  switch (planId) {
    case 'core':
      return {
        id: 'core' as PlanType,
        name: 'Core Setup (Done-With-You)',
        price: '$1,497',
        badgeColor: 'bg-[#E7A335] text-[#171412] border-[#E7A335]',
        badgeSubtle: 'bg-[#E7A335]/15 text-[#E7A335] border-[#E7A335]/30',
        description: 'Complete carrier rollover routing & after-hours bridge for live field techs',
      };
    case 'blueprint':
      return {
        id: 'blueprint' as PlanType,
        name: 'The Blueprint',
        price: '$397',
        badgeColor: 'bg-sky-500 text-white border-sky-500',
        badgeSubtle: 'bg-sky-500/15 text-sky-400 border-sky-500/30',
        description: 'Self-implemented carrier routing diagrams, sequence templates, and IVR logic',
      };
    case 'audit_only':
    default:
      return {
        id: 'audit_only' as PlanType,
        name: '15-Min Free Call Audit',
        price: '$0 Free',
        badgeColor: 'bg-emerald-500 text-white border-emerald-500',
        badgeSubtle: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
        description: 'Diagnostic line isolation & live revenue recovery audit',
      };
  }
}

export function getStatusDetails(status: ClientStatus = 'new') {
  switch (status) {
    case 'new':
      return {
        label: 'New Signup',
        color: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
        dotColor: 'bg-amber-400',
      };
    case 'contacted':
      return {
        label: 'Contacted',
        color: 'bg-blue-500/20 text-blue-300 border-blue-500/40',
        dotColor: 'bg-blue-400',
      };
    case 'audit_scheduled':
      return {
        label: 'Audit Scheduled',
        color: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
        dotColor: 'bg-purple-400',
      };
    case 'onboarding':
      return {
        label: 'Onboarding Setup',
        color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
        dotColor: 'bg-indigo-400',
      };
    case 'completed':
      return {
        label: 'Active Client',
        color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
        dotColor: 'bg-emerald-400',
      };
    case 'cancelled':
      return {
        label: 'Closed / Ineligible',
        color: 'bg-stone-500/20 text-stone-300 border-stone-500/40',
        dotColor: 'bg-stone-400',
      };
  }
}

const INITIAL_SEED_CLIENTS: AuditBooking[] = [];

/**
 * Fetch all registered clients from Backend Server / Firestore
 */
export async function fetchClientsFromFirestore(): Promise<AuditBooking[]> {
  try {
    const res = await fetch('/api/registrations');
    if (res.ok) {
      const data = await res.json();
      if (data.clients && Array.isArray(data.clients)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data.clients));
        return data.clients;
      }
    }
  } catch (err) {
    console.warn('Backend /api/registrations unavailable, using local cache:', err);
  }

  // Fallback to local cache
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
      return [];
    }
    const parsed: AuditBooking[] = JSON.parse(raw);
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Save new registered client to Backend and Firestore
 */
export async function saveClientToFirestore(client: AuditBooking): Promise<AuditBooking> {
  const planInfo = getPlanDetails(client.planInterest);
  const enrichedClient: AuditBooking = {
    ...client,
    planInterest: client.planInterest || 'core',
    planName: client.planName || planInfo.name,
    planPrice: client.planPrice || planInfo.price,
    status: client.status || 'new',
    estMonthlyLoss: client.estMonthlyLoss || Math.round(client.avgJobValue * client.missedCallsWeekly * 4.33 * 0.4),
    notificationDispatched: true,
    notificationTarget: 'ai.prajyot@gmail.com',
    createdAt: client.createdAt || new Date().toISOString(),
  };

  // Sync with Express backend
  try {
    const res = await fetch('/api/registrations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(enrichedClient),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.client) {
        // Also update local storage
        const existing = await fetchClientsFromFirestore();
        const filtered = existing.filter((c) => c.id !== data.client.id);
        const updated = [data.client, ...filtered];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        return data.client;
      }
    }
  } catch (err) {
    console.warn('Direct backend registration post failed, caching locally:', err);
  }

  // Local fallback
  try {
    const existing = await fetchClientsFromFirestore();
    const filtered = existing.filter((c) => c.id !== enrichedClient.id);
    const updated = [enrichedClient, ...filtered];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    return enrichedClient;
  } catch (err) {
    console.error('Error saving client to local cache:', err);
    return enrichedClient;
  }
}

/**
 * Update client status in Backend and Firestore
 */
export async function updateClientStatusInFirestore(
  id: string,
  newStatus: ClientStatus
): Promise<AuditBooking[]> {
  try {
    await fetch(`/api/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
  } catch (err) {
    console.warn('Backend patch failed:', err);
  }

  const list = await fetchClientsFromFirestore();
  const updated = list.map((client) => {
    if (client.id === id) {
      return { ...client, status: newStatus };
    }
    return client;
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Update client notes in Backend and Firestore
 */
export async function updateClientNotesInFirestore(
  id: string,
  newNotes: string
): Promise<AuditBooking[]> {
  try {
    await fetch(`/api/registrations/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ notes: newNotes }),
    });
  } catch (err) {
    console.warn('Backend patch notes failed:', err);
  }

  const list = await fetchClientsFromFirestore();
  const updated = list.map((client) => {
    if (client.id === id) {
      return { ...client, notes: newNotes };
    }
    return client;
  });
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Delete a client record from Backend and Firestore
 */
export async function deleteClientFromFirestore(id: string): Promise<AuditBooking[]> {
  try {
    await fetch(`/api/registrations/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Backend delete failed:', err);
  }

  const list = await fetchClientsFromFirestore();
  const updated = list.filter((client) => client.id !== id);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

/**
 * Subscribe to real-time events via Server-Sent Events (SSE)
 */
export function subscribeToRealtimeEvents(onEvent: (type: string, data: any) => void): () => void {
  if (typeof window === 'undefined' || !window.EventSource) {
    return () => {};
  }

  const eventSource = new EventSource('/api/events');

  eventSource.addEventListener('connected', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent('connected', data);
    } catch {}
  });

  eventSource.addEventListener('new_registration', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent('new_registration', data);
    } catch {}
  });

  eventSource.addEventListener('update_registration', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent('update_registration', data);
    } catch {}
  });

  eventSource.addEventListener('delete_registration', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent('delete_registration', data);
    } catch {}
  });

  eventSource.addEventListener('new_activity', (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data);
      onEvent('new_activity', data);
    } catch {}
  });

  eventSource.onerror = () => {
    // SSE disconnected, EventSource will automatically retry
  };

  return () => {
    eventSource.close();
  };
}

/**
 * Export clients to Excel Sheet (.xlsx)
 */
export function exportClientsToExcel(clients: AuditBooking[], filename = 'ApexRing_Registered_Clients.xlsx') {
  const formattedData = clients.map((c, index) => {
    const plan = getPlanDetails(c.planInterest);
    const status = getStatusDetails(c.status);
    return {
      '#': index + 1,
      'Ticket ID': c.id,
      'Registered Plan': `${plan.name} (${plan.price})`,
      'Plan Type': c.planInterest || 'core',
      'Client Name': c.fullName,
      'Company Name': c.companyName,
      'Trade / Industry': c.tradeType,
      'Phone Number': c.phone,
      'Email Address': c.email,
      'Status': status.label,
      'Scheduled Date': c.scheduledDate || c.preferredTime,
      'Scheduled Time': c.scheduledTimeSlot || '',
      'Missed Calls / Wk': c.missedCallsWeekly,
      'Avg Job Value ($)': c.avgJobValue,
      'Est. Monthly Loss ($)': c.estMonthlyLoss || Math.round(c.avgJobValue * c.missedCallsWeekly * 4.33 * 0.4),
      'Notes & Setup Details': c.notes || '',
      'Tags': (c.tags || []).join(', '),
      'Registered Date (UTC)': c.createdAt,
      'Notification Dispatched': c.notificationDispatched ? 'Yes' : 'No',
      'Notification Target': c.notificationTarget || 'ai.prajyot@gmail.com',
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  worksheet['!cols'] = [
    { wch: 4 },
    { wch: 12 },
    { wch: 32 },
    { wch: 12 },
    { wch: 22 },
    { wch: 28 },
    { wch: 16 },
    { wch: 16 },
    { wch: 28 },
    { wch: 18 },
    { wch: 16 },
    { wch: 14 },
    { wch: 16 },
    { wch: 16 },
    { wch: 20 },
    { wch: 40 },
    { wch: 22 },
    { wch: 24 },
    { wch: 20 },
    { wch: 28 },
  ];

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registered Clients');
  XLSX.writeFile(workbook, filename);
}

/**
 * Export clients to SQL Script (.sql)
 */
export function exportClientsToSql(clients: AuditBooking[], filename = 'ApexRing_Clients_Dump.sql') {
  let sql = `-- ApexRing Production Firestore Clients Dump\n`;
  sql += `-- Generated: ${new Date().toISOString()}\n`;
  sql += `-- Notification Target: ai.prajyot@gmail.com\n\n`;

  sql += `CREATE TABLE IF NOT EXISTS firestore_client_registrations (\n`;
  sql += `  id VARCHAR(32) PRIMARY KEY,\n`;
  sql += `  full_name VARCHAR(128) NOT NULL,\n`;
  sql += `  company_name VARCHAR(128) NOT NULL,\n`;
  sql += `  trade_type VARCHAR(64) NOT NULL,\n`;
  sql += `  phone VARCHAR(32) NOT NULL,\n`;
  sql += `  email VARCHAR(128) NOT NULL,\n`;
  sql += `  plan_interest VARCHAR(32) NOT NULL,\n`;
  sql += `  plan_name VARCHAR(64) NOT NULL,\n`;
  sql += `  plan_price VARCHAR(32) NOT NULL,\n`;
  sql += `  status VARCHAR(32) DEFAULT 'new',\n`;
  sql += `  avg_job_value INT DEFAULT 0,\n`;
  sql += `  missed_calls_weekly INT DEFAULT 0,\n`;
  sql += `  est_monthly_loss INT DEFAULT 0,\n`;
  sql += `  scheduled_date VARCHAR(32),\n`;
  sql += `  scheduled_time_slot VARCHAR(32),\n`;
  sql += `  notes TEXT,\n`;
  sql += `  created_at VARCHAR(64) NOT NULL,\n`;
  sql += `  notification_target VARCHAR(128) DEFAULT 'ai.prajyot@gmail.com'\n`;
  sql += `);\n\n`;

  for (const c of clients) {
    const plan = getPlanDetails(c.planInterest);
    const escape = (val: unknown) => {
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return val;
      return `'${String(val).replace(/'/g, "''")}'`;
    };

    sql += `INSERT INTO firestore_client_registrations (id, full_name, company_name, trade_type, phone, email, plan_interest, plan_name, plan_price, status, avg_job_value, missed_calls_weekly, est_monthly_loss, scheduled_date, scheduled_time_slot, notes, created_at, notification_target) VALUES (${escape(c.id)}, ${escape(c.fullName)}, ${escape(c.companyName)}, ${escape(c.tradeType)}, ${escape(c.phone)}, ${escape(c.email)}, ${escape(c.planInterest || 'core')}, ${escape(plan.name)}, ${escape(plan.price)}, ${escape(c.status || 'new')}, ${c.avgJobValue || 0}, ${c.missedCallsWeekly || 0}, ${c.estMonthlyLoss || 0}, ${escape(c.scheduledDate || '')}, ${escape(c.scheduledTimeSlot || '')}, ${escape(c.notes || '')}, ${escape(c.createdAt || new Date().toISOString())}, ${escape(c.notificationTarget || 'ai.prajyot@gmail.com')});\n`;
  }

  const blob = new Blob([sql], { type: 'application/sql' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Export clients to JSON
 */
export function exportClientsToJson(clients: AuditBooking[], filename = 'ApexRing_Clients.json') {
  const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(clients, null, 2))}`;
  const a = document.createElement('a');
  a.href = jsonString;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Clear all clients from Firestore and local storage
 */
export async function clearAllClientsFromFirestore(): Promise<void> {
  try {
    await fetch('/api/registrations/clear', { method: 'POST' });
  } catch (err) {
    console.warn('Could not call /api/registrations/clear:', err);
  }
  localStorage.removeItem(LOCAL_STORAGE_KEY);
}

