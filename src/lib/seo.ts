import type { Metadata } from "next";
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
).replace(/\/$/, "");
export const description =
  "Berbagi produk, ide bisnis, usaha, dan peluang. Terhubung dengan founder dan profesional, temukan kolaborasi, dan tumbuh bersama di Chatiers.";
export function pageMetadata(
  title: string,
  path: string,
  desc = description,
  privatePage = false,
): Metadata {
  return {
    title,
    description: desc,
    alternates: { canonical: path },
    openGraph: { title: `${title} | Chatiers`, description: desc, url: path },
    ...(privatePage ? { robots: { index: false, follow: false } } : {}),
  };
}
