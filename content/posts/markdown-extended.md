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

## 注記（Admonitions）

対応している注記の種類は `note` `tip` `important` `warning` `caution` の 5 つです。

:::note
スキミングしていても目に留めるべき情報を強調します。
:::

:::tip
ユーザーがより成功しやすくなるための補足情報です。
:::

:::important
ユーザーが成功するために不可欠な情報です。
:::

:::warning
潜在的なリスクがあり、即時の注意を要する重要な内容です。
:::

:::caution
操作による否定的な結果につながる可能性があります。
:::

### カスタムタイトル

:::note[MY CUSTOM TITLE]
タイトルは自由に指定できます。
:::

### GitHub 記法

> [!TIP]
> GitHub の記法にも対応しています。改行は行末に空白 2 つで表現します。

## ネタバレ

本文は :spoiler[こんな感じで **隠せます**]。

## 数式

インライン数式は $\omega = d\phi / dt$ のように書けます。ディスプレイ数式は独立した行に置きます。

$$I = \int \rho R^{2} dV$$

$$
\begin{equation*}
\pi
=3.1415926535
 \;8979323846\;2643383279\;5028841971\;6939937510\;5820974944
 \;\ldots
\end{equation*}
$$
