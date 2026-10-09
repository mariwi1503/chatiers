import { Profile } from "@/features/profile/profile";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Profil Saya",
  "/profile",
  undefined,
  true,
);
export default function ProfilePage() {
  return <Profile />;
}
