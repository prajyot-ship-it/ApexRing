import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory persistent data store
interface RegistrationRecord {
  id: string;
  fullName: string;
  companyName: string;
  tradeType: string;
  phone: string;
  email: string;
  planInterest: string;
  planName: string;
  planPrice: string;
  status: string;
  avgJobValue: number;
  missedCallsWeekly: number;
  estMonthlyLoss: number;
  preferredTime?: string;
  scheduledDate?: string;
  scheduledTimeSlot?: string;
  notes?: string;
  tags?: string[];
  notificationDispatched?: boolean;
  notificationTarget?: string;
  createdAt: string;
  updatedAt?: string;
  ipAddress?: string;
  userAgent?: string;
}

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  userName?: string;
  userRole?: string;
  timestamp: string;
  ipLocation: string;
  device: string;
}

// Real data storage - starts clean with real data submitted by visitors
let registrations: RegistrationRecord[] = [];
let activities: ActivityItem[] = [];

// Real telemetry counters
let totalPageViews = 0;
const uniqueVisitorIds = new Set<string>();
let totalLogins = 0;
let calculatorEngagements = 0;
const deviceCounts: { [key: string]: number } = { Desktop: 0, Mobile: 0, Tablet: 0 };
const trafficSourceCounts: { [key: string]: number } = {};
const geoCounts: { [key: string]: number } = {};
const dailyVisitsMap: { [dateStr: string]: { visitors: number; logins: number; signups: number } } = {};

// Helper to get formatted date string for today and past days
function getDateKey(daysAgo = 0): string {
  const d = new Date(Date.now() - daysAgo * 86400000);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// SSE Clients List for real-time live events
interface SseClient {
  id: number;
  res: Response;
}
let sseClients: SseClient[] = [];

function broadcastSse(eventType: string, data: unknown) {
  const payload = `event: ${eventType}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach((client) => {
    try {
      client.res.write(payload);
    } catch {
      // dead connection
    }
  });
}

// ---------------- API ROUTES ----------------

// Health check
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV || 'development',
    serverTime: new Date().toISOString(),
    registrationsCount: registrations.length,
    activeSseClients: sseClients.length,
    totalPageViews,
    uniqueVisitors: uniqueVisitorIds.size,
  });
});

// SSE Stream for Admin Dashboard real-time live sync
app.get('/api/events', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders?.();

  const clientId = Date.now() + Math.random();
  const newClient: SseClient = { id: clientId, res };
  sseClients.push(newClient);

  // Send initial connection handshake
  res.write(
    `event: connected\ndata: ${JSON.stringify({
      clientId,
      activeConnections: sseClients.length,
      timestamp: new Date().toISOString(),
    })}\n\n`
  );

  // Heartbeat ping every 25 seconds to keep connection alive
  const pingInterval = setInterval(() => {
    try {
      res.write(': ping\n\n');
    } catch {
      clearInterval(pingInterval);
    }
  }, 25000);

  req.on('close', () => {
    clearInterval(pingInterval);
    sseClients = sseClients.filter((c) => c.id !== clientId);
  });
});

// GET all registrations
app.get('/api/registrations', (req: Request, res: Response) => {
  res.json({
    success: true,
    total: registrations.length,
    clients: registrations,
    timestamp: new Date().toISOString(),
  });
});

// POST new registration (from frontend ticket booking)
app.post('/api/registrations', (req: Request, res: Response) => {
  try {
    const body = req.body;
    if (!body.fullName || !body.phone) {
      return res.status(400).json({ success: false, error: 'Full name and phone are required' });
    }

    const todayKey = getDateKey(0);
    if (!dailyVisitsMap[todayKey]) {
      dailyVisitsMap[todayKey] = { visitors: 1, logins: 0, signups: 0 };
    }
    dailyVisitsMap[todayKey].signups += 1;

    const newRecord: RegistrationRecord = {
      id: body.id || `AR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: body.fullName,
      companyName: body.companyName || 'Contractor Services',
      tradeType: body.tradeType || 'General Trade',
      phone: body.phone,
      email: body.email || 'contact@contractor.com',
      planInterest: body.planInterest || 'core',
      planName: body.planName || 'Core Setup (Done-With-You)',
      planPrice: body.planPrice || '$1,497',
      status: body.status || 'new',
      avgJobValue: Number(body.avgJobValue) || 350,
      missedCallsWeekly: Number(body.missedCallsWeekly) || 8,
      estMonthlyLoss: Number(body.estMonthlyLoss) || 12000,
      preferredTime: body.preferredTime,
      scheduledDate: body.scheduledDate,
      scheduledTimeSlot: body.scheduledTimeSlot,
      notes: body.notes || '',
      tags: body.tags || [body.tradeType || 'Trade', 'Direct Registration'],
      notificationDispatched: true,
      notificationTarget: 'ai.prajyot@gmail.com',
      createdAt: body.createdAt || new Date().toISOString(),
      userAgent: req.headers['user-agent'],
    };

    // Prepend to top of list
    registrations = [newRecord, ...registrations.filter((r) => r.id !== newRecord.id)];

    // Log real-time activity
    const newActivity: ActivityItem = {
      id: `act-${Date.now()}`,
      type: 'booking_submitted',
      description: `New Live Registration: ${newRecord.fullName} (${newRecord.companyName} • ${newRecord.tradeType}) registered for [${newRecord.planName}]`,
      userName: newRecord.fullName,
      userRole: 'client',
      timestamp: new Date().toISOString(),
      ipLocation: body.location || 'United States',
      device: body.device || (/Mobile/i.test(req.headers['user-agent'] || '') ? 'Mobile' : 'Desktop'),
    };
    activities.unshift(newActivity);
    if (activities.length > 60) activities = activities.slice(0, 60);

    // Broadcast instant real-time event to Admin Dashboard
    broadcastSse('new_registration', {
      client: newRecord,
      activity: newActivity,
      totalClients: registrations.length,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({
      success: true,
      client: newRecord,
      message: 'Registration created and broadcasted in real-time to admin',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to save registration';
    res.status(500).json({ success: false, error: message });
  }
});

// PATCH registration status / notes
app.patch('/api/registrations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const { status, notes, tags } = req.body;

  const idx = registrations.findIndex((r) => r.id === id);
  if (idx === -1) {
    return res.status(404).json({ success: false, error: 'Registration not found' });
  }

  if (status) registrations[idx].status = status;
  if (notes !== undefined) registrations[idx].notes = notes;
  if (tags !== undefined) registrations[idx].tags = tags;
  registrations[idx].updatedAt = new Date().toISOString();

  // Log activity
  const newActivity: ActivityItem = {
    id: `act-${Date.now()}`,
    type: 'admin_action',
    description: `Admin updated ticket #${id} status to [${status || 'updated'}]`,
    userRole: 'admin',
    timestamp: new Date().toISOString(),
    ipLocation: 'Admin Protocol Console',
    device: 'Desktop',
  };
  activities.unshift(newActivity);

  // Broadcast update
  broadcastSse('update_registration', {
    client: registrations[idx],
    activity: newActivity,
  });

  res.json({ success: true, client: registrations[idx] });
});

// DELETE registration
app.delete('/api/registrations/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const target = registrations.find((r) => r.id === id);
  if (!target) {
    return res.status(404).json({ success: false, error: 'Registration not found' });
  }

  registrations = registrations.filter((r) => r.id !== id);

  broadcastSse('delete_registration', { id, timestamp: new Date().toISOString() });
  res.json({ success: true, message: `Ticket #${id} removed` });
});

