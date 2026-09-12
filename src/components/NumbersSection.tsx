import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Heart } from 'lucide-react';

interface NumberStat {
  value: string;
  label: string;
  sub: string;
}

interface NumbersSectionProps {
  numbers: NumberStat[];
}

export const NumbersSection: React.FC<NumbersSectionProps> = ({ numbers }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="numbers-section"
      ref={sectionRef}
      className="py-14 sm:py-20 px-4 bg-gradient-to-b from-transparent via-pink-50/40 to-transparent"
    >
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 04</span>
            <span>•</span>
            <span>Statistical Evidence</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            Our friendship in numbers 🎀
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mt-2">
            Scientifically calculated, peer-reviewed, and 100% indisputable.
          </p>
        </div>

        {/* 10 Cards Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
          {numbers.map((item, idx) => {
            return (
              <div
                key={idx}
                className={`paper-card rounded-2xl p-4 sm:p-5 border border-pink-200/90 shadow-md text-center flex flex-col justify-between transition-all duration-700 hover:scale-105 hover:shadow-xl ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
                style={{
                  transitionDelay: `${Math.min(idx * 60, 600)}ms`,
                }}
              >
                {/* Top ribbon tag */}
                <div className="flex justify-center mb-1.5">
                  <span className="text-xs font-handwriting text-pink-600 font-bold bg-pink-50 px-2 py-0.5 rounded-md border border-pink-200/60">
                    Stat #{idx + 1}
                  </span>
                </div>

                {/* Big Number / Value */}
                <div className="my-1 sm:my-2">
                  <span className="text-4xl sm:text-5xl font-extrabold text-stone-800 font-handwriting tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-rose-500">
                    {item.value}
                  </span>
                </div>

                {/* Label */}
                <div className="flex-1 flex flex-col justify-center my-1">
                  <h3 className="font-sans font-bold text-stone-800 text-sm sm:text-base leading-snug mb-1">
                    {item.label}
                  </h3>
                  {item.sub && (
                    <p className="text-xs text-stone-500 font-handwriting text-base sm:text-lg leading-tight mt-0.5">
                      {item.sub}
                    </p>
                  )}
                </div>

                {/* Bottom mini heart */}
                <div className="mt-3 pt-2 border-t border-dashed border-stone-200 flex justify-center text-pink-300">
                  <Heart className="w-3.5 h-3.5 fill-pink-200" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
