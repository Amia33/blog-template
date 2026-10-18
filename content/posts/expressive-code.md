---
title: Expressive Code Example
published: 2024-04-10
description: How code blocks look in Markdown using Expressive Code.
tags: [Markdown, Blogging, Demo]
category: Examples
draft: false
---

ここでは [Expressive Code](https://expressive-code.com/) によるコードブロックの表示を確認します。

## シンタックスハイライト

```js
console.log("This code is syntax highlighted!");
```

## ファイル名付きフレーム

```js title="my-test-file.js"
console.log("Title attribute example");
```

## 行番号

```js showLineNumbers
// This code block will show line numbers
console.log("Greetings from line 2!");
console.log("I am on line 3");
```

```js showLineNumbers startLineNumber=5
console.log("Greetings from line 5!");
console.log("I am on line 6");
```

## 行マーカー

```js {1, 4, 7-8}
// Line 1 - targeted by line number
// Line 2
// Line 3
// Line 4 - targeted by line number
// Line 5
// Line 6
// Line 7 - targeted by range "7-8"
// Line 8 - targeted by range "7-8"
```

```js title="line-markers.js" del={2} ins={3-4} {6}
function demo() {
  console.log("this line is marked as deleted");
  // This line and the next one are marked as inserted
  console.log("this is the second inserted line");

  return "this line uses the neutral default marker type";
}
```

## diff 記法

```diff
+this line will be marked as inserted
-this line will be marked as deleted
this is a regular line
```

```diff lang="js"
  function thisIsJavaScript() {
    // This entire block gets highlighted as JavaScript,
    // and we can still add diff markers to it!
-   console.log('Old code to be removed')
+   console.log('New and shiny code!')
  }
```

## 折り返し

```js wrap
function getLongString() {
  return "This is a very long string that will most probably not fit into the available space unless the container is extremely wide";
}
```

## 折りたたみセクション

```js collapse={1-5, 12-14, 21-24}
// All this boilerplate setup code will be collapsed
import { someBoilerplateEngine } from "@example/some-boilerplate";
import { evenMoreBoilerplate } from "@example/even-more-boilerplate";

const engine = someBoilerplateEngine(evenMoreBoilerplate());

// This part of the code will be visible by default
engine.doSomething(1, 2, 3, calcFn);

function calcFn() {
  // You can have multiple collapsed sections
  const a = 1;
  const b = 2;
  const c = a + b;

  // This will remain visible
  console.log(`Calculation result: ${a} + ${b} = ${c}`);
  return c;
}

// All this code until the end of the block will be collapsed again
engine.closeConnection();
engine.freeMemory();
engine.shutdown({ reason: "End of example boilerplate code" });
```
