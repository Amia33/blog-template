"use client";

import { useState } from "react";

import { useMusic } from "@/components/music/music-provider";
import { Icon } from "@/components/ui/icon";
import WidgetCard from "@/components/widget/widget-card";
import { t } from "@/lib/strings";

function formatTime(value: number): string {
  if (!Number.isFinite(value) || value <= 0) return "0:00";
  const minutes = Math.floor(value / 60);
  const seconds = Math.floor(value % 60)
    .toString()
    .padStart(2, "0");
  return `${minutes}:${seconds}`;
}

const MODE_ORDER = ["sequence", "repeat-one", "shuffle"] as const;

const MODE_ICON = {
  sequence: "repeat",
  "repeat-one": "repeatOne",
  shuffle: "shuffle",
} as const;

const MODE_LABEL = {
  sequence: t("repeat"),
  "repeat-one": t("repeatOne"),
  shuffle: t("shuffle"),
} as const;

export default function MusicPlayer() {
  const music = useMusic();
  const [showPlaylist, setShowPlaylist] = useState(false);

  if (!music.currentTrack) return null;

  const modeIndex = MODE_ORDER.indexOf(music.mode);
  const nextMode = MODE_ORDER[(modeIndex + 1) % MODE_ORDER.length];

  return (
    <WidgetCard title={t("music")} icon="music">
      <div className="flex items-center gap-3">
        {music.currentTrack.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={music.currentTrack.cover}
            alt=""
            className="h-14 w-14 rounded-box object-cover"
          />
        ) : (
          <div className="flex h-14 w-14 items-center justify-center rounded-box bg-base-200">
            <Icon name="music" className="text-2xl opacity-60" />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">
            {music.currentTrack.title}
          </p>
          {music.currentTrack.artist ? (
            <p className="truncate text-xs opacity-70">
              {music.currentTrack.artist}
            </p>
          ) : null}
        </div>
      </div>

      <input
        type="range"
        min={0}
        max={music.duration || 0}
        step={0.1}
        value={Math.min(music.currentTime, music.duration || 0)}
        onChange={(event) => music.seek(Number(event.target.value))}
        aria-label={t("play")}
        className="range range-primary range-xs mt-3 w-full"
      />
      <div className="flex justify-between text-[0.7rem] opacity-70">
        <span>{formatTime(music.currentTime)}</span>
        <span>{formatTime(music.duration)}</span>
      </div>

      <div className="mt-1 flex items-center justify-center gap-1">
        <button
          type="button"
          onClick={music.previous}
          aria-label={t("previous")}
          className="btn btn-ghost btn-sm btn-square"
        >
          <Icon name="previous" className="text-lg" />
        </button>
        <button
          type="button"
          onClick={music.toggle}
          aria-label={music.isPlaying ? t("pause") : t("play")}
          className="btn btn-primary btn-circle btn-sm"
        >
          <Icon name={music.isPlaying ? "pause" : "play"} className="text-lg" />
        </button>
        <button
          type="button"
          onClick={music.next}
          aria-label={t("next")}
          className="btn btn-ghost btn-sm btn-square"
        >
          <Icon name="next" className="text-lg" />
        </button>
      </div>

      <div className="mt-2 flex items-center gap-1">
        <button
          type="button"
          onClick={() => music.setMode(nextMode)}
          aria-label={MODE_LABEL[music.mode]}
          className="btn btn-ghost btn-xs btn-square"
        >
          <Icon name={MODE_ICON[music.mode]} className="text-base" />
        </button>
        <button
          type="button"
          onClick={() => music.setMuted(!music.muted)}
          aria-label={music.muted ? t("unmute") : t("mute")}
          className="btn btn-ghost btn-xs btn-square"
        >
          <Icon name={music.muted ? "mute" : "volume"} className="text-base" />
        </button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={music.muted ? 0 : music.volume}
          onChange={(event) => music.setVolume(Number(event.target.value))}
          aria-label={t("volume")}
          className="range range-primary range-xs flex-1"
        />
        <button
          type="button"
          onClick={() => setShowPlaylist((value) => !value)}
          aria-label={t("playlist")}
          aria-expanded={showPlaylist}
          className="btn btn-ghost btn-xs btn-square"
        >
          <Icon name="playlist" className="text-base" />
        </button>
      </div>

      {showPlaylist ? (
        <ul className="menu mt-2 w-full p-0 text-sm">
          {music.tracks.map((track, index) => (
            <li key={track.id}>
              <button
                type="button"
                onClick={() => music.select(index)}
                className={index === music.currentIndex ? "active" : ""}
              >
                <span className="truncate">{track.title}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </WidgetCard>
  );
}
