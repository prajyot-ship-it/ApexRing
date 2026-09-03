import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  CheckCircle2, 
  Pause, 
  Play, 
  Quote, 
  MapPin, 
  Truck, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Clock,
  Zap
} from 'lucide-react';
import { TESTIMONIALS } from '../data/mockData';
import { TradeType } from '../types';

interface TestimonialsCarouselProps {
  onOpenAuditModal?: (plan?: 'blueprint' | 'core' | 'audit_only') => void;
}

const TRADE_FILTERS: Array<{ label: string; value: TradeType | 'ALL' }> = [
  { label: 'All Trades', value: 'ALL' },
  { label: 'HVAC', value: 'HVAC' },
  { label: 'Plumbing', value: 'Plumbing' },
  { label: 'Roofing', value: 'Roofing' },
  { label: 'Electrical', value: 'Electrical' },
  { label: 'Clinic / Dental', value: 'Dental & Clinic' },
];

export const TestimonialsCarousel: React.FC<TestimonialsCarouselProps> = ({ onOpenAuditModal }) => {
  const [selectedTrade, setSelectedTrade] = useState<TradeType | 'ALL'>('ALL');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Filter items based on selected trade
  const filteredTestimonials = selectedTrade === 'ALL'
    ? TESTIMONIALS
    : TESTIMONIALS.filter((t) => t.trade === selectedTrade);

  // Reset index if out of bounds after filtering
  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedTrade]);

  const total = filteredTestimonials.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying || total <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, nextSlide, total]);

  // Handle touch swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 50;

    if (distance > minSwipeDistance) {
      nextSlide();
    } else if (distance < -minSwipeDistance) {
      prevSlide();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  const current = filteredTestimonials[currentIndex] || TESTIMONIALS[0];

  return (
    <section 
      id="testimonials"
      className="py-16 sm:py-24 bg-[#17191A] border-t border-b border-[#F3EFE4]/15 relative overflow-hidden"
      aria-label="Contractor Testimonials and Social Proof"
    >
      {/* Background industrial grid subtle accents */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#F3EFE4 1px, transparent 1px)',
          backgroundSize: '28px 28px'
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#20231F] border border-[#E7A335]/40 text-[#E7A335] text-xs font-mono mb-4 tracking-wider uppercase">
            <span className="w-2 h-2 rounded-full bg-[#E7A335] animate-pulse" />
            Social Proof & Field Dispatch Audits
          </div>
          
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold uppercase tracking-tight text-[#F3EFE4] mb-4">
            Proof From the Service Bay & Job Site
          </h2>
          <p className="text-sm sm:text-base text-[#9A9D8F] font-body">
            Real trade operators don’t have time for theory. Here is how active plumbing, HVAC, electrical, and roofing contractors stop bleeding emergency revenue to voicemail.
          </p>
        </div>

        {/* Aggregated Quick Proof Metrics Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          <div className="bg-[#20231F] border border-[#F3EFE4]/15 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#E7A335] text-xs font-mono mb-1">
              <Star className="w-3.5 h-3.5 fill-[#E7A335]" />
              <span>CONTRACTOR RATING</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#F3EFE4]">
              4.98 / 5.0
            </div>
            <div className="text-[11px] text-[#9A9D8F] font-mono mt-0.5">
              Across 200+ service shops
            </div>
          </div>

          <div className="bg-[#20231F] border border-[#F3EFE4]/15 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#E7A335] text-xs font-mono mb-1">
              <Zap className="w-3.5 h-3.5" />
              <span>TRIGGER SPEED</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#F3EFE4]">
              14.2 sec
            </div>
            <div className="text-[11px] text-[#9A9D8F] font-mono mt-0.5">
              Average automatic text response
            </div>
          </div>

          <div className="bg-[#20231F] border border-[#F3EFE4]/15 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#E7A335] text-xs font-mono mb-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>MEDIAN RECOVERY</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#F3EFE4]">
              +$3,850/mo
            </div>
            <div className="text-[11px] text-[#9A9D8F] font-mono mt-0.5">
              Net captured ticket value
            </div>
          </div>

          <div className="bg-[#20231F] border border-[#F3EFE4]/15 p-4 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[#E7A335] text-xs font-mono mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>CALLER RETENTION</span>
            </div>
            <div className="text-2xl sm:text-3xl font-display font-bold text-[#F3EFE4]">
              71.4%
            </div>
            <div className="text-[11px] text-[#9A9D8F] font-mono mt-0.5">
              Texted back before competitor dialed
            </div>
          </div>
        </div>

        {/* Trade Filter Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
          <span className="text-xs text-[#9A9D8F] font-mono uppercase mr-2 hidden sm:inline-block">
            Filter by Trade:
          </span>
          {TRADE_FILTERS.map((tab) => {
            const isSelected = selectedTrade === tab.value;
            return (
              <button
                key={tab.value}
                id={`testimonial-filter-${tab.value.toLowerCase().replace(/\s+/g, '-')}`}
                type="button"
                onClick={() => setSelectedTrade(tab.value)}
                className={`px-3 py-1.5 text-xs font-mono tracking-wide uppercase transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#E7A335] text-[#171412] font-semibold border-[#E7A335]'
                    : 'bg-[#20231F] text-[#F3EFE4]/80 border-[#F3EFE4]/15 hover:border-[#F3EFE4]/40 hover:text-[#F3EFE4]'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dynamic Testimonial Carousel Card */}
        <div 
          className="relative bg-[#20231F] border-2 border-[#F3EFE4]/20 p-6 sm:p-8 lg:p-10 shadow-2xl transition-all"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Top Card Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#F3EFE4]/15">
            <div className="flex items-center gap-4">
              {/* Initials badge / Operator Avatar */}
              <div className="w-12 h-12 bg-[#17191A] border border-[#E7A335]/40 flex items-center justify-center text-[#E7A335] font-display font-bold text-xl uppercase tracking-wider">
                {current.author.split(' ').map(n => n[0]).join('')}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-display font-bold text-[#F3EFE4] tracking-wide">
                    {current.author}
                  </h3>
                  <span className="text-xs bg-[#E7A335]/20 text-[#E7A335] border border-[#E7A335]/30 px-2 py-0.5 font-mono uppercase">
                    {current.trade}
                  </span>
                </div>
                <div className="text-xs text-[#9A9D8F] flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-[#F3EFE4]/90 font-medium">{current.role}</span>
                  <span>·</span>
                  <span>{current.company}</span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#E7A335]" />
                    {current.location}
                  </span>
                </div>
              </div>
            </div>

            {/* Rating and Verification Status */}
            <div className="flex flex-col sm:items-end gap-1">
              <div className="flex items-center gap-1" aria-label={`Rating: ${current.rating} out of 5 stars`}>
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-[#E7A335] fill-[#E7A335]" />
                ))}
                <span className="text-xs font-mono font-bold text-[#E7A335] ml-1">5.0</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#9A9D8F] font-mono">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#E7A335]" />
                <span>{current.verifiedPlan}</span>
              </div>
            </div>
          </div>

          {/* Main Card Content */}
          <div className="py-6 sm:py-8">
            {/* Big quote icon */}
            <div className="flex items-start gap-3 mb-6">
              <Quote className="w-8 h-8 text-[#E7A335] shrink-0 opacity-75 mt-1" />
              <blockquote className="text-base sm:text-lg lg:text-xl text-[#F3EFE4] leading-relaxed font-body italic">
                "{current.quote}"
              </blockquote>
            </div>

            {/* Before vs After Field Reality Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6 p-4 sm:p-5 bg-[#17191A] border border-[#F3EFE4]/10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#D6553C]/20 border border-[#D6553C]/40 flex items-center justify-center text-[#D6553C] font-mono font-bold text-xs shrink-0 mt-0.5">
                  ✕
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#D6553C] font-semibold mb-1">
                    Before ApexRing
                  </div>
                  <div className="text-xs sm:text-sm text-[#9A9D8F] leading-snug">
                    {current.beforeAfter.before}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 md:border-l md:border-[#F3EFE4]/15 md:pl-4">
                <div className="w-6 h-6 rounded-full bg-[#E7A335]/20 border border-[#E7A335]/40 flex items-center justify-center text-[#E7A335] font-mono font-bold text-xs shrink-0 mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-[11px] font-mono uppercase tracking-wider text-[#E7A335] font-semibold mb-1">
                    With 14-Sec Text-Back
                  </div>
                  <div className="text-xs sm:text-sm text-[#F3EFE4] leading-snug">
                    {current.beforeAfter.after}
                  </div>
                </div>
              </div>
            </div>

            {/* Verified Recovery Highlight Callout */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-[#262B25] border border-[#E7A335]/30">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#17191A] border border-[#E7A335]/40 text-[#E7A335]">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-[#9A9D8F] font-mono uppercase tracking-wide">
                    {current.recoveredStats.label}
                  </div>
                  <div className="text-xl sm:text-2xl font-display font-bold text-[#E7A335]">
                    {current.recoveredStats.highlight}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-[#9A9D8F]">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-[#F3EFE4]/60" />
                  <span>{current.fleet}</span>
                </div>
                <div className="hidden sm:flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#F3EFE4]/60" />
                  <span>{current.verifiedDate}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Footer Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-[#F3EFE4]/15">
            {/* Slide Index / Status */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs tracking-widest text-[#E7A335] font-semibold">
                [ {String(currentIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')} ]
              </span>
              
              {/* Play / Pause toggle */}
              <button
                id="testimonial-toggle-autoplay"
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono uppercase bg-[#17191A] text-[#9A9D8F] hover:text-[#F3EFE4] border border-[#F3EFE4]/15 transition-colors cursor-pointer"
                title={isPlaying ? 'Pause carousel auto-rotation' : 'Play carousel auto-rotation'}
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-3 h-3 text-[#E7A335]" />
                    <span>Auto (7s)</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 text-[#E7A335]" />
                    <span>Paused</span>
                  </>
                )}
              </button>
            </div>

            {/* Direct Indicator Dots / Pill markers */}
            <div className="flex items-center gap-1.5">
              {filteredTestimonials.map((item, idx) => (
                <button
                  key={item.id}
                  id={`testimonial-dot-${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 transition-all cursor-pointer rounded-none ${
                    idx === currentIndex 
                      ? 'w-6 bg-[#E7A335]' 
                      : 'w-2 bg-[#F3EFE4]/20 hover:bg-[#F3EFE4]/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}: ${item.author}`}
                />
              ))}
            </div>

            {/* Prev / Next Navigation buttons */}
            <div className="flex items-center gap-2">
              <button
                id="testimonial-prev-btn"
                type="button"
                onClick={prevSlide}
                className="p-2.5 bg-[#17191A] text-[#F3EFE4] border border-[#F3EFE4]/20 hover:border-[#E7A335] hover:text-[#E7A335] transition-colors cursor-pointer"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                id="testimonial-next-btn"
                type="button"
                onClick={nextSlide}
                className="p-2.5 bg-[#17191A] text-[#F3EFE4] border border-[#F3EFE4]/20 hover:border-[#E7A335] hover:text-[#E7A335] transition-colors cursor-pointer"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Social Proof Action Prompt */}
        <div className="mt-10 p-6 bg-[#1D201D] border border-[#F3EFE4]/15 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div>
            <div className="text-base font-display font-bold uppercase text-[#F3EFE4] tracking-wide">
              Wondering how many jobs your crews miss each week?
            </div>
            <p className="text-xs text-[#9A9D8F] font-mono mt-0.5">
              Run our free 2-minute Call Audit calculator or schedule a live system demonstration.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              id="testimonial-cta-audit"
              type="button"
              onClick={() => onOpenAuditModal?.('core')}
              className="inline-flex items-center gap-2 bg-[#E7A335] text-[#171412] font-semibold px-5 py-2.5 text-xs uppercase font-mono tracking-wider hover:bg-[#F0B355] transition-colors cursor-pointer"
            >
              <span>Get Your Free Call Audit</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
