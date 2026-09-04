import React from 'react';

interface PricingSkeletonProps {
  className?: string;
}

export const PricingSkeleton: React.FC<PricingSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`py-20 sm:py-24 border-b border-[#F3EFE4]/10 bg-[#17191A] relative ${className}`}
      aria-busy="true"
      aria-label="Loading pricing plans"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-7">
        {/* Section Header Skeleton */}
        <div className="max-w-2xl mb-14">
          <div className="h-3.5 w-24 bg-[#E7A335]/30 rounded-xs mb-3 animate-pulse" />
          <div className="h-10 sm:h-12 w-full max-w-lg bg-[#20231F] border border-[#F3EFE4]/10 rounded-xs mb-3 animate-pulse" />
          <div className="space-y-2 max-w-xl">
            <div className="h-4 bg-[#20231F] rounded-xs w-full animate-pulse" />
            <div className="h-4 bg-[#20231F] rounded-xs w-4/5 animate-pulse" />
          </div>
        </div>

        {/* Pricing Cards Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start mb-10">
          {/* Blueprint Ticket Skeleton */}
          <div className="ticket-paper p-7 sm:p-9 pt-9 shadow-xl relative flex flex-col justify-between h-full bg-[#DFD8C4] border border-[#B9B2A0]">
            <div>
              {/* Ticket Sub-header */}
              <div className="flex justify-between items-center border-b border-[#B9B2A0] border-dashed pb-2.5 mb-5">
                <div className="h-3 w-36 bg-[#B9B2A0]/40 rounded-xs animate-pulse" />
                <div className="h-3 w-16 bg-[#B9B2A0]/40 rounded-xs animate-pulse" />
              </div>

              {/* Title & Tagline */}
              <div className="h-8 w-40 bg-[#171412]/20 rounded-xs mb-2 animate-pulse" />
              <div className="h-3.5 w-64 bg-[#6B6E5F]/30 rounded-xs mb-6 animate-pulse" />

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4">
                <div className="h-6 w-14 bg-[#9A9484]/40 rounded-xs animate-pulse" />
                <div className="h-12 w-28 bg-[#171412]/30 rounded-xs animate-pulse" />
                <div className="h-4 w-16 bg-[#6B6E5F]/30 rounded-xs animate-pulse" />
              </div>

              {/* Offer Badge */}
              <div className="h-6 w-36 bg-[#E7A335]/40 rounded-xs mb-6 animate-pulse" />

              {/* Deliverables List Skeleton */}
              <div className="space-y-3 pt-4 border-t border-[#B9B2A0] border-dashed mb-8">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#171412]/20 shrink-0 animate-pulse" />
                    <div
                      className="h-3.5 bg-[#39392F]/20 rounded-xs animate-pulse"
                      style={{ width: `${85 - (i % 3) * 12}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Button Skeleton */}
            <div className="h-12 w-full bg-[#171412]/30 rounded-xs animate-pulse" />
          </div>

          {/* Core Ticket Skeleton (Featured) */}
          <div className="ticket-paper p-7 sm:p-9 pt-9 shadow-2xl relative flex flex-col justify-between h-full bg-[#E9E3D3] border-2 border-[#D6553C]/40">
            {/* Stamp / Tag Placeholder */}
            <div className="absolute -top-3.5 right-6 h-7 w-32 bg-[#D6553C]/40 rounded-xs animate-pulse" />

            <div>
              <div className="flex justify-between items-center border-b border-[#B9B2A0] border-dashed pb-2.5 mb-5">
                <div className="h-3 w-40 bg-[#B9B2A0]/50 rounded-xs animate-pulse" />
                <div className="h-3 w-28 bg-[#D6553C]/30 rounded-xs animate-pulse" />
              </div>

              <div className="h-8 w-48 bg-[#171412]/25 rounded-xs mb-2 animate-pulse" />
              <div className="h-3.5 w-72 bg-[#6B6E5F]/30 rounded-xs mb-6 animate-pulse" />

              {/* Price Row */}
              <div className="flex items-baseline gap-3 mb-4">
                <div className="h-6 w-16 bg-[#9A9484]/40 rounded-xs animate-pulse" />
                <div className="h-12 w-32 bg-[#171412]/30 rounded-xs animate-pulse" />
                <div className="h-4 w-20 bg-[#6B6E5F]/30 rounded-xs animate-pulse" />
              </div>

              <div className="h-6 w-44 bg-[#D6553C]/30 rounded-xs mb-6 animate-pulse" />

              {/* Deliverables List Skeleton */}
              <div className="space-y-3 pt-4 border-t border-[#B9B2A0] border-dashed mb-8">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className="w-4 h-4 rounded-full bg-[#D6553C]/30 shrink-0 animate-pulse" />
                    <div
                      className="h-3.5 bg-[#39392F]/20 rounded-xs animate-pulse"
                      style={{ width: `${88 - (i % 4) * 10}%` }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Primary CTA Skeleton */}
            <div className="space-y-2">
              <div className="h-12 w-full bg-[#D6553C]/40 rounded-xs animate-pulse" />
              <div className="h-3 w-48 mx-auto bg-[#6B6E5F]/30 rounded-xs animate-pulse" />
            </div>
          </div>
        </div>

        {/* Bottom Assurance Strip Skeleton */}
        <div className="border border-[#F3EFE4]/15 bg-[#20231F] p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#E7A335]/20 animate-pulse" />
            <div className="space-y-1.5">
              <div className="h-3.5 w-40 bg-[#F3EFE4]/20 rounded-xs animate-pulse" />
              <div className="h-3 w-56 bg-[#9A9D8F]/20 rounded-xs animate-pulse" />
            </div>
          </div>
          <div className="h-8 w-28 bg-[#17191A] border border-[#F3EFE4]/10 rounded-xs animate-pulse" />
        </div>
      </div>
    </div>
  );
};
