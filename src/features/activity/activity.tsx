"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CheckCheck, Heart } from "lucide-react";
import { useDatabase, useDatabaseMutation } from "@/lib/queries";
import { getUser } from "@/lib/seed";
import { useApp } from "@/providers/app-provider";
export function Activity() {
  const { data } = useDatabase();
  const mutation = useDatabaseMutation();
  const { notify } = useApp();
  const [unreadOnly, setUnreadOnly] = useState(false);
  const activities = data.activities.filter((a) => !unreadOnly || !a.read);
  async function markRead(id?: string) {
    try {
      await mutation.mutateAsync((db) => ({
        ...db,
        activities: db.activities.map((a) =>
          !id || a.id === id ? { ...a, read: true } : a,
        ),
      }));
    } catch (err) {
      notify((err as Error).message, true);
    }
  }
  return (
    <div className="feed-container">
      <div className="page-heading stacked">
        <span className="eyebrow">KONEKSI YANG BERARTI</span>
        <h1>
          Aktivitas<span className="text-violet">.</span>
        </h1>
        <p>Ikuti percakapan dan peluang di sekitarmu.</p>
      </div>
      <div className="activity-toolbar">
        <div className="category-filters">
          <button
            className={!unreadOnly ? "selected" : ""}
            onClick={() => setUnreadOnly(false)}
          >
            Semua
          </button>
          <button
            className={unreadOnly ? "selected" : ""}
            onClick={() => setUnreadOnly(true)}
          >
            Belum dibaca
          </button>
        </div>
        <button
          className="icon-button"
          aria-label="Tandai semua sudah dibaca"
          disabled={mutation.isPending}
          onClick={() => void markRead()}
        >
          <CheckCheck size={22} />
        </button>
      </div>
      <div className="activity-list">
        {activities.map((a) => {
          const u = getUser(a.authorId);
          return (
            <Link
              onClick={() => void markRead(a.id)}
              href={a.postId ? `/post/${a.postId}` : `/people/${u.id}`}
              className={`activity-row ${!a.read ? "unread" : ""}`}
              key={a.id}
            >
              <Image
                src={u.avatar}
                alt=""
                width={42}
                height={42}
                className="avatar"
              />
              <div>
                <p>
                  <strong>{u.fullname}</strong> {a.text}
                </p>
                <span>{a.time}</span>
              </div>
              {!a.read ? (
                <span className="unread-dot" />
              ) : (
                <ArrowUpRight size={17} />
              )}
            </Link>
          );
        })}
      </div>
      {activities.length === 0 && (
        <div className="empty-state">
          <span className="rocket-circle">
            <Heart size={27} />
          </span>
          <h2>Kamu sudah mengikuti semuanya.</h2>
          <p>Aktivitas baru akan muncul di sini.</p>
        </div>
      )}
      <div className="hint m-4">
        <Heart size={18} />
        <p>
          Satu koneksi baru bisa membuka banyak kemungkinan. Sapa seseorang hari
          ini.
        </p>
      </div>
    </div>
  );
}
