---
title: Simple Guides for Fuwari
published: 2024-04-01
description: "How to use this blog template."
image: "./guide-cover.jpeg"
tags: ["Fuwari", "Blogging", "Customization"]
category: Guides
draft: false
---

> Cover image source: [Source](<https://image.civitai.com/xG1nkqKTMzGDvpLrqFT7WA/208fc754-890d-4adb-9753-2c963332675d/width=2048/01651-1456859105-(colour_1.5),girl,_Blue,yellow,green,cyan,purple,red,pink,_best,8k,UHD,masterpiece,male%20focus,%201boy,gloves,%20ponytail,%20long%20hair,.jpeg>)

This blog template is built with [Next.js](https://nextjs.org/). For the things that are not mentioned in this guide, you may find the answers in the [Next.js Docs](https://nextjs.org/docs).

The cover above is referenced with `image: "./guide-cover.jpeg"`, a path relative to this file:

![The cover image, embedded from the post body](./guide-cover.jpeg)

## Front-matter of Posts

```yaml
---
title: My First Blog Post
published: 2023-09-09
description: This is the first post of my new Next.js blog.
image: ./cover.jpg
tags: [Foo, Bar]
category: Front-end
draft: false
---
```

| Attribute     | Description                                                                                                                                                                                                 |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`       | The title of the post.                                                                                                                                                                                      |
| `published`   | The date the post was published.                                                                                                                                                                            |
| `description` | A short description of the post. Displayed on index page.                                                                                                                                                   |
| `image`       | The cover image path of the post.<br/>1. Start with `http://` or `https://`: Use web image<br/>2. Start with `/`: For image in `public` dir<br/>3. With none of the prefixes: Relative to the markdown file |
| `tags`        | The tags of the post.                                                                                                                                                                                       |
| `category`    | The category of the post.                                                                                                                                                                                   |
| `draft`       | If this post is still a draft, which won't be displayed.                                                                                                                                                    |

Relative images are copied into `public/content/<slug>/` at build time under a
content-addressed filename, then served through `next/image` with their real
intrinsic dimensions.

## Where to Place the Post Files

Your post files should be placed in the `content/posts/` directory. You can also create sub-directories to better organize your posts and assets.

```
content/posts/
├── post-1.md
└── post-2/
    ├── cover.png
    └── index.md
```

## Components

Markdown files are compiled as MDX, so you can use the components below anywhere in a post.

<Alert variant="tip" title="Callout">
  Callouts use the same styling as the `:::tip` directive.
</Alert>

<Badge variant="success">Badge</Badge> <Badge variant="warning">Badge</Badge>

<Collapse title="Collapsed section">
  Everything in here is hidden until the summary is expanded.
</Collapse>

<Tabs labels="npm|pnpm|yarn">
  <div>npm install</div>
  <div>pnpm install</div>
  <div>yarn install</div>
</Tabs>

<Card title="Card with a link" href="https://nextjs.org/docs">
  Cards render as links when `href` is given.
</Card>

<Steps>
  <Step title="Write">Add a file under `content/posts/`.</Step>
  <Step title="Preview">Run `pnpm dev`.</Step>
  <Step title="Deploy">Run `pnpm build`.</Step>
</Steps>

<Video
  src="https://oss.446256.xyz/uzN0taK8eC4.mp4"
  poster="https://oss.446256.xyz/uzN0taK8eC4.webp"
  title="Video.js demo"
/>

Press <Kbd>Ctrl</Kbd> + <Kbd>K</Kbd> to search.
