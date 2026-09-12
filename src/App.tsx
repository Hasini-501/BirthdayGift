/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * =========================================================================
 * 💌 FOR ME (QUICK SETUP INSTRUCTIONS):
 * 1. Open public/photos
 * 2. Put your birthday photos there
 * 3. Name them photo1.jpg, photo2.jpg, etc.
 * 4. Change captions & names in src/config.ts
 * 5. Or click the "✨ Edit memories" button in the top right to upload photos
 *    and customize names directly in your browser without code!
 * =========================================================================
 */

import React, { useState, useEffect } from 'react';
import { BIRTHDAY_CONFIG, MemoryItem } from './config';
import {
  getStoredMemories,
  saveStoredMemories,
  clearStoredMemories,
  getStoredHeroPhoto,
  saveStoredHeroPhoto,
  clearStoredHeroPhoto,
} from './utils/photoStorage';

import { OpeningSurprise } from './components/OpeningSurprise';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { LetterSection } from './components/LetterSection';
import { MemoriesSection } from './components/MemoriesSection';
import { ReasonsSection } from './components/ReasonsSection';
import { NumbersSection } from './components/NumbersSection';
import { SurpriseBoxesSection } from './components/SurpriseBoxesSection';
import { WishListSection } from './components/WishListSection';
import { QuizSection } from './components/QuizSection';
import { TimelineSection } from './components/TimelineSection';
import { FinalSurpriseSection } from './components/FinalSurpriseSection';
import { FloatingControls } from './components/FloatingControls';
import { MusicPlayer } from './components/MusicPlayer';
import { EditMemoriesModal } from './components/EditMemoriesModal';
import { Heart, Sparkles } from 'lucide-react';

