// Generates app/icon.svg from the react-icons mark, then derives every raster
// icon from it. Run after changing the mark or the palette:
//
//   node scripts/generate-icons.mjs
//
// app/icon.svg carries its own light/dark variants in an embedded
// `@media (prefers-color-scheme: dark)` block, so no separate dark raster is
// needed - browsers that render SVG favicons switch automatically. The rasters
// here are the fallbacks (`.ico` for Safari and legacy requests), the iOS home
// screen icon, and the manifest install icons.

import { writeFile } from "node:fs/promises";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { GiBowTieRibbon } from "react-icons/gi";
import sharp from "sharp";

const ICON_SVG = "app/icon.svg";

// The plate stays on the site accent; the mark carries the brand colour.
const PLATE = { light: "#6d86f0", dark: "#2b3350", mark: "#DDAACC" };

// Fraction of the canvas the mark covers, leaving even padding around it.
const MARK_RATIO = 0.625;

const CANVAS = 32;
const RADIUS = 8;

// Rendering the real component keeps the icon from drifting away from the mark
// it is drawn from; only the glyph path and its viewBox are taken from it.
const markup = renderToStaticMarkup(
  createElement(GiBowTieRibbon, { color: PLATE.mark }),
);
const viewBox = markup
  .match(/viewBox="([^"]+)"/)[1]
  .split(/\s+/)
  .map(Number);
const VIEW_BOX_WIDTH = viewBox[2];
const MARK_PATH = markup.replace(/^<svg[^>]*>/, "").replace(/<\/svg>$/, "");

function markGroup(size, ratio = MARK_RATIO) {
  const scale = (size * ratio) / VIEW_BOX_WIDTH;
  const offset = (size - size * ratio) / 2;
  return `<g transform="translate(${offset} ${offset}) scale(${scale})" fill="${PLATE.mark}">${MARK_PATH}</g>`;
}

function iconSvg() {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS} ${CANVAS}" width="${CANVAS}" height="${CANVAS}">
  <title>Fuwari</title>
  <style>
    .plate {
      fill: ${PLATE.light};
    }
    @media (prefers-color-scheme: dark) {
      .plate {
        fill: ${PLATE.dark};
      }
    }
  </style>
  <rect class="plate" width="${CANVAS}" height="${CANVAS}" rx="${RADIUS}" />
  ${markGroup(CANVAS)}
</svg>
`;
}

// Full-bleed square with the mark inside Android's 80% safe circle, which it
// crops to whatever shape the launcher asks for.
function maskableSvg(size) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="${PLATE.light}"/>
  ${markGroup(size, 0.55)}
</svg>`;
}

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

const svg = iconSvg();
await writeFile(ICON_SVG, svg);

await writeFile("app/apple-icon.png", await render(svg, 180));
await writeFile("public/favicon/favicon-32.png", await render(svg, 32));
await writeFile("public/favicon/icon-192.png", await render(svg, 192));
await writeFile("public/favicon/icon-512.png", await render(svg, 512));
await writeFile(
  "public/favicon/icon-maskable-512.png",
  await render(maskableSvg(512), 512),
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
