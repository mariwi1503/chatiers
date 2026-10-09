"use client";
import { useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { useDatabase, useDatabaseMutation } from "@/lib/queries";
import { getUser } from "@/lib/seed";
import { useApp } from "@/providers/app-provider";
import { PostCard } from "./post-card";
export function PostDetail({ id }: { id: string }) {
  const { data } = useDatabase();
  const mutation = useDatabaseMutation();
  const { notify } = useApp();
  const [text, setText] = useState("");
  const post = data.posts.find((p) => p.id === id);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await mutation.mutateAsync((db) => ({
        ...db,
        posts: db.posts.map((p) =>
          p.id !== id
            ? p
            : {
                ...p,
                commentCount: p.commentCount + 1,
                comments: [
                  ...p.comments,
                  {
                    id: crypto.randomUUID(),
                    authorId: "me",
                    text: text.trim(),
                    createdAt: new Date().toISOString(),
                  },
                ],
              },
        ),
      }));
      setText("");
      notify("Komentar berhasil ditambahkan.");
    } catch (err) {
      notify((err as Error).message, true);
    }
  }
  return (
    <div className="feed-container">
      <div className="page-heading">
        <Link className="icon-button" href="/" aria-label="Kembali ke feed">
          <ArrowLeft size={23} />
        </Link>
        <h1>Percakapan</h1>
      </div>
      {post ? (
        <>
          <PostCard post={post} />
          <section className="comments-section">
            <h2>Diskusi & insight</h2>
            <p className="muted text-sm mb-5">
              Bantu ide ini tumbuh dengan perspektifmu.
            </p>
            {post.comments.map((c) => {
              const u = getUser(c.authorId, data.profile);
              return (
                <div key={c.id} className="comment">
                  <Image
                    src={u.avatar}
                    alt=""
                    width={32}
                    height={32}
                    className="avatar"
                  />
                  <div>
                    <strong>{u.fullname}</strong>
                    <p>{c.text}</p>
                  </div>
                </div>
              );
            })}
            {post.comments.length === 0 && (
              <p className="empty-inline">
                Mulai percakapan yang berarti. Jadilah yang pertama memberi
                masukan.
              </p>
            )}
            <form className="comment-form" onSubmit={submit}>
              <label htmlFor="comment-input" className="sr-only">
                Tulis komentar
              </label>
              <input
                id="comment-input"
                className="form-input"
                placeholder="Bagikan insight kamu…"
                maxLength={500}
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
              />
              <button
                className="icon-button"
                aria-label="Kirim komentar"
                disabled={!text.trim() || mutation.isPending}
              >
                <Send size={20} />
              </button>
            </form>
          </section>
        </>
      ) : (
        <div className="empty-state">
          <h2>Posting tidak ditemukan</h2>
          <p>Posting mungkin sudah dihapus.</p>
          <Link className="primary-button" href="/">
            Kembali ke feed
          </Link>
        </div>
      )}
    </div>
  );
}
