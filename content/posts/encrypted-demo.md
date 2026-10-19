---
title: "保護された投稿のサンプル"
published: 2026-09-01
description: ""
tags: [Protected, Demo]
category: Demo
pinned: false
encrypted: true
passwordHash: "$argon2id$v=19$m=19456,t=2,p=1$lde8gGreUiKLP515xirR6Q$KmMECYA2ZZpDrSZGYgFgAlQXAzJxhCJIKw63pmatjII"
passwordHint: "デモ用のパスワードは demo-password です。"
hideHomeContent: true
---

この本文は、パスワードを入力してセッションが有効になった後だけサーバー側でレンダリングされます。

## 保護されたセクション

- 本文は静的シェルには含まれません。
- パスワードは Argon2id ハッシュで検証されます。
- セッションは iron-session の暗号化 Cookie です。

```ts
const unlocked = await hasProtectedSession("post:encrypted-demo");
```
