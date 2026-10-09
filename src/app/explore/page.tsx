import { Explore } from "@/features/explore/explore";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Jelajah Produk, Founder & Peluang Usaha",
  "/explore",
);
export default function ExplorePage() {
  return <Explore />;
}
