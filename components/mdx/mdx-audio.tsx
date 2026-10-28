"use client";

import { Audio, AudioPlayer, AudioSkin } from "@videojs/react/audio";

type MdxAudioProps = {
  src: string;
  poster?: string;
  title?: string;
};

export function MdxAudio({ src, poster, title }: MdxAudioProps) {
  return (
    <AudioPlayer title={title} poster={poster}>
      <AudioSkin className="my-6" style={{ width: "100%" }}>
        <Audio src={src} preload="metadata" />
      </AudioSkin>
    </AudioPlayer>
  );
}
