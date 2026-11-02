import type { TimelineItem } from "@/lib/types/config";

export const timelineData: TimelineItem[] = [
  {
    title: "Migrated the blog to Next.js 16",
    date: "2026.10",
    category: "Projects",
    subtitle: "Ported the Fuwari theme to the Next.js App Router",
    description:
      "Rebuilt the Astro Fuwari design with the Next.js 16 App Router and Cache Components.",
    highlights: [
      "MDX + Expressive Code + KaTeX",
      "Dark mode and theme color",
      "RSS / sitemap / JSON-LD",
    ],
    tags: ["Next.js", "React", "TypeScript"],
    icon: "rocket",
    featured: true,
  },
  {
    title: "Launched a personal blog",
    date: "2025.04",
    category: "Projects",
    subtitle: "A place to record everyday learnings",
    description:
      "Launched a personal blog for technical notes, reading logs, photos, and more.",
    tags: ["Blog", "Writing"],
    icon: "code",
  },
  {
    title: "Sample project",
    date: "2023.04 - Present",
    category: "Work",
    subtitle: "Add a project description here",
    description: "Describe the project overview and your role here.",
    tags: ["Sample"],
    icon: "work",
  },
  {
    title: "Sample: Education",
    date: "2019.04 - 2023.03",
    category: "Education",
    subtitle: "Add your studies here",
    description: "Describe the fields you studied and what you worked on here.",
    tags: ["Sample"],
    icon: "school",
  },
  {
    title: "My first website",
    date: "2018.08",
    category: "Life",
    subtitle: "Started writing HTML and CSS",
    description:
      "Built a static site as a hobby and discovered how fun web development is.",
    tags: ["HTML", "CSS"],
    icon: "favorite",
  },
];
