import { ActivityLog, TrafficSource, VisitorAnalytics } from '../types';

const ANALYTICS_STORAGE_KEY = 'apexring_visitor_analytics_v2';
const VISITOR_ID_KEY = 'apexring_unique_visitor_id';

/**
 * Detect real device type from user agent and screen
 */
export function getRealDeviceType(): 'Desktop' | 'Mobile' | 'Tablet' {
  if (typeof window === 'undefined') return 'Desktop';
  const ua = navigator.userAgent || '';
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return 'Tablet';
  }
  if (/Mobile|iP(hone|od)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(ua)) {
    return 'Mobile';
  }
  return 'Desktop';
}

/**
 * Detect real browser name
 */
export function getRealBrowser(): string {
  if (typeof window === 'undefined') return 'Browser';
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg/')) return 'Microsoft Edge';
  if (ua.includes('Chrome')) return 'Chrome';
  if (ua.includes('Safari')) return 'Safari';
  return 'Web Browser';
}

/**
 * Detect real traffic source from document.referrer
 */
export function getRealReferrerSource(): string {
  if (typeof window === 'undefined') return 'Direct / Bookmark';
  const ref = document.referrer;
  if (!ref) return 'Direct / Bookmark';

  try {
    const url = new URL(ref);
    if (url.hostname.includes('google.')) return 'Google Search';
    if (url.hostname.includes('bing.') || url.hostname.includes('duckduckgo.')) return 'Organic Search';
    if (url.hostname.includes('facebook.') || url.hostname.includes('instagram.') || url.hostname.includes('t.co') || url.hostname.includes('linkedin.')) {
      return 'Social Media';
    }
    if (url.hostname === window.location.hostname) return 'Direct / Internal Navigation';
    return `Referral (${url.hostname})`;
  } catch {
    return 'External Referral';
  }
}

/**
 * Get real location / timezone descriptor
 */
export function getRealRegion(): string {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      const parts = tz.split('/');
      const city = parts[parts.length - 1]?.replace(/_/g, ' ') || tz;
      return `${city} (${tz})`;
    }
  } catch {}
  return 'Local Client Session';
}

/**
 * Get or initialize visitor ID
 */
export function getOrCreateVisitorId(): { id: string; isNew: boolean } {
  try {
    let visitorId = localStorage.getItem(VISITOR_ID_KEY);
    if (!visitorId) {
      visitorId = `vst_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem(VISITOR_ID_KEY, visitorId);
      return { id: visitorId, isNew: true };
    }
    return { id: visitorId, isNew: false };
  } catch {
    return { id: 'vst_anon', isNew: false };
  }
}

/**
 * Get all analytics data (synced with backend)
 */
export function getVisitorAnalytics(): VisitorAnalytics {
  try {
    const raw = localStorage.getItem(ANALYTICS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return parsed;
    }
  } catch {}

  const device = getRealDeviceType();
  const region = getRealRegion();
  const source = getRealReferrerSource();

  const initial: VisitorAnalytics = {
    totalPageViews: 1,
    uniqueVisitors: 1,
    totalLogins: 0,
    registeredUsersCount: 0,
    activeSessionsNow: 1,
    calculatorEngagements: 0,
    conversionRate: 0,
    trafficSources: [
      { source, visitors: 1, percentage: 100, color: '#E7A335' },
    ],
    recentActivity: [
      {
        id: `act-${Date.now()}`,
        type: 'visit',
        description: `Active visitor connected from ${region} on ${device} ${getRealBrowser()}`,
        timestamp: new Date().toISOString(),
        ipLocation: region,
        device,
      },
    ],
    dailyVisits: [
      { date: 'Today', visitors: 1, logins: 0, signups: 0 },
    ],
    deviceBreakdown: [
      { device: `${device} (Current Device)`, count: 1, percentage: 100 },
    ],
    geoBreakdown: [
      { region, visitors: 1 },
    ],
  };

  try {
    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(initial));
  } catch {}

  return initial;
}

/**
 * Record a page visit on site load & sync with server
 */
export async function recordSiteVisit(): Promise<VisitorAnalytics> {
  const { id: visitorId, isNew } = getOrCreateVisitorId();
  const device = getRealDeviceType();
  const browser = getRealBrowser();
  const region = getRealRegion();
  const referrer = getRealReferrerSource();

  try {
    const res = await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        isNewVisitor: isNew,
        device,
        region,
        referrer,
        actionType: 'visit',
        description: `Live visitor joined site from ${region} using ${device} ${browser}`,
      }),
    });

    if (res.ok) {
      const serverAnalyticsRes = await fetch('/api/analytics');
      if (serverAnalyticsRes.ok) {
        const serverData = await serverAnalyticsRes.json();
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(serverData));
        return serverData;
      }
    }
  } catch (err) {
    console.warn('Could not sync analytics with backend, updating local state:', err);
  }

  // Local fallback
  const analytics = getVisitorAnalytics();
  analytics.totalPageViews += 1;
  if (isNew) analytics.uniqueVisitors += 1;
  localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));
  return analytics;
}

/**
 * Log custom interaction event (e.g. calculator used, plan clicked, login)
 */
export async function logActivity(event: {
  type: ActivityLog['type'];
  description: string;
  userName?: string;
  userRole?: 'admin' | 'client' | 'visitor';
}): Promise<void> {
  const { id: visitorId } = getOrCreateVisitorId();
  const device = getRealDeviceType();
  const region = getRealRegion();

  const newLog: ActivityLog = {
    id: `act-${Date.now()}`,
    type: event.type,
    description: event.description,
    userName: event.userName,
    userRole: event.userRole,
    timestamp: new Date().toISOString(),
    ipLocation: region,
    device,
  };

  try {
    const analytics = getVisitorAnalytics();
    analytics.recentActivity = [newLog, ...(analytics.recentActivity || [])].slice(0, 60);

    if (event.type === 'login') {
      analytics.totalLogins += 1;
    } else if (event.type === 'calculator_use') {
      analytics.calculatorEngagements += 1;
    } else if (event.type === 'signup' || event.type === 'booking_submitted') {
      analytics.registeredUsersCount += 1;
    }

    if (analytics.uniqueVisitors > 0) {
      analytics.conversionRate = Number(
        ((analytics.registeredUsersCount / analytics.uniqueVisitors) * 100).toFixed(1)
      );
    }

    localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics));

    // Send to server
    await fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        visitorId,
        device,
        region,
        actionType: event.type,
        description: event.description,
        userName: event.userName,
        userRole: event.userRole,
      }),
    });
  } catch (err) {
    console.warn('Failed to log activity event to backend:', err);
  }
}

/**
 * Reset all analytics data to zero
 */
export async function resetAnalyticsData(): Promise<VisitorAnalytics> {
  try {
    await fetch('/api/analytics/clear', { method: 'POST' });
  } catch {}
  localStorage.removeItem(ANALYTICS_STORAGE_KEY);
  return getVisitorAnalytics();
}