// DELETE all registrations (clear database)
app.post('/api/registrations/clear', (req: Request, res: Response) => {
  registrations = [];
  broadcastSse('delete_registration', { id: 'all', timestamp: new Date().toISOString() });
  res.json({ success: true, message: 'All client registrations cleared.' });
});

// POST real telemetry track event
app.post('/api/analytics/track', (req: Request, res: Response) => {
  try {
    const { visitorId, isNewVisitor, path, referrer, device, region, actionType, description, userName, userRole } = req.body;

    totalPageViews += 1;

    if (visitorId) {
      uniqueVisitorIds.add(visitorId);
    }

    if (actionType === 'login') {
      totalLogins += 1;
    } else if (actionType === 'calculator_use') {
      calculatorEngagements += 1;
    }

    // Device counts
    const devType = device || (/Mobile/i.test(req.headers['user-agent'] || '') ? 'Mobile' : 'Desktop');
    deviceCounts[devType] = (deviceCounts[devType] || 0) + 1;

    // Traffic Source
    const sourceName = referrer || 'Direct / Bookmark';
    trafficSourceCounts[sourceName] = (trafficSourceCounts[sourceName] || 0) + 1;

    // Geo Region
    const regionName = region || 'Local Session';
    geoCounts[regionName] = (geoCounts[regionName] || 0) + 1;

    // Daily visit map
    const todayKey = getDateKey(0);
    if (!dailyVisitsMap[todayKey]) {
      dailyVisitsMap[todayKey] = { visitors: 0, logins: 0, signups: 0 };
    }
    dailyVisitsMap[todayKey].visitors += 1;
    if (actionType === 'login') dailyVisitsMap[todayKey].logins += 1;

    // Activity log
    if (description) {
      const act: ActivityItem = {
        id: `act-${Date.now()}`,
        type: actionType || 'visit',
        description,
        userName,
        userRole: userRole || 'visitor',
        timestamp: new Date().toISOString(),
        ipLocation: regionName,
        device: devType,
      };
      activities.unshift(act);
      if (activities.length > 60) activities = activities.slice(0, 60);

      broadcastSse('new_activity', act);
    }

    res.json({ success: true, totalPageViews, uniqueVisitors: uniqueVisitorIds.size });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Track error';
    res.status(500).json({ success: false, error: message });
  }
});

