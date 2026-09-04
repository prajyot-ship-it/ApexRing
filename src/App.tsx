/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SequencePreview } from './components/SequencePreview';
import { HowItWorks } from './components/HowItWorks';
import { TestimonialsCarousel } from './components/TestimonialsCarousel';
import { PricingSection } from './components/PricingSection';
import { GuaranteeBand } from './components/GuaranteeBand';
import { ScenarioSection } from './components/ScenarioSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { AuditModal } from './components/AuditModal';
import { AdminPortal } from './components/AdminPortal';
import { AuthModal } from './components/AuthModal';
import { ScrollReveal } from './components/ScrollReveal';
import { CalculatorState, AuditBooking, UserAccount } from './types';
import { getCurrentUser, logoutUser } from './services/authService';
import { recordSiteVisit } from './services/analyticsService';

export default function App() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    jobValue: 280,
    missedCalls: 9,
    tradeType: 'Plumbing',
    bookRate: 0.30,
  });

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAdminPortalOpen, setIsAdminPortalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => getCurrentUser());
  const [selectedPlan, setSelectedPlan] = useState<'blueprint' | 'core' | 'audit_only'>('core');

  // Track site visit & unique pageviews in analytics on mount
  useEffect(() => {
    recordSiteVisit();
  }, []);

  // Sync current user state
  const handleAuthSuccess = (user: UserAccount) => {
    setCurrentUser(user);
    if (user.role === 'admin') {
      setIsAdminPortalOpen(true);
    }
  };

  const handleLogout = () => {
    logoutUser();
    setCurrentUser(null);
  };

  // Check URL on load and on hashchange for hidden admin URLs: /admin, /#admin, ?admin=true
  useEffect(() => {
    const checkAdminUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      const pathname = window.location.pathname.toLowerCase();

      if (
        hash === '#admin' ||
        hash === '#/admin' ||
        hash.includes('admin') ||
        search.includes('admin=true') ||
        search.includes('view=admin') ||
        pathname === '/admin' ||
        pathname.startsWith('/admin')
      ) {
        setIsAdminPortalOpen(true);
      }
    };

    checkAdminUrl();
    window.addEventListener('hashchange', checkAdminUrl);
    window.addEventListener('popstate', checkAdminUrl);
    return () => {
      window.removeEventListener('hashchange', checkAdminUrl);
      window.removeEventListener('popstate', checkAdminUrl);
    };
  }, []);

  // Global Key-combo listener for:
  // 1) Ctrl + Shift + A (or Cmd + Shift + A on Mac)
  // 2) Ctrl + Alt + A
  // 3) Typing secret code "admin"
  useEffect(() => {
    let keyBuffer = '';
    let bufferTimer: NodeJS.Timeout;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Hotkey: Ctrl+Shift+A or Cmd+Shift+A or Alt+Shift+A
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminPortalOpen((prev) => !prev);
        return;
      }

      // Check typed sequence if not inside an input/textarea
      const targetTag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (targetTag !== 'input' && targetTag !== 'textarea') {
        keyBuffer += e.key.toLowerCase();
        clearTimeout(bufferTimer);
        bufferTimer = setTimeout(() => {
          keyBuffer = '';
        }, 1500);

        if (keyBuffer.endsWith('admin')) {
          setIsAdminPortalOpen(true);
          keyBuffer = '';
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      clearTimeout(bufferTimer);
    };
  }, []);

  // Client registration state: null for all visitors until they register/buy any ticket
  const [registeredBooking, setRegisteredBooking] = useState<AuditBooking | null>(() => {
    // Clear any previous test data from persistent localStorage so fresh visitors always see the launch banner
    try {
      localStorage.removeItem('apexring_registered');
    } catch {
      // ignore
    }
    return null;
  });

  const handleRegistrationComplete = (booking: AuditBooking) => {
    setRegisteredBooking(booking);
  };

  const handleClearRegistration = () => {
    setRegisteredBooking(null);
  };

  const handleOpenAuditModal = (plan: 'blueprint' | 'core' | 'audit_only' = 'core') => {
    setSelectedPlan(plan);
    setIsAuditModalOpen(true);
  };

  const handleClaimAuditWithState = (state: CalculatorState) => {
    setCalculatorState(state);
    setSelectedPlan('core');
    setIsAuditModalOpen(true);
  };

  const handleSelectPlan = (plan: 'blueprint' | 'core') => {
    setSelectedPlan(plan);
    setIsAuditModalOpen(true);
  };

  const handleCloseAdmin = () => {
    setIsAdminPortalOpen(false);
    // Clean up hash if needed
    if (window.location.hash === '#admin' || window.location.hash === '#/admin') {
      window.history.pushState(null, '', window.location.pathname + window.location.search);
    }
  };

  return (
    <div className="min-h-screen bg-[#17191A] text-[#F3EFE4] flex flex-col selection:bg-[#E7A335] selection:text-[#171412]">
      {/* Top sticky header and offer banner: shows Launch pricing before registration, Waitlist status after */}
      <Header 
        onOpenAuditModal={handleOpenAuditModal} 
        registeredBooking={registeredBooking}
        onClearRegistration={handleClearRegistration}
        onOpenAdmin={() => setIsAdminPortalOpen(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main content flow with subtle scroll-triggered animations */}
      <main className="flex-1">
        <Hero
          onOpenAuditModal={handleOpenAuditModal}
          onClaimAuditWithState={handleClaimAuditWithState}
          registeredBooking={registeredBooking}
        />

        <ScrollReveal yOffset={24}>
          <ProblemSection />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <SequencePreview />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <HowItWorks />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <TestimonialsCarousel 
            onOpenAuditModal={handleOpenAuditModal} 
          />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <PricingSection 
            onSelectPlan={handleSelectPlan} 
            registeredBooking={registeredBooking}
          />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <GuaranteeBand />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <ScenarioSection />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <FaqSection />
        </ScrollReveal>

        <ScrollReveal yOffset={24}>
          <FinalCta 
            onOpenAuditModal={() => handleOpenAuditModal('core')} 
            registeredBooking={registeredBooking}
          />
        </ScrollReveal>
      </main>

      {/* Footer with operational status and verified branding */}
      <Footer onOpenAdmin={() => setIsAdminPortalOpen(true)} />

      {/* Interactive Call Audit & Plan Booking Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        calculatorState={calculatorState}
        initialPlan={selectedPlan}
        registeredBooking={registeredBooking}
        onRegistered={handleRegistrationComplete}
      />

      {/* User Login & Contractor Account Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
        onLogout={handleLogout}
        onOpenAdminPortal={() => setIsAdminPortalOpen(true)}
      />

      {/* Admin-Only Hidden Firestore Signups & Plan Management Portal */}
      <AdminPortal
        isOpen={isAdminPortalOpen}
        onClose={handleCloseAdmin}
        currentUser={currentUser}
        onAdminAuthenticated={(adminUser) => {
          setCurrentUser(adminUser);
        }}
        onLogout={handleLogout}
      />
    </div>
  );
}

