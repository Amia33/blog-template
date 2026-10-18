export const UI = {
  home: "ホーム",
  about: "このサイトについて",
  archive: "アーカイブ",
  search: "検索",
  tags: "タグ",
  categories: "カテゴリ",
  recentPosts: "最近の投稿",
  comments: "コメント",
  untitled: "無題",
  uncategorized: "未分類",
  noTags: "タグなし",
  wordCount: "文字",
  wordsCount: "文字",
  minuteCount: "分",
  minutesCount: "分",
  postCount: "件",
  postsCount: "件",
  themeColor: "テーマカラー",
  lightMode: "ライト",
  darkMode: "ダーク",
  systemMode: "システム",
  more: "もっと見る",
  author: "著者",
  publishedAt: "公開日",
  license: "ライセンス",
  contents: "目次",
} as const;

export type UIKey = keyof typeof UI;

export function t(key: UIKey): string {
  return UI[key];
}
