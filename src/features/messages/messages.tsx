"use client";
import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MessageCircle, Send } from "lucide-react";
import { useDatabase, useDatabaseMutation } from "@/lib/queries";
import { getUser } from "@/lib/seed";
import { useApp } from "@/providers/app-provider";
import { updateDatabase } from "@/lib/storage";
import { databaseKey } from "@/lib/queries";
import { useQueryClient } from "@tanstack/react-query";
export function Messages({ initialId }: { initialId?: string }) {
  const { data } = useDatabase();
  const client = useQueryClient();
  const mutation = useDatabaseMutation();
  const { notify } = useApp();
  const [text, setText] = useState("");
  const bottom = useRef<HTMLDivElement>(null);
  const conversation = data.conversations.find((c) => c.id === initialId);
  const user = initialId ? getUser(initialId) : undefined;
  useEffect(() => {
    if (initialId) {
      void updateDatabase((db) => ({
        ...db,
        conversations: db.conversations.map((c) =>
          c.id === initialId ? { ...c, unread: false } : c,
        ),
      }))
        .then((db) => client.setQueryData(databaseKey, db))
        .catch(() => {});
    }
  }, [initialId, client]);
  useEffect(() => {
    if (conversation)
      bottom.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [conversation]);
  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!text.trim() || !initialId) return;
    try {
      await mutation.mutateAsync((db) => ({
        ...db,
        conversations: db.conversations.map((c) =>
          c.id !== initialId
            ? c
            : {
                ...c,
                unread: false,
                messages: [
                  ...c.messages,
                  {
                    id: crypto.randomUUID(),
                    text: text.trim(),
                    mine: true,
                    time: new Intl.DateTimeFormat("id-ID", {
                      timeZone: "Asia/Jakarta",
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(new Date()),
                  },
                ],
              },
        ),
      }));
      setText("");
    } catch (err) {
      notify((err as Error).message, true);
    }
  }
  if (initialId && user && conversation)
    return (
      <div className="feed-container chat-container">
        <div className="page-heading chat-heading">
          <Link
            className="icon-button"
            href="/messages"
            aria-label="Kembali ke pesan"
          >
            <ArrowLeft size={22} />
          </Link>
          <Image
            src={user.avatar}
            alt=""
            width={36}
            height={36}
            className="avatar"
          />
          <Link href={`/people/${user.id}`}>
            <h1>{user.fullname}</h1>
            <p className="muted text-xs">
              {user.position} @ {user.company}
            </p>
          </Link>
        </div>
        <div className="chat-messages">
          <div className="chat-day">Percakapan bisnis</div>
          <p className="chat-intro">
            Ide baik dimulai dari percakapan yang hangat.
          </p>
          {conversation.messages.map((m) => (
            <div className={`chat-bubble ${m.mine ? "mine" : ""}`} key={m.id}>
              <p>{m.text}</p>
              <span>{m.time}</span>
            </div>
          ))}
          <div ref={bottom} />
        </div>
        <form className="chat-input" onSubmit={submit}>
          <label htmlFor="message-input" className="sr-only">
            Tulis pesan
          </label>
          <input
            className="form-input"
            id="message-input"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={1000}
            placeholder="Tulis pesan atau ide kolaborasi…"
            required
          />
          <button
            className="primary-button"
            aria-label="Kirim pesan"
            disabled={!text.trim() || mutation.isPending}
          >
            <Send size={19} />
          </button>
        </form>
      </div>
    );
  return (
    <div className="feed-container">
      <div className="page-heading">
        <Link href="/" className="icon-button" aria-label="Kembali ke feed">
          <ArrowLeft size={22} />
        </Link>
        <h1>Pesan</h1>
        <span className="small-badge ml-auto">
          {data.conversations.filter((c) => c.unread).length} baru
        </span>
      </div>
      <p className="page-subtitle">Mulai percakapan. Temukan kesempatan.</p>
      {data.conversations.map((c) => {
        const u = getUser(c.userId);
        const last = c.messages.at(-1);
        return (
          <Link
            className="conversation-row"
            key={c.id}
            href={`/messages/${c.id}`}
          >
            <Image
              src={u.avatar}
              alt=""
              width={48}
              height={48}
              className="avatar"
            />
            <div>
              <div className="flex justify-between gap-2">
                <strong>{u.fullname}</strong>
                <span>{last?.time}</span>
              </div>
              <p>
                {last?.mine ? "Kamu: " : ""}
                {last?.text}
              </p>
            </div>
            {c.unread && <span className="unread-dot" />}
          </Link>
        );
      })}
      <div className="hint m-4">
        <MessageCircle size={19} />
        <p>
          Gunakan percakapan untuk diskusi produk, bisnis, dan peluang
          kolaborasi.
        </p>
      </div>
    </div>
  );
}
