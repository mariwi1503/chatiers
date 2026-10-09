import { notFound } from "next/navigation";
import { users } from "@/lib/seed";
import { Profile } from "@/features/profile/profile";
import { pageMetadata } from "@/lib/seo";
export function generateStaticParams() {
  return users.map((u) => ({ id: u.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const u = users.find((u) => u.id === id);
  return pageMetadata(
    u ? `${u.fullname} — ${u.company}` : "Profil",
    `/people/${id}`,
    u?.bio,
  );
}
export default async function PersonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!users.some((u) => u.id === id)) notFound();
  return <Profile userId={id} />;
}
