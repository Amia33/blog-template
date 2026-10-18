import Image from "next/image";

import { Icon } from "@/components/ui/icon";
import { siteConfig } from "@/lib/config";

export default function Banner() {
  const { banner } = siteConfig;
  if (!banner.enable || !banner.src) return null;

  const objectPosition =
    banner.position === "top"
      ? "top"
      : banner.position === "bottom"
        ? "bottom"
        : "center";

  return (
    <div className="relative mb-4 h-[35vh] overflow-hidden rounded-box lg:h-[45vh]">
      <Image
        src={banner.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition }}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-base-100 to-transparent" />
      {banner.credit.enable && banner.credit.text ? (
        <a
          href={banner.credit.url || undefined}
          target={banner.credit.url ? "_blank" : undefined}
          rel={banner.credit.url ? "noopener noreferrer" : undefined}
          className="absolute right-3 bottom-3 flex items-center gap-1 rounded-full bg-black/60 px-3 py-1.5 text-xs text-white/75 transition hover:bg-black/75 hover:text-white"
        >
          <Icon name="copyright" className="text-base" />
          <span>{banner.credit.text}</span>
          {banner.credit.url ? (
            <Icon name="external" className="text-xs" />
          ) : null}
        </a>
      ) : null}
    </div>
  );
}
