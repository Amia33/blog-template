import DirectionalTransition from "@/components/layout/directional-transition";
import PageShell from "@/components/layout/page-shell";
import AlbumSection from "@/components/albums/album-section";
import PageHeader from "@/components/ui/page-header";
import { getAlbums, toAlbumIndexItem } from "@/lib/content";
import { pageAlternates, pageOpenGraph, pageTwitter } from "@/lib/seo";
import { t } from "@/lib/strings";

export const metadata = {
  title: t("albums"),
  description: t("albumsDescription"),
  alternates: pageAlternates("/albums"),
  openGraph: pageOpenGraph({
    url: "/albums",
    title: t("albums"),
    description: t("albumsDescription"),
  }),
  twitter: pageTwitter({
    title: t("albums"),
    description: t("albumsDescription"),
  }),
};

export default function AlbumsPage() {
  const albums = getAlbums().map(toAlbumIndexItem);

  return (
    <PageShell page="albums">
      <DirectionalTransition>
        <PageHeader
          title={t("albums")}
          description={t("albumsDescription")}
          count={`${albums.length} ${t("postCount")}`}
        />
        <AlbumSection albums={albums} />
      </DirectionalTransition>
    </PageShell>
  );
}
