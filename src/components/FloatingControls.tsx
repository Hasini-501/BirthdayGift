import React, { useState, useEffect } from 'react';
import { Heart, ArrowUp } from 'lucide-react';
import { soundEngine } from '../utils/audio';

export const FloatingControls: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    soundEngine.playSparkleSound();
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-center gap-3 select-none">
      {/* Scroll to top floating "♡" button */}
      {showScrollTop && (
        <button
          id="scroll-to-top-btn"
          type="button"
          onClick={scrollToTop}
          title="Scroll back to top ♡"
          className="group w-12 h-12 rounded-full bg-white/95 border-2 border-pink-300 text-pink-500 shadow-xl hover:shadow-pink-200/80 flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 backdrop-blur-xs cursor-pointer animate-fadeIn"
        >
          <div className="relative flex items-center justify-center">
            <Heart className="w-5 h-5 fill-pink-400 group-hover:scale-125 transition-transform" />
            <ArrowUp className="w-2.5 h-2.5 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <span className="sr-only">Scroll to top</span>
        </button>
      )}
    </div>
  );
};
