import React from 'react';

interface TestimonialsSkeletonProps {
  className?: string;
}

export const TestimonialsSkeleton: React.FC<TestimonialsSkeletonProps> = ({ className = '' }) => {
  return (
    <div
      className={`py-16 sm:py-24 bg-[#17191A] border-t border-b border-[#F3EFE4]/15 relative overflow-hidden ${className}`}
      aria-busy="true"
      aria-label="Loading testimonials"
    >
      {/* Background subtle grid */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F3EFE4 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header Skeleton */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          {/* Badge Skeleton */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#20231F] border border-[#F3EFE4]/10 mb-4 animate-pulse">
            <div className="w-2 h-2 rounded-full bg-[#E7A335]/40" />
            <div className="w-36 h-3 bg-[#9A9D8F]/20 rounded-xs" />
          </div>

          {/* Heading Skeleton */}
          <div className="h-9 sm:h-12 bg-[#20231F] border border-[#F3EFE4]/10 rounded-xs max-w-xl mx-auto mb-4 animate-pulse" />

          {/* Subtitle Skeleton */}
          <div className="space-y-2 max-w-lg mx-auto">
            <div className="h-3.5 bg-[#20231F] rounded-xs w-full animate-pulse" />
            <div className="h-3.5 bg-[#20231F] rounded-xs w-4/5 mx-auto animate-pulse" />
          </div>
        </div>

        {/* Aggregated Quick Proof Metrics Strip Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {[1, 2, 3, 4].map((box) => (
            <div
              key={box}
              className="bg-[#20231F] border border-[#F3EFE4]/15 p-4 text-center animate-pulse"
            >
              <div className="h-3 w-24 bg-[#9A9D8F]/20 mx-auto rounded-xs mb-2.5" />
              <div className="h-7 w-20 bg-[#E7A335]/30 mx-auto rounded-xs mb-1.5" />
              <div className="h-2.5 w-28 bg-[#9A9D8F]/20 mx-auto rounded-xs" />
            </div>
          ))}
        </div>

        {/* Trade Filter Tabs Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          {[1, 2, 3, 4, 5, 6].map((tab) => (
            <div
              key={tab}
              className="h-7 w-20 sm:w-24 bg-[#20231F] border border-[#F3EFE4]/10 rounded-xs animate-pulse"
            />
          ))}
        </div>

        {/* Main Testimonial Card Skeleton */}
        <div className="bg-[#20231F] border border-[#F3EFE4]/20 p-6 sm:p-8 lg:p-10 relative shadow-2xl">
          {/* Top Card Bar Skeleton */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#F3EFE4]/15">
            <div className="flex items-center gap-4">
              {/* Initials Avatar Skeleton */}
              <div className="w-12 h-12 bg-[#17191A] border border-[#E7A335]/30 flex items-center justify-center animate-pulse">
                <div className="w-6 h-6 bg-[#E7A335]/20 rounded-xs" />
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-32 h-5 bg-[#F3EFE4]/20 rounded-xs animate-pulse" />
                  <div className="w-16 h-4 bg-[#E7A335]/20 rounded-xs animate-pulse" />
                </div>
                <div className="w-48 h-3.5 bg-[#9A9D8F]/20 rounded-xs animate-pulse" />
              </div>
            </div>

            {/* Rating and Verification Skeleton */}
            <div className="space-y-2 flex flex-col sm:items-end">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <div key={star} className="w-4 h-4 bg-[#E7A335]/30 rounded-xs animate-pulse" />
                ))}
              </div>
              <div className="w-24 h-3 bg-[#9A9D8F]/20 rounded-xs animate-pulse" />
            </div>
          </div>

          {/* Card Body Quote Skeleton */}
          <div className="py-6 sm:py-8 space-y-4">
            <div className="space-y-2.5">
              <div className="h-4 bg-[#F3EFE4]/20 rounded-xs w-full animate-pulse" />
              <div className="h-4 bg-[#F3EFE4]/20 rounded-xs w-11/12 animate-pulse" />
              <div className="h-4 bg-[#F3EFE4]/20 rounded-xs w-4/5 animate-pulse" />
            </div>

            {/* Before vs After Skeleton Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 sm:p-5 bg-[#17191A] border border-[#F3EFE4]/10">
              <div className="space-y-2">
                <div className="w-24 h-3 bg-[#D6553C]/40 rounded-xs animate-pulse" />
                <div className="h-3.5 bg-[#9A9D8F]/20 rounded-xs w-5/6 animate-pulse" />
                <div className="h-3.5 bg-[#9A9D8F]/20 rounded-xs w-2/3 animate-pulse" />
              </div>
              <div className="space-y-2 md:border-l md:border-[#F3EFE4]/15 md:pl-4">
                <div className="w-28 h-3 bg-[#E7A335]/40 rounded-xs animate-pulse" />
                <div className="h-3.5 bg-[#F3EFE4]/20 rounded-xs w-5/6 animate-pulse" />
                <div className="h-3.5 bg-[#F3EFE4]/20 rounded-xs w-3/4 animate-pulse" />
              </div>
            </div>

            {/* Verified Recovery Highlight Skeleton */}
            <div className="p-4 bg-[#262B25] border border-[#E7A335]/20 flex items-center justify-between animate-pulse">
              <div className="space-y-1.5">
                <div className="w-32 h-3 bg-[#9A9D8F]/30 rounded-xs" />
                <div className="w-28 h-6 bg-[#E7A335]/40 rounded-xs" />
              </div>
              <div className="w-24 h-4 bg-[#E7A335]/20 rounded-xs" />
            </div>
          </div>

          {/* Bottom Navigation & Indicator Bar Skeleton */}
          <div className="flex items-center justify-between pt-6 border-t border-[#F3EFE4]/15">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#17191A] border border-[#F3EFE4]/20 rounded-xs animate-pulse" />
              <div className="w-8 h-8 bg-[#17191A] border border-[#F3EFE4]/20 rounded-xs animate-pulse" />
            </div>
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div key={dot} className="w-2 h-2 rounded-full bg-[#F3EFE4]/20 animate-pulse" />
              ))}
            </div>
            <div className="w-24 h-4 bg-[#9A9D8F]/20 rounded-xs animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
