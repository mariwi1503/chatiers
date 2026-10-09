"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bookmark,
  Heart,
  Plus,
  Search,
  Send,
  UserRound,
  ArrowUpRight,
  Layers,
  Lightbulb,
} from "lucide-react";
import { useApp } from "@/providers/app-provider";
import { useDatabase } from "@/lib/queries";
import { users } from "@/lib/seed";
import type { ReactNode } from "react";
function FeedIcon() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="18" height="11" rx="3.5" />
      <path d="M6 18h12a3 3 0 003-3M8 21h8a3 3 0 003-3" />
    </svg>
  );
}
const links = [
  { href: "/", label: "Feed", icon: FeedIcon },
  { href: "/explore", label: "Explore", icon: Search },
  { href: "/activity", label: "Activity", icon: Heart },
  { href: "/profile", label: "Profile", icon: UserRound },
];
export function AppShell({ children }: { children: ReactNode }) {
  const path = usePathname();
  const { openComposer } = useApp();
  const { data } = useDatabase();
  const unread = data.conversations.filter((c) => c.unread).length;
  const activityUnread = data.activities.some((a) => !a.read);
  function navLink(item: (typeof links)[number], desktop = false) {
    const active =
      item.href === "/" ? path === "/" : path.startsWith(item.href);
    return (
      <Link
        key={item.href}
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`${desktop ? "sidebar-link" : "bottom-link"} ${active ? "active" : ""}`}
      >
        <span className="relative">
          <item.icon size={24} />
          {item.href === "/activity" && activityUnread && (
            <span className="activity-dot" />
          )}
        </span>
        <span>{item.label}</span>
      </Link>
    );
  }
  return (
    <>
      <a href="#main-content" className="skip-link">
        Langsung ke konten
      </a>
      <header className="mobile-header">
        <div className="header-inner">
          <Link href="/" aria-label="Chatiers — Beranda">
            <Image
              priority
              src="/images/logo.webp"
              width={60}
              height={40}
              alt="Chatiers"
              className="header-logo"
            />
          </Link>
          <Link
            href="/messages"
            className="inbox-button"
            aria-label={`Pesan, ${unread} percakapan belum dibaca`}
          >
            <Send size={23} className="-rotate-12" />
            {unread > 0 && <span className="message-badge">{unread}</span>}
          </Link>
        </div>
      </header>
      <div className="desktop-grid">
        <aside className="desktop-sidebar">
          <Link href="/" aria-label="Chatiers — Beranda">
            <Image
              priority
              src="/images/logo.webp"
              width={114}
              height={76}
              alt="Chatiers"
              className="desktop-logo"
            />
          </Link>
          <p className="sidebar-tagline">Tempat ide bertemu peluang.</p>
          <nav aria-label="Navigasi utama">
            {links.map((item) => navLink(item, true))}
            <Link
              href="/saved"
              className={`sidebar-link ${path === "/saved" ? "active" : ""}`}
            >
              <Bookmark size={24} />
              Tersimpan
            </Link>
            <Link
              href="/messages"
              className={`sidebar-link ${path === "/messages" ? "active" : ""}`}
            >
              <Send size={24} />
              Pesan{unread > 0 && <span className="small-badge">{unread}</span>}
            </Link>
          </nav>
          <button
            className="primary-button sidebar-compose"
            onClick={openComposer}
          >
            <Plus size={20} />
            Bagikan ide
          </button>
          <Link href="/profile" className="sidebar-profile">
            <Image
              src={data.profile.avatar}
              alt=""
              width={40}
              height={40}
              className="avatar"
            />
            <div>
              <strong>{data.profile.fullname}</strong>
              <p>{data.profile.company}</p>
            </div>
            <ArrowUpRight size={18} />
          </Link>
          <div className="sidebar-footer">
            © {new Date().getFullYear()} Chatiers
            <br />
            Ide baik tumbuh bersama.
          </div>
        </aside>
        <main id="main-content" className="main-content">
          {children}
        </main>
        <aside className="desktop-right">
          <div className="right-intro">
            <span className="eyebrow">
              <span className="live-dot" /> RUANG UNTUK TUMBUH
            </span>
            <h2>
              Ide kecil.
              <br />
              <span>Peluang besar.</span>
            </h2>
            <p>Temukan orang yang tepat untuk langkah bisnismu berikutnya.</p>
          </div>
          <section className="right-card">
            <div className="section-heading">
              <h3>Peluang minggu ini</h3>
              <ArrowUpRight size={18} />
            </div>
            <Link href="/post/finsmart-team" className="opportunity">
              <span className="opportunity-icon">
                <Layers size={20} />
              </span>
              <div>
                <strong>Bangun bersama FinSmart</strong>
                <p>Teknologi · Cari Tim</p>
              </div>
            </Link>
            <Link href="/post/supplier-umkm" className="opportunity">
              <span className="opportunity-icon violet">
                <Lightbulb size={20} />
              </span>
              <div>
                <strong>Mitra supplier UMKM</strong>
                <p>Kuliner · Kolaborasi</p>
              </div>
            </Link>
            <Link href="/explore" className="text-button text-sm">
              Jelajahi semua peluang <ArrowUpRight size={15} />
            </Link>
          </section>
          <section className="right-card">
            <h3>Kenalan baru, ide baru</h3>
            {users
              .filter((u) => u.id !== "official")
              .slice(0, 2)
              .map((user) => (
                <Link
                  href={`/people/${user.id}`}
                  className="suggested-person"
                  key={user.id}
                >
                  <Image
                    src={user.avatar}
                    alt=""
                    width={36}
                    height={36}
                    className="avatar"
                  />
                  <div>
                    <strong>{user.fullname}</strong>
                    <p>
                      {user.position} @ {user.company}
                    </p>
                  </div>
                  <Plus size={17} />
                </Link>
              ))}
          </section>
          <p className="right-footnote">
            Ruang sederhana untuk produk, bisnis,
            <br />
            dan percakapan yang membawa kemajuan.
          </p>
        </aside>
      </div>
      <div className="bottom-nav-wrap">
        <nav className="bottom-nav" aria-label="Navigasi mobile">
          {links.slice(0, 2).map((item) => navLink(item))}
          <button
            className="create-button"
            onClick={openComposer}
            aria-label="Bagikan ide"
          >
            <Plus size={26} strokeWidth={2.4} />
          </button>
          {links.slice(2).map((item) => navLink(item))}
        </nav>
      </div>
    </>
  );
}
