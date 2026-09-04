import React, { useState } from 'react';
import {
  X,
  Lock,
  User,
  Mail,
  Building,
  Wrench,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  LogOut,
  Sparkles,
  Zap,
  Key,
  Flame,
  Phone,
  Database,
  ExternalLink,
} from 'lucide-react';
import { UserAccount, TradeType, PlanType } from '../types';
import { loginUser, signupUser, logoutUser } from '../services/authService';
import { getPlanDetails } from '../services/firestoreService';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: UserAccount | null;
  onAuthSuccess: (user: UserAccount) => void;
  onLogout?: () => void;
  onOpenAdminPortal?: () => void;
  onOpenAuditModal?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
  onLogout,
  onOpenAdminPortal,
  onOpenAuditModal,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Sign up fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [tradeType, setTradeType] = useState<TradeType>('HVAC');
  const [phone, setPhone] = useState('');
  const [planInterest, setPlanInterest] = useState<PlanType>('core');

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter your email address');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = loginUser(email, password);
      setIsLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setErrorMsg(res.error || 'Failed to sign in');
      }
    }, 300);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !companyName) {
      setErrorMsg('Please fill out Name, Email, and Company Name');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = signupUser({
        fullName,
        email,
        companyName,
        tradeType,
        phone,
        planInterest,
      });
      setIsLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      }
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-sm overflow-y-auto font-sans selection:bg-[#E7A335] selection:text-[#171412]">
      <div className="relative w-full max-w-md bg-[#1A1C1D] border border-[#F3EFE4]/20 rounded-xs shadow-2xl overflow-hidden flex flex-col text-[#ECE6D6]">
        {/* Modal Top Header */}
        <div className="bg-[#222527] px-6 py-4 border-b border-[#F3EFE4]/15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#E7A335]/20 border border-[#E7A335]/40 flex items-center justify-center text-[#E7A335]">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-[#F3EFE4]">
                {currentUser ? 'Contractor Account Portal' : authMode === 'signin' ? 'Sign In to ApexRing' : 'Create Contractor Account'}
              </h3>
              <p className="text-[11px] font-mono-code text-[#9A9D8F]">
                {currentUser ? 'Manage your registered plan & line audit' : 'Access your carrier routing setup & audit reports'}
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

        {/* If Already Logged In: Show Account Profile Card */}
        {currentUser ? (
          <div className="p-6 space-y-5 text-xs font-mono-code">
            <div className="bg-[#121415] border border-[#E7A335]/30 p-4 rounded-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-[#E7A335] text-[#171412] font-display font-bold flex items-center justify-center text-sm">
                    {currentUser.fullName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-[#F3EFE4]">{currentUser.fullName}</div>
                    <div className="text-[11px] text-[#9A9D8F]">{currentUser.companyName}</div>
                  </div>
                </div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-xs border ${
                    currentUser.role === 'admin'
                      ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  {currentUser.role === 'admin' ? 'ADMIN ACCESS' : 'VERIFIED CLIENT'}
                </span>
              </div>

              {/* Details table */}
              <div className="mt-4 pt-3 border-t border-[#F3EFE4]/10 space-y-2">
                <div className="flex justify-between">
                  <span className="text-[#9A9D8F]">Email:</span>
                  <span className="text-[#ECE6D6] font-semibold">{currentUser.email}</span>
                </div>
                {currentUser.tradeType && (
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Trade Specialty:</span>
                    <span className="text-[#E7A335] font-bold">{currentUser.tradeType}</span>
                  </div>
                )}
                {currentUser.planInterest && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#9A9D8F]">Selected Plan:</span>
                    <span className="text-[#E7A335] font-bold">
                      {getPlanDetails(currentUser.planInterest).name} ({getPlanDetails(currentUser.planInterest).price})
                    </span>
                  </div>
                )}
                {currentUser.ticketId && (
                  <div className="flex justify-between">
                    <span className="text-[#9A9D8F]">Intake Ticket:</span>
                    <span className="text-sky-400 font-bold">#{currentUser.ticketId}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-[#9A9D8F]">Total Logins:</span>
                  <span className="text-[#ECE6D6] font-bold">{currentUser.loginCount} sessions</span>
                </div>
              </div>
            </div>

            {/* Admin Quick Launcher if Role is Admin */}
            {currentUser.role === 'admin' && (
              <div className="bg-purple-950/40 border border-purple-500/40 p-3.5 rounded-xs space-y-2">
                <div className="flex items-center gap-2 text-purple-300 font-bold">
                  <Database className="w-4 h-4 text-[#E7A335]" />
                  <span>Admin Dispatch Tools Active</span>
                </div>
                <p className="text-[11px] text-[#9A9D8F]">
                  View live visitor traffic, all registered client tickets, and export data.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAdminPortal();
                  }}
                  className="w-full bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-mono-code text-xs font-bold py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Database className="w-4 h-4" />
                  <span>Launch Admin & Visitor Traffic Dashboard</span>
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-2">
              {onOpenAuditModal && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenAuditModal();
                  }}
                  className="flex-1 bg-[#242728] hover:bg-[#303436] text-[#ECE6D6] border border-[#F3EFE4]/20 py-2.5 rounded-xs transition-colors font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-4 h-4 text-[#E7A335]" />
                  <span>Book / View Audit</span>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  logoutUser();
                  onLogout();
                  onClose();
                }}
                className="bg-red-950/40 hover:bg-red-900/60 text-red-300 border border-red-500/30 px-4 py-2.5 rounded-xs transition-colors font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        ) : (
          /* Sign In & Sign Up Form */
          <div className="p-6 space-y-5 text-xs font-mono-code">
            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 bg-[#121415] p-1 rounded-xs border border-[#F3EFE4]/10">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signin');
                  setErrorMsg('');
                }}
                className={`py-1.5 text-center font-bold rounded-xs transition-colors cursor-pointer ${
                  authMode === 'signin'
                    ? 'bg-[#E7A335] text-[#171412]'
                    : 'text-[#9A9D8F] hover:text-[#ECE6D6]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('signup');
                  setErrorMsg('');
                }}
                className={`py-1.5 text-center font-bold rounded-xs transition-colors cursor-pointer ${
                  authMode === 'signup'
                    ? 'bg-[#E7A335] text-[#171412]'
                    : 'text-[#9A9D8F] hover:text-[#ECE6D6]'
                }`}
              >
                Create Account
              </button>
            </div>

            {errorMsg && (
              <div className="bg-red-950/60 border border-red-500/40 text-red-300 p-2.5 rounded-xs text-[11px]">
                {errorMsg}
              </div>
            )}

            {authMode === 'signin' ? (
              /* Sign In Form */
              <form onSubmit={handleSignIn} className="space-y-4">
                <div>
                  <label className="text-[#ECE6D6] font-bold block mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. marcus@vancehvac.com"
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#ECE6D6] font-bold block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-bold py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
                </button>
              </form>
            ) : (
              /* Sign Up Form */
              <form onSubmit={handleSignUp} className="space-y-3.5">
                <div>
                  <label className="text-[#ECE6D6] font-bold block mb-1">
                    Your Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Marcus Vance"
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#ECE6D6] font-bold block mb-1">
                    Company Name *
                  </label>
                  <div className="relative">
                    <Building className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="e.g. Vance Heating & Air LLC"
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[#ECE6D6] font-bold block mb-1">Trade *</label>
                    <select
                      value={tradeType}
                      onChange={(e) => setTradeType(e.target.value as TradeType)}
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] px-2.5 py-2 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
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
                    <label className="text-[#ECE6D6] font-bold block mb-1">Plan *</label>
                    <select
                      value={planInterest}
                      onChange={(e) => setPlanInterest(e.target.value as PlanType)}
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] px-2.5 py-2 text-xs text-[#F3EFE4] rounded-xs outline-hidden"
                    >
                      <option value="core">Core ($1,497)</option>
                      <option value="blueprint">The Blueprint ($397)</option>
                      <option value="audit_only">Free Audit ($0)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[#ECE6D6] font-bold block mb-1">
                    Work Email *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@company.com"
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[#ECE6D6] font-bold block mb-1">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-[#9A9D8F] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-[#121415] border border-[#F3EFE4]/20 focus:border-[#E7A335] pl-9 pr-3 py-2 text-xs text-[#F3EFE4] placeholder-[#787B6A] rounded-xs outline-hidden"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#E7A335] hover:bg-[#F0B355] text-[#171412] font-bold py-2.5 rounded-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm mt-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isLoading ? 'Creating Account...' : 'Create Contractor Account'}</span>
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
