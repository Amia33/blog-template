"use client";

import { useEffect, useSyncExternalStore } from "react";

import { Icon } from "@/components/ui/icon";
import { postListConfig, textureConfig } from "@/lib/config";
import { t } from "@/lib/strings";
import type { TexturePreset } from "@/lib/types/config";

const POST_LIST_KEY = "post-list-mode";
const TEXTURE_PRESET_KEY = "texture-preset";
const TEXTURE_OPACITY_KEY = "texture-opacity";
const MOTION_KEY = "motion-reduced";

const PRESETS: { value: TexturePreset; label: string }[] = [
  { value: "none", label: t("none") },
  { value: "starlight", label: "Starlight" },
  { value: "cyber-dots", label: "Cyber Dots" },
  { value: "topography", label: "Topography" },
  { value: "geometric", label: "Geometric" },
  { value: "sakura", label: "Sakura" },
];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);

  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function emit() {
  for (const listener of listeners) listener();
}

function read(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

function isTexturePreset(value: string | null): value is TexturePreset {
  return PRESETS.some((preset) => preset.value === value);
}

function getMode(): "list" | "grid" {
  return read(POST_LIST_KEY) === "grid" ? "grid" : "list";
}

function getPreset(): TexturePreset {
  const value = read(TEXTURE_PRESET_KEY);
  return isTexturePreset(value) ? value : textureConfig.defaultPreset;
}

function getOpacity(): number {
  const value = read(TEXTURE_OPACITY_KEY);
  const parsed = value ? Number(value) : textureConfig.defaultOpacity;
  return Number.isFinite(parsed) ? parsed : textureConfig.defaultOpacity;
}

function getReducedMotion(): boolean {
  const value = read(MOTION_KEY);
  if (value !== null) return value === "true";
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export default function DisplaySettings() {
  const mode = useSyncExternalStore(
    subscribe,
    getMode,
    () => postListConfig.layout.mode,
  );
  const preset = useSyncExternalStore(
    subscribe,
    getPreset,
    () => textureConfig.defaultPreset,
  );
  const opacity = useSyncExternalStore(
    subscribe,
    getOpacity,
    () => textureConfig.defaultOpacity,
  );
  const reducedMotion = useSyncExternalStore(
    subscribe,
    getReducedMotion,
    () => false,
  );

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute("data-post-list-mode", mode);
    root.setAttribute("data-texture-preset", preset);
    root.setAttribute("data-motion-reduced", String(reducedMotion));
    root.style.setProperty("--texture-opacity", String(opacity));
  }, [mode, opacity, preset, reducedMotion]);

  const applyMode = (next: "list" | "grid") => {
    localStorage.setItem(POST_LIST_KEY, next);
    emit();
  };

  const applyPreset = (next: TexturePreset) => {
    localStorage.setItem(TEXTURE_PRESET_KEY, next);
    emit();
  };

  const applyOpacity = (next: number) => {
    localStorage.setItem(TEXTURE_OPACITY_KEY, String(next));
    emit();
  };

  const applyReducedMotion = (next: boolean) => {
    localStorage.setItem(MOTION_KEY, String(next));
    emit();
  };

  return (
    <div className="dropdown dropdown-end">
      <div
        tabIndex={0}
        role="button"
        className="btn btn-ghost btn-square"
        aria-label={t("displaySettings")}
      >
        <Icon name="palette" className="text-xl" />
      </div>
      <div
        tabIndex={0}
        className="dropdown-content z-50 mt-2 w-72 rounded-box bg-base-100 p-4 shadow"
      >
        <h2 className="mb-3 text-sm font-bold">{t("displaySettings")}</h2>

        <div className="mb-3">
          <div className="mb-1 text-xs font-semibold opacity-60">
            {t("postLayout")}
          </div>
          <div className="join w-full">
            <button
              type="button"
              aria-pressed={mode === "list"}
              onClick={() => applyMode("list")}
              className={`btn join-item flex-1 ${mode === "list" ? "btn-primary" : ""}`}
            >
              <Icon name="list" className="text-base" />
              {t("list")}
            </button>
            <button
              type="button"
              aria-pressed={mode === "grid"}
              onClick={() => applyMode("grid")}
              className={`btn join-item flex-1 ${mode === "grid" ? "btn-primary" : ""}`}
            >
              <Icon name="grid" className="text-base" />
              {t("grid")}
            </button>
          </div>
        </div>

        {textureConfig.enable ? (
          <>
            <div className="mb-3">
              <div className="mb-1 text-xs font-semibold opacity-60">
                {t("backgroundTexture")}
              </div>
              <div className="grid grid-cols-3 gap-1">
                {PRESETS.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    aria-pressed={preset === item.value}
                    onClick={() => applyPreset(item.value)}
                    className={`rounded-field border p-2 text-[0.65rem] transition-colors ${
                      preset === item.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-base-300 hover:border-primary/50"
                    }`}
                  >
                    <span className="mb-1 block h-6 rounded-field bg-base-200" />
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label
                htmlFor="texture-opacity"
                className="mb-1 block text-xs font-semibold opacity-60"
              >
                {t("textureOpacity")}
              </label>
              <input
                id="texture-opacity"
                type="range"
                min={0.05}
                max={0.25}
                step={0.01}
                value={opacity}
                onChange={(event) => applyOpacity(Number(event.target.value))}
                className="range range-primary range-xs w-full"
              />
            </div>
          </>
        ) : null}

        {textureConfig.allowMotion ? (
          <label className="flex cursor-pointer items-center justify-between gap-2 text-sm">
            <span>{t("reducedMotion")}</span>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={(event) => applyReducedMotion(event.target.checked)}
              className="toggle toggle-primary toggle-sm"
            />
          </label>
        ) : null}
      </div>
    </div>
  );
}
