type LegalSection = {
  title: string;
  paragraphs?: string[];
  items?: string[];
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
    <main
      dir="rtl"
      className="min-h-screen bg-[#031225] px-4 py-10 text-white sm:py-14"
    >
      <div className="mx-auto max-w-4xl">
        <header className="rounded-3xl border border-white/10 bg-[#071a31] p-6 shadow-2xl sm:p-8">
          <p className="text-sm font-bold text-[#e8ad45]">
            المملكة للخدمات المنزلية
          </p>

          <h1 className="mt-3 text-3xl font-black sm:text-4xl">
            {title}
          </h1>

          <p className="mt-4 text-sm leading-8 text-white/60 sm:text-base">
            {description}
          </p>

          <p className="mt-4 text-xs text-white/35">
            آخر تحديث: {updatedAt}
          </p>
        </header>

        <div className="mt-6 space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="rounded-3xl border border-white/10 bg-[#071a31] p-6 shadow-xl sm:p-8"
            >
              <h2 className="text-xl font-black text-[#e8ad45]">
                {section.title}
              </h2>

              {section.paragraphs?.map(
                (paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-4 text-sm leading-8 text-white/65"
                  >
                    {paragraph}
                  </p>
                ),
              )}

              {section.items &&
                section.items.length > 0 && (
                  <ul className="mt-4 space-y-3">
                    {section.items.map((item) => (
                      <li
                        key={item}
                        className="relative pr-5 text-sm leading-8 text-white/65"
                      >
                        <span className="absolute right-0 top-3 h-2 w-2 rounded-full bg-[#e8ad45]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}