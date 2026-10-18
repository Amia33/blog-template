import { Icon } from "@/components/ui/icon";
import { licenseConfig, profileConfig } from "@/lib/config";
import { i18n, I18nKey } from "@/lib/i18n";
import { formatDateToYYYYMMDD } from "@/lib/utils";

export default function License({
  title,
  url,
  pubDate,
}: {
  title: string;
  url: string;
  pubDate: Date;
}) {
  if (!licenseConfig.enable) return null;

  return (
    <aside className="relative mt-6 overflow-hidden rounded-box bg-base-200 p-5">
      <p className="font-bold">{title}</p>
      <a href={url} className="link link-primary text-sm break-all">
        {url}
      </a>
      <div className="mt-3 flex flex-wrap gap-6 text-sm">
        <div>
          <div className="opacity-60">{i18n(I18nKey.author)}</div>
          <div>{profileConfig.name}</div>
        </div>
        <div>
          <div className="opacity-60">{i18n(I18nKey.publishedAt)}</div>
          <div>{formatDateToYYYYMMDD(pubDate)}</div>
        </div>
        <div>
          <div className="opacity-60">{i18n(I18nKey.license)}</div>
          <a
            href={licenseConfig.url}
            target="_blank"
            rel="noopener noreferrer"
            className="link link-primary"
          >
            {licenseConfig.name}
          </a>
        </div>
      </div>
      <Icon
        name="creativeCommons"
        className="pointer-events-none absolute top-1/2 -right-6 -translate-y-1/2 text-[10rem] opacity-5"
      />
    </aside>
  );
}
