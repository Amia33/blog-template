#!/usr/bin/env node
// Creates a post under content/posts/.
//
//   pnpm new-post my-post
//   pnpm new-post my-post --title "Hello" --tags a,b --draft
//   pnpm new-post guides/getting-started
//   pnpm new-post                      # prompt for every field
//
// Posts are folders by default (`content/posts/<slug>/index.md`) so images sit
// next to them and `image: "./cover.png"` resolves; pass --flat for the single
// file form.

import { existsSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createInterface } from "node:readline/promises";

const POSTS_DIR = path.join("content", "posts");

const USAGE = `Usage: pnpm new-post [slug] [options]

Options:
  --title <text>        Post title (defaults to the slug, title-cased)
  --description <text>  Short description, used in listings and meta tags
  --tags <a,b>          Comma-separated tags
  --category <text>     Category name
  --lang <code>         Language code, when it differs from the site language
  --draft               Mark the post as a draft
  --flat                Write content/posts/<slug>.md instead of <slug>/index.md
  --force               Overwrite the post if it already exists
  -i, --interactive     Prompt for every field, even when a slug is given
  -h, --help            Show this message`;

const BOOLEAN_FLAGS = new Set([
  "draft",
  "flat",
  "force",
  "interactive",
  "help",
]);
const VALUE_FLAGS = new Set([
  "title",
  "description",
  "tags",
  "category",
  "lang",
]);
const ALIASES = { i: "interactive", h: "help" };

function fail(message) {
  console.error(`\n${message}\n\n${USAGE}\n`);
  process.exit(1);
}

function parseArgs(argv) {
  const values = {};
  const slugs = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (!arg.startsWith("-") || arg === "-") {
      slugs.push(arg);
      continue;
    }

    const [rawName, inline] = arg.replace(/^--?/, "").split("=", 2);
    const name = ALIASES[rawName] ?? rawName;

    if (BOOLEAN_FLAGS.has(name)) {
      values[name] = true;
      continue;
    }

    if (VALUE_FLAGS.has(name)) {
      const value = inline ?? argv[++index];
      if (value === undefined) fail(`Missing a value for --${name}`);
      values[name] = value;
      continue;
    }

    fail(`Unknown option: ${arg}`);
  }

  return { values, slugs };
}

// Keeps only url-safe segments, so `My Post!` and `my-post` land in the same
// place and a path can never escape content/posts/.
function slugify(input) {
  return input
    .trim()
    .replace(/\\/g, "/")
    .split("/")
    .map((segment) =>
      segment
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, ""),
    )
    .filter(Boolean)
    .join("/");
}

function titleFromSlug(slug) {
  return slug
    .split(/[-/]/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

function parseTags(input) {
  return String(input ?? "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// Only leaves a value unquoted when it is a plain YAML scalar; everything else
// (colons, leading digits, empty strings) is emitted as a JSON string, which is
// also a valid YAML double-quoted scalar.
const PLAIN_SCALAR = /^[A-Za-z](?:[A-Za-z0-9 ._@/-]*[A-Za-z0-9._@/-])?$/;
const YAML_KEYWORDS = /^(y|yes|n|no|on|off|null|true|false)$/i;

function yamlString(value) {
  const text = String(value ?? "");
  if (text !== "" && PLAIN_SCALAR.test(text) && !YAML_KEYWORDS.test(text)) {
    return text;
  }
  return JSON.stringify(text);
}

function today() {
  const now = new Date();
  const pad = (value) => String(value).padStart(2, "0");
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
}

async function prompt(values, slug) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });

  const ask = async (label, fallback) => {
    const suffix = fallback ? ` [${fallback}]` : "";
    const answer = (await rl.question(`${label}${suffix}: `)).trim();
    return answer || fallback || "";
  };

  try {
    const resolved = slug || (await ask("Slug (kebab-case, used in the URL)"));
    const title = await ask("Title", values.title ?? titleFromSlug(resolved));
    const description = await ask("Description", values.description);
    const tags = await ask("Tags (comma separated)", values.tags);
    const category = await ask("Category", values.category);
    const lang = await ask("Language code", values.lang);
    const draft = await ask("Draft (y/N)", values.draft ? "y" : "");

    return {
      slug: resolved,
      title,
      description,
      tags,
      category,
      lang,
      draft: /^y/i.test(draft),
    };
  } catch (error) {
    // Ctrl+D ends the read stream, which rejects the pending question.
    if (error?.code === "ABORT_ERR") fail("Aborted, nothing was written.");
    throw error;
  } finally {
    rl.close();
  }
}

const { values, slugs } = parseArgs(process.argv.slice(2));

if (values.help) {
  console.log(USAGE);
  process.exit(0);
}

const [slugArg] = slugs;
const interactive = values.interactive === true || slugArg === undefined;

if (interactive && !process.stdin.isTTY) {
  fail("No slug given and stdin is not a terminal, so the prompts cannot run.");
}

const answers = interactive
  ? await prompt(values, slugArg)
  : {
      slug: slugArg,
      title: values.title,
      description: values.description,
      tags: values.tags,
      category: values.category,
      lang: values.lang,
      draft: values.draft === true,
    };

const slug = slugify(answers.slug ?? "");
if (!slug) {
  fail(
    `Could not build a URL slug out of "${answers.slug ?? ""}". ` +
      "Pass one made of latin letters, digits and dashes.",
  );
}

const file =
  values.flat === true
    ? path.join(POSTS_DIR, `${slug}.md`)
    : path.join(POSTS_DIR, slug, "index.md");

if (existsSync(file) && values.force !== true) {
  fail(`${file} already exists. Pass --force to overwrite it.`);
}

const frontmatter = [
  "---",
  `title: ${yamlString(answers.title || titleFromSlug(slug))}`,
  `published: ${today()}`,
  `description: ${yamlString(answers.description ?? "")}`,
  'image: ""',
  `tags: [${parseTags(answers.tags).map(yamlString).join(", ")}]`,
  `category: ${yamlString(answers.category ?? "")}`,
  `draft: ${answers.draft === true}`,
  ...(answers.lang ? [`lang: ${yamlString(answers.lang)}`] : []),
  "---",
  "",
].join("\n");

await mkdir(path.dirname(file), { recursive: true });
await writeFile(file, frontmatter, {
  flag: values.force === true ? "w" : "wx",
});

console.log(`Created ${file}`);
