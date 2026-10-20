import type { TimelineItem } from "@/lib/types/config";

export const timelineData: TimelineItem[] = [
  {
    title: "Next.js 16 ブログへ移行",
    date: "2026.10",
    category: "Projects",
    subtitle: "Fuwari テーマを Next.js App Router に移植",
    description:
      "Astro 版 Fuwari のデザインを保ちながら、Next.js 16 の App Router と Cache Components で再実装しました。",
    highlights: [
      "MDX + Expressive Code + KaTeX",
      "ダークモードとテーマカラー",
      "RSS / サイトマップ / JSON-LD",
    ],
    tags: ["Next.js", "React", "TypeScript"],
    icon: "rocket",
    featured: true,
  },
  {
    title: "個人ブログを公開",
    date: "2025.04",
    category: "Projects",
    subtitle: "日々の学びを書き留める場所",
    description:
      "技術メモ、読書録、写真などをまとめる個人ブログを公開しました。",
    tags: ["Blog", "Writing"],
    icon: "code",
  },
  {
    title: "サンプルプロジェクト",
    date: "2023.04 - Present",
    category: "Work",
    subtitle: "ここにプロジェクトの説明を入力",
    description: "プロジェクトの概要や担当した内容をここに記載します。",
    tags: ["Sample"],
    icon: "work",
  },
  {
    title: "サンプル: 学習",
    date: "2019.04 - 2023.03",
    category: "Education",
    subtitle: "ここに学習内容を入力",
    description: "学んだ分野や取り組みをここに記載します。",
    tags: ["Sample"],
    icon: "school",
  },
  {
    title: "はじめての Web サイト",
    date: "2018.08",
    category: "Life",
    subtitle: "HTML と CSS を書き始める",
    description: "趣味で静的サイトを作り、Web 開発の面白さに触れました。",
    tags: ["HTML", "CSS"],
    icon: "favorite",
  },
];
