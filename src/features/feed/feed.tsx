"use client";
import Image from "next/image";
import { useDatabase } from "@/lib/queries";
import { useApp } from "@/providers/app-provider";
import { PostCard, FeedEnd } from "./post-card";
export function Feed() {
  const { data } = useDatabase();
  const { openComposer } = useApp();
  return (
    <div className="feed-container">
      <h1 className="sr-only">
        Chatiers — Berbagi ide bisnis, produk, dan peluang
      </h1>
      <div className="quick-composer">
        <Image
          src={data.profile.avatar}
          alt=""
          width={40}
          height={40}
          className="avatar"
        />
        <button onClick={openComposer}>
          Apa ide bisnis atau produk baru anda?
        </button>
      </div>
      <div className="feed-stream">
        {data.posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      <FeedEnd />
    </div>
  );
}
