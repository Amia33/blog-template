import { MDXContent } from "@content-collections/mdx/react";

export default function MdxContent({ code }: { code: string }) {
  return <MDXContent code={code} />;
}
