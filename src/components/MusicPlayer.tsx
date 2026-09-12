import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Music,
  Upload,
  RotateCcw,
  Sparkles,
  ChevronUp,
  ChevronDown
} from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface MusicPlayerProps {
  customAudioUrl: string;
  songTitle?: string;
  songArtist?: string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  customAudioUrl,
  songTitle = 'Belong Together',
  songArtist = 'Mark Ambor',
}) => {
  const [isPlaying, setIsPlaying] = useState(soundEngine.getIsPlaying());
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(148);
  const [volume, setVolume] = useState(0.75);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(0.75);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSongTitle, setActiveSongTitle] = useState(songTitle);
  const [activeSongArtist, setActiveSongArtist] = useState(songArtist);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsPlaying(soundEngine.getIsPlaying());
    const unsubStatus = soundEngine.subscribe((status) => {
      setIsPlaying(status);
    });
    const unsubTime = soundEngine.subscribeTime((curr, dur) => {
      setCurrentTime(curr);
      if (dur && !isNaN(dur) && dur > 0) {
        setDuration(dur);
      }
    });

    return () => {
      unsubStatus();
      unsubTime();
    };
  }, []);

  const togglePlay = () => {
    soundEngine.toggleMusic(customAudioUrl, (status) => {
      setIsPlaying(status);
    });
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    soundEngine.seek(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    soundEngine.setVolume(val);
  };

  const toggleMute = () => {
    if (isMuted) {
      soundEngine.setVolume(prevVolume || 0.75);
      setVolume(prevVolume || 0.75);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      soundEngine.setVolume(0);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const handleCustomAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const objectUrl = URL.createObjectURL(file);
      soundEngine.setCustomAudio(objectUrl, true);
      setActiveSongTitle(file.name.replace(/\.[^/.]+$/, ''));
      setActiveSongArtist('Custom Audio');
      soundEngine.playSparkleSound();
    } catch (err) {
      console.error('Failed to load audio file:', err);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs < 0) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="fixed bottom-4 left-4 z-40 select-none max-w-sm sm:max-w-md">
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*,.mp3,.m4a,.wav,.ogg"
        className="hidden"
        onChange={handleCustomAudioUpload}
      />

      {/* EXPANDED PLAYER CARD */}
      {isExpanded ? (
        <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-pink-200 w-80 sm:w-88 transition-all animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-pink-100">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full bg-gradient-to-tr from-pink-400 to-rose-400 flex items-center justify-center text-white shadow-sm ${isPlaying ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}>
                <Music className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-800 truncate max-w-[170px] leading-tight">
                  {activeSongTitle}
                </p>
                <p className="text-[10px] text-pink-600 font-medium">
                  {activeSongArtist}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                title="Upload another music file"
                className="p-1.5 text-stone-400 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors cursor-pointer text-xs flex items-center gap-1"
              >
                <Upload className="w-3.5 h-3.5" />
                <span className="text-[10px] hidden sm:inline">Upload</span>
              </button>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                title="Minimize player"
                className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Time & Progress Slider */}
          <div className="mt-3">
            <input
              type="range"
              min="0"
              max={duration || 148}
              step="0.5"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls bar */}
          <div className="flex items-center justify-between mt-2 pt-1">
            {/* Left: Restart */}
            <button
              type="button"
              onClick={() => soundEngine.seek(0)}
              title="Restart song from beginning"
              className="p-2 text-stone-500 hover:text-pink-600 hover:bg-pink-50 rounded-full transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Center: Play/Pause */}
            <button
              type="button"
              onClick={togglePlay}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white flex items-center justify-center shadow-md shadow-pink-200 hover:scale-105 active:scale-95 transition-all cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
            </button>

            {/* Right: Volume & Mute */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={toggleMute}
                className="p-2 text-stone-500 hover:text-pink-600 transition-colors cursor-pointer"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-pink-500" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolume}
                className="w-14 h-1 bg-pink-100 rounded-lg appearance-none cursor-pointer accent-pink-500"
              />
            </div>
          </div>
        </div>
      ) : (
        /* COMPACT FLOATING PILL */
        <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-md border border-pink-200/90 rounded-full px-3 py-1.5 shadow-lg shadow-pink-100/60 transition-all hover:border-pink-300">
          <button
            type="button"
            onClick={togglePlay}
            title={isPlaying ? 'Pause song' : 'Play song'}
            className="w-7 h-7 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white flex items-center justify-center shrink-0 hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs"
          >
            {isPlaying ? (
              <Pause className="w-3 h-3 fill-white" />
            ) : (
              <Play className="w-3 h-3 fill-white ml-0.5" />
            )}
          </button>

          {/* Equalizer animation when playing */}
          <div
            onClick={() => setIsExpanded(true)}
            className="flex items-center gap-2 cursor-pointer pr-1"
          >
            <div className="flex items-end gap-0.5 h-3.5 px-0.5">
              <span className={`w-0.5 bg-pink-500 rounded-full ${isPlaying ? 'h-3 animate-pulse' : 'h-1.5'}`} />
              <span className={`w-0.5 bg-rose-400 rounded-full ${isPlaying ? 'h-3.5 animate-bounce' : 'h-2'}`} />
              <span className={`w-0.5 bg-pink-500 rounded-full ${isPlaying ? 'h-2 animate-pulse' : 'h-1'}`} />
            </div>

            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-stone-800 leading-tight max-w-[130px] sm:max-w-[160px] truncate">
                {activeSongTitle}
              </span>
              <span className="text-[9px] text-pink-600 font-medium leading-none">
                {isPlaying ? `${formatTime(currentTime)} / ${formatTime(duration)}` : activeSongArtist}
              </span>
            </div>

            <ChevronUp className="w-3.5 h-3.5 text-stone-400 hover:text-pink-500 ml-1" />
          </div>
        </div>
      )}
    </div>
  );
};
