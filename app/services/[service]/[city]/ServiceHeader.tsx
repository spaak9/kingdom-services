"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  cities,
  citySlugs,
  services,
  serviceSlugs,
} from "@/app/lib/service-data";

type SearchResult = {
  citySlug: (typeof citySlugs)[number];
  cityName: string;
  regionName: string;
};

const MENU_ANIMATION_MS = 320;

export default function ServiceHeader() {
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [openRegion, setOpenRegion] = useState<string | null>(null);
  const [openCity, setOpenCity] = useState<string | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const closeTimerRef = useRef<number | null>(null);

  const regions = useMemo(() => {
    const grouped = new Map<
      string,
      Array<{
        slug: (typeof citySlugs)[number];
        name: string;
      }>
    >();

    citySlugs.forEach((citySlug) => {
      const city = cities[citySlug];
      const current = grouped.get(city.region) ?? [];

      current.push({
        slug: city.slug,
        name: city.name,
      });

      grouped.set(city.region, current);
    });

    return Array.from(grouped.entries()).map(([name, regionCities]) => ({
      name,
      cities: regionCities,
    }));
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuMounted ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuMounted]);

  useEffect(() => {
    if (!searchOpen) return;

    const timer = window.setTimeout(() => {
      searchInputRef.current?.focus();
    }, 120);

    return () => window.clearTimeout(timer);
  }, [searchOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current !== null) {
        window.clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const normalizedSearch = normalizeArabic(searchQuery);

  const citySearchResults: SearchResult[] = normalizedSearch
    ? citySlugs
        .map((citySlug) => ({
          citySlug,
          cityName: cities[citySlug].name,
          regionName: cities[citySlug].region,
        }))
        .filter((city) =>
          normalizeArabic(city.cityName).startsWith(normalizedSearch),
        )
    : [];

  const openMenu = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setSearchOpen(false);
    setMenuMounted(true);

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        setMenuVisible(true);
      });
    });
  };

  const closeMenu = () => {
    setMenuVisible(false);

    closeTimerRef.current = window.setTimeout(() => {
      setMenuMounted(false);
      setOpenRegion(null);
      setOpenCity(null);
      closeTimerRef.current = null;
    }, MENU_ANIMATION_MS);
  };

  const toggleRegion = (regionName: string) => {
    setOpenRegion((current) =>
      current === regionName ? null : regionName,
    );
    setOpenCity(null);
  };

  const toggleCity = (cityName: string) => {
    setOpenCity((current) => (current === cityName ? null : cityName));
  };

  const openCityFromSearch = (result: SearchResult) => {
    setOpenRegion(result.regionName);
    setOpenCity(result.cityName);
    setSearchOpen(false);
    setSearchQuery("");
    openMenu();

    window.setTimeout(() => {
      document
        .getElementById(`service-menu-city-${result.citySlug}`)
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 460);
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
              onClick={openMenu}
              aria-label="فتح القائمة"
              className="flex h-11 w-11 items-center justify-center rounded-xl text-[#e8ad45] transition hover:bg-white/5 active:scale-95"
            >
              <MenuIcon />
            </button>

            <Link href="/" className="text-right leading-none">
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
            </Link>
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
              : "max-h-0 border-t-transparent opacity-0"
          }`}
        >
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
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
                    {citySearchResults.map((result) => (
                      <button
                        key={result.citySlug}
                        type="button"
                        onClick={() => openCityFromSearch(result)}
                        className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-[#071a31] px-4 py-3 text-right transition hover:border-[#e8ad45]/60 hover:bg-[#0a2341] active:scale-[0.99]"
                      >
                        <span>
                          <span className="block text-sm font-black text-white">
                            {result.cityName}
                          </span>
                          <span className="mt-1 block text-xs text-white/45">
                            {result.regionName}
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

      {menuMounted && (
        <>
          <button
            type="button"
            aria-label="إغلاق القائمة"
            onClick={closeMenu}
            className={`fixed inset-0 z-[60] bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${
              menuVisible ? "opacity-100" : "opacity-0"
            }`}
          />

          <aside
            dir="rtl"
            className={`fixed right-0 top-0 z-[70] h-full w-[88%] max-w-[380px] overflow-y-auto border-l border-white/10 bg-[#06182e] shadow-2xl transition-transform duration-300 ease-out ${
              menuVisible ? "translate-x-0" : "translate-x-full"
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
              <Link
                href="/"
                onClick={closeMenu}
                className="flex min-h-14 items-center rounded-2xl border border-[#e8ad45] bg-[#e8ad45] px-5 text-sm font-black text-[#031225] shadow-[0_12px_30px_rgba(232,173,69,0.2)] transition active:scale-[0.98]"
              >
                الرئيسية
              </Link>

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
                                id={`service-menu-city-${city.slug}`}
                                key={city.slug}
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
                                      {serviceSlugs.map((serviceSlug) => {
                                        const service = services[serviceSlug];

                                        return (
                                          <Link
                                            key={service.slug}
                                            href={`/services/${service.slug}/${city.slug}`}
                                            onClick={closeMenu}
                                            className="flex min-h-11 items-center justify-center rounded-xl border border-white/10 bg-[#081d37] px-2 text-center text-xs font-black text-white transition hover:border-[#e8ad45]/70 hover:bg-[#e8ad45] hover:text-[#031225] active:scale-[0.98]"
                                          >
                                            {service.pluralName}
                                          </Link>
                                        );
                                      })}
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
      )}
    </>
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
      aria-hidden="true"
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
      aria-hidden="true"
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
      aria-hidden="true"
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
      aria-hidden="true"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}