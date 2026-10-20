"use client";

import { useEffect, useSyncExternalStore } from "react";

import { Icon } from "@/components/ui/icon";
import {
  AUTO_MODE,
  DARK_MODE,
  LIGHT_MODE,
  THEME_STORAGE_KEY,
} from "@/lib/constants";
import { t } from "@/lib/strings";

type ThemeMode = typeof LIGHT_MODE | typeof DARK_MODE | typeof AUTO_MODE;

const modes: {
  mode: ThemeMode;
  label: string;
  icon: "lightMode" | "darkMode" | "systemMode";
}[] = [
  { mode: LIGHT_MODE, label: t("lightMode"), icon: "lightMode" },
  { mode: DARK_MODE, label: t("darkMode"), icon: "darkMode" },
  { mode: AUTO_MODE, label: t("systemMode"), icon: "systemMode" },
];

const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  for (const listener of listeners) listener();
}

function getSnapshot(): ThemeMode {
  return (
    (localStorage.getItem(THEME_STORAGE_KEY) as ThemeMode | null) ?? AUTO_MODE
  );
}

function getServerSnapshot(): ThemeMode {
  return AUTO_MODE;
}

function resolveTheme(mode: ThemeMode): "fuwari" | "fuwari-dark" {
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const dark = mode === DARK_MODE || (mode === AUTO_MODE && prefersDark);
  return dark ? "fuwari-dark" : "fuwari";
}

function applyTheme(mode: ThemeMode) {
  const root = document.documentElement;
  root.dataset.theme = resolveTheme(mode);
  root.dataset.themeMode = mode;
}

export default function ThemeSwitch() {
  const mode = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    applyTheme(getSnapshot());

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (getSnapshot() === AUTO_MODE) applyTheme(AUTO_MODE);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const select = (next: ThemeMode) => {
    localStorage.setItem(THEME_STORAGE_KEY, next);
    applyTheme(next);
    emit();
  };

  const current = modes.find((item) => item.mode === mode) ?? modes[2];

  return (
    <div className="dropdown dropdown-end">
      <button
        type="button"
        className="btn btn-ghost btn-square"
        aria-label="テーマ"
        aria-haspopup="true"
      >
        <Icon name={current.icon} className="text-xl" />
      </button>
      <ul
        tabIndex={0}
        className="menu dropdown-content z-50 mt-2 w-40 rounded-box bg-base-100 p-2 shadow"
      >
        {modes.map((item) => (
          <li key={item.mode}>
            <button
              type="button"
              onClick={() => select(item.mode)}
              aria-current={item.mode === mode ? "true" : undefined}
              className={item.mode === mode ? "active" : ""}
            >
              <Icon name={item.icon} className="text-lg" />
              {item.label}
              {item.mode === mode ? (
                <Icon name="check" className="ml-auto text-base" />
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
