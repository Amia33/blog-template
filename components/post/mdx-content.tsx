import { MDXContent } from "@content-collections/mdx/react";

import { MdxImage } from "@/components/post/mdx-image";

const components = { img: MdxImage };

export default function MdxContent({ code }: { code: string }) {
  return <MDXContent code={code} components={components} />;
}
