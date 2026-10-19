import "server-only";

import { getSortedPosts } from "@/lib/content";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export type CalendarDayPost = {
  slug: string;
  title: string;
};

export type CalendarData = {
  postsByDate: Record<string, CalendarDayPost[]>;
  activeMonths: string[];
};

export function getCalendarData(): CalendarData {
  const postsByDate: Record<string, CalendarDayPost[]> = {};

  for (const post of getSortedPosts()) {
    const key = formatDateToYYYYMMDD(post.published);
    (postsByDate[key] ??= []).push({
      slug: post.slug,
      title: post.title,
    });
  }

  const activeMonths = [
    ...new Set(Object.keys(postsByDate).map((key) => key.slice(0, 7))),
  ].sort();

  return { postsByDate, activeMonths };
}
