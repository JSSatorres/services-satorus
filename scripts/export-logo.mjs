import sharp from "sharp";

const fontFile = new URL(
  "../node_modules/@fontsource-variable/bricolage-grotesque/files/bricolage-grotesque-latin-wght-normal.woff2",
  import.meta.url,
);
const outputFile = new URL(
  "../public/brand/satorus-logo-transparent.png",
  import.meta.url,
);

const graphite = "#171b18";
const orange = "#e56748";
const lime = "#dfe97a";

// Render oversize first, then reduce to the delivery width for cleaner edges.
const fontSize = 1200;
const markSize = Math.round(fontSize * 1.12);
const gap = Math.round(fontSize * 0.48);
const padding = 128;

const wordmark = await sharp({
  text: {
    text: `<span foreground="${graphite}" weight="760" letter_spacing="-49152">satorus.</span>`,
    font: `Bricolage Grotesque Variable ${fontSize}`,
    fontfile: fontFile.pathname.slice(1),
    dpi: 72,
    rgba: true,
  },
})
  .trim({ background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

const wordmarkMetadata = await sharp(wordmark).metadata();
const wordmarkWidth = wordmarkMetadata.width;
const wordmarkHeight = wordmarkMetadata.height;

if (!wordmarkWidth || !wordmarkHeight) {
  throw new Error("No se pudo medir el wordmark.");
}

const mark = Buffer.from(`
  <svg xmlns="http://www.w3.org/2000/svg" width="${markSize}" height="${markSize}" viewBox="0 0 48 48">
    <path d="M36.5 10.8C30.2 5.8 18.1 5.7 11.8 12.4C5.7 18.9 11.8 23.9 24 23.9C36.5 23.9 42.3 29 36.2 35.8C30.4 42.2 18 42.4 10.7 36.7" fill="none" stroke="${orange}" stroke-linecap="round" stroke-width="6.5"/>
    <circle cx="10.7" cy="36.7" r="4.2" fill="${lime}" stroke="${graphite}" stroke-width="2.2"/>
  </svg>
`);

const contentHeight = Math.max(markSize, wordmarkHeight);
const sourceWidth = padding * 2 + markSize + gap + wordmarkWidth;
const sourceHeight = padding * 2 + contentHeight;

const composedLogo = await sharp({
  create: {
    width: sourceWidth,
    height: sourceHeight,
    channels: 4,
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  },
})
  .composite([
    {
      input: mark,
      left: padding,
      top: padding + Math.round((contentHeight - markSize) / 2),
    },
    {
      input: wordmark,
      left: padding + markSize + gap,
      top: padding + Math.round((contentHeight - wordmarkHeight) / 2),
    },
  ])
  .png()
  .toBuffer();

const logo = await sharp(composedLogo)
  .resize({ width: 4096, kernel: sharp.kernel.lanczos3 })
  .png({ compressionLevel: 9, adaptiveFiltering: true })
  .toFile(outputFile.pathname.slice(1));

console.log(
  `Logo exportado: ${logo.width}x${logo.height}px, PNG RGBA transparente.`,
);
