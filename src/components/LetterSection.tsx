import React, { useState } from 'react';
import { Heart, Sparkles, Check, Copy } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface LetterSectionProps {
  heading: string;
  salutation: string;
  paragraphs: string[];
  signature: string;
  bestFriendName: string;
}

export const LetterSection: React.FC<LetterSectionProps> = ({
  heading,
  salutation,
  paragraphs,
  signature,
  bestFriendName,
}) => {
  const [copied, setCopied] = useState(false);
  const [isLoved, setIsLoved] = useState(false);

  const fullLetterText = `${salutation}\n\n${paragraphs.join('\n\n')}\n\n${signature}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(fullLetterText);
    setCopied(true);
    soundEngine.playSparkleSound();
    setTimeout(() => setCopied(false), 2000);
  };

  const handleHeartClick = () => {
    setIsLoved(!isLoved);
    soundEngine.playSparkleSound();
  };

  return (
    <section id="letter-section" className="py-12 sm:py-16 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 01</span>
            <span>•</span>
            <span>Straight from the heart</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-stone-900 flex items-center justify-center gap-2 font-handwriting">
            <span>{heading}</span>
          </h2>
          <p className="text-sm text-stone-500 mt-1">Read this slowly, okay? No skipping ahead! 🥺</p>
        </div>

        {/* Vintage Handwritten Notebook Letter Card */}
        <div className="relative paper-card rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border-2 border-stone-200/70 notebook-paper transition-transform duration-300 hover:shadow-2xl">
          {/* Scrapbook washi tape top & side */}
          <div className="absolute -top-3.5 left-12 w-28 h-6 washi-tape-lavender rounded-xs transform -rotate-3 z-10" />
          <div className="absolute -top-3.5 right-12 w-24 h-6 washi-tape-peach rounded-xs transform rotate-2 z-10" />

          {/* Wax Seal / Stamp */}
          <div className="absolute top-6 right-6 sm:top-8 sm:right-8 z-10">
            <button
              type="button"
              onClick={handleHeartClick}
              title="Click to stamp a heart"
              className="group relative w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white shadow-md flex items-center justify-center border-2 border-white/80 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            >
              <Heart className={`w-6 h-6 ${isLoved ? 'fill-white animate-bounce' : 'fill-rose-300/40'}`} />
              <span className="sr-only">Like letter</span>
              {isLoved && (
                <span className="absolute -top-6 -right-2 text-xs font-handwriting font-bold text-rose-600 bg-white px-1.5 py-0.5 rounded-full shadow border border-rose-200 animate-fadeIn">
                  Saved! 💗
                </span>
              )}
            </button>
          </div>

          {/* Letter Body */}
          <div className="space-y-5 text-stone-800 font-handwriting text-2xl sm:text-3xl leading-relaxed pt-2">
            <p className="font-bold text-pink-700 text-3xl sm:text-4xl">
              {salutation.replace('[NAME]', bestFriendName)}
            </p>

            {paragraphs.map((p, idx) => (
              <p key={idx} className="text-stone-700">
                {p}
              </p>
            ))}

            <div className="pt-6 border-t border-dashed border-stone-300 text-right">
              <p className="font-bold text-stone-900 text-2xl sm:text-3xl">
                {signature}
              </p>
              <p className="text-xs font-sans text-stone-400 mt-1 uppercase tracking-wider">
                Certified Best Friend Bond • Infinite Validity
              </p>
            </div>
          </div>

          {/* Bottom Card Actions */}
          <div className="mt-8 pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-200/60 text-xs text-stone-500 font-sans">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Written with 100% genuine friendship tears & smiles</span>
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy letter text</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
