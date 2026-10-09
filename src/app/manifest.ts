import type { MetadataRoute } from "next";
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Chatiers — Tempat Ide Bertemu Peluang",
    short_name: "Chatiers",
    description:
      "Komunitas sederhana untuk berbagi bisnis, produk, ide, dan peluang.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf8ff",
    theme_color: "#faf8ff",
    lang: "id",
    icons: [
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
      { src: "/icon.png", sizes: "64x64", type: "image/png" },
    ],
  };
}
