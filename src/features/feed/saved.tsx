"use client";
import Link from "next/link";
import { ArrowLeft, Bookmark } from "lucide-react";
import { useDatabase } from "@/lib/queries";
import { PostCard } from "./post-card";
export function Saved() {
  const { data } = useDatabase();
  const posts = data.posts.filter((p) => p.saved);
  return (
    <div className="feed-container">
      <div className="page-heading">
        <Link
          className="icon-button"
          href="/profile"
          aria-label="Kembali ke profil"
        >
          <ArrowLeft size={22} />
        </Link>
        <h1>Posting tersimpan</h1>
      </div>
      <p className="page-subtitle">
        Simpan ide yang menarik. Kembali saat kamu siap.
      </p>
      {posts.map((p) => (
        <PostCard key={p.id} post={p} />
      ))}
      {posts.length === 0 && (
        <div className="empty-state">
          <span className="rocket-circle">
            <Bookmark size={26} />
          </span>
          <h2>Ruang untuk ide pilihanmu.</h2>
          <p>Ketuk ikon simpan di posting yang ingin kamu baca lagi.</p>
          <Link href="/explore" className="primary-button">
            Temukan ide menarik
          </Link>
        </div>
      )}
    </div>
  );
}
