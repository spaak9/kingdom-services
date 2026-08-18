import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppSection from "./components/WhatsAppSection";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://s-baak.com"),

  title: {
    default: "المملكة للخدمات المنزلية",
    template: "%s | المملكة للخدمات المنزلية",
  },

  description:
    "المملكة للخدمات المنزلية لخدمات السباكة والكهرباء والصباغة والتبليط والصيانة المنزلية في مدن المملكة.",

  applicationName: "المملكة للخدمات المنزلية",

  keywords: [
    "المملكة للخدمات المنزلية",
    "خدمات منزلية",
    "سباك",
    "كهربائي",
    "صباغ",
    "مبلط",
    "صيانة منزلية",
  ],

  authors: [
    {
      name: "المملكة للخدمات المنزلية",
    },
  ],

  creator: "المملكة للخدمات المنزلية",
  publisher: "المملكة للخدمات المنزلية",

  alternates: {
    canonical: "/",
  },

  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/icon.png",
  },

  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://s-baak.com",
    siteName: "المملكة للخدمات المنزلية",
    title: "المملكة للخدمات المنزلية",
    description:
      "خدمات السباكة والكهرباء والصباغة والتبليط والصيانة المنزلية في مدن المملكة.",
  },

  twitter: {
    card: "summary",
    title: "المملكة للخدمات المنزلية",
    description:
      "خدمات السباكة والكهرباء والصباغة والتبليط والصيانة المنزلية في مدن المملكة.",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "المملكة للخدمات المنزلية",
  alternateName: ["المملكة", "خدمات المملكة المنزلية"],
  url: "https://s-baak.com/",
};

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#020d1a] px-4 pb-7 pt-10">
      <div className="mx-auto max-w-6xl text-center">
        <h2 className="text-2xl font-black text-[#e8ad45]">
          المملكة
        </h2>

        <p className="mt-1 font-bold">
          للخدمات المنزلية
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-3 text-sm text-white/60">
          <a
            href="/privacy"
            className="transition hover:text-white"
          >
            سياسة الخصوصية
          </a>

          <a
            href="/terms"
            className="transition hover:text-white"
          >
            الشروط والأحكام
          </a>

          <a
            href="/usage-policy"
            className="transition hover:text-white"
          >
            سياسة الاستخدام
          </a>

          <a
            href="/support"
            className="transition hover:text-white"
          >
            الدعم الفني
          </a>
        </div>

        <div className="mt-8 border-t border-white/10 pt-6 text-xs leading-6 text-white/40">
          © 2026 المملكة للخدمات المنزلية. جميع الحقوق محفوظة.
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema).replace(
              /</g,
              "\\u003c",
            ),
          }}
        />

        {children}

        <WhatsAppSection />

        <Footer />
      </body>
    </html>
  );
}