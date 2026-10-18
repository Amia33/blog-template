import { ALERT_KEYWORDS } from "@/lib/rehype-alerts";

type Node = {
  type: string;
  name?: string;
  value?: string;
  data?: Record<string, unknown>;
  children?: Node[];
};

const ALERT_NAMES = new Set(
  ALERT_KEYWORDS.map((keyword) => keyword.toLowerCase()),
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
      const variant = node.name.toLowerCase();
      const label = takeLabel(node);

      // `Alert` is resolved through the MDX component map, same as the alerts
      // rehype-github-alerts produces for `> [!NOTE]` blocks.
      const alert: Node = {
        type: "blockquote",
        data: {
          hName: "Alert",
          hProperties: label ? { variant, title: textOf(label) } : { variant },
        },
        children: node.children ?? [],
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
