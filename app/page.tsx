"use client";

// NEW ONE-FILE BUILD — Header + Menu + Home Page
import { useEffect, useRef, useState } from "react";
import { cities, citySlugs } from "@/app/lib/service-data";

type ServiceId = "plumbing" | "electricity" | "painting" | "ceramic";

type Service = {
  id: ServiceId;
  title: string;
  description: string;
  icon: React.ReactNode;
};

type Region = {
  name: string;
  cities: {
    name: string;
    slug: string;
  }[];
};

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  delay?: number;
};

// ضع رقم الواتساب هنا بدون + أو مسافات
const WHATSAPP_NUMBER = "9665XXXXXXXX";

const services: Service[] = [
  {
    id: "plumbing",
    title: "سباك",
    description: "صيانة التسريبات والتمديدات والأدوات الصحية.",
    icon: <FaucetIcon />,
  },
  {
    id: "electricity",
    title: "كهربائي",
    description: "أعمال كهربائية منزلية وصيانة وتركيبات آمنة.",
    icon: <BoltIcon />,
  },
  {
    id: "painting",
    title: "صباغ",
    description: "أعمال صباغة داخلية وخارجية وتشطيبات منزلية.",
    icon: <PaintIcon />,
  },
  {
    id: "ceramic",
    title: "مبلط",
    description: "تركيب البلاط والبورسلان وأعمال الترميم.",
    icon: <TilesIcon />,
  },
];

const regionOrder = [
  "المنطقة الوسطى",
  "المنطقة الشرقية",
  "المنطقة الغربية",
  "المنطقة الشمالية",
  "المنطقة الجنوبية",
] as const;

const regions: Region[] = regionOrder.map((regionName) => ({
  name: regionName,
  cities: citySlugs
    .map((citySlug) => cities[citySlug])
    .filter((city) => city.region === regionName)
    .map((city) => ({
      name: city.name,
      slug: city.slug,
    })),
}));

const features = [
  {
    title: "عمالة متخصصة",
    description: "فنيون ذوو خبرة في أعمال الصيانة والخدمات المنزلية.",
  },
  {
    title: "مدن متعددة",
    description: "خدمات متوفرة في مدن ومحافظات المملكة.",
  },
  {
    title: "وصول سريع",
    description: "بيانات التواصل والموقع في صفحة واحدة.",
  },
  {
    title: "خدمة موثوقة",
    description: "معلومات مرتبة وواضحة لكل خدمة.",
  },
];

