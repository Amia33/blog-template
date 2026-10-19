import type { CSSProperties } from "react";

import { textureConfig } from "@/lib/config";

export default function TextureCanvas() {
  if (!textureConfig.enable) return null;

  return (
    <div
      id="texture-canvas"
      aria-hidden="true"
      data-texture-preset={textureConfig.defaultPreset}
      style={
        {
          "--texture-opacity": String(textureConfig.defaultOpacity),
        } as CSSProperties
      }
    />
  );
}
