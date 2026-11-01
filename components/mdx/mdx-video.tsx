"use client";

import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";

import { siteConfig } from "@/lib/config";
import { t } from "@/lib/strings";

type MdxVideoProps = {
  src: string;
  poster?: string;
  title?: string;
  caption?: string;
  captionLang?: string;
  captionLabel?: string;
};

export function MdxVideo({
  src,
  poster,
  title,
  caption,
  captionLang = siteConfig.locale,
  captionLabel = t("captions"),
}: MdxVideoProps) {
  return (
    <VideoPlayer title={title} poster={poster}>
      <VideoSkin
        className="not-prose my-6"
        // The skin sets `height: 100%`, which makes it fill the stretched
        // article column. `height: auto` lets the aspect ratio size it.
        style={{ width: "100%", height: "auto", aspectRatio: "16 / 9" }}
      >
        <Video src={src} poster={poster} playsInline preload="metadata">
          {caption ? (
            <track
              kind="captions"
              src={caption}
              srcLang={captionLang}
              label={captionLabel}
              default
            />
          ) : null}
        </Video>
      </VideoSkin>
    </VideoPlayer>
  );
}
