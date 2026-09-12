import React, { useState } from 'react';
import { Sparkles, Heart, CheckCircle2 } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface WishItem {
  icon: string;
  text: string;
  sub: string;
}

interface WishListSectionProps {
  wishes: WishItem[];
  bestFriendName: string;
}

export const WishListSection: React.FC<WishListSectionProps> = ({
  wishes,
  bestFriendName,
}) => {
  const [claimedWishes, setClaimedWishes] = useState<Record<number, boolean>>({});

  const handleClaimWish = (idx: number) => {
    soundEngine.playSparkleSound();
    setClaimedWishes(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const claimedCount = Object.values(claimedWishes).filter(Boolean).length;

  return (
    <section id="wishes-section" className="py-12 sm:py-16 px-4 bg-[#FFF8FA]/80">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 06</span>
            <span>•</span>
            <span>Birthday Manifestations</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            Things I want for you this year 🌷
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mt-2">
            Tap each wish to claim & manifest it into reality for {bestFriendName}!
          </p>

          {claimedCount > 0 && (
            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-medium animate-fadeIn">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span>{claimedCount} of {wishes.length} wishes officially claimed! ✨</span>
            </div>
          )}
        </div>

        {/* Wishlist Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
          {wishes.map((item, idx) => {
            const isClaimed = !!claimedWishes[idx];

            return (
              <div
                key={idx}
                onClick={() => handleClaimWish(idx)}
                className={`paper-card rounded-2xl p-4 sm:p-5 border transition-all duration-300 cursor-pointer flex items-center justify-between gap-4 group ${
                  isClaimed
                    ? 'bg-rose-50/70 border-rose-300 shadow-md translate-x-1'
                    : 'bg-white border-stone-200/90 shadow-sm hover:border-pink-200 hover:shadow-md'
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-100 to-rose-100 flex items-center justify-center text-2xl shadow-xs group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div>
                    <h3 className="font-handwriting text-2xl font-bold text-stone-800 leading-tight">
                      {item.text}
                    </h3>
                    <p className="text-xs text-stone-500 font-sans mt-0.5">
                      {item.sub}
                    </p>
                  </div>
                </div>

                {/* Claim Stamp / Indicator */}
                <div className="shrink-0">
                  {isClaimed ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500 text-white font-handwriting text-sm font-bold shadow-xs animate-scaleUp">
                      <Sparkles className="w-3 h-3" />
                      Claimed!
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-dashed border-stone-300 text-stone-400 group-hover:border-pink-400 group-hover:text-pink-500 transition-colors">
                      <Heart className="w-4 h-4" />
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
