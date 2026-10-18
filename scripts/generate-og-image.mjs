// Builds the site-wide fallback Open Graph image by cropping the banner to the
// 1200x630 card every crawler expects. Run after changing public/banner.jpg:
//
//   node scripts/generate-og-image.mjs
//
// JPEG rather than PNG because this is photographic and PNG would be several
// hundred KB larger for no benefit.

import sharp from "sharp";

const SOURCE = "public/banner.jpg";
const TARGET = "public/og-default.jpg";

await sharp(SOURCE)
  .resize(1200, 630, { fit: "cover", position: "center" })
  .jpeg({ quality: 82, progressive: true, mozjpeg: true })
  .toFile(TARGET);

console.log(`wrote ${TARGET}`);
