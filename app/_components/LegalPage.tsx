import Link from "next/link";
import type { ReactNode } from "react";

type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
  content?: ReactNode;
};

type LegalPageProps = {
  title: string;
  description: string;
  updatedAt: string;
  sections: LegalSection[];
};

export default function LegalPage({
  title,
  description,
  updatedAt,
  sections,
}: LegalPageProps) {
  return (
    <main dir="rtl" className="min-h-screen bg-[#031225] text-white">
      <header className="border-b border-white/10 bg-[#04162b] px-4 py-5">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
          <Link href="/" className="group">
            <span className="block text-xl font-black text-[#e8ad45] transition group-hover:text-[#f3c36c]">
              المملكة
            </span>
            <span className="block text-xs font-bold text-white/70">
              للخدمات المنزلية
            </span>
          </Link>

          <Link
            href="/"
            className="rounded-xl border border-white/10 px-4 py-2 text-sm font-bold text-white/70 transition hover:border-[#e8ad45]/50 hover:text-white"
          >
            الرجوع للرئيسية
          </Link>
        </div>
      </header>

      <section className="px-4 py-10 sm:py-14">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-[28px] border border-[#e8ad45]/20 bg-[#071a31] p-6 shadow-2xl sm:p-9">
            <div className="h-1 w-16 rounded-full bg-[#e8ad45]" />

            <h1 className="mt-5 text-3xl font-black leading-tight sm:text-4xl">
              {title}
            </h1>

            <p className="mt-4 max-w-3xl text-sm leading-8 text-white/65 sm:text-base">
              {description}
            </p>

            <p className="mt-4 text-xs font-bold text-[#e8ad45]/80">
              آخر تحديث: {updatedAt}
            </p>
          </div>

          <div className="mt-6 space-y-4">
            {sections.map((section, index) => (
              <article
                key={section.title}
                className="rounded-3xl border border-white/10 bg-[#071a31] p-6 sm:p-8"
              >
                <h2 className="flex items-start gap-3 text-xl font-black text-[#e8ad45]">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e8ad45]/10 text-sm">
                    {index + 1}
                  </span>
                  <span className="pt-1">{section.title}</span>
                </h2>

                {section.paragraphs?.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-sm leading-8 text-white/65 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}

                {section.items && (
                  <ul className="mt-4 space-y-3 text-sm leading-8 text-white/65 sm:text-base">
                    {section.items.map((item) => (
                      <li key={item} className="flex items-start gap-3">
                        <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-[#e8ad45]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {section.content && <div className="mt-4">{section.content}</div>}
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-3xl border border-[#25D366]/20 bg-[#25D366]/10 p-6 text-center">
            <h2 className="text-lg font-black">لديك استفسار؟</h2>
            <p className="mt-2 text-sm leading-7 text-white/60">
              تواصل مع الدعم الفني عبر واتساب وسنساعدك قدر الإمكان.
            </p>
            <a
              href="https://wa.me/966598863130?text=%D8%A7%D9%84%D8%B3%D9%84%D8%A7%D9%85%20%D8%B9%D9%84%D9%8A%D9%83%D9%85%D8%8C%20%D8%A3%D8%AD%D8%AA%D8%A7%D8%AC%20%D8%A7%D9%84%D8%AF%D8%B9%D9%85%20%D8%A7%D9%84%D9%81%D9%86%D9%8A%20%D9%85%D9%86%20%D9%85%D9%88%D9%82%D8%B9%20%D8%A7%D9%84%D9%85%D9%85%D9%84%D9%83%D8%A9%20%D9%84%D9%84%D8%AE%D8%AF%D9%85%D8%A7%D8%AA%20%D8%A7%D9%84%D9%85%D9%86%D8%B2%D9%84%D9%8A%D8%A9."
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex min-h-12 items-center justify-center rounded-2xl bg-[#25D366] px-6 font-black text-[#031225] transition hover:-translate-y-0.5"
            >
              فتح واتساب
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-[#020d1a] px-4 py-7 text-center text-xs leading-6 text-white/40">
        © 2026 المملكة للخدمات المنزلية. جميع الحقوق محفوظة.
      </footer>
    </main>
  );
}