import type { Database, Post, User } from "@/types";

export const currentUser: User = {
  id: "me",
  fullname: "Alex Morgan",
  phone: "+62 812 3456 7890",
  email: "alex@ruangusaha.id",
  position: "Founder",
  company: "Ruang Usaha",
  address: "Jakarta Selatan, DKI Jakarta",
  bio: "Membangun ruang untuk ide yang berarti. Tertarik pada produk digital, UMKM, dan kolaborasi yang tumbuh bersama.",
  avatar: "/images/chaty.webp",
  website: "https://ruangusaha.id",
};
export const users: User[] = [
  {
    id: "rizky",
    fullname: "Rizky Pratama",
    phone: "+62 812 1111 2222",
    email: "rizky@quickdeliver.id",
    position: "Founder",
    company: "QuickDeliver",
    address: "Jakarta, DKI Jakarta",
    bio: "Membantu UMKM kuliner mendapatkan bahan baku terbaik. Yuk, bangun bisnis yang berdampak bersama.",
    avatar: "/images/rizky.webp",
    website: "https://quickdeliver.id",
  },
  {
    id: "sarah",
    fullname: "Sarah Jessica",
    phone: "+62 813 2222 3333",
    email: "sarah@studiolab.id",
    position: "Product Designer",
    company: "StudioLab",
    address: "Bandung, Jawa Barat",
    bio: "Merancang produk yang sederhana dan menyenangkan. Terbuka untuk kolaborasi desain dan produk digital.",
    avatar: "/images/rizky.webp",
    website: "https://studiolab.id",
  },
  {
    id: "official",
    fullname: "Chatiers Official",
    phone: "+62 800 1234 5678",
    email: "hello@chatiers.id",
    position: "Tim Produk",
    company: "Chatiers",
    address: "Jakarta, Indonesia",
    bio: "Tempat ide bertemu peluang. Berbagi, terhubung, dan tumbuh bersama komunitas bisnis.",
    avatar: "/images/chaty.webp",
    website: "https://chatiers.id",
  },
  {
    id: "andi",
    fullname: "Andi Wijaya",
    phone: "+62 815 3333 4444",
    email: "andi@finsmart.id",
    position: "Co-Founder",
    company: "FinSmart",
    address: "Surabaya, Jawa Timur",
    bio: "Membuat pengelolaan keuangan lebih mudah untuk setiap pemilik usaha. Sedang mencari talenta hebat untuk tumbuh bersama.",
    avatar: "/images/andi.webp",
    website: "https://finsmart.id",
  },
];
const base = {
  liked: false,
  saved: false,
  reposted: false,
  comments: [],
  images: [],
};
export const seedPosts: Post[] = [
  {
    ...base,
    id: "supplier-umkm",
    authorId: "rizky",
    category: "Bisnis",
    timeLabel: "2j lalu",
    createdAt: "2026-10-09T05:00:00Z",
    text: "Lagi riset untuk bikin platform agregator supplier bahan baku untuk UMKM kuliner di Jabodetabek dengan jaminan delivery H+1. Kira-kira margin 5–7% feasible nggak untuk tahap awal? Mau minta insight dari sesama founder F&B!",
    likes: 342,
    commentCount: 58,
    reposts: 24,
    comments: [
      {
        id: "c1",
        authorId: "andi",
        text: "Menarik! Mulai dari satu area dulu supaya biaya logistik lebih efisien. Validasi juga minimum order dengan calon mitra.",
        createdAt: "2026-10-09T06:00:00Z",
      },
    ],
  },
  {
    ...base,
    id: "design-chatiers",
    authorId: "sarah",
    category: "Design",
    timeLabel: "3j lalu",
    createdAt: "2026-10-09T04:00:00Z",
    text: "Sneak peek eksplorasi visual identitas dan micro-interaction aplikasi Chatiers v2.0! Geser untuk melihat wireframe awal sampai final prototype ✨ Mau dengar feedback kalian!",
    likes: 215,
    commentCount: 41,
    reposts: 18,
    images: [
      "/images/design-feed.webp",
      "/images/design-profile.webp",
      "/images/chaty.webp",
    ],
  },
  {
    ...base,
    id: "meet-chaty",
    authorId: "official",
    category: "Launching",
    timeLabel: "4j lalu",
    createdAt: "2026-10-09T03:00:00Z",
    text: "Halo para perintis! Kenalkan robot mascot Chatiers 🤖 yang siap bantu kamu networking dan validasi ide produk langsung ke ribuan audiens terverifikasi. Apa fitur bisnis yang paling kamu butuhkan minggu ini?",
    images: ["/images/chaty.webp"],
    liked: true,
    likes: 894,
    commentCount: 164,
    reposts: 92,
  },
  {
    ...base,
    id: "finsmart-team",
    authorId: "andi",
    category: "Cari Tim",
    timeLabel: "6j lalu",
    createdAt: "2026-10-09T01:00:00Z",
    text: "Kami sedang scale FinTech SaaS untuk pencatatan keuangan warung. Mencari Senior Flutter Dev & Lead Marketing. Equity + Gaji kompetitif. Drop portfolio atau DM langsung ya!",
    likes: 188,
    commentCount: 43,
    reposts: 31,
  },
];
export function createSeed(): Database {
  return structuredClone({
    version: 1,
    profile: currentUser,
    posts: seedPosts,
    following: [],
    activities: [
      {
        id: "a1",
        authorId: "sarah",
        text: "ingin terhubung dengan kamu. Mari bertukar ide!",
        time: "10 menit lalu",
        read: false,
      },
      {
        id: "a2",
        authorId: "rizky",
        text: "membagikan ide baru tentang supplier UMKM.",
        time: "2 jam lalu",
        read: false,
        postId: "supplier-umkm",
      },
      {
        id: "a3",
        authorId: "andi",
        text: "sedang mencari rekan untuk membangun FinSmart.",
        time: "6 jam lalu",
        read: false,
        postId: "finsmart-team",
      },
    ],
    conversations: users
      .filter((u) => u.id !== "official")
      .map((u, i) => ({
        id: u.id,
        userId: u.id,
        unread: true,
        messages: [
          {
            id: `m${i}`,
            text: [
              "Halo! Saya tertarik bertukar ide tentang bisnis kamu. Ada waktu untuk ngobrol?",
              "Hai! Terima kasih sudah melihat eksplorasi desain saya. Ada masukan?",
              "Halo, kami sedang membuka peluang kolaborasi di FinSmart. Yuk, diskusi!",
            ][i],
            mine: false,
            time: "09.30",
          },
        ],
      })),
  } satisfies Database);
}
export function getUser(id: string, profile = currentUser) {
  return id === "me" ? profile : (users.find((u) => u.id === id) ?? users[2]);
}
