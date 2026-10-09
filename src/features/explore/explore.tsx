"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, ArrowUpRight, Compass, Users } from "lucide-react";
import { categories } from "@/types";
import { users, getUser } from "@/lib/seed";
import { useDatabase } from "@/lib/queries";
import { PostCard } from "@/features/feed/post-card";
export function Explore() {
  const { data } = useDatabase();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Semua");
  const [tab, setTab] = useState<"posts" | "people">("posts");
  const search = query.toLocaleLowerCase("id").trim();
  const posts = data.posts.filter((p) => {
    const u = getUser(p.authorId, data.profile);
    return (
      (category === "Semua" || p.category === category) &&
      `${p.text} ${u.fullname} ${u.company} ${p.category}`
        .toLocaleLowerCase("id")
        .includes(search)
    );
  });
  const people = users.filter((u) =>
    `${u.fullname} ${u.company} ${u.position} ${u.address}`
      .toLocaleLowerCase("id")
      .includes(search),
  );
  return (
    <div className="feed-container">
      <div className="page-heading stacked">
        <span className="eyebrow">TEMUKAN LANGKAH BERIKUTNYA</span>
        <h1>
          Jelajah peluang<span className="text-violet">.</span>
        </h1>
        <p>Ide, produk, dan orang yang bisa membuat bisnismu tumbuh.</p>
      </div>
      <div className="search-field">
        <Search size={20} />
        <label className="sr-only" htmlFor="explore-search">
          Cari ide, produk, atau founder
        </label>
        <input
          id="explore-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Cari ide, produk, atau founder…"
        />
      </div>
      <div className="tabs" role="tablist" aria-label="Jenis hasil pencarian">
        <button
          role="tab"
          aria-selected={tab === "posts"}
          className={tab === "posts" ? "active" : ""}
          onClick={() => setTab("posts")}
        >
          <Compass size={17} />
          Ide & peluang
        </button>
        <button
          role="tab"
          aria-selected={tab === "people"}
          className={tab === "people" ? "active" : ""}
          onClick={() => setTab("people")}
        >
          <Users size={17} />
          Orang
        </button>
      </div>
      {tab === "posts" ? (
        <>
          <div className="category-filters">
            {["Semua", ...categories].map((c) => (
              <button
                aria-pressed={category === c}
                className={category === c ? "selected" : ""}
                onClick={() => setCategory(c)}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>
          {!search && category === "Semua" && (
            <div className="explore-banner">
              <span className="rocket-circle">
                <Compass size={26} />
              </span>
              <div>
                <h2>Kolaborasi dimulai dari satu sapaan.</h2>
                <p>Temukan rekan, validasi ide, atau bangun sesuatu bersama.</p>
              </div>
              <ArrowUpRight size={22} />
            </div>
          )}
          <p className="result-count">
            {posts.length} ide & peluang untuk kamu
          </p>
          {posts.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
          {posts.length === 0 && (
            <div className="empty-state">
              <Search size={35} />
              <h2>Belum ada yang cocok</h2>
              <p>Coba kata kunci atau kategori lain.</p>
              <button
                className="text-button"
                onClick={() => {
                  setQuery("");
                  setCategory("Semua");
                }}
              >
                Lihat semua peluang
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="people-list">
          {people.map((u) => (
            <Link key={u.id} href={`/people/${u.id}`} className="person-card">
              <Image
                src={u.avatar}
                alt=""
                width={48}
                height={48}
                className="avatar"
              />
              <div>
                <h2>{u.fullname}</h2>
                <p>
                  {u.position} @ {u.company}
                </p>
                <span>{u.address}</span>
              </div>
              <ArrowUpRight size={20} />
            </Link>
          ))}
          {people.length === 0 && (
            <div className="empty-state">
              <h2>Orang belum ditemukan</h2>
              <p>Cari dengan nama atau perusahaan lain.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
