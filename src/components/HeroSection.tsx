import React, { useState, useRef } from 'react';
import { Heart, Sparkles, Cake, Camera, ArrowDown, Upload, RefreshCw } from 'lucide-react';
import { readFileAsDataUrl } from '../utils/photoStorage';
import { soundEngine } from '../utils/audio';

interface HeroSectionProps {
  bestFriendName: string;
  subtitle: string;
  badge: string;
  heroImage: string;
  heroImageFallback: string;
  onOpenEditor: () => void;
  onUpdateHeroPhoto?: (dataUrl: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  bestFriendName,
  subtitle,
  badge,
  heroImage,
  heroImageFallback,
  onOpenEditor,
  onUpdateHeroPhoto,
}) => {
  const [imgSrc, setImgSrc] = useState(heroImage);
  const [hasError, setHasError] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setImgSrc(heroImage);
    setHasError(false);
  }, [heroImage]);

  const handleImageError = () => {
    if (imgSrc !== heroImageFallback) {
      setImgSrc(heroImageFallback);
    } else {
      setHasError(true);
    }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setImgSrc(dataUrl);
      setHasError(false);
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
      setHasError(false);
      onUpdateHeroPhoto?.(dataUrl);
      soundEngine.playSparkleSound();
    } catch (err) {
      console.error('Failed to read dropped photo:', err);
    }
  };

  return (
    <section id="hero" className="relative pt-6 sm:pt-12 pb-16 px-4 overflow-hidden">
      {/* Floating background stickers/hearts/stars */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
        <span className="absolute top-12 left-[8%] text-3xl opacity-60 animate-soft-float">🌸</span>
        <span className="absolute top-20 right-[12%] text-2xl opacity-70 animate-bounce">💖</span>
        <span className="absolute bottom-24 left-[15%] text-2xl opacity-50 animate-pulse">✨</span>
        <span className="absolute bottom-16 right-[10%] text-3xl opacity-60 animate-soft-float">🎀</span>
        <span className="absolute top-1/2 left-[3%] text-xl opacity-40">⭐</span>
        <span className="absolute top-2/3 right-[4%] text-2xl opacity-50">🍰</span>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-100/90 border border-pink-200 text-pink-700 text-sm font-medium shadow-sm mb-6 animate-pulse-glow">
          <Cake className="w-4 h-4 text-pink-500 animate-bounce" />
          <span>{badge}</span>
          <Sparkles className="w-4 h-4 text-pink-500" />
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4">
          Happy Birthday,{' '}
          <span className="font-handwriting text-pink-500 underline decoration-pink-300 decoration-wavy decoration-2 block sm:inline">
            {bestFriendName} 💗
          </span>
        </h1>

        {/* Subtitle */}
        <p className="max-w-2xl mx-auto text-stone-600 text-lg sm:text-xl md:text-2xl font-handwriting leading-relaxed mb-10">
          "{subtitle}"
        </p>

        {/* Polaroid Scrapbook Photo Container */}
        <div className="relative mx-auto max-w-sm sm:max-w-md mb-10 group">
          {/* Top Washi Tape */}
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 w-36 h-7 washi-tape z-20 transform -rotate-2 rounded-xs" />

          {/* Cute Stamp Sticker */}
          <div className="absolute -bottom-4 -right-3 z-20 bg-rose-500 text-white font-handwriting text-base sm:text-lg font-bold px-3.5 py-1 rounded-full shadow-md transform rotate-6 border-2 border-white flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Birthday Star 👑</span>
          </div>

          <div className="absolute -top-3 -left-3 z-20 bg-amber-100 text-amber-800 font-handwriting text-sm font-semibold px-2.5 py-0.5 rounded-md shadow-sm border border-amber-200 transform -rotate-6">
            ✨ Pure Sunshine
          </div>

          {/* Polaroid Frame */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`bg-white p-4 sm:p-5 pb-8 sm:pb-10 rounded-2xl shadow-xl border transition-all duration-300 transform -rotate-1 group-hover:rotate-0 ${
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
              {!hasError ? (
                <>
                  <img
                    src={imgSrc}
                    alt={`Happy birthday ${bestFriendName}`}
                    onError={handleImageError}
                    className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    loading="eager"
                  />
                  {/* Subtle photo change pill */}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload Sailu's original photo (keeps face 100% exact)"
                    className="absolute bottom-2.5 right-2.5 z-20 bg-white/90 hover:bg-white text-stone-700 hover:text-pink-600 px-3 py-1.5 rounded-full text-xs font-semibold shadow-md border border-pink-200 transition-all flex items-center gap-1.5 backdrop-blur-xs cursor-pointer opacity-90 hover:opacity-100 hover:scale-105"
                  >
                    <Camera className="w-3.5 h-3.5 text-pink-500" />
                    <span>Upload real photo</span>
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center text-stone-500">
                  <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center text-pink-500 mb-2">
                    <Camera className="w-7 h-7" />
                  </div>
                  <p className="font-handwriting text-xl text-stone-700 font-bold mb-1">
                    📸 Add a memory here
                  </p>
                  <p className="text-xs text-stone-400 max-w-xs">
                    Put your photo in <code className="bg-stone-100 px-1 py-0.5 rounded text-pink-600">public/photos/hero.jpg</code> or tap upload!
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-pink-500 text-white rounded-full text-xs font-semibold hover:bg-pink-600 shadow-sm"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Select photo</span>
                  </button>
                </div>
              )}
            </div>

            {/* Polaroid Handwritten Caption */}
            <div className="mt-4 text-center">
              <p className="font-handwriting text-2xl sm:text-3xl text-stone-800 font-bold">
                The most gorgeous human on her special day ♡
              </p>
              <p className="text-xs text-stone-400 tracking-wider uppercase mt-1">
                Cherished Forever • Best Friend Edition
              </p>
            </div>
          </div>
        </div>

        {/* Scroll down prompt */}
        <div className="flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-pink-500 transition-colors">
          <span className="font-handwriting text-xl text-stone-600">
            Scroll down for your surprises 💌
          </span>
          <a
            href="#letter-section"
            className="w-9 h-9 rounded-full bg-white border border-pink-200 flex items-center justify-center shadow-sm hover:scale-110 active:scale-95 transition-all text-pink-500 animate-bounce"
          >
            <ArrowDown className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
};
