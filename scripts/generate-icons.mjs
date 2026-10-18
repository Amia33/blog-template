// Regenerates every raster icon from app/icon.svg, which is the single source of
// truth for the mark. Run after editing that file:
//
//   node scripts/generate-icons.mjs
//
// app/icon.svg carries its own light/dark variants in an embedded
// `@media (prefers-color-scheme: dark)` block, so no separate dark raster is
// needed - browsers that render SVG favicons switch automatically. The rasters
// here are the fallbacks (`.ico` for Safari and legacy requests), the iOS home
// screen icon, and the manifest install icons.

import { readFile, writeFile } from "node:fs/promises";
import sharp from "sharp";

const SRC = "app/icon.svg";

// Must match the light palette in app/icon.svg; used for the masked icon, which
// is generated rather than derived so the mark stays inside the safe zone.
const BRAND = { bg: "#6d86f0", fg: "#ffffff" };

async function render(svg, size) {
  return sharp(Buffer.from(svg), { density: 384 })
    .resize(size, size, { fit: "contain" })
    .png({ compressionLevel: 9 })
    .toBuffer();
}

function encodeIco(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);

  const directory = Buffer.alloc(16 * images.length);
  let offset = header.length + directory.length;

  images.forEach(({ size, data }, index) => {
    const entry = index * 16;
    directory.writeUInt8(size >= 256 ? 0 : size, entry);
    directory.writeUInt8(size >= 256 ? 0 : size, entry + 1);
    directory.writeUInt8(0, entry + 2);
    directory.writeUInt8(0, entry + 3);
    directory.writeUInt16LE(1, entry + 4);
    directory.writeUInt16LE(32, entry + 6);
    directory.writeUInt32LE(data.length, entry + 8);
    directory.writeUInt32LE(offset, entry + 12);
    offset += data.length;
  });

  return Buffer.concat([header, directory, ...images.map((i) => i.data)]);
}

// Full-bleed square with the mark inside the 80% safe zone, for Android's
// adaptive icon masking.
function maskableSvg(size) {
  const radius = Math.round(size * 0.14);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${BRAND.bg}"/>
  <circle cx="${size / 2}" cy="${size / 2}" r="${radius}" fill="${BRAND.fg}"/>
</svg>`;
}

const svg = await readFile(SRC, "utf8");

await writeFile("app/apple-icon.png", await render(svg, 180));
await writeFile("public/favicon/favicon-32.png", await render(svg, 32));
await writeFile("public/favicon/icon-192.png", await render(svg, 192));
await writeFile("public/favicon/icon-512.png", await render(svg, 512));
await writeFile(
  "public/favicon/icon-maskable-512.png",
  await sharp(Buffer.from(maskableSvg(512)), { density: 384 })
    .png({ compressionLevel: 9 })
    .toBuffer(),
);

await writeFile(
  "app/favicon.ico",
  encodeIco([
    { size: 16, data: await render(svg, 16) },
    { size: 32, data: await render(svg, 32) },
    { size: 48, data: await render(svg, 48) },
  ]),
);

console.log("icons written");
