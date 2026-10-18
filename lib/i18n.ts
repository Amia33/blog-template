export enum I18nKey {
  home = "home",
  about = "about",
  archive = "archive",
  search = "search",

  tags = "tags",
  categories = "categories",
  recentPosts = "recentPosts",

  comments = "comments",

  untitled = "untitled",
  uncategorized = "uncategorized",
  noTags = "noTags",

  wordCount = "wordCount",
  wordsCount = "wordsCount",
  minuteCount = "minuteCount",
  minutesCount = "minutesCount",
  postCount = "postCount",
  postsCount = "postsCount",

  themeColor = "themeColor",

  lightMode = "lightMode",
  darkMode = "darkMode",
  systemMode = "systemMode",

  more = "more",

  author = "author",
  publishedAt = "publishedAt",
  license = "license",
}

export type Translation = {
  [K in I18nKey]: string;
};

export const en: Translation = {
  [I18nKey.home]: "Home",
  [I18nKey.about]: "About",
  [I18nKey.archive]: "Archive",
  [I18nKey.search]: "Search",

  [I18nKey.tags]: "Tags",
  [I18nKey.categories]: "Categories",
  [I18nKey.recentPosts]: "Recent Posts",

  [I18nKey.comments]: "Comments",

  [I18nKey.untitled]: "Untitled",
  [I18nKey.uncategorized]: "Uncategorized",
  [I18nKey.noTags]: "No Tags",

  [I18nKey.wordCount]: "word",
  [I18nKey.wordsCount]: "words",
  [I18nKey.minuteCount]: "minute",
  [I18nKey.minutesCount]: "minutes",
  [I18nKey.postCount]: "post",
  [I18nKey.postsCount]: "posts",

  [I18nKey.themeColor]: "Theme Color",

  [I18nKey.lightMode]: "Light",
  [I18nKey.darkMode]: "Dark",
  [I18nKey.systemMode]: "System",

  [I18nKey.more]: "More",

  [I18nKey.author]: "Author",
  [I18nKey.publishedAt]: "Published at",
  [I18nKey.license]: "License",
};

const translations: Record<string, Translation> = {
  en,
};

export function i18n(key: I18nKey): string {
  const lang = "en";
  return (translations[lang] ?? en)[key];
}
