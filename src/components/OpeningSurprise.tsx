import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, Heart, Gift, Mail } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface OpeningSurpriseProps {
  bestFriendName: string;
  onOpened: () => void;
  isAlreadyOpened?: boolean;
  customAudioUrl?: string;
}

export const OpeningSurprise: React.FC<OpeningSurpriseProps> = ({
  bestFriendName,
  onOpened,
  isAlreadyOpened = false,
  customAudioUrl,
}) => {
  const [isOpen, setIsOpen] = useState(isAlreadyOpened);
  const [isOpening, setIsOpening] = useState(false);
  const [typewriterText, setTypewriterText] = useState('');
  const fullTypewriter = `Happy Birthday, ${bestFriendName}!! 🥹💗`;

  const handleOpen = () => {
    if (isOpening || isOpen) return;
    setIsOpening(true);

    soundEngine.playSparkleSound();
    // Start "Belong Together" by Mark Ambor
    soundEngine.startMusic(customAudioUrl);

    // Trigger celebratory confetti cannon
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#FFB6C1', '#FFC0CB', '#E6E6FA', '#FFDAB9', '#FFE4E1', '#FF69B4']
    });

    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0.1, y: 0.7 },
        colors: ['#FF69B4', '#FFB6C1', '#D8BFD8', '#FFF0F5']
      });
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 0.9, y: 0.7 },
        colors: ['#FF69B4', '#FFB6C1', '#D8BFD8', '#FFF0F5']
      });
    }, 250);

    // Typewriter effect
    let charIndex = 0;
    const interval = setInterval(() => {
      if (charIndex <= fullTypewriter.length) {
        setTypewriterText(fullTypewriter.slice(0, charIndex));
        charIndex++;
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setIsOpen(true);
          onOpened();
        }, 1200);
      }
    }, 45);
  };

  if (isOpen) {
    return null;
  }

  return (
    <div
      id="opening-surprise-screen"
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#FFF8F6] px-4 py-8 overflow-y-auto transition-opacity duration-700"
    >
      {/* Background Floating Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-[10%] text-2xl opacity-60 animate-bounce">🎀</div>
        <div className="absolute top-24 right-[15%] text-2xl opacity-50 animate-pulse">✨</div>
        <div className="absolute bottom-20 left-[12%] text-3xl opacity-40 animate-soft-float">🌸</div>
        <div className="absolute bottom-16 right-[14%] text-2xl opacity-60 animate-soft-float">💌</div>
        <div className="absolute top-1/3 left-[5%] text-xl opacity-40">⭐</div>
        <div className="absolute top-1/2 right-[8%] text-xl opacity-40">💖</div>
      </div>

      <div className="relative w-full max-w-lg mx-auto text-center z-10">
        {/* Cute Header Ribbon */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 rounded-full bg-pink-100 text-pink-700 text-sm font-medium shadow-sm border border-pink-200/70">
          <span className="animate-spin text-xs">✨</span>
          <span>A secret delivery just for you</span>
          <span className="animate-spin text-xs">✨</span>
        </div>

        {/* Surprise Box / Envelope Graphic */}
        <div className="relative mx-auto w-64 h-64 sm:w-72 sm:h-72 mb-8 flex items-center justify-center">
          {/* Soft back glow */}
          <div className="absolute inset-0 bg-gradient-to-tr from-pink-200 via-rose-100 to-purple-200 rounded-full blur-2xl opacity-70 animate-pulse-glow" />

          {/* Envelope & Gift Container */}
          <div
            className={`relative w-56 h-56 sm:w-64 sm:h-64 rounded-3xl paper-card border-2 border-pink-200 shadow-xl flex flex-col items-center justify-center p-6 transition-all duration-700 ${
              isOpening ? 'scale-105 rotate-1 shadow-2xl bg-white' : 'hover:scale-[1.02] hover:-rotate-1'
            }`}
          >
            {/* Washi tape decoration */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-28 h-6 washi-tape rounded-sm transform -rotate-1" />

            {!isOpening ? (
              <div className="flex flex-col items-center justify-center">
                <div className="relative mb-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-md transform transition-transform group-hover:rotate-6">
                    <Gift className="w-10 h-10 animate-bounce" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-pink-200 text-pink-500">
                    <Heart className="w-4 h-4 fill-pink-400" />
                  </div>
                </div>
                <p className="text-xs uppercase tracking-widest text-pink-500 font-semibold mb-1">
                  Confidential & Cute
                </p>
                <p className="font-handwriting text-2xl text-stone-700">
                  To: My Bestie 💗
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center px-2 animate-fadeIn">
                <div className="text-4xl mb-3 animate-bounce">💌</div>
                <p className="font-handwriting text-2xl sm:text-3xl text-pink-600 font-bold leading-tight min-h-[3.5rem] flex items-center justify-center">
                  {typewriterText}
                  <span className="inline-block w-1 h-6 bg-pink-500 ml-1 animate-pulse" />
                </p>
                <p className="text-xs text-stone-400 mt-2">Unwrapping your birthday world...</p>
              </div>
            )}
          </div>
        </div>

        {/* Introductory Text */}
        <div className="space-y-3 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight">
            Someone very special has a birthday today... 🎀
          </h1>
          <p className="text-base sm:text-lg text-stone-600 font-handwriting text-2xl">
            I made you a little something 💌
          </p>
        </div>

        {/* Action Button */}
        {!isOpening ? (
          <button
            id="open-surprise-btn"
            type="button"
            onClick={handleOpen}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-pink-500 text-white font-semibold text-lg shadow-lg hover:shadow-pink-300/50 hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
          >
            <Sparkles className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            <span>Open your surprise ✨</span>
            <Heart className="w-5 h-5 fill-white/80 group-hover:scale-125 transition-transform" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-pink-50 border border-pink-200 text-pink-600 text-sm font-medium animate-pulse">
            <Sparkles className="w-4 h-4" />
            Opening with lots of love...
          </div>
        )}

        {/* Bottom subtle note */}
        <p className="mt-8 text-xs text-stone-400">
          Turn up your sound for <span className="text-pink-600 font-medium">"Belong Together" by Mark Ambor</span> 🎵
        </p>
      </div>
    </div>
  );
};
