---
title: "Protected album"
description: "A sample password-protected album."
cover: ""
date: 2026-06-01
location: "Kyoto"
tags: [Photo, Protected]
layout: masonry
columns: 2
encrypted: true
passwordHash: "$argon2id$v=19$m=19456,t=2,p=1$lde8gGreUiKLP515xirR6Q$KmMECYA2ZZpDrSZGYgFgAlQXAzJxhCJIKw63pmatjII"
passwordHint: "The demo password is demo-password."
---

This is a sample protected album. Photos live in `content/albums/private-example/photos/` and are served only from authenticated routes.
