import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/seo";
import { seedPosts, users } from "@/lib/seed";
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/explore`, changeFrequency: "daily", priority: 0.9 },
    ...seedPosts.map((p) => ({
      url: `${siteUrl}/post/${p.id}`,
      lastModified: p.createdAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...users.map((u) => ({
      url: `${siteUrl}/people/${u.id}`,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
