import { Saved } from "@/features/feed/saved";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Posting Tersimpan",
  "/saved",
  undefined,
  true,
);
export default function SavedPage() {
  return <Saved />;
}
