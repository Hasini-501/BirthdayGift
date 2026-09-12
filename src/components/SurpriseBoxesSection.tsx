import React, { useState } from 'react';
import { SurpriseBox } from '../config';
import { Gift, X, Sparkles, Heart } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

interface SurpriseBoxesSectionProps {
  boxes: SurpriseBox[];
}

export const SurpriseBoxesSection: React.FC<SurpriseBoxesSectionProps> = ({ boxes }) => {
  const [selectedBox, setSelectedBox] = useState<SurpriseBox | null>(null);
  const [openedBoxIds, setOpenedBoxIds] = useState<Record<string, boolean>>({});

  const handleOpenBox = (box: SurpriseBox, e: React.MouseEvent<HTMLButtonElement>) => {
    soundEngine.playSparkleSound();
    setSelectedBox(box);
    setOpenedBoxIds(prev => ({ ...prev, [box.id]: true }));

    // Burst confetti at button position
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (rect.left + rect.width / 2) / window.innerWidth;
    const y = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x, y },
      colors: ['#F472B6', '#C084FC', '#FDE047', '#FDA4AF']
    });
  };

  const closeModal = () => {
    setSelectedBox(null);
  };

  return (
    <section id="surprise-boxes-section" className="py-12 sm:py-18 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 05</span>
            <span>•</span>
            <span>Emergency Bestie Care</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            Choose a surprise 🎁
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto mt-2">
            Four little emergency boxes. Open whichever one your heart needs right now!
          </p>
        </div>

        {/* 4 Interactive Gift Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {boxes.map((box) => {
            const isOpened = !!openedBoxIds[box.id];

            return (
              <button
                key={box.id}
                type="button"
                onClick={(e) => handleOpenBox(box, e)}
                className="group relative paper-card rounded-3xl p-6 border-2 border-stone-200 text-center flex flex-col items-center justify-between transition-all duration-300 hover:scale-105 hover:shadow-xl hover:border-pink-300 cursor-pointer h-72"
              >
                {/* Washi tape on box */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-5 washi-tape rounded-xs transform -rotate-1" />

                {/* Status indicator */}
                <div className="w-full flex justify-between items-center text-xs text-stone-400">
                  <span className="font-sans font-semibold">
                    {isOpened ? 'Opened ✨' : 'Unopened 🔒'}
                  </span>
                  <span>{box.emoji}</span>
                </div>

                {/* Animated Gift Box Visual */}
                <div className="my-auto relative">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-300 to-rose-400 flex items-center justify-center text-white shadow-lg transform transition-transform group-hover:-translate-y-1 group-hover:rotate-3">
                    <Gift className="w-10 h-10 animate-pulse" />
                  </div>
                  {/* Ribbon cross */}
                  <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-3 bg-white/40 pointer-events-none" />
                  <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-3 bg-white/40 pointer-events-none" />
                </div>

                {/* Box Title */}
                <div>
                  <h3 className="font-handwriting text-2xl font-bold text-stone-800 leading-tight">
                    {box.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-1 font-sans">
                    Tap to unwrap message
                  </p>
                </div>

                {/* Bottom button trigger */}
                <div className="w-full mt-3 pt-3 border-t border-dashed border-stone-200 flex items-center justify-center gap-1 text-xs font-semibold text-pink-600 group-hover:text-pink-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Unwrap Box</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Gift Box Reveal Modal */}
      {selectedBox && (
        <div
          id="surprise-box-modal"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeModal}
        >
          <div
            className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border-2 border-pink-200 paper-card transform transition-all duration-300 animate-scaleUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Content */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 mx-auto rounded-full bg-pink-100 flex items-center justify-center text-3xl mb-3 shadow-inner">
                {selectedBox.emoji}
              </div>

              <div className="inline-block px-3 py-1 rounded-full bg-pink-50 border border-pink-200 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-2">
                Special Delivery
              </div>

              <h3 className="font-handwriting text-3xl sm:text-4xl font-bold text-stone-800 mb-4">
                {selectedBox.title}
              </h3>

              {/* Message Note */}
              <div className="p-6 rounded-2xl bg-[#FFF9F6] border border-pink-100 shadow-xs mb-6 notebook-paper">
                <p className="font-handwriting text-2xl sm:text-3xl text-stone-800 font-bold leading-relaxed">
                  "{selectedBox.message}"
                </p>
                <p className="text-xs font-sans text-stone-400 mt-3 italic">
                  {selectedBox.subtext}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-rose-400 text-white font-semibold text-sm shadow-md hover:shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Keep in my heart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
