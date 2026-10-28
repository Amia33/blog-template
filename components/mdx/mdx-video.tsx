"use client";

import { Video, VideoPlayer, VideoSkin } from "@videojs/react/video";

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
  captionLang = "ja",
  captionLabel = "字幕",
}: MdxVideoProps) {
  return (
    <VideoPlayer title={title} poster={poster}>
      <VideoSkin
        className="my-6"
        style={{ width: "100%", aspectRatio: "16 / 9" }}
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
