---
title: Markdown Extended Features
published: 2024-05-01
updated: 2024-11-29
description: "Read more about Markdown features in Fuwari"
image: ""
tags: [Demo, Example, Markdown, Fuwari]
category: "Examples"
draft: false
---

## Admonitions

Five admonition types are supported: `note`, `tip`, `important`, `warning`, and `caution`.

:::note
Highlight information that readers should not miss even when skimming.
:::

:::tip
Supplementary information that helps the reader succeed.
:::

:::important
Information that is essential to the reader's success.
:::

:::warning
Important content that carries a potential risk and needs immediate attention.
:::

:::caution
Actions that may lead to a negative outcome.
:::

### Custom titles

:::note[MY CUSTOM TITLE]
Titles can be set freely.
:::

### GitHub syntax

> [!TIP]
> GitHub's syntax is supported too. End a line with two spaces to force a line break.

## Spoilers

Text can be hidden like this: :spoiler[**this**].

## Math

Inline math can be written as $\omega = d\phi / dt$. Display math goes on its own line.

$$
I = \int \rho R^{2} dV
$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;\ldots
\end{equation*}
$$
