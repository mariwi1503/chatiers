# Chatiers

Aplikasi komunitas bisnis mobile first: berbagi produk, usaha, ide, dan peluang. Beranda mengikuti desain referensi, menggunakan logo yang disediakan, font Plus Jakarta Sans lokal, warna lavender, serta navigasi bawah. Pada desktop, feed dilengkapi navigasi samping dan rekomendasi peluang.

## Menjalankan

```bash
npm install
cp .env.example .env.local
npm run dev
```

Buka http://localhost:3000. Ubah `NEXT_PUBLIC_SITE_URL` menjadi origin domain produksi sebelum build. Nilai ini digunakan untuk canonical URL, sitemap, robots, Open Graph, dan structured data. Tanpa konfigurasi, origin menggunakan `http://localhost:3000`.

```bash
npm run lint
npm run typecheck
npm run build
npm start
```

## Fitur

- Feed, posting kategori bisnis, dan unggah hingga 3 gambar (JPG/PNG/WebP, maksimum 2 MB per gambar).
- Suka, komentar, bagikan ulang, simpan posting, lihat gambar, dan hapus posting sendiri dengan konfirmasi.
- Jelajah dengan pencarian teks, filter kategori, dan pencarian orang.
- Profil bisnis, edit nama lengkap, HP, email, jabatan, perusahaan, alamat, bio, dan website.
- Ikuti profesional, aktivitas dengan status dibaca, serta percakapan bisnis.
- Responsif, navigasi keyboard, dialog dengan fokus terjaga, pesan status, dan dukungan reduced motion.

## Arsitektur

```text
src/
  app/                 # App Router, layout, metadata, halaman, SEO endpoints
  components/
    layout/            # Shell, header, navigasi mobile dan desktop
    ui/                # Dialog reusable
  features/
    feed/              # Feed, post card, composer, komentar, koleksi
    explore/           # Pencarian dan kategori
    profile/           # Profil dan formulir edit
    activity/          # Aktivitas komunitas
    messages/          # Kotak masuk dan percakapan
  lib/                 # Repository localStorage, query hooks, seed, Zod, SEO
  providers/           # TanStack Query, composer, toast, sinkronisasi tab
  types/               # Kontrak domain
public/
  images/              # Logo pengguna dan aset desain referensi
  fonts/               # Font variabel lokal
tests/                 # Pengujian end-to-end Playwright
```

Data domain dipisahkan dari UI. `storage.ts` adalah batas repository: fungsi baca dan mutasi bisa diganti dengan API nanti tanpa mengubah kontrak komponen. TanStack Query mengelola cache dan mutasi, Zod memvalidasi formulir dan data yang tersimpan.

## Data demo

Semua data menggunakan dummy data dan localStorage dengan key `chatiers:database:v1`. Tidak ada database server, autentikasi, atau pengiriman pesan ke pengguna nyata. Data tiap browser berdiri sendiri. Posting, komentar, interaksi, profil, koneksi, aktivitas, dan pesan tersimpan setelah refresh; perubahan antartab tersinkronisasi melalui storage event. Data rusak atau versi yang tidak dikenali kembali ke seed. Kegagalan penyimpanan ditampilkan ke pengguna.

Hapus key tersebut melalui DevTools untuk mengembalikan demo awal. Nomor HP dan email profil sendiri hanya tampil pada halaman profil sendiri. Detail kontak pengguna dummy lain tetap terdapat pada entitas data.

## SEO

Halaman publik memiliki metadata server, canonical, Open Graph/Twitter cards, HTML berbahasa Indonesia, sitemap, robots, serta JSON-LD Organization/WebSite dan SocialMediaPosting. Feed seed dirender pada server sehingga isi awal bisa dibaca crawler. Halaman profil sendiri, pesan, aktivitas, koleksi, dan posting lokal memakai `noindex`. Posting localStorage tidak bisa dipublikasikan atau diindeks lintas perangkat; untuk itu diperlukan penyimpanan server pada tahap produksi.

## Pengujian browser

```bash
# macOS menggunakan Google Chrome yang terpasang.
npm run build
npm test

# OS lain: instal Chromium Playwright sekali, lalu jalankan tes.
npx playwright install chromium
npm run build
npm test
```

Untuk browser dengan lokasi khusus, gunakan `PLAYWRIGHT_CHROME_PATH`. Tes memeriksa penyimpanan suka/koleksi, posting, komentar, edit profil, ikuti pengguna, pesan, aktivitas, overflow pada ukuran mobile/tablet/desktop, aset gambar, dan SEO endpoints. Screenshot mobile dan desktop tersedia di `test-results/` setelah pengujian.

## Aset

Logo berasal dari `logo.png` yang disediakan pengguna. Foto, maskot, dan preview desain diunduh dari sumber gambar dalam HTML yang menyertai referensi; semua digunakan dari folder lokal tanpa ketergantungan pada host gambar saat aplikasi berjalan. `scripts/prepare-assets.mjs <path-code.html>` menyiapkan ulang aset dan membutuhkan akses internet. Aset yang sudah tersedia cukup untuk menjalankan dan membangun aplikasi tanpa mengulang skrip ini.
