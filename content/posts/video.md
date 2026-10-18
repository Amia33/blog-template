---
title: Include Video in the Posts
published: 2023-08-01
description: This post demonstrates how to include embedded video in a blog post.
tags: [Example, Video]
category: Examples
draft: false
---

Just copy the embed code from YouTube or other platforms, and paste the `src` into an `Embed` component.

```mdx
<Embed
  src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_"
  title="YouTube video player"
/>
```

## YouTube

<Embed
  src="https://www.youtube.com/embed/5gIf0_xpFPI?si=N1WTorLKL0uwLsU_"
  title="YouTube video player"
/>

## Bilibili

<Embed
  src="//player.bilibili.com/player.html?bvid=BV1fK4y1s7Qf&p=1"
  title="Bilibili video player"
/>

Raw `<iframe>` snippets still work, but they keep the width and height from the
snippet instead of scaling to a 16:9 box.
