import { PostDetail } from "@/features/feed/post-detail";
import { getUser, seedPosts } from "@/lib/seed";
import { pageMetadata, siteUrl } from "@/lib/seo";
export function generateStaticParams() {
  return seedPosts.map((p) => ({ id: p.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = seedPosts.find((p) => p.id === id);
  return pageMetadata(
    p ? `${p.category} oleh ${getUser(p.authorId).fullname}` : "Percakapan",
    `/post/${id}`,
    p?.text.slice(0, 160),
    !p,
  );
}
export default async function PostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const p = seedPosts.find((p) => p.id === id);
  const schema = p
    ? {
        "@context": "https://schema.org",
        "@type": "SocialMediaPosting",
        headline: `${p.category} oleh ${getUser(p.authorId).fullname}`,
        articleBody: p.text,
        datePublished: p.createdAt,
        author: {
          "@type": "Person",
          name: getUser(p.authorId).fullname,
          url: `${siteUrl}/people/${p.authorId}`,
        },
        url: `${siteUrl}/post/${id}`,
        ...(p.images.length
          ? { image: p.images.map((src) => `${siteUrl}${src}`) }
          : {}),
      }
    : null;
  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <PostDetail id={id} />
    </>
  );
}
