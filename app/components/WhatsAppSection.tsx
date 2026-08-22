"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppSection() {
  const pathname = usePathname();

  const isHomePage = pathname === "/";
  const isAdminPage = pathname.startsWith("/admin");

  // إخفاء الواتساب بالكامل من لوحة الإدارة
  if (isAdminPage) {
    return null;
  }

  return (
    <section
      dir="rtl"
      className="border-t border-white/10 bg-[#031225] px-4 py-8"
    >
      <div className="mx-auto max-w-6xl">
        <a
          href="https://wa.me/966598863130"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-h-[76px] items-center justify-center gap-4 rounded-3xl border border-[#25D366]/20 bg-[#25D366]/[0.06] px-5 text-center backdrop-blur-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#25D366]/40 hover:bg-[#25D366]/[0.10]"
        >
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#25D366]/10 text-[#25D366] transition duration-300 group-hover:scale-105">
            <svg
              width="25"
              height="25"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20.5 11.1a8.5 8.5 0 0 1-12.7 7.4L4 20l1.5-3.6A8.5 8.5 0 1 1 20.5 11.1Z" />

              <path d="M8.8 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.6.7c.5 1 1.3 1.8 2.3 2.3l.7-.6c.2-.2.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.1.4-1.6.2-1.1-.3-2.3-1-3.3-2s-1.7-2.2-2-3.3c-.2-.5 0-1.2.2-1.7.2-.4.4-.4.7-.4Z" />
            </svg>
          </span>

          <span className="text-right">
            <span className="block text-base font-black text-white">
              {isHomePage
                ? "تواصل معنا عبر واتساب"
                : "احجز الآن"}
            </span>

            <span className="mt-1 block text-sm text-white/50">
              {isHomePage
                ? "تواصل معنا مباشرة عبر واتساب"
                : "احجز موقعك من هنا"}
            </span>
          </span>

          <span className="mr-auto hidden rounded-xl bg-[#25D366]/10 px-4 py-2 text-sm font-black text-[#25D366] sm:block">
            {isHomePage
              ? "واتساب"
              : "احجز الآن"}
          </span>
        </a>
      </div>
    </section>
  );
}