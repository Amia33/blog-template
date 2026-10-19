"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import WidgetCard from "@/components/widget/widget-card";
import type { CalendarData } from "@/lib/calendar";
import { t } from "@/lib/strings";
import { getPostUrlBySlug } from "@/lib/utils";

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

const subscribe = () => () => {};

let cachedToday: string | null = null;

function getToday(): string {
  if (cachedToday === null) {
    const now = new Date();
    cachedToday = `${now.toISOString().slice(0, 7)}-${pad(now.getUTCDate())}`;
  }
  return cachedToday;
}

let cachedMonth: string | null = null;

function getCurrentMonth(): string {
  if (cachedMonth === null) {
    cachedMonth = new Date().toISOString().slice(0, 7);
  }
  return cachedMonth;
}

export default function CalendarView({
  data,
  locale,
  startOfWeek,
}: {
  data: CalendarData;
  locale: string;
  startOfWeek: number;
}) {
  const fallbackMonth = useSyncExternalStore(
    subscribe,
    getCurrentMonth,
    () => "1970-01",
  );
  const today = useSyncExternalStore(subscribe, getToday, () => "");

  const months =
    data.activeMonths.length > 0 ? data.activeMonths : [fallbackMonth];
  const initialMonth =
    data.activeMonths[data.activeMonths.length - 1] ?? fallbackMonth;

  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const month = selectedMonth || initialMonth;
  const monthIndex = months.indexOf(month);

  const [year, monthNumber] = month.split("-").map(Number);

  const monthLabel = new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "long",
  }).format(new Date(Date.UTC(year, monthNumber - 1, 1)));

  const weekdays = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      weekday: "short",
    });
    return Array.from({ length: 7 }, (_, index) => {
      const day = new Date(Date.UTC(2024, 0, 7 + index + startOfWeek));
      return formatter.format(day);
    });
  }, [locale, startOfWeek]);

  const daysInMonth = new Date(Date.UTC(year, monthNumber, 0)).getUTCDate();
  const firstWeekday = new Date(Date.UTC(year, monthNumber - 1, 1)).getUTCDay();
  const leading = (firstWeekday - startOfWeek + 7) % 7;

  const cells: (number | null)[] = [
    ...Array.from({ length: leading }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ];

  const selectedPosts = selectedDay
    ? (data.postsByDate[selectedDay] ?? [])
    : [];

  return (
    <WidgetCard title={t("calendar")} icon="calendarMonth">
      <div className="mb-2 flex items-center justify-between gap-2">
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-square"
          aria-label={t("previous")}
          disabled={monthIndex <= 0}
          onClick={() => {
            if (monthIndex > 0) {
              setSelectedMonth(months[monthIndex - 1]);
            }
          }}
        >
          <span aria-hidden>‹</span>
        </button>
        <span className="text-sm font-semibold">{monthLabel}</span>
        <button
          type="button"
          className="btn btn-ghost btn-xs btn-square"
          aria-label={t("next")}
          disabled={monthIndex < 0 || monthIndex >= months.length - 1}
          onClick={() => {
            if (monthIndex >= 0 && monthIndex < months.length - 1) {
              setSelectedMonth(months[monthIndex + 1]);
            }
          }}
        >
          <span aria-hidden>›</span>
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[0.65rem] opacity-60">
        {weekdays.map((weekday, index) => (
          <span key={`${weekday}-${index}`}>{weekday}</span>
        ))}
      </div>

      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((day, index) => {
          if (day === null) {
            return <span key={`empty-${index}`} />;
          }

          const key = `${month}-${pad(day)}`;
          const posts = data.postsByDate[key];
          const hasPosts = Boolean(posts && posts.length > 0);
          const isToday = key === today;
          const isSelected = key === selectedDay;

          return (
            <button
              key={key}
              type="button"
              disabled={!hasPosts}
              aria-current={isToday ? "date" : undefined}
              aria-label={
                hasPosts ? `${key} (${posts.length} ${t("posts")})` : key
              }
              onClick={() => setSelectedDay(isSelected ? null : key)}
              className={`flex h-7 items-center justify-center rounded-field text-xs transition-colors ${
                hasPosts
                  ? "bg-primary/10 text-primary hover:bg-primary hover:text-primary-content"
                  : "opacity-40"
              } ${isToday ? "ring-1 ring-primary" : ""} ${
                isSelected ? "font-bold" : ""
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {selectedDay && selectedPosts.length > 0 ? (
        <ul className="menu mt-2 w-full p-0 text-sm">
          {selectedPosts.map((post) => (
            <li key={post.slug}>
              <Link href={getPostUrlBySlug(post.slug)}>
                <span className="truncate">{post.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </WidgetCard>
  );
}
