import { Messages } from "@/features/messages/messages";
import { pageMetadata } from "@/lib/seo";
export const metadata = pageMetadata(
  "Pesan & Kolaborasi",
  "/messages",
  undefined,
  true,
);
export default function MessagesPage() {
  return <Messages />;
}
