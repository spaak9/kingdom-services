import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import WhatsAppFloat from "./components/WhatsAppFloat";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.s-baak.com"),

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

  openGraph: {
    type: "website",
    locale: "ar_SA",
    url: "https://www.s-baak.com",
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
  url: "https://www.s-baak.com/",
};

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
            __html: JSON.stringify(websiteSchema).replace(/</g, "\\u003c"),
          }}
        />

        {children}

        <WhatsAppFloat />
      </body>
    </html>
  );
}