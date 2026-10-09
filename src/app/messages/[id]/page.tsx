import { notFound } from "next/navigation";
import { Messages } from "@/features/messages/messages";
import { pageMetadata } from "@/lib/seo";
import { users } from "@/lib/seed";
export const metadata = pageMetadata(
  "Percakapan Bisnis",
  "/messages",
  undefined,
  true,
);
export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!users.some((u) => u.id === id && u.id !== "official")) notFound();
  return <Messages initialId={id} />;
}
