import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { AppProvider } from "@/providers/app-provider";
import { AppShell } from "@/components/layout/app-shell";
import { description, siteUrl } from "@/lib/seo";
import "./globals.css";
const jakarta = localFont({
  src: "../../public/fonts/plus-jakarta-sans.woff2",
  variable: "--font-jakarta",
  display: "swap",
  weight: "400 800",
});
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Chatiers — Tempat Ide Bertemu Peluang",
    template: "%s | Chatiers",
  },
  description,
  applicationName: "Chatiers",
  category: "business",
  keywords: [
    "komunitas bisnis",
    "ide bisnis",
    "peluang usaha",
    "produk UMKM",
    "networking profesional",
    "kolaborasi bisnis",
    "Chatiers",
  ],
  authors: [{ name: "Chatiers" }],
  creator: "Chatiers",
  publisher: "Chatiers",
  alternates: { canonical: "/", languages: { "id-ID": "/" } },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Chatiers",
    title: "Chatiers — Tempat Ide Bertemu Peluang",
    description,
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Chatiers — Berbagi ide, membangun peluang",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Chatiers — Tempat Ide Bertemu Peluang",
    description,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: { capable: true, title: "Chatiers", statusBarStyle: "default" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#faf8ff",
  colorScheme: "light",
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Chatiers",
        url: siteUrl,
        logo: `${siteUrl}/images/logo.webp`,
        description,
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        name: "Chatiers",
        url: siteUrl,
        description,
        inLanguage: "id-ID",
        publisher: { "@id": `${siteUrl}/#organization` },
      },
    ],
  };
  return (
    <html lang="id" className={jakarta.variable}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
          }}
        />
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
