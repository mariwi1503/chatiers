import { Feed } from "@/features/feed/feed";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata("Feed — Ide Bisnis & Peluang", "/");
export default function HomePage() {
  return <Feed />;
}
