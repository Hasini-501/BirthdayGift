import React, { useState, useEffect } from 'react';
import { MemoryItem } from '../config';
import { Camera, X, ChevronLeft, ChevronRight, Sparkles, Heart, Plus } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MemoriesSectionProps {
  memories: MemoryItem[];
  onOpenEditor: () => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({
  memories,
  onOpenEditor,
}) => {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  // Display initial 6 or all photos
  const displayedMemories = showAll ? memories : memories.slice(0, 6);

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
  };

  const openLightbox = (index: number) => {
    setSelectedPhotoIndex(index);
    soundEngine.playCardFlip();
  };

  const closeLightbox = () => {
    setSelectedPhotoIndex(null);
  };

  const nextPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex + 1) % displayedMemories.length);
    }
  };

  const prevPhoto = () => {
    if (selectedPhotoIndex !== null) {
      setSelectedPhotoIndex((selectedPhotoIndex - 1 + displayedMemories.length) % displayedMemories.length);
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedPhotoIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedPhotoIndex, displayedMemories.length]);

  return (
    <section id="memories-section" className="py-12 sm:py-16 px-4 bg-[#FFF6F8]/60">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Chapter 02</span>
            <span>•</span>
            <span>Scrapbook Wall</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-stone-900 font-handwriting">
            Our little memories 📸
          </h2>
          <p className="text-sm sm:text-base text-stone-600 max-w-lg mx-auto mt-2">
            Click any polaroid to zoom in! Every photo holds a thousand unhinged laughs.
          </p>
        </div>

        {/* Polaroid Scrapbook Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {displayedMemories.map((item, index) => {
            const isMissing = failedImages[item.id];
            // Rotate angle alternates
            const rotation = item.rotation ?? (index % 2 === 0 ? -2.5 : 2.5);

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(index)}
                style={{ transform: `rotate(${rotation}deg)` }}
                className="group relative cursor-pointer transition-all duration-300 hover:scale-105 hover:rotate-0 hover:z-20 hover:shadow-2xl"
              >
                {/* Scrapbook washi tape */}
                <div
                  className={`absolute -top-3.5 left-1/2 -translate-x-1/2 w-24 sm:w-28 h-6 z-10 rounded-xs ${
                    index % 3 === 0
                      ? 'washi-tape'
                      : index % 3 === 1
                      ? 'washi-tape-lavender'
                      : 'washi-tape-peach'
                  }`}
                />

                {/* Polaroid Frame */}
                <div className="bg-white p-3.5 sm:p-4 pb-7 sm:pb-8 rounded-2xl shadow-lg border border-stone-200 flex flex-col justify-between h-full">
                  {/* Image Container */}
                  <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                    {!isMissing ? (
                      <img
                        src={item.image}
                        alt={item.caption}
                        loading="lazy"
                        onError={() => {
                          if (item.fallbackImage) {
                            // If primary local photo is not found, attempt fallback image
                            const img = new Image();
                            img.src = item.fallbackImage;
                            img.onload = () => {
                              item.image = item.fallbackImage;
                              setFailedImages(prev => ({ ...prev }));
                            };
                            img.onerror = () => handleImageError(item.id);
                          } else {
                            handleImageError(item.id);
                          }
                        }}
                        className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4 text-center text-stone-500 bg-pink-50/70 w-full h-full">
                        <Camera className="w-8 h-8 text-pink-400 mb-1" />
                        <p className="font-handwriting text-lg font-bold text-stone-700">
                          📸 Add a memory here
                        </p>
                        <p className="text-[11px] text-stone-400 mt-1 max-w-[180px] leading-tight">
                          Drop in <code className="text-pink-600 font-semibold">{item.image}</code> or click Edit memories!
                        </p>
                      </div>
                    )}

                    {/* Tag badge */}
                    {item.tag && (
                      <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[10px] font-semibold text-stone-700 shadow-xs border border-stone-200">
                        {item.tag}
                      </div>
                    )}
                  </div>

                  {/* Caption */}
                  <div className="mt-3.5 text-center px-1">
                    <p className="font-handwriting text-xl sm:text-2xl text-stone-800 font-bold leading-snug">
                      {item.caption}
                    </p>
                    {item.date && (
                      <span className="text-[11px] font-sans text-stone-400 tracking-wider uppercase block mt-1">
                        {item.date}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Controls: "More memories →" & "✨ Add photos" */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          {memories.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border-2 border-pink-200 text-pink-700 font-semibold text-sm shadow-sm hover:bg-pink-50 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              <span>{showAll ? 'Show fewer memories' : 'More memories →'}</span>
              <Heart className="w-4 h-4 fill-pink-300" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenEditor}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-pink-100 hover:bg-pink-200 text-pink-800 font-medium text-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Upload or change photos</span>
          </button>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedPhotoIndex !== null && (
        <div
          id="photo-lightbox"
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 select-none animate-fadeIn"
          onClick={closeLightbox}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2.5 rounded-full transition-colors cursor-pointer"
            title="Close (Esc)"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Navigation Prev */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevPhoto();
            }}
            className="absolute left-3 sm:left-6 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer"
            title="Previous (Left arrow)"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Navigation Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextPhoto();
            }}
            className="absolute right-3 sm:right-6 z-50 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-3 rounded-full transition-colors cursor-pointer"
            title="Next (Right arrow)"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Polaroid Inside Lightbox */}
          <div
            className="relative max-w-xl w-full bg-white p-4 sm:p-6 pb-8 sm:pb-10 rounded-3xl shadow-2xl border border-stone-200 transition-all duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-stone-900">
              <img
                src={displayedMemories[selectedPhotoIndex].image}
                alt={displayedMemories[selectedPhotoIndex].caption}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-5 text-center">
              <p className="font-handwriting text-3xl sm:text-4xl text-stone-900 font-bold">
                {displayedMemories[selectedPhotoIndex].caption}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 text-xs text-stone-400 font-sans uppercase tracking-widest">
                <span>{displayedMemories[selectedPhotoIndex].date || 'Best memory'}</span>
                <span>•</span>
                <span>Photo {selectedPhotoIndex + 1} of {displayedMemories.length}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
