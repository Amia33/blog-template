"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import type { Track } from "@/lib/types/config";

export type PlayMode = "sequence" | "repeat-one" | "shuffle";

type MusicContextValue = {
  tracks: Track[];
  currentIndex: number;
  currentTrack: Track | null;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  muted: boolean;
  mode: PlayMode;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  select: (index: number) => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  setMuted: (muted: boolean) => void;
  setMode: (mode: PlayMode) => void;
};

const MusicContext = createContext<MusicContextValue | null>(null);

export function useMusic(): MusicContextValue {
  const context = useContext(MusicContext);

  if (!context) {
    throw new Error("useMusic must be used inside MusicProvider");
  }

  return context;
}

export default function MusicProvider({
  tracks,
  defaultVolume,
  defaultMode,
  children,
}: {
  tracks: Track[];
  defaultVolume: number;
  defaultMode: PlayMode;
  children: ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const shouldPlayRef = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(defaultVolume);
  const [muted, setMutedState] = useState(false);
  const [mode, setModeState] = useState<PlayMode>(defaultMode);

  const currentTrack = tracks[currentIndex] ?? null;

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio || !currentTrack) return;

    void audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
  }, [currentTrack]);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    setIsPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (isPlaying) pause();
    else play();
  }, [isPlaying, pause, play]);

  const select = useCallback(
    (index: number) => {
      if (index < 0 || index >= tracks.length) return;
      shouldPlayRef.current = isPlaying;
      setCurrentIndex(index);
      setCurrentTime(0);
    },
    [isPlaying, tracks.length],
  );

  const advance = useCallback(
    (direction: 1 | -1 = 1) => {
      if (tracks.length === 0) return;

      shouldPlayRef.current = isPlaying;
      setCurrentIndex((index) => {
        if (mode === "shuffle" && tracks.length > 1) {
          let nextIndex = index;
          while (nextIndex === index) {
            nextIndex = Math.floor(Math.random() * tracks.length);
          }
          return nextIndex;
        }

        return (index + direction + tracks.length) % tracks.length;
      });
      setCurrentTime(0);
    },
    [isPlaying, mode, tracks.length],
  );

  const next = useCallback(() => advance(1), [advance]);
  const previous = useCallback(() => advance(-1), [advance]);

  const seek = useCallback((time: number) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = time;
    setCurrentTime(time);
  }, []);

  const setVolume = useCallback((value: number) => {
    const audio = audioRef.current;
    const clamped = Math.min(1, Math.max(0, value));

    setVolumeState(clamped);
    setMutedState(false);

    if (audio) {
      audio.volume = clamped;
      audio.muted = false;
    }
  }, []);

  const setMuted = useCallback((value: boolean) => {
    const audio = audioRef.current;
    setMutedState(value);
    if (audio) audio.muted = value;
  }, []);

  const setMode = useCallback((value: PlayMode) => {
    setModeState(value);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.muted = muted;
  }, [volume, muted]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.load();

    if (shouldPlayRef.current) {
      void audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [currentIndex]);

  const handleEnded = useCallback(() => {
    if (mode === "repeat-one") {
      const audio = audioRef.current;
      if (audio) {
        audio.currentTime = 0;
        void audio.play().catch(() => setIsPlaying(false));
      }
      return;
    }

    if (mode === "sequence" && currentIndex >= tracks.length - 1) {
      setIsPlaying(false);
      setCurrentTime(0);
      return;
    }

    advance(1);
  }, [advance, currentIndex, mode, tracks.length]);

  const value = useMemo<MusicContextValue>(
    () => ({
      tracks,
      currentIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      mode,
      play,
      pause,
      toggle,
      next,
      previous,
      select,
      seek,
      setVolume,
      setMuted,
      setMode,
    }),
    [
      tracks,
      currentIndex,
      currentTrack,
      isPlaying,
      currentTime,
      duration,
      volume,
      muted,
      mode,
      play,
      pause,
      toggle,
      next,
      previous,
      select,
      seek,
      setVolume,
      setMuted,
      setMode,
    ],
  );

  return (
    <MusicContext.Provider value={value}>
      {children}
      <audio
        ref={audioRef}
        src={currentTrack?.source}
        preload="metadata"
        onTimeUpdate={(event) =>
          setCurrentTime(event.currentTarget.currentTime)
        }
        onLoadedMetadata={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={handleEnded}
      />
    </MusicContext.Provider>
  );
}
