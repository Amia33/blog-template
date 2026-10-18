import DirectionalTransition from "@/components/layout/directional-transition";
import Lightbox from "@/components/post/lightbox";
import Markdown from "@/components/post/markdown";
import MdxContent from "@/components/post/mdx-content";
import { getAbout } from "@/lib/content";
import { t } from "@/lib/strings";

export const metadata = {
  title: t("about"),
  description: t("about"),
};

export default function AboutPage() {
  const about = getAbout();

  return (
    <DirectionalTransition>
      <div className="card bg-base-100 p-6 md:p-9">
        <Lightbox>
          <Markdown>
            {about ? (
              <MdxContent code={about.mdx} />
            ) : (
              <p>このサイトについての情報が見つかりません。</p>
            )}
          </Markdown>
        </Lightbox>
      </div>
    </DirectionalTransition>
  );
}
