import React, { useState } from 'react';
import { ReasonItem } from '../config';
import { Sparkles, Heart, RotateCcw } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface ReasonsSectionProps {
  reasons: ReasonItem[];
}

export const ReasonsSection: React.FC<ReasonsSectionProps> = ({ reasons }) => {
  // Track which cards are flipped
  const [flippedCards, setFlippedCards] = useState<Record<number, boolean>>({});

  const toggleFlip = (id: number) => {
    soundEngine.playCardFlip();
    setFlippedCards(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const flipAll = () => {
    soundEngine.playSparkleSound();
    const allFlipped: Record<number, boolean> = {};
    const shouldFlip = Object.keys(flippedCards).length < reasons.length;
    if (shouldFlip) {
      reasons.forEach(r => { allFlipped[r.id] = true; });
    }
    setFlippedCards(allFlipped);
  };

  return (
    <section id="reasons-section" className="py-12 sm:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 03</span>
            <span>•</span>
            <span>Tap To Reveal</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            Reasons why you're my person 🫶
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto mt-2">
            Flip each card to unlock the truth. (Spoiler: You're stuck with me forever!)
          </p>

          <button
            type="button"
            onClick={flipAll}
            className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-purple-600 hover:text-purple-700 bg-purple-100/70 hover:bg-purple-200 px-3.5 py-1.5 rounded-full transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{Object.keys(flippedCards).length === reasons.length ? 'Reset all cards' : 'Reveal all cards at once ✨'}</span>
          </button>
        </div>

        {/* 8 Flip Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {reasons.map((reason) => {
            const isFlipped = !!flippedCards[reason.id];

            return (
              <div
                key={reason.id}
                onClick={() => toggleFlip(reason.id)}
                className="relative h-56 cursor-pointer select-none perspective-1000 group"
              >
                <div
                  className={`w-full h-full rounded-2xl transition-transform duration-500 transform-style-3d shadow-md hover:shadow-xl ${
                    isFlipped ? 'rotate-y-180' : 'hover:-translate-y-1'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* FRONT OF CARD */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl bg-white border-2 border-pink-200/80 p-5 flex flex-col justify-between items-center text-center backface-hidden paper-card"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-full flex justify-between items-center">
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-pink-50 text-pink-600 border border-pink-100">
                        {reason.tag}
                      </span>
                      <Sparkles className="w-4 h-4 text-pink-400 group-hover:rotate-45 transition-transform" />
                    </div>

                    <div className="my-auto flex flex-col items-center">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-100 flex items-center justify-center text-3xl shadow-xs mb-2 group-hover:scale-110 transition-transform">
                        {reason.emoji}
                      </div>
                      <h3 className="font-handwriting text-2xl font-bold text-stone-800">
                        {reason.frontText}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-pink-500 font-medium group-hover:underline">
                      <span>Tap to reveal</span>
                      <Heart className="w-3 h-3 fill-pink-300" />
                    </div>
                  </div>

                  {/* BACK OF CARD (REVEALED REASON) */}
                  <div
                    className="absolute inset-0 w-full h-full rounded-2xl bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 border-2 border-rose-300 p-5 flex flex-col justify-between items-center text-center rotate-y-180 backface-hidden"
                    style={{
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)',
                    }}
                  >
                    <div className="w-full flex justify-between items-center text-xs text-rose-500 font-bold">
                      <span>Reason #{reason.id}</span>
                      <span>💗</span>
                    </div>

                    <div className="my-auto">
                      <p className="font-handwriting text-2xl sm:text-2xl text-stone-900 font-bold leading-snug">
                        "{reason.backText}"
                      </p>
                    </div>

                    <div className="text-[11px] text-stone-400 font-sans uppercase tracking-wider">
                      Tap to flip back
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
