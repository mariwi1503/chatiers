import { readFile, writeFile, mkdir } from "node:fs/promises";
import sharp from "sharp";
const referencePath = process.argv[2];
const html = await readFile(referencePath, "utf8");
const sources = [
  ...new Set(
    [
      ...html.matchAll(/src="(https:\/\/lh3\.googleusercontent\.com[^"\s]+)"/g),
    ].map((m) => m[1]),
  ),
];
await mkdir("public/images", { recursive: true });
for (const [name, index] of [
  ["chaty", 1],
  ["rizky", 2],
  ["design-feed", 3],
  ["design-profile", 4],
  ["andi", 5],
]) {
  const response = await fetch(sources[index]);
  if (!response.ok)
    throw new Error(`Could not download ${name}: ${response.status}`);
  await sharp(Buffer.from(await response.arrayBuffer()))
    .resize({
      width: name.startsWith("design") ? 640 : 480,
      withoutEnlargement: true,
    })
    .webp({ quality: 88 })
    .toFile(`public/images/${name}.webp`);
}
await sharp("public/images/logo.png")
  .resize(480)
  .webp({ quality: 90 })
  .toFile("public/images/logo.webp");
await sharp("public/images/logo.png")
  .extract({ left: 440, top: 90, width: 645, height: 610 })
  .resize(180, 180, { fit: "contain", background: "#ffffff" })
  .png()
  .toFile("src/app/apple-icon.png");
await sharp("public/images/browser-icon.png")
  .resize(64, 64, {
    fit: "contain",
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  })
  .png()
  .toFile("src/app/icon.png");
await mkdir("public/fonts", { recursive: true });
const css = await (
  await fetch(
    "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400..800&display=swap",
    {
      headers: {
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
      },
    },
  )
).text();
const fonts = [...css.matchAll(/url\((https:[^)]+)\)/g)];
const fontUrl = fonts.at(-1)?.[1];
if (!fontUrl) throw new Error("Font URL missing");
await writeFile(
  "public/fonts/plus-jakarta-sans.woff2",
  Buffer.from(await (await fetch(fontUrl)).arrayBuffer()),
);
console.log("Reference assets, application icons, and local font prepared.");
