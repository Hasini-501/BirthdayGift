import React, { useEffect, useState } from 'react';
import { Music, VolumeX, Sparkles, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface NavbarProps {
  bestFriendName: string;
  customAudioUrl?: string;
  songTitle?: string;
  songArtist?: string;
  onOpenEditor: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  bestFriendName,
  customAudioUrl,
  songTitle = 'Belong Together',
  songArtist = 'Mark Ambor',
  onOpenEditor,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isPlayingMusic, setIsPlayingMusic] = useState(soundEngine.getIsPlaying());

  useEffect(() => {
    setIsPlayingMusic(soundEngine.getIsPlaying());
    const unsubscribe = soundEngine.subscribe((status) => {
      setIsPlayingMusic(status);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, progress)));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleToggleMusic = () => {
    soundEngine.toggleMusic(customAudioUrl, (status) => {
      setIsPlayingMusic(status);
    });
  };

  return (
    <>
      {/* Top Reading/Surprise Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1.5 z-40 bg-pink-100/50">
        <div
          className="h-full bg-gradient-to-r from-pink-400 via-rose-400 to-purple-400 transition-all duration-150 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Floating Header */}
      <header className="sticky top-2 z-30 px-3 sm:px-6 py-2 max-w-5xl mx-auto">
        <div className="backdrop-blur-md bg-white/80 border border-pink-200/80 rounded-full px-4 sm:px-6 py-2 shadow-sm flex items-center justify-between gap-2">
          {/* Logo / Scrapbook Tag */}
          <a
            href="#hero"
            className="flex items-center gap-1.5 sm:gap-2 group text-stone-700 hover:text-pink-600 transition-colors"
          >
            <span className="text-lg">🎀</span>
            <span className="font-handwriting text-xl sm:text-2xl font-bold text-stone-800">
              For {bestFriendName}
            </span>
            <Heart className="w-3.5 h-3.5 fill-pink-400 text-pink-400 group-hover:scale-125 transition-transform" />
          </a>

          {/* Center quick stats indicator */}
          <div className="hidden md:flex items-center gap-2 text-xs text-stone-500 font-medium">
            <span className="inline-block w-2 h-2 rounded-full bg-pink-400 animate-ping" />
            <span>Surprise Progress: {Math.round(scrollProgress)}% explored</span>
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Music Control Button */}
            <button
              id="music-toggle-btn"
              type="button"
              onClick={handleToggleMusic}
              title={isPlayingMusic ? `Pause "${songTitle}" by ${songArtist}` : `Play "${songTitle}" by ${songArtist}`}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                isPlayingMusic
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md shadow-pink-200 scale-105'
                  : 'bg-pink-50 text-pink-700 hover:bg-pink-100 border border-pink-200'
              }`}
            >
              {isPlayingMusic ? (
                <>
                  <Music className="w-3.5 h-3.5 animate-bounce text-pink-100" />
                  <span className="hidden sm:inline font-semibold">🎵 Belong Together</span>
                  <span className="sm:hidden font-semibold">🎵 Belong Together</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3.5 h-3.5 text-stone-400" />
                  <span className="hidden sm:inline">▶ Belong Together 🎶</span>
                  <span className="sm:hidden">▶ Play 🎶</span>
                </>
              )}
            </button>

            {/* Unobtrusive Edit Button for the Creator */}
            <button
              id="open-editor-btn"
              type="button"
              onClick={onOpenEditor}
              title="Edit photos, names and captions"
              className="inline-flex items-center gap-1 px-2.5 sm:px-3 py-1.5 rounded-full text-xs text-stone-500 hover:text-stone-800 hover:bg-stone-100 border border-stone-200/80 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">✨ Edit memories</span>
              <span className="sm:hidden">Edit</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};