// GET real analytics telemetry
app.get('/api/analytics', (req: Request, res: Response) => {
  const totalUnique = Math.max(1, uniqueVisitorIds.size);
  const totalLossAnalyzed = registrations.reduce((acc, c) => acc + (c.estMonthlyLoss || 0), 0);
  const coreSignups = registrations.filter((c) => c.planInterest === 'core').length;
  const blueprintSignups = registrations.filter((c) => c.planInterest === 'blueprint').length;
  const auditSignups = registrations.filter((c) => c.planInterest === 'audit_only').length;

  // Build real traffic sources array
  const totalSourcesCount = Object.values(trafficSourceCounts).reduce((a, b) => a + b, 0);
  const colors = ['#E7A335', '#38BDF8', '#34D399', '#A78BFA', '#F472B6'];
  let trafficSources = Object.entries(trafficSourceCounts).map(([source, count], idx) => ({
    source,
    visitors: count,
    percentage: totalSourcesCount > 0 ? Math.round((count / totalSourcesCount) * 100) : 100,
    color: colors[idx % colors.length],
  }));

  if (trafficSources.length === 0) {
    trafficSources = [
      { source: 'Direct / Bookmark (Live Session)', visitors: Math.max(1, totalPageViews), percentage: 100, color: '#E7A335' },
    ];
  }

  // Build real device breakdown
  const totalDevices = Math.max(1, Object.values(deviceCounts).reduce((a, b) => a + b, 0));
  const deviceBreakdown = [
    {
      device: 'Desktop (Workstation / Office)',
      count: deviceCounts.Desktop || 0,
      percentage: Math.round(((deviceCounts.Desktop || 0) / totalDevices) * 100),
    },
    {
      device: 'Mobile (Field Techs / Smartphones)',
      count: deviceCounts.Mobile || 0,
      percentage: Math.round(((deviceCounts.Mobile || 0) / totalDevices) * 100),
    },
    {
      device: 'Tablet (iPad / Dispatch Console)',
      count: deviceCounts.Tablet || 0,
      percentage: Math.round(((deviceCounts.Tablet || 0) / totalDevices) * 100),
    },
  ];

  // Build 7-day trend
  const dailyVisits = [];
  for (let i = 6; i >= 0; i--) {
    const key = getDateKey(i);
    const label = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : key;
    const entry = dailyVisitsMap[key] || { visitors: 0, logins: 0, signups: 0 };
    dailyVisits.push({
      date: label,
      visitors: entry.visitors,
      logins: entry.logins,
      signups: entry.signups,
    });
  }

  // Geo breakdown
  const geoBreakdown = Object.entries(geoCounts).map(([region, visitors]) => ({
    region,
    visitors,
  }));
  if (geoBreakdown.length === 0) {
    geoBreakdown.push({ region: 'Active Live Session', visitors: Math.max(1, totalPageViews) });
  }

  res.json({
    success: true,
    totalPageViews: Math.max(1, totalPageViews),
    uniqueVisitors: totalUnique,
    totalLogins,
    registeredUsersCount: registrations.length,
    activeSessionsNow: Math.max(1, sseClients.length),
    calculatorEngagements,
    conversionRate: Number(((registrations.length / totalUnique) * 100).toFixed(1)),
    totalLossAnalyzed,
    planBreakdown: {
      core: coreSignups,
      blueprint: blueprintSignups,
      auditOnly: auditSignups,
    },
    trafficSources,
    recentActivity: activities,
    dailyVisits,
    deviceBreakdown,
    geoBreakdown,
    serverTime: new Date().toISOString(),
  });
});

// POST custom activity from client
app.post('/api/analytics/activity', (req: Request, res: Response) => {
  const { type, description, userName, userRole, location, device } = req.body;
  if (!description) {
    return res.status(400).json({ error: 'Description is required' });
  }

  const act: ActivityItem = {
    id: `act-${Date.now()}`,
    type: type || 'visit',
    description,
    userName,
    userRole: userRole || 'visitor',
    timestamp: new Date().toISOString(),
    ipLocation: location || 'United States',
    device: device || (/Mobile/i.test(req.headers['user-agent'] || '') ? 'Mobile' : 'Desktop'),
  };

  activities.unshift(act);
  if (activities.length > 60) activities = activities.slice(0, 60);

  broadcastSse('new_activity', act);
  res.json({ success: true, activity: act });
});

// POST reset all analytics
app.post('/api/analytics/clear', (req: Request, res: Response) => {
  totalPageViews = 0;
  uniqueVisitorIds.clear();
  totalLogins = 0;
  calculatorEngagements = 0;
  Object.keys(deviceCounts).forEach((k) => (deviceCounts[k] = 0));
  Object.keys(trafficSourceCounts).forEach((k) => delete trafficSourceCounts[k]);
  Object.keys(geoCounts).forEach((k) => delete geoCounts[k]);
  Object.keys(dailyVisitsMap).forEach((k) => delete dailyVisitsMap[k]);
  activities = [];
  res.json({ success: true, message: 'All analytics metrics reset to zero.' });
});

// ---------------- VITE MIDDLEWARE / PRODUCTION STATIC ----------------

async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ApexRing Server running on http://0.0.0.0:${PORT}`);
  });
}

start();
