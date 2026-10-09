"use client";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import { Bookmark, Heart, Rocket, Trash2 } from "lucide-react";
import { CommentIcon, RepostIcon } from "@/components/ui/feed-icons";
import type { Post } from "@/types";
import { getUser } from "@/lib/seed";
import { useDatabase, useDatabaseMutation } from "@/lib/queries";
import { useApp } from "@/providers/app-provider";
import { Dialog } from "@/components/ui/dialog";
export function PostCard({ post }: { post: Post }) {
  const { data } = useDatabase();
  const author = getUser(post.authorId, data.profile);
  const mutation = useDatabaseMutation();
  const { notify } = useApp();
  const [slide, setSlide] = useState(0);
  const [viewImage, setViewImage] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const carousel = useRef<HTMLDivElement>(null);
  const closeImage = useCallback(() => setViewImage(null), []);
  const closeDelete = useCallback(() => setDeleting(false), []);
  async function toggle(kind: "liked" | "saved" | "reposted") {
    try {
      await mutation.mutateAsync((db) => ({
        ...db,
        posts: db.posts.map((p) =>
          p.id !== post.id
            ? p
            : {
                ...p,
                [kind]: !p[kind],
                ...(kind === "liked"
                  ? { likes: p.likes + (p.liked ? -1 : 1) }
                  : kind === "reposted"
                    ? { reposts: p.reposts + (p.reposted ? -1 : 1) }
                    : {}),
              },
        ),
      }));
      if (kind === "saved")
        notify(
          post.saved
            ? "Posting dihapus dari koleksi."
            : "Posting disimpan. Lihat di profilmu.",
        );
      if (kind === "reposted")
        notify(
          post.reposted
            ? "Bagikan ulang dibatalkan."
            : "Posting dibagikan ulang ke profilmu.",
        );
    } catch (err) {
      notify((err as Error).message, true);
    }
  }
  const isMascot = post.id === "meet-chaty";
  const text =
    post.id === "finsmart-team" ? (
      <>
        Kami sedang scale FinTech SaaS untuk pencatatan keuangan warung. Mencari{" "}
        <strong className="text-primary">Senior Flutter Dev</strong> &amp;{" "}
        <strong className="text-violet">Lead Marketing</strong>. Equity + Gaji
        kompetitif. Drop portfolio atau DM langsung ya!
      </>
    ) : (
      post.text
    );
  return (
    <article className="post-card">
      <Link
        href={author.id === "me" ? "/profile" : `/people/${author.id}`}
        className="post-avatar-link"
        aria-label={`Profil ${author.fullname}`}
      >
        <Image
          src={author.avatar}
          alt={author.fullname}
          width={40}
          height={40}
          className="avatar"
        />
      </Link>
      <div className="post-content">
        <div className="post-header">
          <div className="author-info">
            <div className="author-line">
              <Link
                href={author.id === "me" ? "/profile" : `/people/${author.id}`}
                className="author-name"
              >
                {author.fullname}
              </Link>
              <span className="verified-space" />
              <span className="post-time">
                • &nbsp;{post.timeLabel || "Baru saja"}
              </span>
            </div>
            <p className="author-description">
              {author.id === "official"
                ? "Tim Produk Chatiers"
                : `${author.position} @ ${author.company}`}
            </p>
          </div>
          <span
            className={`category-badge category-${post.category.replaceAll(" ", "-").toLowerCase()}`}
          >
            {post.category}
          </span>
        </div>
        <p className="post-text">{text}</p>
        {post.images.length > 0 && (
          <div className="post-media">
            {isMascot ? (
              <button
                className="mascot-media"
                onClick={() => setViewImage(post.images[0])}
                aria-label="Lihat maskot Chaty"
              >
                <Image
                  src={post.images[0]}
                  alt="Chaty, robot biru ramah maskot Chatiers"
                  width={192}
                  height={192}
                />
                <span>Meet Chaty 🤖</span>
              </button>
            ) : (
              <>
                <div
                  ref={carousel}
                  className="media-carousel"
                  onScroll={() =>
                    setSlide(
                      Math.min(
                        post.images.length - 1,
                        Math.round((carousel.current?.scrollLeft || 0) / 200),
                      ),
                    )
                  }
                >
                  {post.images.map((src, i) => (
                    <button
                      className="media-slide"
                      key={`${src}-${i}`}
                      onClick={() => setViewImage(src)}
                      aria-label={`Lihat gambar ${i + 1} dari ${post.images.length}`}
                    >
                      <Image
                        src={src}
                        alt={`Preview ${post.category} oleh ${author.fullname}, gambar ${i + 1}`}
                        width={192}
                        height={192}
                        unoptimized={src.startsWith("data:")}
                      />
                      <span className="slide-count">
                        {i + 1}/{post.images.length}
                      </span>
                    </button>
                  ))}
                </div>
                {post.images.length > 1 && (
                  <div className="carousel-dots">
                    {post.images.map((_, i) => (
                      <button
                        key={i}
                        className={slide === i ? "selected" : ""}
                        aria-label={`Ke gambar ${i + 1}`}
                        aria-pressed={slide === i}
                        onClick={() =>
                          carousel.current?.scrollTo({
                            left: i * 200,
                            behavior: "smooth",
                          })
                        }
                      />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
        <div className="post-actions">
          <button
            disabled={mutation.isPending}
            aria-label={`${post.liked ? "Batal suka" : "Sukai"} posting ${author.fullname}`}
            aria-pressed={post.liked}
            className={post.liked ? "liked" : ""}
            onClick={() => void toggle("liked")}
          >
            <Heart size={20} fill={post.liked ? "currentColor" : "none"} />
            <span>{post.likes}</span>
          </button>
          <Link
            href={`/post/${post.id}`}
            aria-label={`Lihat ${post.commentCount} komentar pada posting ${author.fullname}`}
          >
            <CommentIcon />
            <span>{post.commentCount}</span>
          </Link>
          <button
            disabled={mutation.isPending}
            className={post.reposted ? "reposted" : ""}
            aria-label="Bagikan ulang posting"
            aria-pressed={post.reposted}
            onClick={() => void toggle("reposted")}
          >
            <RepostIcon />
            <span>{post.reposts}</span>
          </button>
          <button
            disabled={mutation.isPending}
            className={post.saved ? "saved" : ""}
            aria-label={post.saved ? "Batal simpan posting" : "Simpan posting"}
            aria-pressed={post.saved}
            onClick={() => void toggle("saved")}
          >
            <Bookmark size={20} fill={post.saved ? "currentColor" : "none"} />
          </button>
          {post.authorId === "me" && (
            <button
              aria-label="Hapus posting"
              onClick={() => setDeleting(true)}
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
      {viewImage && (
        <Dialog title="Lihat gambar" wide onClose={closeImage}>
          <Image
            className="lightbox-image"
            src={viewImage}
            alt="Gambar posting dalam ukuran penuh"
            width={900}
            height={900}
            unoptimized={viewImage.startsWith("data:")}
          />
        </Dialog>
      )}
      {deleting && (
        <Dialog title="Hapus posting?" onClose={closeDelete}>
          <div className="dialog-body">
            <p>Posting ini akan dihapus dari feed dan koleksimu.</p>
            <div className="flex gap-3 mt-6">
              <button className="secondary-button flex-1" onClick={closeDelete}>
                Batal
              </button>
              <button
                className="primary-button flex-1"
                onClick={async () => {
                  try {
                    await mutation.mutateAsync((db) => ({
                      ...db,
                      posts: db.posts.filter((p) => p.id !== post.id),
                    }));
                    notify("Posting dihapus.");
                    closeDelete();
                  } catch (err) {
                    notify((err as Error).message, true);
                  }
                }}
              >
                Hapus
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </article>
  );
}
export function FeedEnd() {
  return (
    <div className="feed-end">
      <span className="rocket-circle">
        <Rocket size={28} />
      </span>
      <h2>Kamu sudah up to date!</h2>
      <p>
        Temukan lebih banyak founder dan peluang bisnis
        <br className="hidden min-[380px]:block" /> baru di tab{" "}
        <Link href="/explore">Jelajah</Link>.
      </p>
    </div>
  );
}
