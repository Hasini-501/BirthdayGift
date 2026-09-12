import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Heart, Gift, Camera, Flame, Volume2, X, Upload } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';
import { readFileAsDataUrl } from '../utils/photoStorage';

interface FinalSurpriseProps {
  bestFriendName: string;
  teaser: string;
  buttonText: string;
  letter: string[];
  finalPhoto: string;
  finalPhotoFallback: string;
  caption: string;
  onOpenEditor: () => void;
  onUpdateHeroPhoto?: (dataUrl: string) => void;
}

export const FinalSurpriseSection: React.FC<FinalSurpriseProps> = ({
  bestFriendName,
  teaser,
  buttonText,
  letter,
  finalPhoto,
  finalPhotoFallback,
  caption,
  onOpenEditor,
  onUpdateHeroPhoto,
}) => {
  const [isLetterRevealed, setIsLetterRevealed] = useState(false);
  const [isCelebrationActive, setIsCelebrationActive] = useState(false);
  const [isCandleBlown, setIsCandleBlown] = useState(false);
  const [imgSrc, setImgSrc] = useState(finalPhoto);
  const [imgError, setImgError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setImgSrc(finalPhoto);
    setImgError(false);
  }, [finalPhoto]);

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImgSrc(dataUrl);
      setImgError(false);
      onUpdateHeroPhoto?.(dataUrl);
      soundEngine.playSparkleSound();
    } catch (err) {
      console.error('Failed to read photo:', err);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImgSrc(dataUrl);
      setImgError(false);
      onUpdateHeroPhoto?.(dataUrl);
      soundEngine.playSparkleSound();
    } catch (err) {
      console.error('Failed to read dropped photo:', err);
    }
  };

  const handleRevealLetter = () => {
    soundEngine.playSparkleSound();
    setIsLetterRevealed(true);

    confetti({
      particleCount: 70,
      spread: 70,
      origin: { y: 0.8 },
      colors: ['#F472B6', '#FB7185', '#FDE047', '#E879F9']
    });
  };

  const handleTriggerGrandCelebration = () => {
    soundEngine.playCelebrationChime();
    setIsCelebrationActive(true);

    // Continuous celebratory confetti fireworks
    const duration = 3.5 * 1000;
    const animationEnd = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 65,
        origin: { x: 0 },
        colors: ['#FF69B4', '#FFB6C1', '#FDE047', '#C084FC']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 65,
        origin: { x: 1 },
        colors: ['#FF69B4', '#FFB6C1', '#FDE047', '#C084FC']
      });

      if (Date.now() < animationEnd) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const handleBlowCandle = () => {
    soundEngine.playSparkleSound();
    setIsCandleBlown(true);

    confetti({
      particleCount: 90,
      spread: 90,
      origin: { y: 0.5 },
      colors: ['#F43F5E', '#EC4899', '#D946EF', '#8B5CF6', '#F59E0B']
    });
  };

  return (
    <section id="final-surprise-section" className="py-16 sm:py-24 px-4 bg-gradient-to-b from-transparent to-pink-100/60">
      <div className="max-w-4xl mx-auto text-center">
        {/* Teaser Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-100 text-rose-700 text-xs font-semibold uppercase tracking-wider mb-4 animate-pulse-glow">
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
            <span>Grand Finale</span>
            <Sparkles className="w-3.5 h-3.5 text-rose-500" />
          </div>

          <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-handwriting mb-4">
            {teaser}
          </h2>

          <p className="text-stone-600 text-base sm:text-lg max-w-md mx-auto">
            Before your birthday journey ends, there's one more note meant strictly for your eyes.
          </p>
        </div>

        {/* Initial Trigger Button if not revealed yet */}
        {!isLetterRevealed ? (
          <div className="py-8">
            <button
              id="open-final-letter-btn"
              type="button"
              onClick={handleRevealLetter}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-500 to-purple-500 text-white font-bold text-lg shadow-xl hover:shadow-pink-300/60 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <Heart className="w-5 h-5 fill-white group-hover:scale-125 transition-transform" />
              <span>{buttonText}</span>
              <Sparkles className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </button>
          </div>
        ) : (
          /* Revealed Final Letter & Scrapbook Layout */
          <div className="space-y-12 animate-fadeIn">
            {/* The Final Letter Paper */}
            <div className="paper-card rounded-3xl p-6 sm:p-12 border-2 border-pink-200 shadow-2xl relative max-w-3xl mx-auto notebook-paper text-left">
              {/* Washi tape accents */}
              <div className="absolute -top-3.5 left-1/3 -translate-x-1/2 w-32 h-6 washi-tape-lavender rounded-xs transform -rotate-2" />
              <div className="absolute -top-3.5 right-1/4 w-28 h-6 washi-tape rounded-xs transform rotate-2" />

              <div className="space-y-5 font-handwriting text-2xl sm:text-3xl text-stone-800 leading-relaxed pt-3">
                {letter.map((line, idx) => (
                  <p key={idx} className={idx === 0 || idx === letter.length - 1 ? 'font-bold text-pink-700 text-3xl sm:text-4xl' : ''}>
                    {line}
                  </p>
                ))}
              </div>

              {/* Heart Stamp Signature */}
              <div className="mt-8 pt-4 border-t border-dashed border-stone-300 flex items-center justify-between">
                <span className="text-xs font-sans text-stone-400 uppercase tracking-widest">
                  Forever & Always • Unconditional Best Friends
                </span>
                <span className="text-2xl">💌</span>
              </div>
            </div>

            {/* Final Large Polaroid Photo */}
            <div className="relative mx-auto max-w-sm sm:max-w-md group">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-36 h-6 washi-tape-peach rounded-xs transform -rotate-1 z-10" />

              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`bg-white p-4 sm:p-5 pb-8 sm:pb-10 rounded-2xl shadow-2xl border transition-all duration-300 transform rotate-1 group-hover:rotate-0 ${
                  isDragging ? 'border-pink-500 ring-4 ring-pink-200 scale-102' : 'border-stone-200'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />

                <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-pink-50 flex items-center justify-center">
                  {!imgError ? (
                    <>
                      <img
                        src={imgSrc}
                        alt="Forever Us"
                        onError={() => {
                          if (imgSrc !== finalPhotoFallback) {
                            setImgSrc(finalPhotoFallback);
                          } else {
                            setImgError(true);
                          }
                        }}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        title="Upload our exact photo"
                        className="absolute bottom-2.5 right-2.5 z-20 bg-white/90 hover:bg-white text-stone-700 hover:text-pink-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border border-pink-200 transition-all flex items-center gap-1.5 backdrop-blur-xs cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
                      >
                        <Camera className="w-3.5 h-3.5 text-pink-500" />
                        <span>Upload photo</span>
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-stone-500">
                      <Camera className="w-8 h-8 text-pink-400 mb-1" />
                      <p className="font-handwriting text-xl text-stone-700 font-bold">
                        📸 Add our final memory
                      </p>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="mt-2 text-xs font-semibold text-pink-600 underline"
                      >
                        Upload final photo
                      </button>
                    </div>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <p className="font-handwriting text-3xl sm:text-4xl text-pink-600 font-bold">
                    {caption}
                  </p>
                  <p className="text-xs font-sans text-stone-400 mt-1 uppercase tracking-wider">
                    To infinity and beyond
                  </p>
                </div>
              </div>
            </div>

            {/* FINAL INTERACTION TRIGGER BUTTON: "One last surprise ✨" */}
            <div className="pt-8 pb-4">
              <button
                id="one-last-surprise-btn"
                type="button"
                onClick={handleTriggerGrandCelebration}
                className="group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-5 rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 text-white font-extrabold text-lg sm:text-xl shadow-2xl hover:shadow-pink-300/70 hover:scale-105 active:scale-95 transition-all cursor-pointer animate-pulse-glow"
              >
                <Sparkles className="w-6 h-6 animate-spin" />
                <span>One last surprise ✨</span>
                <Heart className="w-6 h-6 fill-white group-hover:scale-125 transition-transform" />
              </button>
            </div>
          </div>
        )}

        {/* FULL SCREEN CELEBRATION MODAL */}
        {isCelebrationActive && (
          <div
            id="grand-celebration-screen"
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto animate-fadeIn"
          >
            {/* Floating balloons / stars decoration */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
              <div className="absolute top-10 left-[10%] text-4xl animate-bounce">🎈</div>
              <div className="absolute top-16 right-[12%] text-4xl animate-bounce" style={{ animationDelay: '0.2s' }}>🎈</div>
              <div className="absolute bottom-16 left-[15%] text-4xl animate-bounce" style={{ animationDelay: '0.4s' }}>🎈</div>
              <div className="absolute bottom-20 right-[15%] text-4xl animate-bounce" style={{ animationDelay: '0.3s' }}>🎈</div>
              <div className="absolute top-1/3 left-[5%] text-3xl animate-pulse">✨</div>
              <div className="absolute top-1/2 right-[6%] text-3xl animate-pulse">💖</div>
            </div>

            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsCelebrationActive(false)}
              className="absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer z-50"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Celebration Core Card */}
            <div className="relative max-w-lg w-full bg-white rounded-3xl p-6 sm:p-10 text-center shadow-2xl border-4 border-pink-300 animate-scaleUp z-10 paper-card">
              {/* Animated Birthday Cake Graphic */}
              <div className="relative mb-6">
                <div className="text-7xl sm:text-8xl select-none inline-block relative">
                  🎂
                  {/* Flickering candle flame if not blown out */}
                  {!isCandleBlown && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
                      <Flame className="w-8 h-8 text-amber-400 fill-amber-300 animate-pulse" />
                    </div>
                  )}
                </div>
              </div>

              {/* Celebration Title */}
              <h2 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-handwriting leading-tight mb-2">
                HAPPY BIRTHDAY <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500">
                  {bestFriendName.toUpperCase()}!! 🎂💗
                </span>
              </h2>

              <p className="text-stone-600 font-handwriting text-2xl mb-6">
                May your year be as extraordinary, hilarious, and radiant as you are.
              </p>

              {/* Candle Blowing Interaction */}
              <div className="p-4 rounded-2xl bg-pink-50 border border-pink-200 mb-6">
                {!isCandleBlown ? (
                  <div className="space-y-3">
                    <p className="text-xs uppercase tracking-widest text-pink-600 font-bold">
                      Interactive Birthday Moment
                    </p>
                    <p className="font-handwriting text-2xl text-stone-800 font-bold">
                      Close your eyes, make a wish... ✨
                    </p>
                    <button
                      type="button"
                      onClick={handleBlowCandle}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-bold shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    >
                      <span>🌬️ Blow out the candle!</span>
                    </button>
                  </div>
                ) : (
                  <div className="animate-fadeIn space-y-1">
                    <p className="font-handwriting text-3xl text-pink-600 font-bold">
                      Wish Made & Sent To The Universe! 🌟
                    </p>
                    <p className="text-xs text-stone-500">
                      Everything you wished for is on its way to you.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    confetti({
                      particleCount: 100,
                      spread: 80,
                      colors: ['#FF69B4', '#F43F5E', '#FBBF24', '#A855F7']
                    });
                    soundEngine.playSparkleSound();
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-700 text-sm font-semibold transition-colors cursor-pointer"
                >
                  🎉 More Confetti!
                </button>

                <button
                  type="button"
                  onClick={() => setIsCelebrationActive(false)}
                  className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Return to surprise site ♡
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
