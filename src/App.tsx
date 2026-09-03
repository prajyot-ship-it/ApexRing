/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { SequencePreview } from './components/SequencePreview';
import { HowItWorks } from './components/HowItWorks';
import { PricingSection } from './components/PricingSection';
import { GuaranteeBand } from './components/GuaranteeBand';
import { ScenarioSection } from './components/ScenarioSection';
import { FaqSection } from './components/FaqSection';
import { FinalCta } from './components/FinalCta';
import { Footer } from './components/Footer';
import { AuditModal } from './components/AuditModal';
import { CalculatorState } from './types';

export default function App() {
  const [calculatorState, setCalculatorState] = useState<CalculatorState>({
    jobValue: 280,
    missedCalls: 9,
    tradeType: 'Plumbing',
    bookRate: 0.30,
  });

  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'blueprint' | 'core' | 'audit_only'>('core');

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

  return (
    <div className="min-h-screen bg-[#17191A] text-[#F3EFE4] flex flex-col selection:bg-[#E7A335] selection:text-[#171412]">
      {/* Top sticky header and offer banner */}
      <Header onOpenAuditModal={handleOpenAuditModal} />

      {/* Main content flow */}
      <main className="flex-1">
        <Hero
          onOpenAuditModal={handleOpenAuditModal}
          onClaimAuditWithState={handleClaimAuditWithState}
        />
        <ProblemSection />
        <SequencePreview />
        <HowItWorks />
        <PricingSection onSelectPlan={handleSelectPlan} />
        <GuaranteeBand />
        <ScenarioSection />
        <FaqSection />
        <FinalCta onOpenAuditModal={() => handleOpenAuditModal('core')} />
      </main>

      {/* Footer with operational status and verified branding */}
      <Footer />

      {/* Interactive Call Audit & Plan Booking Modal */}
      <AuditModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        calculatorState={calculatorState}
        initialPlan={selectedPlan}
      />
    </div>
  );
}
