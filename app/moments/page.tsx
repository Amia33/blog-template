import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import MomentSection from "@/components/moments/moment-section";
import PageHeader from "@/components/ui/page-header";
import { profileConfig } from "@/lib/config";
import { getSortedMoments } from "@/lib/content";
import { pageAlternates, pageOpenGraph, pageTwitter } from "@/lib/seo";
import { t } from "@/lib/strings";

export const metadata = {
  title: t("moments"),
  description: t("momentsDescription"),
  alternates: pageAlternates("/moments"),
  openGraph: pageOpenGraph({
    url: "/moments",
    title: t("moments"),
    description: t("momentsDescription"),
  }),
  twitter: pageTwitter({
    title: t("moments"),
    description: t("momentsDescription"),
  }),
};

export default function MomentsPage() {
  const moments = getSortedMoments().map((moment) => ({
    slug: moment.slug,
    published: moment.published.toISOString(),
    pinned: moment.pinned,
    location: moment.location,
    mood: moment.mood,
    tags: moment.tags,
    html: moment.html,
    images: moment.images.map((image) => ({
      src: image.src,
      alt: image.alt ?? "",
      width: image.width ?? 0,
      height: image.height ?? 0,
      blurDataURL: image.blurDataURL ?? "",
      remote: image.remote ?? false,
      optimizable: image.optimizable ?? false,
    })),
  }));

  const author = {
    name: profileConfig.name,
    avatar: profileConfig.avatar,
  };

  return (
    <PageShell page="moments">
      <DirectionalTransition>
        <PageHeader
          title={t("moments")}
          description={t("momentsDescription")}
          count={`${moments.length} ${t("postCount")}`}
        />
        <MomentSection moments={moments} author={author} />
      </DirectionalTransition>
    </PageShell>
  );
}