export default function App() {
  const [hasOpenedSurprise, setHasOpenedSurprise] = useState(false);
  const [bestFriendName, setBestFriendName] = useState(BIRTHDAY_CONFIG.bestFriendName);
  const [memories, setMemories] = useState<MemoryItem[]>(BIRTHDAY_CONFIG.memories);
  const [customHeroPhoto, setCustomHeroPhoto] = useState<string | null>(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  // Helper to persist to server files so they stay in ZIP and GitHub
  const syncToProjectFiles = async (name: string, hero: string | null, memoryItems: MemoryItem[]) => {
    try {
      const res = await fetch('/api/save-custom-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bestFriendName: name,
          heroPhoto: hero || '',
          memories: memoryItems,
        })
      });
      if (res.ok) {
        setSyncStatus('Photos & content saved to project files for GitHub / ZIP export!');
        setTimeout(() => setSyncStatus(null), 6000);
      }
    } catch {
      // ignore
    }
  };

  // Load any stored photos from IndexedDB/localStorage
  useEffect(() => {
    async function loadData() {
      const stored = await getStoredMemories();
      let currentMemories = BIRTHDAY_CONFIG.memories;
      if (stored && stored.length > 0) {
        setMemories(stored);
        currentMemories = stored;
      }
      const savedHeroPhoto = await getStoredHeroPhoto();
      if (savedHeroPhoto) {
        setCustomHeroPhoto(savedHeroPhoto);
      }
      const savedName = localStorage.getItem('bestie_name_pref');
      const resolvedName = (savedName && savedName !== 'Emily') ? savedName : BIRTHDAY_CONFIG.bestFriendName;
      setBestFriendName(resolvedName);

      // If user has uploaded custom pictures (data: URLs), sync them to project files!
      const hasUploadedPhotos = (stored && stored.some(m => m.image?.startsWith('data:image/'))) ||
        (savedHeroPhoto && savedHeroPhoto.startsWith('data:image/'));

      if (hasUploadedPhotos) {
        syncToProjectFiles(resolvedName, savedHeroPhoto || null, currentMemories);
      }
    }
    loadData();
  }, []);

  const handleSaveMemories = async (updated: MemoryItem[]) => {
    setMemories(updated);
    await saveStoredMemories(updated);
    syncToProjectFiles(bestFriendName, customHeroPhoto, updated);
  };

  const handleUpdateHeroPhoto = async (photoDataUrl: string) => {
    setCustomHeroPhoto(photoDataUrl);
    await saveStoredHeroPhoto(photoDataUrl);
    syncToProjectFiles(bestFriendName, photoDataUrl, memories);
  };

  const handleChangeName = (newName: string) => {
    setBestFriendName(newName);
    localStorage.setItem('bestie_name_pref', newName);
    syncToProjectFiles(newName, customHeroPhoto, memories);
  };

  const handleResetDefaults = async () => {
    await clearStoredMemories();
    await clearStoredHeroPhoto();
    setCustomHeroPhoto(null);
    localStorage.removeItem('bestie_name_pref');
    setMemories(BIRTHDAY_CONFIG.memories);
    setBestFriendName(BIRTHDAY_CONFIG.bestFriendName);
  };

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-[#4A3E3D] selection:bg-[#FFD1DC] selection:text-[#5B2C37] relative flex flex-col justify-between">
      {/* Sync Status Banner */}
      {syncStatus && (
        <div className="bg-emerald-600 text-white text-xs sm:text-sm font-semibold py-2 px-4 text-center shadow-md flex items-center justify-center gap-2 z-50 sticky top-0 animate-fadeIn">
          <Sparkles className="w-4 h-4 text-yellow-300 shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* 1. LANDING / OPENING SURPRISE SCREEN */}
      <OpeningSurprise
        bestFriendName={bestFriendName}
        customAudioUrl={BIRTHDAY_CONFIG.music.customAudioUrl}
        onOpened={() => setHasOpenedSurprise(true)}
        isAlreadyOpened={hasOpenedSurprise}
      />

      {/* 2. NAVIGATION & TOP CONTROLS */}
      <Navbar
        bestFriendName={bestFriendName}
        customAudioUrl={BIRTHDAY_CONFIG.music.customAudioUrl}
        songTitle={BIRTHDAY_CONFIG.music.title}
        songArtist={BIRTHDAY_CONFIG.music.artist}
        onOpenEditor={() => setIsEditorOpen(true)}
      />

      {/* MAIN SURPRISE CONTENT CONTAINER */}
      <main className="flex-1 w-full overflow-x-hidden">
        {/* HERO SECTION */}
        <HeroSection
          bestFriendName={bestFriendName}
          subtitle={BIRTHDAY_CONFIG.heroSubtitle}
          badge={BIRTHDAY_CONFIG.heroBadge}
          heroImage={customHeroPhoto || BIRTHDAY_CONFIG.heroImage}
          heroImageFallback={BIRTHDAY_CONFIG.heroImageFallback}
          onOpenEditor={() => setIsEditorOpen(true)}
          onUpdateHeroPhoto={handleUpdateHeroPhoto}
        />

        {/* SECTION 1: A LITTLE LETTER FOR YOU */}
        <LetterSection
          heading={BIRTHDAY_CONFIG.letter.heading}
          salutation={BIRTHDAY_CONFIG.letter.salutation}
          paragraphs={BIRTHDAY_CONFIG.letter.paragraphs}
          signature={BIRTHDAY_CONFIG.letter.signature}
          bestFriendName={bestFriendName}
        />

        {/* SECTION 2: OUR LITTLE MEMORIES (POLAROID SCRAPBOOK) */}
        <MemoriesSection
          memories={memories}
          onOpenEditor={() => setIsEditorOpen(true)}
        />

        {/* SECTION 3: REASONS WHY YOU'RE MY PERSON */}
        <ReasonsSection
          reasons={BIRTHDAY_CONFIG.reasons}
        />

        {/* SECTION 4: OUR FRIENDSHIP IN NUMBERS */}
        <NumbersSection
          numbers={BIRTHDAY_CONFIG.numbers}
        />

        {/* SECTION 5: CHOOSE A SURPRISE */}
        <SurpriseBoxesSection
          boxes={BIRTHDAY_CONFIG.surpriseBoxes}
        />

        {/* SECTION 6: THINGS I WANT FOR YOU THIS YEAR */}
        <WishListSection
          wishes={BIRTHDAY_CONFIG.wishList}
          bestFriendName={bestFriendName}
        />

        {/* SECTION 7: A TINY FRIENDSHIP QUIZ */}
        <QuizSection
          title={BIRTHDAY_CONFIG.quiz.title}
          subtitle={BIRTHDAY_CONFIG.quiz.subtitle}
          questions={BIRTHDAY_CONFIG.quiz.questions}
          completedBadge={BIRTHDAY_CONFIG.quiz.completedBadge}
          completedMessage={BIRTHDAY_CONFIG.quiz.completedMessage}
        />

        {/* SECTION 8: REASONS I'M GRATEFUL FOR YOU (TIMELINE) */}
        <TimelineSection
          moments={BIRTHDAY_CONFIG.timeline}
        />

        {/* SECTION 9: FINAL SURPRISE & GRAND CELEBRATION */}
        <FinalSurpriseSection
          bestFriendName={bestFriendName}
          teaser={BIRTHDAY_CONFIG.finalSurprise.teaser}
          buttonText={BIRTHDAY_CONFIG.finalSurprise.buttonText}
          letter={BIRTHDAY_CONFIG.finalSurprise.letter}
          finalPhoto={customHeroPhoto || BIRTHDAY_CONFIG.finalSurprise.finalPhoto || BIRTHDAY_CONFIG.heroImage}
          finalPhotoFallback={BIRTHDAY_CONFIG.finalSurprise.finalPhotoFallback}
          caption={BIRTHDAY_CONFIG.finalSurprise.caption}
          onOpenEditor={() => setIsEditorOpen(true)}
          onUpdateHeroPhoto={handleUpdateHeroPhoto}
        />
      </main>

      {/* FOOTER */}
      <footer className="py-12 px-4 border-t border-pink-200/60 text-center bg-white/60">
        <div className="max-w-md mx-auto space-y-2">
          <div className="flex items-center justify-center gap-1 text-pink-400">
            <Sparkles className="w-4 h-4" />
            <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
            <Sparkles className="w-4 h-4" />
          </div>
          <p className="font-handwriting text-2xl sm:text-3xl text-stone-800 font-bold">
            Made with all the love in the world for {bestFriendName}
          </p>
          <p className="text-xs text-stone-400 font-sans">
            Best Friend Certified • Keep shining your light everywhere you go 🌟
          </p>
        </div>
      </footer>

      {/* FLOATING CONTROLS (SCROLL TO TOP) */}
      <FloatingControls />

      {/* FLOATING MUSIC CONTROLLER */}
      <MusicPlayer
        customAudioUrl={BIRTHDAY_CONFIG.music.customAudioUrl}
        songTitle={BIRTHDAY_CONFIG.music.title}
        songArtist={BIRTHDAY_CONFIG.music.artist}
      />

      {/* MEMORIES & CUSTOMIZATION MODAL */}
      <EditMemoriesModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        memories={memories}
        onSaveMemories={handleSaveMemories}
        bestFriendName={bestFriendName}
        onChangeName={handleChangeName}
        onResetDefaults={handleResetDefaults}
        currentHeroPhoto={customHeroPhoto || BIRTHDAY_CONFIG.heroImage}
        onSaveHeroPhoto={handleUpdateHeroPhoto}
      />
    </div>
  );
}