export default function HomePage() {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  return (
    <div
      dir="rtl"
      className="min-h-screen overflow-x-hidden bg-[#031225] text-white"
    >
      <Header />

      <main>
        <section className="relative isolate overflow-hidden">
          <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,#173b62_0%,#07182c_45%,#020b16_100%)]" />
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(3,18,37,0.03),#031225)]" />
          <div className="absolute -right-24 top-16 -z-10 h-72 w-72 rounded-full bg-[#e8ad45]/5 blur-3xl" />
          <div className="absolute -left-24 bottom-10 -z-10 h-80 w-80 rounded-full bg-[#1b5b93]/15 blur-3xl" />

          <div className="mx-auto max-w-6xl px-4 pb-12 pt-10 text-center sm:pb-16 sm:pt-14 md:pb-20 md:pt-20">
            <Reveal>
              <div className="mx-auto mb-5 h-1 w-16 rounded-full bg-[#e8ad45]" />

              <h1 className="mx-auto max-w-4xl text-[30px] font-black leading-[1.35] sm:text-[38px] md:text-5xl lg:text-6xl">
                خدمات منزلية موثوقة في مدن المملكة
              </h1>

              <p className="mx-auto mt-5 max-w-3xl text-[15px] leading-8 text-white/70 sm:mt-6 sm:text-[17px] sm:leading-9 md:text-lg">
                المملكة للخدمات المنزلية موقع متخصص في خدمات السباكة والكهرباء
                والصباغة والتبليط وأعمال الصيانة المنزلية، ويجمع مقدمي الخدمات
                في مدن ومحافظات المملكة داخل منصة واحدة واضحة واحترافية.
              </p>
            </Reveal>

            <div className="mt-9 grid grid-cols-2 gap-3 sm:mt-10 sm:grid-cols-4 sm:gap-3 md:mt-11 md:gap-4">
              {services.map((service, index) => (
                <Reveal key={service.id} delay={index * 100}>
                  <article className="group flex h-full min-h-[190px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#071a31]/95 px-3 py-4 text-center shadow-[0_18px_50px_rgba(0,0,0,0.18)] transition duration-300 hover:-translate-y-1 hover:border-[#e8ad45]/45 sm:min-h-[185px] sm:px-3 sm:py-4 md:min-h-[225px] md:px-6 md:py-6">
                    <span className="flex h-14 w-14 scale-90 items-center justify-center text-[#e8ad45] transition duration-300 group-hover:scale-100 sm:h-13 sm:w-13 sm:scale-90 md:h-16 md:w-16 md:scale-100 md:group-hover:scale-110">
                      {service.icon}
                    </span>

                    <h2 className="mt-3 text-[18px] font-black leading-6 sm:text-[16px] md:mt-4 md:text-[23px]">
                      {service.title}
                    </h2>

                    <p className="mt-2 text-[12px] leading-6 text-white/58 sm:text-[11px] sm:leading-5 md:mt-3 md:text-[15px] md:leading-7">
                      {service.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="about"
          className="relative scroll-mt-24 overflow-hidden bg-[#06182e] px-4 py-12 sm:py-16 md:py-20"
        >
          <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-[#e8ad45]/5 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-[#17416f]/20 blur-3xl" />

          <div className="relative mx-auto max-w-5xl">
            <Reveal>
              <div className="rounded-[28px] border border-white/10 bg-[#081d37]/95 p-5 text-center shadow-2xl backdrop-blur-sm sm:p-7 md:rounded-[32px] md:p-12">
                <span className="text-base font-bold text-[#e8ad45]">
                  عن الموقع
                </span>

                <h2 className="mt-3 text-[28px] font-black leading-[1.4] sm:text-3xl md:text-4xl">
                  المملكة للخدمات المنزلية
                </h2>

                <div className="mx-auto mt-6 max-w-4xl space-y-5 text-[15px] leading-8 text-white/70 sm:mt-7 sm:text-[17px] sm:leading-9 md:text-lg">
                  <p>
                    المملكة للخدمات المنزلية منصة متخصصة في جمع وعرض خدمات
                    الصيانة المنزلية بمختلف أنواعها داخل مدن المملكة، وتشمل
                    خدمات السباكة والكهرباء والصباغة والتبليط وأعمال الترميم
                    والتشطيبات والصيانة العامة. جاءت فكرة الموقع لتوفير مساحة
                    واحدة مرتبة تجمع الخدمات المنزلية المهمة وتعرضها بصورة
                    واضحة واحترافية تساعد الزائر على التعرف على طبيعة كل خدمة
                    والمعلومات المرتبطة بها.
                  </p>

                  <p>
                    نهتم بأن تكون صفحات الخدمات غنية بالمعلومات المفيدة، مثل
                    وصف الأعمال المتوفرة وبيانات التواصل والموقع والصور
                    والتفاصيل الخاصة بكل مدينة وقسم. كما نحرص على تنظيم المحتوى
                    بطريقة تمنح الزائر صورة أوضح عن الخدمة، وتساعده على الوصول
                    إلى الخيار المناسب دون تشتيت أو بحث طويل بين مصادر متعددة.
                  </p>

                  <p>
                    هدفنا أن تكون المملكة للخدمات المنزلية وجهة موثوقة تجمع
                    الخدمات الأساسية التي يحتاجها المنزل، وتمنح مقدمي الخدمات
                    مساحة احترافية لعرض أعمالهم وخبراتهم، مع المحافظة على هوية
                    واضحة ومظهر يليق باسم المملكة، ومحتوى منظم يركز على الجودة
                    والوضوح وسهولة الوصول إلى المعلومات.
                  </p>
                </div>

                <div className="mt-9 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <AboutBadge title="خدمات منزلية متنوعة" />
                  <AboutBadge title="تغطية عدد من المدن" />
                  <AboutBadge title="معلومات واضحة ومرتبة" />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        <section className="px-4 py-12 sm:py-16 md:py-20">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="mx-auto max-w-xl text-center text-[27px] font-black leading-[1.45] sm:text-3xl md:text-4xl">
                لماذا المملكة للخدمات المنزلية؟
              </h2>
            </Reveal>

            <div className="mt-8 grid grid-cols-2 gap-3 sm:mt-9 sm:grid-cols-4 sm:gap-3 md:gap-4">
              {features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 100}>
                  <article className="group flex h-full min-h-[180px] flex-col items-center justify-center rounded-3xl border border-white/10 bg-[#071a31] p-4 text-center transition duration-300 hover:-translate-y-1 hover:border-[#e8ad45]/45 sm:min-h-[175px] sm:p-3 md:min-h-[225px] md:p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e8ad45]/10 text-xl text-[#e8ad45] transition duration-300 group-hover:rotate-6 group-hover:scale-110 sm:h-11 sm:w-11 sm:text-lg md:h-14 md:w-14 md:text-2xl">
                      ✓
                    </span>

                    <h3 className="mt-3 text-[17px] font-black leading-6 sm:text-[15px] md:mt-4 md:text-[22px]">
                      {feature.title}
                    </h3>

                    <p className="mt-2 text-[12px] leading-6 text-white/58 sm:text-[11px] sm:leading-5 md:mt-3 md:text-[15px] md:leading-7">
                      {feature.description}
                    </p>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [openCity, setOpenCity] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 180);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    setOpenRegion(null);
    setOpenCity(null);
  };

  const toggleRegion = (regionName: string) => {
    setOpenRegion((current) =>
      current === regionName ? null : regionName,
    );

    setOpenCity(null);
  };

  const toggleCity = (cityName: string) => {
    setOpenCity((current) =>
      current === cityName ? null : cityName,
    );
  };

  const normalizedSearch = normalizeArabic(searchQuery);

  const citySearchResults = normalizedSearch
    ? regions
        .flatMap((region) =>
          region.cities.map((city) => ({
            ...city,
            regionName: region.name,
          })),
        )
        .filter((city) =>
          normalizeArabic(city.name).startsWith(normalizedSearch),
        )
    : [];

  const openCityFromSearch = (
    regionName: string,
    cityName: string,
    citySlug: string,
  ) => {
    setOpenRegion(regionName);
    setOpenCity(cityName);
    setMenuOpen(true);
    setSearchOpen(false);
    setSearchQuery("");

    window.setTimeout(() => {
      document
        .getElementById(`menu-city-${citySlug}`)
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 380);
  };

  return (
    <>
      <header
        dir="rtl"
        className={`fixed inset-x-0 top-0 z-50 border-b border-white/10 transition-all duration-300 ${
          scrolled
            ? "bg-[#031225]/90 shadow-[0_12px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl"
            : "bg-[#031225]"
        }`}
      >
        <div
          className={`mx-auto flex max-w-6xl items-center justify-between px-4 transition-all duration-300 ${
            scrolled ? "h-16" : "h-[78px]"
          }`}
        >
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="فتح القائمة"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#e8ad45] transition hover:bg-white/5 active:scale-95"
            >
              <MenuIcon />
            </button>

            <a href="/" className="text-right leading-none">
              <span
                className={`block font-black tracking-[-0.04em] text-[#e8ad45] transition-all duration-300 ${
                  scrolled ? "text-[24px]" : "text-[31px]"
                }`}
              >
                المملكة
              </span>

              <span className="mt-1 block text-xs font-extrabold text-white">
                للخدمات المنزلية
              </span>
            </a>
          </div>

          <button
            type="button"
            onClick={() => setSearchOpen((value) => !value)}
            aria-label="فتح البحث"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-[#e8ad45] transition hover:bg-white/5 active:scale-95"
          >
            <SearchIcon />
          </button>
        </div>

        <div
          className={`overflow-hidden border-t border-white/10 bg-[#061a33] transition-all duration-300 ${
            searchOpen
              ? "max-h-[430px] opacity-100"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) =>
                  setSearchQuery(event.target.value)
                }
                aria-label="البحث عن مدينة"
                placeholder="اكتب اسم المدينة..."
                autoComplete="off"
                className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 pl-12 text-right text-sm text-white outline-none transition placeholder:text-white/35 focus:border-[#e8ad45]"
              />

              <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#e8ad45]">
                <SearchIcon size={20} />
              </span>
            </div>

            {normalizedSearch && (
              <div className="mt-3 max-h-[300px] overflow-y-auto rounded-2xl border border-white/10 bg-[#031225] p-2 shadow-2xl">
                {citySearchResults.length > 0 ? (
                  <div className="space-y-2">
                    {citySearchResults.map((city) => (
                      <button
                        key={`${city.regionName}-${city.slug}`}
                        type="button"
                        onClick={() =>
                          openCityFromSearch(
                            city.regionName,
                            city.name,
                            city.slug,
                          )
                        }
                        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#071a31] px-4 py-3 text-right transition hover:border-[#e8ad45]/60 hover:bg-[#0a2341] active:scale-[0.99]"
                      >
                        <span>
                          <span className="block text-sm font-black text-white">
                            {city.name}
                          </span>

                          <span className="mt-1 block text-xs text-white/45">
                            {city.regionName}
                          </span>
                        </span>

                        <span className="text-xs font-black text-[#e8ad45]">
                          فتح المدينة
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="px-3 py-5 text-center text-sm text-white/50">
                    لا توجد مدينة تبدأ بهذه الأحرف
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <div className={scrolled ? "h-16" : "h-[78px]"} />

      <button
        type="button"
        aria-label="إغلاق القائمة"
        onClick={closeMenu}
        className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
          menuOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        dir="rtl"
        className={`fixed right-0 top-0 z-[70] h-full w-[88%] max-w-[380px] overflow-y-auto border-l border-white/10 bg-[#06182e] shadow-2xl transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="sticky top-0 z-10 border-b border-white/10 bg-[#06182e]/95 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-black tracking-[-0.04em] text-[#e8ad45]">
                المملكة
              </p>

              <p className="mt-1 text-sm font-extrabold text-white">
                للخدمات المنزلية
              </p>
            </div>

            <button
              type="button"
              onClick={closeMenu}
              aria-label="إغلاق القائمة"
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/5 text-white transition hover:bg-white/10 active:scale-95"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <nav className="space-y-3 p-5">
          <a
            href="/"
            onClick={closeMenu}
            className="flex min-h-14 items-center rounded-2xl border border-[#e8ad45] bg-[#e8ad45] px-5 text-sm font-black text-[#031225] shadow-[0_12px_30px_rgba(232,173,69,0.2)] transition active:scale-[0.98]"
          >
            الرئيسية
          </a>

          {regions.map((region) => {
            const regionOpen = openRegion === region.name;

            return (
              <div
                key={region.name}
                className={`overflow-hidden rounded-2xl border transition duration-300 ${
                  regionOpen
                    ? "border-[#e8ad45]/55 bg-[#081d37]"
                    : "border-white/10 bg-white/[0.025]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleRegion(region.name)}
                  className="flex min-h-14 w-full items-center justify-between px-5 text-right text-sm font-black transition hover:bg-white/[0.04] active:bg-white/[0.07]"
                >
                  <span>{region.name}</span>

                  <span
                    className={`text-[#e8ad45] transition-transform duration-300 ${
                      regionOpen ? "rotate-180" : ""
                    }`}
                  >
                    <ChevronIcon />
                  </span>
                </button>

                <div
                  className={`grid transition-all duration-300 ease-out ${
                    regionOpen
                      ? "grid-rows-[1fr] border-t border-white/10 opacity-100"
                      : "grid-rows-[0fr] opacity-0"
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="space-y-2 p-3">
                      {region.cities.map((city) => {
                        const cityOpen = openCity === city.name;

                        return (
                          <div
                            id={`menu-city-${city.slug}`}
                            key={city.name}
                            className={`scroll-mt-24 overflow-hidden rounded-xl border transition ${
                              cityOpen
                                ? "border-[#e8ad45]/40 bg-[#031225]"
                                : "border-white/10 bg-[#031225]/70"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleCity(city.name)}
                              className="flex min-h-12 w-full items-center justify-between px-4 text-right text-sm font-bold transition hover:bg-white/[0.04]"
                            >
                              <span>{city.name}</span>

                              <span
                                className={`text-[#e8ad45] transition-transform duration-300 ${
                                  cityOpen ? "rotate-180" : ""
                                }`}
                              >
                                <ChevronIcon size={19} />
                              </span>
                            </button>

                            <div
                              className={`grid transition-all duration-300 ${
                                cityOpen
                                  ? "grid-rows-[1fr] border-t border-white/10 opacity-100"
                                  : "grid-rows-[0fr] opacity-0"
                              }`}
                            >
                              <div className="overflow-hidden">
                                <div className="grid grid-cols-2 gap-2 p-3">
                                  {services.map((service) => (
                                    <a
                                      key={service.id}
                                      href={`/services/${service.id}/${city.slug}`}
                                      onClick={closeMenu}
                                      className="flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-[#081d37] px-2 text-center text-xs font-black text-white transition hover:border-[#e8ad45]/70 hover:bg-[#e8ad45] hover:text-[#031225] active:scale-[0.98]"
                                    >
                                      {service.title}
                                    </a>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

function Reveal({
  children,
  className = "",
  delay = 0,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(node);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`${className} transition-all duration-700 ease-out ${
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-8 opacity-0"
      }`}
    >
      {children}
    </div>
  );
}

function AboutBadge({ title }: { title: string }) {
  return (
    <div className="rounded-2xl border border-[#e8ad45]/20 bg-[#e8ad45]/5 px-4 py-4 text-sm font-black text-[#f3c36f] transition duration-300 hover:-translate-y-1 hover:border-[#e8ad45]/45 hover:bg-[#e8ad45]/10">
      {title}
    </div>
  );
}

function normalizeArabic(value: string) {
  return value
    .trim()
    .replace(/[\u064B-\u065F\u0670]/g, "")
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ؤ/g, "و")
    .replace(/ئ/g, "ي");
}

function WhatsAppIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="shrink-0"
      aria-hidden="true"
    >
      <path d="M20.5 11.1a8.5 8.5 0 0 1-12.7 7.4L4 20l1.5-3.6A8.5 8.5 0 1 1 20.5 11.1Z" />
      <path d="M8.8 8.3c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.7c.1.2.1.4-.1.6l-.6.7c.5 1 1.3 1.8 2.3 2.3l.7-.6c.2-.2.4-.2.6-.1l1.7.7c.3.1.4.3.4.5v.5c0 .3 0 .5-.4.7-.4.2-1.1.4-1.6.2-1.1-.3-2.3-1-3.3-2s-1.7-2.2-2-3.3c-.2-.5 0-1.2.2-1.7Z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SearchIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="25"
      height="25"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function ChevronIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function FaucetIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 29h34c7 0 10 5 10 11v4H45v-3c0-2-1-3-4-3H12Z" />
      <path d="M25 29V18h15v11M20 18h25M32 11v7" />
      <path d="M55 49c0 4-3 7-7 7s-7-3-7-7c0-3 7-11 7-11s7 8 7 11Z" />
    </svg>
  );
}

function BoltIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M36 5 15 36h15l-3 23 22-33H34Z" />
    </svg>
  );
}

function PaintIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="10" y="11" width="39" height="15" rx="4" />
      <path d="M49 18h7v14H33v9" />
      <rect x="28" y="40" width="10" height="19" rx="3" />
      <path d="M14 32c0 4-3 7-7 7 4 0 7 3 7 7 0-4 3-7 7-7-4 0-7-3-7-7Z" />
    </svg>
  );
}

function TilesIcon() {
  return (
    <svg
      width="56"
      height="56"
      viewBox="0 0 64 64"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="7" y="7" width="22" height="22" rx="2" />
      <rect x="35" y="7" width="22" height="22" rx="2" />
      <rect x="7" y="35" width="22" height="22" rx="2" />
      <rect x="35" y="35" width="22" height="22" rx="2" />
    </svg>
  );
}