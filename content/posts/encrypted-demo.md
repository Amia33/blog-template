---
title: "Protected post example"
published: 2026-09-01
description: ""
tags: [Protected, Demo]
category: Demo
pinned: false
encrypted: true
passwordHash: "$argon2id$v=19$m=19456,t=2,p=1$lde8gGreUiKLP515xirR6Q$KmMECYA2ZZpDrSZGYgFgAlQXAzJxhCJIKw63pmatjII"
passwordHint: "The demo password is demo-password."
hideHomeContent: true
---

This body is rendered on the server only after the password has been entered and the session is active.

## Protected section

- The body is not included in the static shell.
- The password is verified against an Argon2id hash.
- The session is an encrypted cookie managed by iron-session.

```ts
const unlocked = await hasProtectedSession("post:encrypted-demo");
```
