import React, { useState, useRef } from 'react';
import { MemoryItem } from '../config';
import { readFileAsDataUrl } from '../utils/photoStorage';
import { X, Upload, Trash2, ArrowUp, ArrowDown, Sparkles, Check, RefreshCw, Image as ImageIcon, Music, Play, Pause, Download, HardDrive } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface EditMemoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  memories: MemoryItem[];
  onSaveMemories: (updated: MemoryItem[]) => void;
  bestFriendName: string;
  onChangeName: (name: string) => void;
  onResetDefaults: () => void;
  currentHeroPhoto?: string;
  onSaveHeroPhoto?: (photoDataUrl: string) => void;
}

export const EditMemoriesModal: React.FC<EditMemoriesModalProps> = ({
  isOpen,
  onClose,
  memories,
  onSaveMemories,
  bestFriendName,
  onChangeName,
  onResetDefaults,
  currentHeroPhoto,
  onSaveHeroPhoto,
}) => {
  const [localMemories, setLocalMemories] = useState<MemoryItem[]>(memories);
  const [nameInput, setNameInput] = useState(bestFriendName);
  const [heroPhotoPreview, setHeroPhotoPreview] = useState<string | undefined>(currentHeroPhoto);
  const [isDragging, setIsDragging] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(soundEngine.getIsPlaying());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const audioFileInputRef = useRef<HTMLInputElement>(null);

  // Sync state when modal opens
  React.useEffect(() => {
    setLocalMemories(memories);
    setNameInput(bestFriendName);
    setHeroPhotoPreview(currentHeroPhoto);
    setIsAudioPlaying(soundEngine.getIsPlaying());
    const unsub = soundEngine.subscribe((playing) => setIsAudioPlaying(playing));
    return () => unsub();
  }, [isOpen, memories, bestFriendName, currentHeroPhoto]);

  if (!isOpen) return null;

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = URL.createObjectURL(file);
      soundEngine.setCustomAudio(url, true);
      soundEngine.playSparkleSound();
    } catch (err) {
      console.error('Failed to load audio in modal:', err);
    }
  };

  const handleHeroPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataUrl(file);
      setHeroPhotoPreview(dataUrl);
      onSaveHeroPhoto?.(dataUrl);
      soundEngine.playSparkleSound();
    } catch (err) {
      console.error('Failed to read hero photo:', err);
    }
  };

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newItems: MemoryItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.match(/image\/(jpeg|jpg|png|webp)/i)) continue;

      try {
        const dataUrl = await readFileAsDataUrl(file);
        newItems.push({
          id: `uploaded-${Date.now()}-${i}`,
          image: dataUrl,
          fallbackImage: dataUrl,
          caption: `Memory with ${nameInput} 💗`,
          date: 'Special Moment',
          tag: 'New Memory',
          rotation: (Math.random() * 6) - 3,
        });
      } catch (err) {
        console.error('Error reading file:', err);
      }
    }

    if (newItems.length > 0) {
      setLocalMemories(prev => [...newItems, ...prev]);
      soundEngine.playSparkleSound();
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleCaptionChange = (id: string, newCaption: string) => {
    setLocalMemories(prev =>
      prev.map(item => item.id === id ? { ...item, caption: newCaption } : item)
    );
  };

  const handleDeletePhoto = (id: string) => {
    setLocalMemories(prev => prev.filter(item => item.id !== id));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setLocalMemories(prev => {
      const copy = [...prev];
      const temp = copy[index - 1];
      copy[index - 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === localMemories.length - 1) return;
    setLocalMemories(prev => {
      const copy = [...prev];
      const temp = copy[index + 1];
      copy[index + 1] = copy[index];
      copy[index] = temp;
      return copy;
    });
  };

  const [isSyncingToFiles, setIsSyncingToFiles] = useState(false);
  const [syncMsg, setSyncMsg] = useState('');

  const handleDownloadConfigJson = () => {
    const data = {
      bestFriendName: nameInput.trim() || bestFriendName,
      heroPhoto: heroPhotoPreview || currentHeroPhoto || '',
      memories: localMemories,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'customData.json';
    a.click();
    URL.revokeObjectURL(url);
    soundEngine.playSparkleSound();
  };

  const handleSaveAll = async () => {
    const trimmedName = nameInput.trim() || bestFriendName;
    onChangeName(trimmedName);
    onSaveMemories(localMemories);

    // Save to server so pictures exist in public/photos and customData.json
    setIsSyncingToFiles(true);
    try {
      const res = await fetch('/api/save-custom-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bestFriendName: trimmedName,
          heroPhoto: heroPhotoPreview || currentHeroPhoto,
          memories: localMemories,
        })
      });
      if (res.ok) {
        setSyncMsg('Locked into project files! 📁');
      }
    } catch {
      // ignore in static or production preview
    } finally {
      setIsSyncingToFiles(false);
    }

    setSavedSuccess(true);
    soundEngine.playSparkleSound();
    setTimeout(() => {
      setSavedSuccess(false);
      setSyncMsg('');
      onClose();
    }, 1200);
  };

  return (
    <div
      id="edit-memories-modal"
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full bg-white rounded-3xl p-5 sm:p-8 shadow-2xl border-2 border-pink-200 paper-card my-auto max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
              <span>✨ Customize Your Surprise</span>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Easily change names, drag & drop photos, and edit captions!
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 p-2 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto py-4 space-y-6 flex-1 pr-1">
          {/* Change Recipient Name */}
          <div className="p-4 rounded-2xl bg-pink-50/70 border border-pink-200">
            <label className="block text-xs font-bold uppercase tracking-wider text-pink-700 mb-1.5">
              Best Friend's Name:
            </label>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              placeholder="e.g. Sailu"
              className="w-full px-4 py-2 rounded-xl bg-white border border-pink-300 text-stone-800 font-semibold focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="text-[11px] text-stone-500 mt-1">
              Updating this automatically changes the title, hero, letters, and final celebration!
            </p>
          </div>

          {/* Sailu's Main Portrait & "Forever Us" Photo */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50 to-rose-50/60 border border-pink-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-pink-700">
                Sailu's Photo (Hero & "Forever Us")
              </label>
              <span className="text-[11px] bg-pink-100 text-pink-700 px-2 py-0.5 rounded-full font-semibold">
                100% Original • Untouched Face
              </span>
            </div>
            <p className="text-xs text-stone-600 mb-3">
              Keeps her real photo exactly as taken (no AI filters or face modification). Used for both the main Polaroid and the final "Forever Us" letter.
            </p>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-white border-2 border-pink-300 shadow-sm shrink-0">
                <img
                  src={heroPhotoPreview || currentHeroPhoto || "/photos/hero.jpg"}
                  alt="Sailu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <input
                  ref={heroFileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleHeroPhotoChange}
                />
                <button
                  type="button"
                  onClick={() => heroFileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all active:scale-95"
                >
                  <Upload className="w-4 h-4" />
                  <span>Choose Sailu's exact photo</span>
                </button>
                <p className="text-[11px] text-stone-400 mt-1">
                  Supports IMG files, JPG, PNG, WEBP
                </p>
              </div>
            </div>
          </div>

          {/* Birthday Song & Background Music */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-pink-50/70 to-purple-50/50 border border-pink-200">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-purple-800">
                Birthday Soundtrack (Music)
              </label>
              <span className="text-[11px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-semibold">
                Full 2:28 Original Song
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-purple-100">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => soundEngine.toggleMusic()}
                  className="w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer"
                >
                  {isAudioPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
                </button>
                <div>
                  <p className="text-xs font-bold text-stone-800">
                    Belong Together
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Mark Ambor • 2 min 28 sec
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  ref={audioFileInputRef}
                  type="file"
                  accept="audio/*,.mp3,.m4a,.wav"
                  className="hidden"
                  onChange={handleAudioUpload}
                />
                <button
                  type="button"
                  onClick={() => audioFileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold border border-purple-200 cursor-pointer transition-colors"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload custom audio</span>
                </button>
              </div>
            </div>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragging
                ? 'border-pink-500 bg-pink-100/70 scale-[1.01]'
                : 'border-pink-300 hover:border-pink-400 bg-pink-50/40 hover:bg-pink-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/jpeg,image/png,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />

            <div className="w-12 h-12 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-2">
              <Upload className="w-6 h-6 animate-bounce" />
            </div>

            <p className="font-semibold text-stone-800 text-sm sm:text-base">
              Drag & drop photos here, or <span className="text-pink-600 underline">browse computer</span>
            </p>
            <p className="text-xs text-stone-400 mt-1">
              Supports JPG, PNG, WEBP • Stored securely in your browser
            </p>
          </div>

          {/* Photos Manager List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-stone-800 flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4 text-pink-500" />
                <span>Current Scrapbook Photos ({localMemories.length})</span>
              </h3>
              <span className="text-xs text-stone-400">Reorder with arrows</span>
            </div>

            <div className="space-y-3">
              {localMemories.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-2.5 sm:p-3 rounded-2xl bg-stone-50 border border-stone-200 group hover:border-pink-300 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-200 shrink-0">
                    <img
                      src={item.image}
                      alt="Thumbnail"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Caption Input */}
                  <div className="flex-1 min-w-0">
                    <input
                      type="text"
                      value={item.caption}
                      onChange={(e) => handleCaptionChange(item.id, e.target.value)}
                      placeholder="Enter photo caption..."
                      className="w-full px-3 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-800 text-sm font-handwriting text-lg focus:outline-none focus:ring-1 focus:ring-pink-400"
                    />
                    <span className="text-[11px] text-stone-400 block mt-0.5">
                      Photo #{index + 1}
                    </span>
                  </div>

                  {/* Reorder Buttons */}
                  <div className="flex flex-col gap-1 shrink-0">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1 rounded bg-white hover:bg-stone-100 disabled:opacity-30 text-stone-600 border border-stone-200"
                      title="Move up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={index === localMemories.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1 rounded bg-white hover:bg-stone-100 disabled:opacity-30 text-stone-600 border border-stone-200"
                      title="Move down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Delete Button */}
                  <button
                    type="button"
                    onClick={() => handleDeletePhoto(item.id)}
                    className="p-2 rounded-xl text-rose-500 hover:bg-rose-100 transition-colors shrink-0"
                    title="Remove photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                if (confirm('Reset photos to sample friendship memories?')) {
                  onResetDefaults();
                  onClose();
                }
              }}
              className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-800 underline cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Restore original defaults</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadConfigJson}
              title="Download backup customData.json file"
              className="inline-flex items-center gap-1.5 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 px-3 py-1.5 rounded-lg font-medium cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-stone-500" />
              <span>Download JSON backup</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {syncMsg && (
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 animate-fadeIn">
                {syncMsg}
              </span>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-stone-300 text-stone-600 hover:bg-stone-100 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={isSyncingToFiles}
              onClick={handleSaveAll}
              className="px-6 py-2 rounded-full bg-pink-600 hover:bg-pink-700 disabled:opacity-75 text-white text-sm font-bold shadow-md hover:shadow-pink-300 transition-all cursor-pointer inline-flex items-center gap-1.5"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 text-white" />
                  <span>Saved!</span>
                </>
              ) : isSyncingToFiles ? (
                <>
                  <HardDrive className="w-4 h-4 animate-spin text-white" />
                  <span>Saving to Files...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
