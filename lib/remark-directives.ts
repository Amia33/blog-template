import {
  ALERT_TITLE,
  ALERT_VARIANT,
  alertClassNames,
} from "@/lib/rehype-alerts";

type Node = {
  type: string;
  name?: string;
  value?: string;
  data?: Record<string, unknown>;
  children?: Node[];
};

const ALERT_NAMES = new Set(
  Object.keys(ALERT_VARIANT).map((keyword) => keyword.toLowerCase()),
);

function textOf(node: Node): string {
  if (typeof node.value === "string") return node.value;
  return (node.children ?? []).map(textOf).join("");
}

function takeLabel(node: Node): Node | undefined {
  const first = node.children?.[0];
  if (first?.data?.directiveLabel === true) {
    return node.children?.shift();
  }
  return undefined;
}

function walk(parent: Node): void {
  const children = parent.children;
  if (!children) return;

  for (let index = 0; index < children.length; index += 1) {
    const node = children[index];

    if (
      node.type === "containerDirective" &&
      node.name !== undefined &&
      ALERT_NAMES.has(node.name)
    ) {
      const keyword = node.name.toUpperCase();
      const label = takeLabel(node);
      const title = label ? textOf(label) : ALERT_TITLE[keyword];

      const alert: Node = {
        type: "blockquote",
        data: {
          hName: "div",
          hProperties: { className: alertClassNames(keyword) },
        },
        children: [
          {
            type: "paragraph",
            data: {
              hName: "span",
              hProperties: { className: ["font-bold"] },
            },
            children: [{ type: "text", value: title }],
          },
          ...(node.children ?? []),
        ],
      };

      children[index] = alert;
      walk(alert);
      continue;
    }

    if (node.type === "textDirective" && node.name === "spoiler") {
      node.data = {
        ...node.data,
        hName: "span",
        hProperties: { className: ["spoiler"] },
      };
    }

    walk(node);
  }
}

export function remarkDirectives() {
  return (tree: unknown): void => {
    walk(tree as Node);
  };
}
