"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { Icon } from "@/components/ui/icon";
import { announcementConfig } from "@/lib/config";
import { t } from "@/lib/strings";

const STORAGE_KEY = "announcement-closed-at";
const CHANGE_EVENT = "announcement:change";

function subscribe(listener: () => void) {
  window.addEventListener("storage", listener);
  window.addEventListener(CHANGE_EVENT, listener);

  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CHANGE_EVENT, listener);
  };
}

function getSnapshot(): boolean {
  if (typeof window === "undefined") return false;

  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;

  const closedAt = Number(stored);
  return (
    Number.isFinite(closedAt) &&
    Date.now() - closedAt < announcementConfig.closeDuration * 1000
  );
}

function getServerSnapshot(): boolean {
  return false;
}

function emit() {
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export default function Announcement() {
  const closed = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const { title, content, link, closable } = announcementConfig;

  if (!content || closed) return null;

  return (
    <section className="card bg-base-100 p-4">
      <div className="flex items-start justify-between gap-2">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Icon name="announcement" className="text-primary" />
          {title || t("announcement")}
        </h2>
        {closable ? (
          <button
            type="button"
            aria-label={t("close")}
            className="relative btn btn-ghost btn-xs btn-square after:absolute after:-inset-2.5 after:content-['']"
            onClick={() => {
              localStorage.setItem(STORAGE_KEY, String(Date.now()));
              emit();
            }}
          >
            <Icon name="close" className="text-base" />
          </button>
        ) : null}
      </div>
      <p className="mt-2 whitespace-pre-line text-sm opacity-80">{content}</p>
      {link ? (
        <Link
          href={link.url}
          target={link.external ? "_blank" : undefined}
          rel={link.external ? "noopener noreferrer" : undefined}
          className="link link-primary mt-2 inline-flex items-center gap-1 text-sm"
        >
          {link.text}
          {link.external ? <Icon name="external" className="text-xs" /> : null}
        </Link>
      ) : null}
    </section>
  );
}
