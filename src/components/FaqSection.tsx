import React, { useState } from 'react';
import { FAQ_LIST } from '../data/mockData';
import { Plus, Minus, HelpCircle } from 'lucide-react';

export const FaqSection: React.FC = () => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    'faq-1': true,
  });

  const toggleFaq = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <section id="faq" className="py-20 sm:py-24 border-b border-[#F3EFE4]/10 bg-[#17191A]">
      <div className="max-w-4xl mx-auto px-4 sm:px-7">
        <div className="max-w-xl mb-12">
          <div className="font-mono-code text-xs sm:text-sm text-[#E7A335] mb-2 tracking-wide uppercase">
            BEFORE YOU BOOK
          </div>
          <h2 className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-[#F3EFE4]">
            Questions every shop owner asks
          </h2>
          <p className="text-[#9A9D8F] text-base sm:text-lg mt-3">
            Honest answers about your existing numbers, carriers, and how dispatch is handled.
          </p>
        </div>

        <div className="border-t border-[#F3EFE4]/15 divide-y divide-[#F3EFE4]/15">
          {FAQ_LIST.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div key={item.id} className="py-5 sm:py-6">
                <button
                  type="button"
                  onClick={() => toggleFaq(item.id)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between text-left gap-4 cursor-pointer group focus:outline-none"
                >
                  <span className="font-sans font-semibold text-lg sm:text-xl text-[#F3EFE4] group-hover:text-[#E7A335] transition-colors">
                    {item.question}
                  </span>
                  <span className="font-mono-code text-xl text-[#E7A335] flex-shrink-0 transition-transform duration-200">
                    {isOpen ? <Minus className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="mt-3 text-[#9A9D8F] text-base leading-relaxed max-w-2xl font-sans">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
