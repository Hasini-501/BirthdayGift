import React from 'react';
import { TimelineMoment } from '../config';
import { Sparkles, Heart } from 'lucide-react';

interface TimelineSectionProps {
  moments: TimelineMoment[];
}

export const TimelineSection: React.FC<TimelineSectionProps> = ({ moments }) => {
  return (
    <section id="timeline-section" className="py-12 sm:py-20 px-4 bg-gradient-to-b from-transparent via-rose-50/30 to-transparent">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 08</span>
            <span>•</span>
            <span>The Journey of Us</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            Reasons I'm grateful for you 🌷
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mt-2">
            From strangers to the person I can't imagine my life without.
          </p>
        </div>

        {/* Vertical Timeline */}
        <div className="relative">
          {/* Central dashed line */}
          <div className="absolute left-4 sm:left-1/2 top-4 bottom-4 -translate-x-1/2 w-0.5 border-l-2 border-dashed border-pink-300" />

          <div className="space-y-8 sm:space-y-12">
            {moments.map((moment, idx) => {
              const isEven = idx % 2 === 0;

              return (
                <div
                  key={moment.id}
                  className={`relative flex flex-col sm:flex-row items-start sm:items-center ${
                    isEven ? 'sm:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Pin Indicator */}
                  <div className="absolute left-4 sm:left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-pink-400 shadow-md flex items-center justify-center text-base z-10">
                    <span>{moment.emoji}</span>
                  </div>

                  {/* Content Card */}
                  <div
                    className={`ml-12 sm:ml-0 sm:w-1/2 ${
                      isEven ? 'sm:pl-10' : 'sm:pr-10'
                    }`}
                  >
                    <div className="paper-card rounded-2xl p-5 sm:p-6 border border-pink-200/80 shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group">
                      {/* Tag & Date */}
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                          moment.tag === 'Forever'
                            ? 'bg-rose-100 text-rose-700'
                            : moment.tag === 'Now'
                            ? 'bg-pink-100 text-pink-700'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {moment.tag}
                        </span>

                        {moment.date && (
                          <span className="text-[11px] font-sans text-stone-400">
                            {moment.date}
                          </span>
                        )}
                      </div>

                      {/* Title */}
                      <h3 className="font-handwriting text-2xl sm:text-3xl font-bold text-stone-800 leading-snug mb-2 group-hover:text-pink-600 transition-colors">
                        {moment.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-stone-600 font-sans leading-relaxed">
                        {moment.description}
                      </p>

                      {/* Bottom heart marker */}
                      <div className="mt-3 pt-2 border-t border-dashed border-stone-100 flex items-center justify-end text-pink-300">
                        <Heart className="w-3.5 h-3.5 fill-pink-200" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
