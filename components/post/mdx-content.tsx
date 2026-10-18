import { MDXContent } from "@content-collections/mdx/react";

import { mdxComponents } from "@/components/mdx";

export default function MdxContent({ code }: { code: string }) {
  return <MDXContent code={code} components={mdxComponents} />;
}
