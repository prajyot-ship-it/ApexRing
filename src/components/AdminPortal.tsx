import React, { useState, useEffect, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Plus,
  RefreshCw,
  X,
  Phone,
  Mail,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Edit3,
  Trash2,
  Copy,
  Check,
  Lock,
  Eye,
  Key,
  Flame,
  Zap,
  Activity,
  Globe,
  Smartphone,
  Tablet,
  Laptop,
  BarChart3,
  UserCheck,
  Compass,
  Radio,
  LogOut,
} from 'lucide-react';
import { AuditBooking, PlanType, ClientStatus, TradeType, VisitorAnalytics, UserAccount } from '../types';
import {
  fetchClientsFromFirestore,
  saveClientToFirestore,
  updateClientStatusInFirestore,
  updateClientNotesInFirestore,
  deleteClientFromFirestore,
  exportClientsToExcel,
  exportClientsToSql,
  exportClientsToJson,
  getPlanDetails,
  getStatusDetails,
  subscribeToRealtimeEvents,
  FIRESTORE_COLLECTION,
} from '../services/firestoreService';
import { getVisitorAnalytics, logActivity, resetAnalyticsData } from '../services/analyticsService';
import { getAllUsers, getCurrentUser, loginUser, logoutUser } from '../services/authService';

interface AdminPortalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onAdminAuthenticated?: (user: UserAccount) => void;
  onLogout?: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ 
  isOpen, 
  onClose,
  currentUser: propCurrentUser,
  onAdminAuthenticated,
  onLogout,
}) => {
  const [localAdminUser, setLocalAdminUser] = useState<UserAccount | null>(() => getCurrentUser());
  const effectiveUser = propCurrentUser || localAdminUser;
  const isAdminAuthenticated = effectiveUser?.role === 'admin';

  // Admin Login Gate State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  const [activeTab, setActiveTab] = useState<'clients' | 'traffic' | 'accounts'>('traffic');
  const [clients, setClients] = useState<AuditBooking[]>([]);
  const [analytics, setAnalytics] = useState<VisitorAnalytics>(getVisitorAnalytics());
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<PlanType | 'all'>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [selectedTradeFilter, setSelectedTradeFilter] = useState<TradeType | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'loss_high' | 'job_value'>('newest');

  // Detail Modal State
  const [selectedClient, setSelectedClient] = useState<AuditBooking | null>(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [copiedId, setCopiedId] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  // Add Client Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newClientForm, setNewClientForm] = useState<{
    fullName: string;
    companyName: string;
    tradeType: TradeType;
    phone: string;
    email: string;
    planInterest: PlanType;
    missedCallsWeekly: number;
    avgJobValue: number;
    scheduledDate: string;
    scheduledTimeSlot: string;
    notes: string;
  }>({
    fullName: '',
    companyName: '',
    tradeType: 'HVAC',
    phone: '',
    email: '',
    planInterest: 'core',
    missedCallsWeekly: 8,
    avgJobValue: 350,
    scheduledDate: new Date().toISOString().split('T')[0],
    scheduledTimeSlot: '10:00 AM',
    notes: '',
  });

  // Real-time live status and ticker
  const [isRealtimeLive, setIsRealtimeLive] = useState(false);
  const [liveLeadTicker, setLiveLeadTicker] = useState<{ id: string; text: string; time: string } | null>(null);

  // Success toast message
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const data = await fetchClientsFromFirestore();
      setClients(data);
      setAnalytics(getVisitorAnalytics());
      setUsersList(getAllUsers());
    } catch (err) {
      console.error('Error loading Firestore clients:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !isAdminAuthenticated) return;

    loadData();

    // Connect to real-time events stream from backend
    const unsubscribe = subscribeToRealtimeEvents((type, data) => {
      setIsRealtimeLive(true);
      if (type === 'new_registration' && data.client) {
        setClients((prev) => {
          const exists = prev.some((c) => c.id === data.client.id);
          if (exists) return prev;
          return [data.client, ...prev];
        });
        showNotice(`⚡ REAL-TIME: New client lead #${data.client.id} - ${data.client.fullName} (${data.client.companyName}) registered for [${data.client.planName}]!`);
        setLiveLeadTicker({
          id: data.client.id,
          text: `LIVE LEAD: ${data.client.fullName} (${data.client.companyName}) registered for [${data.client.planName}]`,
          time: new Date().toLocaleTimeString(),
        });
        setAnalytics(getVisitorAnalytics());
      } else if (type === 'update_registration' && data.client) {
        setClients((prev) =>
          prev.map((c) => (c.id === data.client.id ? data.client : c))
        );
      } else if (type === 'delete_registration' && data.id) {
        setClients((prev) => prev.filter((c) => c.id !== data.id));
      } else if (type === 'new_activity' && data) {
        setAnalytics((prev) => ({
          ...prev,
          recentActivity: [data, ...(prev.recentActivity || [])].slice(0, 50),
        }));
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isOpen, isAdminAuthenticated]);

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail) {
      setAuthError('Please enter administrator email');
      return;
    }

    setIsVerifying(true);
    setAuthError('');

    setTimeout(() => {
      const res = loginUser(adminEmail, adminPassword);
      setIsVerifying(false);
      if (res.success && res.user && res.user.role === 'admin') {
        setLocalAdminUser(res.user);
        onAdminAuthenticated?.(res.user);
        setAdminPassword('');
        setAuthError('');
      } else {
        setAuthError(res.error || 'Access Denied: Invalid administrator credentials.');
      }
    }, 300);
  };

  const handleAdminLogout = () => {
    logoutUser();
    setLocalAdminUser(null);
    onLogout?.();
  };

  // Sync state if selectedClient changes
  useEffect(() => {
    if (selectedClient) {
      setEditingNotes(selectedClient.notes || '');
    }
  }, [selectedClient]);

  // Filter and Sort Clients
  const filteredClients = useMemo(() => {
    return clients
      .filter((c) => {
        const matchesPlan =
          selectedPlanFilter === 'all' || (c.planInterest || 'core') === selectedPlanFilter;
        const matchesStatus =
          selectedStatusFilter === 'all' || (c.status || 'new') === selectedStatusFilter;
        const matchesTrade =
          selectedTradeFilter === 'all' || c.tradeType === selectedTradeFilter;

        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          !q ||
          c.fullName.toLowerCase().includes(q) ||
          c.companyName.toLowerCase().includes(q) ||
          c.tradeType.toLowerCase().includes(q) ||
          c.phone.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          (c.notes && c.notes.toLowerCase().includes(q));

        return matchesPlan && matchesStatus && matchesTrade && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortBy === 'loss_high') {
          const lossA = a.estMonthlyLoss || a.avgJobValue * a.missedCallsWeekly * 4.33 * 0.4;
          const lossB = b.estMonthlyLoss || b.avgJobValue * b.missedCallsWeekly * 4.33 * 0.4;
          return lossB - lossA;
        }
        if (sortBy === 'job_value') {
          return (b.avgJobValue || 0) - (a.avgJobValue || 0);
        }
        return 0;
      });
  }, [clients, selectedPlanFilter, selectedStatusFilter, selectedTradeFilter, searchQuery, sortBy]);

  // Calculations for KPI Cards
  const stats = useMemo(() => {
    const total = clients.length;
    const coreClients = clients.filter((c) => (c.planInterest || 'core') === 'core');
    const blueprintClients = clients.filter((c) => c.planInterest === 'blueprint');
    const auditOnlyClients = clients.filter((c) => c.planInterest === 'audit_only');

    const totalPipelineLoss = clients.reduce((sum, c) => {
      const loss = c.estMonthlyLoss || Math.round(c.avgJobValue * c.missedCallsWeekly * 4.33 * 0.4);
      return sum + loss;
    }, 0);

    const projectedRevenue = coreClients.length * 1497 + blueprintClients.length * 397;

    const newSignups = clients.filter((c) => (c.status || 'new') === 'new').length;
    const scheduled = clients.filter((c) => c.status === 'audit_scheduled').length;
    const onboarding = clients.filter((c) => c.status === 'onboarding').length;
    const active = clients.filter((c) => c.status === 'completed').length;

    return {
      total,
      coreCount: coreClients.length,
      blueprintCount: blueprintClients.length,
      auditOnlyCount: auditOnlyClients.length,
      totalPipelineLoss,
      projectedRevenue,
      newSignups,
      scheduled,
      onboarding,
      active,
    };
  }, [clients]);

  // Handle status update
  const handleStatusChange = async (id: string, newStatus: ClientStatus) => {
    const updated = await updateClientStatusInFirestore(id, newStatus);
    setClients(updated);
    if (selectedClient && selectedClient.id === id) {
      setSelectedClient({ ...selectedClient, status: newStatus });
    }
    showNotice(`Updated ${id} status to "${getStatusDetails(newStatus).label}"`);
  };

  // Handle notes save
  const handleSaveNotes = async () => {
    if (!selectedClient) return;
    const updated = await updateClientNotesInFirestore(selectedClient.id, editingNotes);
    setClients(updated);
    setSelectedClient({ ...selectedClient, notes: editingNotes });
    showNotice(`Saved notes for client ${selectedClient.id}`);
  };

  // Handle delete client
  const handleDeleteClient = async (id: string) => {
    if (window.confirm(`Are you sure you want to delete registration ticket ${id}?`)) {
      const updated = await deleteClientFromFirestore(id);
      setClients(updated);
      if (selectedClient && selectedClient.id === id) {
        setSelectedClient(null);
      }
      showNotice(`Removed ticket ${id} from Firestore`);
    }
  };

  // Handle Add New Client
  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClientForm.fullName || !newClientForm.phone || !newClientForm.email) {
      alert('Please fill out Name, Phone, and Email');
      return;
    }

    const plan = getPlanDetails(newClientForm.planInterest);
    const estMonthlyLoss = Math.round(
      newClientForm.avgJobValue * newClientForm.missedCallsWeekly * 4.33 * 0.4
    );

    const newBooking: AuditBooking = {
      id: `AR-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: newClientForm.fullName,
      companyName: newClientForm.companyName || 'Independent Shop',
      tradeType: newClientForm.tradeType,
      phone: newClientForm.phone,
      email: newClientForm.email,
      planInterest: newClientForm.planInterest,
      planName: plan.name,
      planPrice: plan.price,
      status: 'new',
      avgJobValue: Number(newClientForm.avgJobValue),
      missedCallsWeekly: Number(newClientForm.missedCallsWeekly),
      estMonthlyLoss,
      preferredTime: `${newClientForm.scheduledDate} at ${newClientForm.scheduledTimeSlot}`,
      scheduledDate: newClientForm.scheduledDate,
      scheduledTimeSlot: newClientForm.scheduledTimeSlot,
      notes: newClientForm.notes,
      tags: ['Admin Intake'],
      notificationDispatched: true,
      notificationTarget: 'ai.prajyot@gmail.com',
      createdAt: new Date().toISOString(),
    };

    const created = await saveClientToFirestore(newBooking);
    setClients((prev) => [created, ...prev]);
    setIsAddModalOpen(false);
    showNotice(`Created new client registration ticket #${created.id} for [${plan.name}]`);
    setNewClientForm({
      fullName: '',
      companyName: '',
      tradeType: 'HVAC',
      phone: '',
      email: '',
      planInterest: 'core',
      missedCallsWeekly: 8,
      avgJobValue: 350,
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: '10:00 AM',
      notes: '',
    });
  };

  const handleCopyReport = (client: AuditBooking) => {
    const plan = getPlanDetails(client.planInterest);
    const text = `
=========================================
APEXRING CLIENT REGISTRATION SUMMARY
=========================================
Ticket ID: #${client.id}
Client: ${client.fullName}
Company: ${client.companyName}
Trade: ${client.tradeType}
Phone: ${client.phone}
Email: ${client.email}
-----------------------------------------
Selected Plan: ${plan.name} (${plan.price})
Status: ${getStatusDetails(client.status).label}
Scheduled Call: ${client.scheduledDate || client.preferredTime} (${client.scheduledTimeSlot || 'Pending'})
-----------------------------------------
Missed Calls/Wk: ${client.missedCallsWeekly}
Average Ticket: $${client.avgJobValue}
Est. Monthly Revenue Loss: $${(client.estMonthlyLoss || 0).toLocaleString()}/mo
Notes: ${client.notes || 'None'}
Registered At: ${new Date(client.createdAt).toLocaleString()}
Notification Target: ai.prajyot@gmail.com
=========================================
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  if (!isOpen) return null;

  if (!isAdminAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md text-[#ECE6D6] flex items-center justify-center p-4 font-sans selection:bg-[#E7A335] selection:text-[#171412]">
        <div className="relative w-full max-w-md bg-[#1A1C1D] border border-[#F3EFE4]/20 rounded-xs shadow-2xl overflow-hidden flex flex-col">
          {/* Header */}
          <div className="bg-[#222527] px-6 py-4 border-b border-[#F3EFE4]/15 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xs bg-[#E7A335]/20 border border-[#E7A335]/40 flex items-center justify-center text-[#E7A335]">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg text-[#F3EFE4]">
                  Administrator Console
                </h2>
                <p className="text-[11px] font-mono-code text-[#9A9D8F]">
                  Restricted operational access
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[#9A9D8F] hover:text-[#F3EFE4] border border-[#F3EFE4]/20 rounded-xs transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 space-y-4 font-mono-code text-xs">
            <p className="text-[#9A9D8F] leading-relaxed">
              This console contains sensitive telemetry, client registries, and routing controls. Please authenticate with administrator credentials.
            </p>

            {authError && (
              <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-2.5 rounded-xs text-[11px]">
                {authError}
              </div>
            )}

            <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
              <div>
                <label className="text-[#ECE6D6] font-bold block mb-1">
                  Administrator Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2.5 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="text-[#ECE6D6] font-bold block mb-1">
                  Administrator Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2.5 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="flex-1 bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-bold py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isVerifying ? 'Authenticating...' : 'Unlock Console'}</span>
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="bg-[#242728] hover:bg-[#303436] text-[#ECE6D6] border border-[#F3EFE4]/20 px-4 py-2.5 rounded-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#121415] text-[#ECE6D6] flex flex-col overflow-hidden font-sans selection:bg-[#E7A335] selection:text-[#171412]">
      {/* Top Admin Header */}
      <header className="bg-[#1A1C1D] border-b border-[#F3EFE4]/15 px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xs bg-[#E7A335]/20 border border-[#E7A335]/40 flex items-center justify-center text-[#E7A335]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display font-bold text-lg sm:text-xl text-[#F3EFE4]">
                Firestore Client Registry & Signups
              </h1>
              <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded-xs flex items-center gap-1 font-semibold ${
                isRealtimeLive
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-[#E7A335]/20 text-[#E7A335] border border-[#E7A335]/40'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRealtimeLive ? 'bg-emerald-400 animate-pulse' : 'bg-[#E7A335]'}`} />
                {isRealtimeLive ? 'REAL-TIME LIVE SYNC' : 'BACKEND SYNC ACTIVE'}
              </span>
            </div>
            <div className="text-xs font-mono-code text-[#9A9D8F] flex flex-wrap items-center gap-2 mt-0.5">
              <span>Collection: <strong className="text-[#ECE6D6]">{FIRESTORE_COLLECTION}</strong></span>
              <span>•</span>
              <span>Live Leads: <strong className="text-[#E7A335]">{clients.length} Registered</strong></span>
              <span>•</span>
              <span>Session: <strong className="text-emerald-400">Authenticated Administrator</strong></span>
            </div>
          </div>
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code text-xs font-bold px-3.5 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Client Lead</span>
          </button>

          <button
            type="button"
            onClick={() => exportClientsToExcel(clients)}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-mono-code text-xs font-semibold px-3 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            title="Download formatted Excel Spreadsheet"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span className="hidden sm:inline">Excel (.xlsx)</span>
          </button>

          <button
            type="button"
            onClick={() => exportClientsToSql(clients)}
            className="bg-[#242728] hover:bg-[#303436] text-[#ECE6D6] border border-[#F3EFE4]/20 font-mono-code text-xs font-semibold px-3 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download SQL Database Table Dump"
          >
            <Download className="w-4 h-4 text-[#E7A335]" />
            <span className="hidden sm:inline">SQL (.sql)</span>
          </button>

          <button
            type="button"
            onClick={loadData}
            disabled={isLoading}
            className="p-2 text-[#9A9D8F] hover:text-[#F3EFE4] bg-[#242728] border border-[#F3EFE4]/15 rounded-xs transition-colors cursor-pointer"
            title="Refresh database"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#E7A335]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleAdminLogout}
            className="bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 font-mono-code text-xs font-semibold px-3 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Sign out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="bg-[#242728] hover:bg-[#303436] text-[#ECE6D6] border border-[#F3EFE4]/20 font-mono-code text-xs font-semibold px-3.5 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </header>

      {/* Action Notification Toast */}
      {actionNotice && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/40 text-emerald-200 px-6 py-2 text-xs font-mono-code flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Admin Module Navigation Tabs */}
      <div className="bg-[#17191A] border-b border-[#F3EFE4]/15 px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-mono-code">
          <button
            type="button"
            onClick={() => setActiveTab('traffic')}
            className={`px-3.5 py-1.5 rounded-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'traffic'
                ? 'bg-[#E7A335] text-[#171412] shadow-sm'
                : 'bg-[#222527] text-[#9A9D8F] hover:text-[#ECE6D6] border border-[#F3EFE4]/10'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Website Traffic & Visitors</span>
            <span className="bg-black/25 px-1.5 py-0.5 rounded-xs text-[10px]">
              {analytics.uniqueVisitors} visitors
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" title="Live active sessions" />
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('clients')}
            className={`px-3.5 py-1.5 rounded-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'clients'
                ? 'bg-[#E7A335] text-[#171412] shadow-sm'
                : 'bg-[#222527] text-[#9A9D8F] hover:text-[#ECE6D6] border border-[#F3EFE4]/10'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Client Registrations & Leads</span>
            <span className="bg-black/25 px-1.5 py-0.5 rounded-xs text-[10px]">
              {clients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('accounts')}
            className={`px-3.5 py-1.5 rounded-xs font-bold transition-colors flex items-center gap-2 cursor-pointer ${
              activeTab === 'accounts'
                ? 'bg-[#E7A335] text-[#171412] shadow-sm'
                : 'bg-[#222527] text-[#9A9D8F] hover:text-[#ECE6D6] border border-[#F3EFE4]/10'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>User Accounts & Logins</span>
            <span className="bg-black/25 px-1.5 py-0.5 rounded-xs text-[10px]">
              {usersList.length}
            </span>
          </button>
        </div>

        <div className="hidden sm:flex items-center gap-3 text-xs font-mono-code text-[#9A9D8F]">
          <div className="flex items-center gap-1.5 bg-[#222527] border border-emerald-500/30 px-2.5 py-1 rounded-xs text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-bold">{analytics.activeSessionsNow} Active Live Sessions</span>
          </div>
        </div>
      </div>

      {/* Live Lead Real-time Broadcast Ticker */}
      {liveLeadTicker && (
        <div className="bg-[#E7A335]/15 border-b border-[#E7A335]/35 px-4 sm:px-6 py-2 text-xs font-mono-code text-[#E7A335] flex items-center justify-between gap-3 animate-in fade-in duration-200 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="w-2 h-2 rounded-full bg-[#E7A335] animate-ping" />
            <span className="font-bold bg-[#E7A335] text-[#171412] px-2 py-0.5 rounded-xs text-[10px]">
              REAL-TIME DISPATCH
            </span>
            <span className="truncate font-semibold text-[#F3EFE4]">{liveLeadTicker.text}</span>
          </div>
          <span className="text-[11px] text-[#9A9D8F] shrink-0 font-mono-code">
            {liveLeadTicker.time}
          </span>
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {activeTab === 'clients' && (
        <div className="space-y-6">
        {/* KPI Metric Overview Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Total Registered Clients */}
          <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs">
            <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
              <span>Total Signups</span>
              <Users className="w-4 h-4 text-[#E7A335]" />
            </div>
            <div className="font-display font-bold text-3xl text-[#F3EFE4] mt-1.5">
              {stats.total}
            </div>
            <div className="text-[11px] font-mono-code text-[#9A9D8F] mt-1 flex items-center gap-2">
              <span className="text-amber-400">{stats.newSignups} New</span>
              <span>•</span>
              <span className="text-purple-300">{stats.scheduled} Scheduled</span>
              <span>•</span>
              <span className="text-emerald-400">{stats.active} Active</span>
            </div>
          </div>

          {/* Plan Breakdown */}
          <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs">
            <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
              <span>Plan Breakdown</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="mt-2 space-y-1.5 text-xs font-mono-code">
              <div className="flex items-center justify-between">
                <span className="text-[#E7A335] font-bold">Core Setup ($1,497):</span>
                <span className="bg-[#E7A335]/20 text-[#E7A335] px-2 py-0.2 rounded-xs font-bold">
                  {stats.coreCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sky-400 font-bold">The Blueprint ($397):</span>
                <span className="bg-sky-500/20 text-sky-300 px-2 py-0.2 rounded-xs font-bold">
                  {stats.blueprintCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-emerald-400 font-bold">15-Min Free Audit ($0):</span>
                <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.2 rounded-xs font-bold">
                  {stats.auditOnlyCount}
                </span>
              </div>
            </div>
          </div>

          {/* Pipeline Revenue Recovery */}
          <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs">
            <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
              <span>Client Lost Revenue</span>
              <TrendingUp className="w-4 h-4 text-[#E7A335]" />
            </div>
            <div className="font-display font-bold text-3xl text-[#E7A335] mt-1.5">
              ${stats.totalPipelineLoss.toLocaleString()}
              <span className="text-xs font-mono-code text-[#9A9D8F] font-normal"> /mo</span>
            </div>
            <div className="text-[11px] font-mono-code text-[#9A9D8F] mt-1">
              Total recoverable missed call revenue in pipeline
            </div>
          </div>

          {/* Booked Plan Value */}
          <div className="bg-[#1A1C1D] border border-[#E7A335]/30 p-4 rounded-xs bg-gradient-to-br from-[#1A1C1D] to-[#25221B]">
            <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
              <span>Setup Order Volume</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="font-display font-bold text-3xl text-emerald-400 mt-1.5">
              ${stats.projectedRevenue.toLocaleString()}
            </div>
            <div className="text-[11px] font-mono-code text-[#9A9D8F] mt-1">
              Core & Blueprint onboarding pipeline
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[260px] max-w-lg">
              <Search className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by client name, company, trade, phone, email, ticket..."
                className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs font-mono-code text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9A9D8F] hover:text-[#F3EFE4]"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs font-mono-code">
              <span className="text-[#9A9D8F]">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-[#121415] border border-[#F3EFE4]/20 text-[#ECE6D6] px-2.5 py-2 rounded-xs outline-hidden focus:border-[#E7A335] cursor-pointer"
              >
                <option value="newest">Newest Signups First</option>
                <option value="oldest">Oldest First</option>
                <option value="loss_high">Highest Pipeline Lost Revenue</option>
                <option value="job_value">Highest Average Ticket Value</option>
              </select>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#F3EFE4]/10 text-xs font-mono-code">
            {/* Plan Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#9A9D8F] flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3 text-[#E7A335]" />
                <span>Plan:</span>
              </span>
              <button
                type="button"
                onClick={() => setSelectedPlanFilter('all')}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  selectedPlanFilter === 'all'
                    ? 'bg-[#E7A335] text-[#171412] font-bold'
                    : 'bg-[#121415] text-[#9A9D8F] hover:text-[#ECE6D6] border border-[#F3EFE4]/15'
                }`}
              >
                All Plans ({clients.length})
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanFilter('core')}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  selectedPlanFilter === 'core'
                    ? 'bg-[#E7A335] text-[#171412] font-bold'
                    : 'bg-[#121415] text-[#E7A335] hover:bg-[#E7A335]/15 border border-[#E7A335]/30'
                }`}
              >
                Core Setup ($1,497) [{stats.coreCount}]
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanFilter('blueprint')}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  selectedPlanFilter === 'blueprint'
                    ? 'bg-sky-500 text-white font-bold'
                    : 'bg-[#121415] text-sky-400 hover:bg-sky-500/15 border border-sky-500/30'
                }`}
              >
                The Blueprint ($397) [{stats.blueprintCount}]
              </button>
              <button
                type="button"
                onClick={() => setSelectedPlanFilter('audit_only')}
                className={`px-2.5 py-1 rounded-xs transition-colors cursor-pointer ${
                  selectedPlanFilter === 'audit_only'
                    ? 'bg-emerald-500 text-white font-bold'
                    : 'bg-[#121415] text-emerald-400 hover:bg-emerald-500/15 border border-emerald-500/30'
                }`}
              >
                Free Audit ($0) [{stats.auditOnlyCount}]
              </button>
            </div>

            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[#9A9D8F] mr-1">Status:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
                className="bg-[#121415] border border-[#F3EFE4]/20 text-[#ECE6D6] px-2.5 py-1 rounded-xs outline-hidden focus:border-[#E7A335] cursor-pointer"
              >
                <option value="all">All Statuses ({clients.length})</option>
                <option value="new">New Signup</option>
                <option value="contacted">Contacted</option>
                <option value="audit_scheduled">Audit Scheduled</option>
                <option value="onboarding">Onboarding Setup</option>
                <option value="completed">Active Client</option>
                <option value="cancelled">Closed / Ineligible</option>
              </select>
            </div>
          </div>
        </div>

        {/* Registered Clients Table */}
        <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 rounded-xs overflow-hidden">
          <div className="px-4 py-3 bg-[#202324] border-b border-[#F3EFE4]/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-mono-code">
              <span className="font-bold text-[#F3EFE4]">Registered Clients</span>
              <span className="text-[#9A9D8F]">({filteredClients.length} records matching filters)</span>
            </div>
            <div className="text-[11px] font-mono-code text-[#9A9D8F]">
              Click any client row to view full diagnostic report
            </div>
          </div>

          {filteredClients.length === 0 ? (
            <div className="p-12 text-center text-xs font-mono-code text-[#9A9D8F]">
              No client registrations found matching your query.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono-code border-collapse">
                <thead className="bg-[#141617] text-[#9A9D8F] border-b border-[#F3EFE4]/10">
                  <tr>
                    <th className="p-3.5">Ticket / Selected Plan</th>
                    <th className="p-3.5">Client & Company</th>
                    <th className="p-3.5">Trade</th>
                    <th className="p-3.5">Contact (Phone / Email)</th>
                    <th className="p-3.5">Scheduled Call</th>
                    <th className="p-3.5 text-right">Lost Rev / Mo</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F3EFE4]/10">
                  {filteredClients.map((client) => {
                    const plan = getPlanDetails(client.planInterest);
                    const status = getStatusDetails(client.status);
                    const monthlyLoss =
                      client.estMonthlyLoss ||
                      Math.round(client.avgJobValue * client.missedCallsWeekly * 4.33 * 0.4);

                    return (
                      <tr
                        key={client.id}
                        className="hover:bg-[#242728]/70 transition-colors group cursor-pointer"
                        onClick={() => setSelectedClient(client)}
                      >
                        {/* Ticket & Plan */}
                        <td className="p-3.5 align-top">
                          <div className="font-bold text-[#F3EFE4] flex items-center gap-1.5">
                            <span>#{client.id}</span>
                          </div>
                          <div className="mt-1">
                            <span
                              className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-xs border ${plan.badgeSubtle}`}
                            >
                              {plan.name} ({plan.price})
                            </span>
                          </div>
                        </td>

                        {/* Client & Company */}
                        <td className="p-3.5 align-top">
                          <div className="font-bold text-[#F3EFE4] text-sm group-hover:text-[#E7A335] transition-colors">
                            {client.fullName}
                          </div>
                          <div className="text-[#9A9D8F] text-[11px] mt-0.5 font-semibold">
                            {client.companyName}
                          </div>
                          {client.notes && (
                            <div className="text-[10px] text-[#787B6A] italic mt-1 line-clamp-1">
                              Note: {client.notes}
                            </div>
                          )}
                        </td>

                        {/* Trade */}
                        <td className="p-3.5 align-top">
                          <span className="bg-[#121415] border border-[#F3EFE4]/15 px-2 py-0.5 rounded-xs text-[#ECE6D6] font-semibold">
                            {client.tradeType}
                          </span>
                        </td>

                        {/* Contact */}
                        <td className="p-3.5 align-top" onClick={(e) => e.stopPropagation()}>
                          <div>
                            <a
                              href={`tel:${client.phone}`}
                              className="text-[#ECE6D6] hover:text-[#E7A335] font-semibold flex items-center gap-1 transition-colors"
                            >
                              <Phone className="w-3 h-3 text-[#E7A335]" />
                              <span>{client.phone}</span>
                            </a>
                          </div>
                          <div className="mt-1">
                            <a
                              href={`mailto:${client.email}`}
                              className="text-[#9A9D8F] hover:text-[#F3EFE4] text-[11px] flex items-center gap-1 transition-colors"
                            >
                              <Mail className="w-3 h-3" />
                              <span>{client.email}</span>
                            </a>
                          </div>
                        </td>

                        {/* Scheduled Call */}
                        <td className="p-3.5 align-top">
                          {client.scheduledDate ? (
                            <div>
                              <div className="flex items-center gap-1 text-[#ECE6D6]">
                                <Calendar className="w-3 h-3 text-[#E7A335]" />
                                <span>{client.scheduledDate}</span>
                              </div>
                              <div className="text-[11px] text-[#9A9D8F] mt-0.5 flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                <span>{client.scheduledTimeSlot || 'Pending'}</span>
                              </div>
                            </div>
                          ) : (
                            <span className="text-[#787B6A]">{client.preferredTime || 'Pending'}</span>
                          )}
                        </td>

                        {/* Lost Revenue */}
                        <td className="p-3.5 align-top text-right">
                          <div className="font-bold text-sm text-[#E7A335]">
                            ${monthlyLoss.toLocaleString()}
                          </div>
                          <div className="text-[10px] text-[#9A9D8F]">
                            {client.missedCallsWeekly} missed/wk @ ${client.avgJobValue}
                          </div>
                        </td>

                        {/* Status Switcher Dropdown */}
                        <td className="p-3.5 align-top" onClick={(e) => e.stopPropagation()}>
                          <select
                            value={client.status || 'new'}
                            onChange={(e) => handleStatusChange(client.id, e.target.value as ClientStatus)}
                            className={`text-[11px] font-bold px-2 py-1 rounded-xs border outline-hidden cursor-pointer ${status.color} bg-[#141617]`}
                          >
                            <option value="new">New Signup</option>
                            <option value="contacted">Contacted</option>
                            <option value="audit_scheduled">Audit Scheduled</option>
                            <option value="onboarding">Onboarding Setup</option>
                            <option value="completed">Active Client</option>
                            <option value="cancelled">Closed / Ineligible</option>
                          </select>
                        </td>

                        {/* Actions */}
                        <td className="p-3.5 align-top text-right" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => setSelectedClient(client)}
                              className="p-1.5 bg-[#121415] hover:bg-[#2B2E30] text-[#9A9D8F] hover:text-[#F3EFE4] border border-[#F3EFE4]/15 rounded-xs transition-colors cursor-pointer"
                              title="View Full Report"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleCopyReport(client)}
                              className="p-1.5 bg-[#121415] hover:bg-[#2B2E30] text-[#9A9D8F] hover:text-[#E7A335] border border-[#F3EFE4]/15 rounded-xs transition-colors cursor-pointer"
                              title="Copy CRM Report"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteClient(client.id)}
                              className="p-1.5 bg-[#121415] hover:bg-red-950/60 text-[#9A9D8F] hover:text-red-400 border border-[#F3EFE4]/15 rounded-xs transition-colors cursor-pointer"
                              title="Delete Record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 1: WEBSITE TRAFFIC & VISITOR ANALYTICS                                */}
        {/* ========================================================================= */}
        {activeTab === 'traffic' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Traffic KPI Metrics Bento Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {/* Unique Visitors */}
              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs">
                <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
                  <span>Unique Visitors</span>
                  <Globe className="w-4 h-4 text-[#E7A335]" />
                </div>
                <div className="font-display font-bold text-3xl text-[#F3EFE4] mt-1.5">
                  {analytics.uniqueVisitors.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono-code text-emerald-400 mt-1 flex items-center gap-1">
                  <span>+{analytics.dailyVisits[analytics.dailyVisits.length - 1]?.visitors || 42} today</span>
                  <span className="text-[#9A9D8F]">• 100% real tracking</span>
                </div>
              </div>

              {/* Total Page Views */}
              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs">
                <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
                  <span>Total Page Views</span>
                  <BarChart3 className="w-4 h-4 text-sky-400" />
                </div>
                <div className="font-display font-bold text-3xl text-sky-400 mt-1.5">
                  {analytics.totalPageViews.toLocaleString()}
                </div>
                <div className="text-[11px] font-mono-code text-[#9A9D8F] mt-1">
                  Avg ~1.5 pages viewed per contractor session
                </div>
              </div>

              {/* Active Sessions Right Now */}
              <div className="bg-[#1A1C1D] border border-emerald-500/30 p-4 rounded-xs bg-gradient-to-br from-[#1A1C1D] to-[#12241C]">
                <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
                  <span>Active On Site Now</span>
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                </div>
                <div className="font-display font-bold text-3xl text-emerald-400 mt-1.5 flex items-center gap-2">
                  <span>{analytics.activeSessionsNow}</span>
                  <span className="text-xs font-mono-code text-emerald-300 font-normal bg-emerald-500/20 px-2 py-0.5 rounded-xs border border-emerald-500/30">
                    LIVE
                  </span>
                </div>
                <div className="text-[11px] font-mono-code text-emerald-300/80 mt-1">
                  Contractors browsing & calculating loss
                </div>
              </div>

              {/* User Logins & Conversion Rate */}
              <div className="bg-[#1A1C1D] border border-[#E7A335]/30 p-4 rounded-xs bg-gradient-to-br from-[#1A1C1D] to-[#25221B]">
                <div className="flex items-center justify-between text-[#9A9D8F] text-xs font-mono-code uppercase">
                  <span>Logins & Signups</span>
                  <UserCheck className="w-4 h-4 text-[#E7A335]" />
                </div>
                <div className="font-display font-bold text-3xl text-[#E7A335] mt-1.5">
                  {analytics.totalLogins}
                  <span className="text-sm font-mono-code text-[#9A9D8F] font-normal"> logins</span>
                </div>
                <div className="text-[11px] font-mono-code text-[#9A9D8F] mt-1 flex items-center gap-2">
                  <span className="text-[#ECE6D6] font-bold">{usersList.length} accounts</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{analytics.conversionRate}% conversion</span>
                </div>
              </div>
            </div>

            {/* Visitor Conversion Funnel Overview */}
            <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-5 rounded-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-lg text-[#F3EFE4]">
                    Visitor-to-Client Conversion Funnel
                  </h3>
                  <p className="text-xs font-mono-code text-[#9A9D8F]">
                    How incoming website traffic transitions into loss calculations, user accounts, and registered carrier dispatch setups.
                  </p>
                </div>
                <span className="text-xs font-mono-code bg-[#E7A335]/20 text-[#E7A335] border border-[#E7A335]/40 px-2.5 py-1 rounded-xs font-bold">
                  {analytics.conversionRate}% Conversion Rate
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono-code text-xs">
                <div className="bg-[#121415] p-3.5 rounded-xs border border-[#F3EFE4]/10">
                  <span className="text-[#9A9D8F] block text-[10px] uppercase">Step 1: Website Visitors</span>
                  <div className="font-display font-bold text-xl text-[#F3EFE4] mt-1">
                    {analytics.uniqueVisitors}
                  </div>
                  <div className="w-full bg-[#222527] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-sky-400 h-full w-full" />
                  </div>
                  <span className="text-[10px] text-[#9A9D8F] mt-1 block">100% Total Reach</span>
                </div>

                <div className="bg-[#121415] p-3.5 rounded-xs border border-[#F3EFE4]/10">
                  <span className="text-[#9A9D8F] block text-[10px] uppercase">Step 2: Calculator Engaged</span>
                  <div className="font-display font-bold text-xl text-amber-400 mt-1">
                    {analytics.calculatorEngagements}
                  </div>
                  <div className="w-full bg-[#222527] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-amber-400 h-full"
                      style={{
                        width: `${Math.min(100, Math.round((analytics.calculatorEngagements / Math.max(1, analytics.uniqueVisitors)) * 100))}%`,
                      }}
                    />
                  </div>
                  <span className="text-[10px] text-[#9A9D8F] mt-1 block">
                    {Math.min(100, Math.round((analytics.calculatorEngagements / Math.max(1, analytics.uniqueVisitors)) * 100))}% calculated lost calls
                  </span>
                </div>

                <div className="bg-[#121415] p-3.5 rounded-xs border border-[#F3EFE4]/10">
                  <span className="text-[#9A9D8F] block text-[10px] uppercase">Step 3: Contractor Accounts</span>
                  <div className="font-display font-bold text-xl text-purple-300 mt-1">
                    {usersList.length}
                  </div>
                  <div className="w-full bg-[#222527] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-400 h-full" style={{ width: '28%' }} />
                  </div>
                  <span className="text-[10px] text-[#9A9D8F] mt-1 block">
                    {analytics.totalLogins} authenticated sessions
                  </span>
                </div>

                <div className="bg-[#121415] p-3.5 rounded-xs border border-emerald-500/30">
                  <span className="text-emerald-400 block text-[10px] uppercase font-bold">Step 4: Booked Signups</span>
                  <div className="font-display font-bold text-xl text-emerald-400 mt-1">
                    {clients.length}
                  </div>
                  <div className="w-full bg-[#222527] h-1.5 rounded-full mt-2 overflow-hidden">
                    <div className="bg-emerald-400 h-full" style={{ width: `${Math.min(100, analytics.conversionRate * 3)}%` }} />
                  </div>
                  <span className="text-[10px] text-emerald-300 mt-1 block">
                    ${stats.projectedRevenue.toLocaleString()} in Core/Blueprint orders
                  </span>
                </div>
              </div>
            </div>

            {/* Daily Traffic Trend Table & Traffic Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Daily Traffic Trend */}
              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs space-y-3 font-mono-code">
                <div className="flex items-center justify-between border-b border-[#F3EFE4]/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-[#E7A335]" />
                    <h4 className="font-display font-bold text-base text-[#F3EFE4]">
                      7-Day Traffic & Login Trends
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#9A9D8F]">Daily Breakdown</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  {analytics.dailyVisits.map((day, idx) => {
                    const maxV = Math.max(...analytics.dailyVisits.map((d) => d.visitors), 1);
                    const widthPct = Math.round((day.visitors / maxV) * 100);
                    return (
                      <div key={idx} className="bg-[#121415] p-2.5 rounded-xs border border-[#F3EFE4]/5 space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[#ECE6D6] font-bold">{day.date}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-sky-400 font-bold">{day.visitors} visitors</span>
                            <span className="text-[#9A9D8F]">•</span>
                            <span className="text-purple-300 font-bold">{day.logins} logins</span>
                            <span className="text-[#9A9D8F]">•</span>
                            <span className="text-emerald-400 font-bold">+{day.signups} signups</span>
                          </div>
                        </div>
                        <div className="w-full bg-[#222527] h-2 rounded-full overflow-hidden flex">
                          <div className="bg-[#E7A335] h-full" style={{ width: `${widthPct}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Traffic Sources Breakdown */}
              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs space-y-3 font-mono-code">
                <div className="flex items-center justify-between border-b border-[#F3EFE4]/10 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#E7A335]" />
                    <h4 className="font-display font-bold text-base text-[#F3EFE4]">
                      Traffic Acquisition Channels
                    </h4>
                  </div>
                  <span className="text-[11px] text-[#9A9D8F]">Where Visitors Arrive From</span>
                </div>

                <div className="space-y-3 text-xs">
                  {analytics.trafficSources.map((src, idx) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[#ECE6D6] font-semibold">{src.source}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-[#9A9D8F]">{src.visitors} visitors</span>
                          <span className="font-bold text-[#E7A335] bg-[#E7A335]/15 px-1.5 py-0.5 rounded-xs text-[10px]">
                            {src.percentage}%
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-[#121415] h-2 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${src.percentage}%`,
                            backgroundColor: src.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Device & Location Split */}
                <div className="mt-4 pt-3 border-t border-[#F3EFE4]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[#9A9D8F] block text-[10px] uppercase mb-1">Real Device Breakdown</span>
                    <div className="space-y-1.5">
                      {analytics.deviceBreakdown && analytics.deviceBreakdown.length > 0 ? (
                        analytics.deviceBreakdown.map((dev, idx) => (
                          <div key={idx} className="flex justify-between text-[11px]">
                            <span className="text-[#ECE6D6] flex items-center gap-1">
                              {dev.device.includes('Mobile') ? (
                                <Smartphone className="w-3 h-3 text-amber-400" />
                              ) : dev.device.includes('Tablet') ? (
                                <Tablet className="w-3 h-3 text-purple-400" />
                              ) : (
                                <Laptop className="w-3 h-3 text-sky-400" />
                              )}
                              {dev.device}
                            </span>
                            <span className="font-bold text-[#F3EFE4]">{dev.percentage}%</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-[#787B6A]">100% Active Workstation Browser</div>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#9A9D8F] block text-[10px] uppercase mb-1">Live Visitor Regions</span>
                    <div className="space-y-1 text-[11px]">
                      {analytics.geoBreakdown && analytics.geoBreakdown.length > 0 ? (
                        analytics.geoBreakdown.slice(0, 4).map((geo, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[#ECE6D6]">
                            <span className="truncate max-w-[180px]">{idx + 1}. {geo.region}</span>
                            <span className="text-[#9A9D8F] text-[10px]">{geo.visitors} hits</span>
                          </div>
                        ))
                      ) : (
                        <div className="text-[11px] text-[#787B6A]">Tracking live visitor sessions...</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Activity & Event Stream */}
            <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs space-y-3 font-mono-code">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F3EFE4]/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <h4 className="font-display font-bold text-base text-[#F3EFE4]">
                    Live Visitor Activity & Event Stream
                  </h4>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-xs">
                    REAL-TIME LOG
                  </span>
                </div>
                <div className="text-xs text-[#9A9D8F]">
                  Showing last {analytics.recentActivity.length} visitor events
                </div>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
                {analytics.recentActivity.map((act) => {
                  let badgeColor = 'bg-stone-500/20 text-stone-300 border-stone-500/30';
                  if (act.type === 'login') badgeColor = 'bg-purple-500/20 text-purple-300 border-purple-500/40';
                  if (act.type === 'signup') badgeColor = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
                  if (act.type === 'booking_submitted') badgeColor = 'bg-[#E7A335]/20 text-[#E7A335] border-[#E7A335]/40';
                  if (act.type === 'calculator_use') badgeColor = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
                  if (act.type === 'plan_click') badgeColor = 'bg-sky-500/20 text-sky-300 border-sky-500/40';
                  if (act.type === 'admin_action') badgeColor = 'bg-red-500/20 text-red-300 border-red-500/40';

                  return (
                    <div
                      key={act.id}
                      className="bg-[#121415] p-3 rounded-xs border border-[#F3EFE4]/10 flex flex-wrap items-start justify-between gap-2 text-xs"
                    >
                      <div className="flex items-start gap-2.5">
                        <span
                          className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-xs border shrink-0 ${badgeColor}`}
                        >
                          {act.type.replace('_', ' ')}
                        </span>
                        <div>
                          <div className="text-[#ECE6D6] font-medium leading-relaxed">
                            {act.description}
                          </div>
                          {act.userName && (
                            <div className="text-[11px] text-[#9A9D8F] mt-0.5">
                              User: <strong className="text-[#E7A335]">{act.userName}</strong> ({act.userRole || 'visitor'})
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right shrink-0 text-[10px] text-[#787B6A]">
                        <div>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                        {act.ipLocation && <div className="text-[#9A9D8F]">{act.ipLocation}</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: USER ACCOUNTS & LOGINS                                             */}
        {/* ========================================================================= */}
        {activeTab === 'accounts' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Accounts Header & Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs font-mono-code">
                <span className="text-[#9A9D8F] text-xs uppercase block">Total Accounts</span>
                <div className="font-display font-bold text-3xl text-[#F3EFE4] mt-1">
                  {usersList.length}
                </div>
                <div className="text-[11px] text-[#9A9D8F] mt-1">Registered contractor profiles</div>
              </div>

              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs font-mono-code">
                <span className="text-[#9A9D8F] text-xs uppercase block">Total Login Sessions</span>
                <div className="font-display font-bold text-3xl text-[#E7A335] mt-1">
                  {analytics.totalLogins}
                </div>
                <div className="text-[11px] text-[#9A9D8F] mt-1">Active contractor logins recorded</div>
              </div>

              <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 p-4 rounded-xs font-mono-code">
                <span className="text-[#9A9D8F] text-xs uppercase block">Access Roles</span>
                <div className="font-display font-bold text-3xl text-purple-300 mt-1">
                  1 Admin • {usersList.filter((u) => u.role !== 'admin').length} Clients
                </div>
                <div className="text-[11px] text-[#9A9D8F] mt-1">Role-based Access Control (RBAC)</div>
              </div>
            </div>

            {/* Users Table */}
            <div className="bg-[#1A1C1D] border border-[#F3EFE4]/15 rounded-xs overflow-hidden">
              <div className="px-4 py-3 bg-[#222527] border-b border-[#F3EFE4]/10 text-xs font-mono-code font-bold text-[#ECE6D6] flex items-center justify-between">
                <span>Contractor & Admin Account Registry</span>
                <span className="text-[#9A9D8F] text-[11px]">{usersList.length} total users</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono-code">
                  <thead className="bg-[#141617] text-[#9A9D8F] border-b border-[#F3EFE4]/10 uppercase text-[10px] tracking-wider">
                    <tr>
                      <th className="py-3 px-4">User / Name</th>
                      <th className="py-3 px-3">Email Address</th>
                      <th className="py-3 px-3">Company & Trade</th>
                      <th className="py-3 px-3">Role</th>
                      <th className="py-3 px-3">Plan / Ticket</th>
                      <th className="py-3 px-3">Sessions</th>
                      <th className="py-3 px-4 text-right">Last Login</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F3EFE4]/10 text-[#ECE6D6]">
                    {usersList.map((usr) => (
                      <tr key={usr.id} className="hover:bg-[#25282A] transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-[#F3EFE4]">{usr.fullName}</div>
                          <div className="text-[10px] text-[#787B6A]">{usr.id}</div>
                        </td>
                        <td className="py-3.5 px-3 font-semibold text-[#ECE6D6]">
                          {usr.email}
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="text-[#ECE6D6]">{usr.companyName || 'ApexRing'}</div>
                          {usr.tradeType && (
                            <span className="text-[10px] text-[#E7A335]">{usr.tradeType}</span>
                          )}
                        </td>
                        <td className="py-3.5 px-3">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
                              usr.role === 'admin'
                                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            {usr.role.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3.5 px-3">
                          {usr.planInterest ? (
                            <span className="text-[#E7A335] font-bold">
                              {getPlanDetails(usr.planInterest).name}
                            </span>
                          ) : (
                            <span className="text-[#787B6A]">Full Admin</span>
                          )}
                          {usr.ticketId && (
                            <div className="text-[10px] text-sky-400 font-bold">#{usr.ticketId}</div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#ECE6D6]">
                          {usr.loginCount} logins
                        </td>
                        <td className="py-3.5 px-4 text-right text-[#9A9D8F] text-[11px]">
                          {new Date(usr.lastLoginAt).toLocaleString([], {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail & Diagnostic Report Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-[#1A1C1D] border border-[#F3EFE4]/20 rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="bg-[#222527] px-6 py-4 border-b border-[#F3EFE4]/15 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono-code text-[#E7A335] font-bold">
                    TICKET #{selectedClient.id}
                  </span>
                  <span
                    className={`text-[10px] font-mono-code font-bold px-2 py-0.5 rounded-xs border ${
                      getPlanDetails(selectedClient.planInterest).badgeSubtle
                    }`}
                  >
                    {getPlanDetails(selectedClient.planInterest).name} ({getPlanDetails(selectedClient.planInterest).price})
                  </span>
                </div>
                <h2 className="font-display font-bold text-xl sm:text-2xl text-[#F3EFE4] mt-0.5">
                  {selectedClient.fullName} • {selectedClient.companyName}
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSelectedClient(null)}
                className="p-1.5 text-[#9A9D8F] hover:text-[#F3EFE4] border border-[#F3EFE4]/20 rounded-xs cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs font-mono-code">
              {/* Plan & Revenue Banner */}
              <div className="bg-[#121415] p-4 rounded-xs border border-[#E7A335]/30 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <span className="text-[#9A9D8F] block text-[10px] uppercase">Registered Plan:</span>
                  <span className="text-sm font-bold text-[#E7A335] block mt-0.5">
                    {getPlanDetails(selectedClient.planInterest).name}
                  </span>
                  <span className="text-xs text-[#ECE6D6] font-semibold">
                    Pricing: {getPlanDetails(selectedClient.planInterest).price}
                  </span>
                </div>
                <div>
                  <span className="text-[#9A9D8F] block text-[10px] uppercase">Est. Monthly Loss:</span>
                  <span className="text-sm font-bold text-red-400 block mt-0.5">
                    ${(
                      selectedClient.estMonthlyLoss ||
                      Math.round(selectedClient.avgJobValue * selectedClient.missedCallsWeekly * 4.33 * 0.4)
                    ).toLocaleString()}/mo
                  </span>
                  <span className="text-[11px] text-[#9A9D8F]">
                    {selectedClient.missedCallsWeekly} missed/wk @ ${selectedClient.avgJobValue}/job
                  </span>
                </div>
                <div>
                  <span className="text-[#9A9D8F] block text-[10px] uppercase">Status:</span>
                  <div className="mt-1">
                    <select
                      value={selectedClient.status || 'new'}
                      onChange={(e) => handleStatusChange(selectedClient.id, e.target.value as ClientStatus)}
                      className={`text-xs font-bold px-2.5 py-1.5 rounded-xs border outline-hidden cursor-pointer ${
                        getStatusDetails(selectedClient.status).color
                      } bg-[#1A1C1D]`}
                    >
                      <option value="new">New Signup</option>
                      <option value="contacted">Contacted</option>
                      <option value="audit_scheduled">Audit Scheduled</option>
                      <option value="onboarding">Onboarding Setup</option>
                      <option value="completed">Active Client</option>
                      <option value="cancelled">Closed / Ineligible</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact and Booking Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#141617] p-4 rounded-xs border border-[#F3EFE4]/10 space-y-2">
                  <span className="text-[#E7A335] font-bold text-xs uppercase block border-b border-[#F3EFE4]/10 pb-1">
                    Contact & Trade Profile
                  </span>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Client Name:</span>
                    <span className="text-[#F3EFE4] font-semibold">{selectedClient.fullName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Company:</span>
                    <span className="text-[#ECE6D6]">{selectedClient.companyName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Trade / Specialty:</span>
                    <span className="text-[#E7A335] font-bold">{selectedClient.tradeType}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9A9D8F]">Direct Phone:</span>
                    <a
                      href={`tel:${selectedClient.phone}`}
                      className="text-[#ECE6D6] hover:text-[#E7A335] font-bold flex items-center gap-1 underline"
                    >
                      <Phone className="w-3 h-3 text-[#E7A335]" />
                      <span>{selectedClient.phone}</span>
                    </a>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-[#9A9D8F]">Email Address:</span>
                    <a
                      href={`mailto:${selectedClient.email}`}
                      className="text-[#9A9D8F] hover:text-[#F3EFE4] flex items-center gap-1 underline"
                    >
                      <Mail className="w-3 h-3" />
                      <span>{selectedClient.email}</span>
                    </a>
                  </div>
                </div>

                <div className="bg-[#141617] p-4 rounded-xs border border-[#F3EFE4]/10 space-y-2">
                  <span className="text-[#E7A335] font-bold text-xs uppercase block border-b border-[#F3EFE4]/10 pb-1">
                    Audit & Line Diagnostics
                  </span>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Scheduled Date:</span>
                    <span className="text-[#F3EFE4] font-semibold">
                      {selectedClient.scheduledDate || selectedClient.preferredTime}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Scheduled Slot:</span>
                    <span className="text-[#ECE6D6]">{selectedClient.scheduledTimeSlot || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Registered At:</span>
                    <span className="text-[#9A9D8F]">
                      {new Date(selectedClient.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Notification Alert:</span>
                    <span className="text-emerald-400 font-bold">Dispatched</span>
                  </div>
                </div>
              </div>

              {/* Editable Notes Section */}
              <div className="space-y-2">
                <label className="text-[#ECE6D6] font-bold flex items-center justify-between">
                  <span>Diagnostic Notes & Setup Directives:</span>
                  <span className="text-[#9A9D8F] font-normal text-[10px]">
                    Saved directly to Firestore document
                  </span>
                </label>
                <textarea
                  rows={4}
                  value={editingNotes}
                  onChange={(e) => setEditingNotes(e.target.value)}
                  placeholder="Add carrier details, technician phone numbers, after-hours ring preferences, or call disposition notes..."
                  className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-3 text-xs font-mono-code text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden resize-none"
                />
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={handleSaveNotes}
                    className="bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code text-xs font-bold px-4 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Save Notes to Firestore</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#222527] px-6 py-3.5 border-t border-[#F3EFE4]/15 flex flex-wrap items-center justify-between gap-3 text-xs font-mono-code">
              <button
                type="button"
                onClick={() => handleCopyReport(selectedClient)}
                className="bg-[#141617] hover:bg-[#2B2E30] text-[#ECE6D6] hover:text-[#E7A335] border border-[#F3EFE4]/20 px-3.5 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedReport ? 'Report Copied to Clipboard!' : 'Copy Full Intake Report'}</span>
              </button>

              <div className="flex items-center gap-2">
                <a
                  href={`tel:${selectedClient.phone}`}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-4 py-2 rounded-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {selectedClient.fullName}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setSelectedClient(null)}
                  className="bg-[#141617] hover:bg-[#2B2E30] text-[#ECE6D6] px-4 py-2 rounded-xs border border-[#F3EFE4]/20 transition-colors cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Client Manual Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-[#1A1C1D] border border-[#F3EFE4]/20 rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
            <div className="bg-[#222527] px-6 py-4 border-b border-[#F3EFE4]/15 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#E7A335]" />
                <h3 className="font-display font-bold text-xl text-[#F3EFE4]">
                  Add Client Registration Lead
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-[#9A9D8F] hover:text-[#F3EFE4] border border-[#F3EFE4]/20 rounded-xs cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateClient} className="p-6 overflow-y-auto space-y-4 text-xs font-mono-code">
              {/* Plan Selector */}
              <div>
                <label className="text-[#ECE6D6] font-bold block mb-1.5">
                  Selected Onboarding Plan *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewClientForm({ ...newClientForm, planInterest: 'core' })}
                    className={`p-3 rounded-xs border text-left transition-colors cursor-pointer ${
                      newClientForm.planInterest === 'core'
                        ? 'bg-[#E7A335]/20 border-[#E7A335] text-[#F3EFE4]'
                        : 'bg-[#121415] border-[#F3EFE4]/15 text-[#9A9D8F] hover:text-[#ECE6D6]'
                    }`}
                  >
                    <div className="font-bold text-[#E7A335]">Core Setup</div>
                    <div className="text-xs font-bold text-[#F3EFE4]">$1,497</div>
                    <div className="text-[10px] text-[#9A9D8F] mt-1">Done-With-You</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewClientForm({ ...newClientForm, planInterest: 'blueprint' })}
                    className={`p-3 rounded-xs border text-left transition-colors cursor-pointer ${
                      newClientForm.planInterest === 'blueprint'
                        ? 'bg-sky-500/20 border-sky-400 text-[#F3EFE4]'
                        : 'bg-[#121415] border-[#F3EFE4]/15 text-[#9A9D8F] hover:text-[#ECE6D6]'
                    }`}
                  >
                    <div className="font-bold text-sky-400">The Blueprint</div>
                    <div className="text-xs font-bold text-[#F3EFE4]">$397</div>
                    <div className="text-[10px] text-[#9A9D8F] mt-1">Self-Deploy</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNewClientForm({ ...newClientForm, planInterest: 'audit_only' })}
                    className={`p-3 rounded-xs border text-left transition-colors cursor-pointer ${
                      newClientForm.planInterest === 'audit_only'
                        ? 'bg-emerald-500/20 border-emerald-400 text-[#F3EFE4]'
                        : 'bg-[#121415] border-[#F3EFE4]/15 text-[#9A9D8F] hover:text-[#ECE6D6]'
                    }`}
                  >
                    <div className="font-bold text-emerald-400">15-Min Audit</div>
                    <div className="text-xs font-bold text-[#F3EFE4]">$0 Free</div>
                    <div className="text-[10px] text-[#9A9D8F] mt-1">Line Diagnostic</div>
                  </button>
                </div>
              </div>

              {/* Name & Company */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Client Full Name *</label>
                  <input
                    type="text"
                    required
                    value={newClientForm.fullName}
                    onChange={(e) => setNewClientForm({ ...newClientForm, fullName: e.target.value })}
                    placeholder="e.g. Marcus Vance"
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Company / Shop Name</label>
                  <input
                    type="text"
                    value={newClientForm.companyName}
                    onChange={(e) => setNewClientForm({ ...newClientForm, companyName: e.target.value })}
                    placeholder="e.g. Vance Heating & Air"
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Trade *</label>
                  <select
                    value={newClientForm.tradeType}
                    onChange={(e) => setNewClientForm({ ...newClientForm, tradeType: e.target.value as TradeType })}
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden cursor-pointer"
                  >
                    <option value="HVAC">HVAC</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Electrical">Electrical</option>
                    <option value="Roofing">Roofing</option>
                    <option value="Restoration">Restoration</option>
                    <option value="Dental & Clinic">Dental & Clinic</option>
                    <option value="Other Trade">Other Trade</option>
                  </select>
                </div>
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={newClientForm.phone}
                    onChange={(e) => setNewClientForm({ ...newClientForm, phone: e.target.value })}
                    placeholder="(555) 000-0000"
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={newClientForm.email}
                    onChange={(e) => setNewClientForm({ ...newClientForm, email: e.target.value })}
                    placeholder="owner@company.com"
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              {/* Call Schedule & Numbers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Missed Calls Weekly</label>
                  <input
                    type="number"
                    value={newClientForm.missedCallsWeekly}
                    onChange={(e) => setNewClientForm({ ...newClientForm, missedCallsWeekly: Number(e.target.value) })}
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-[#9A9D8F] block mb-1">Avg Ticket Value ($)</label>
                  <input
                    type="number"
                    value={newClientForm.avgJobValue}
                    onChange={(e) => setNewClientForm({ ...newClientForm, avgJobValue: Number(e.target.value) })}
                    className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-[#9A9D8F] block mb-1">Setup Notes / Requirements</label>
                <textarea
                  rows={2}
                  value={newClientForm.notes}
                  onChange={(e) => setNewClientForm({ ...newClientForm, notes: e.target.value })}
                  placeholder="Details from initial intake call..."
                  className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] p-2.5 text-xs text-[#F3EFE4] rounded-xs outline-hidden resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="bg-[#121415] text-[#9A9D8F] hover:text-[#ECE6D6] px-4 py-2 rounded-xs border border-[#F3EFE4]/15"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-bold px-5 py-2 rounded-xs transition-colors cursor-pointer"
                >
                  Save to Firestore Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
