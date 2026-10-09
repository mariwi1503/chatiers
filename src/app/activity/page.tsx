import { Activity } from "@/features/activity/activity";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Aktivitas & Koneksi",
  "/activity",
  undefined,
  true,
);
export default function ActivityPage() {
  return <Activity />;
}
