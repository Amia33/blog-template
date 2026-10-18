import MainGridLayout from "@/components/layout/main-grid";
import Markdown from "@/components/post/markdown";
import MdxContent from "@/components/post/mdx-content";
import { getAbout } from "@/lib/content";
import { i18n, I18nKey } from "@/lib/i18n";
import { getPostHeadings } from "@/lib/toc";

export const metadata = {
  title: i18n(I18nKey.about),
  description: i18n(I18nKey.about),
};

export default function AboutPage() {
  const about = getAbout();
  const headings = about ? getPostHeadings(about.content) : [];

  return (
    <MainGridLayout headings={headings}>
      <div className="card bg-base-100 p-6 md:p-9">
        <Markdown>
          {about ? (
            <MdxContent code={about.mdx} />
          ) : (
            <p>About content not found.</p>
          )}
        </Markdown>
      </div>
    </MainGridLayout>
  );
}
