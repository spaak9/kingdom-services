import type { Metadata } from "next";
import Link from "next/link";
import ServiceHeader from "./ServiceHeader";
import { notFound } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import {
  SITE_URL,
  WHATSAPP_NUMBER,
  cities,
  citySlugs,
  getSeoTitle,
  getServiceCityUrl,
  isCitySlug,
  isServiceSlug,
  services,
  serviceSlugs,
} from "@/app/lib/service-data";

type PageProps = { params: Promise<{ service: string; city: string }> };

type ServiceContact = {
  phone_number: string | null;
  whatsapp_number: string | null;
  google_maps_url: string | null;
  is_active: boolean | null;
};

function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}

function convertArabicNumbers(value: string) {
  const arabic = "٠١٢٣٤٥٦٧٨٩";
  const persian = "۰۱۲۳۴۵۶۷۸۹";
  return value
    .replace(/[٠-٩]/g, n => String(arabic.indexOf(n)))
    .replace(/[۰-۹]/g, n => String(persian.indexOf(n)));
}
function getDigits(value: string) { return convertArabicNumbers(value).replace(/\D/g, ""); }
function isPhoneValue(value: string) {
  const normalized = convertArabicNumbers(value).trim();
  if (!normalized || !/^[+()\-\s\d]+$/.test(normalized)) return false;
  const digits = normalized.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}
function toWhatsAppNumber(value: string) {
  let digits = getDigits(value);
  if (!digits) return "";
  if (digits.startsWith("00966")) digits = digits.slice(2);
  else if (digits.startsWith("05")) digits = `966${digits.slice(1)}`;
  else if (digits.startsWith("5") && digits.length === 9) digits = `966${digits}`;
  else if (digits.startsWith("00")) digits = digits.slice(2);
  return digits;
}
function toInternationalPhone(value: string) {
  const digits = getDigits(value);
  if (!digits) return "";
  if (digits.startsWith("00966")) return `+${digits.slice(2)}`;
  if (digits.startsWith("966")) return `+${digits}`;
  if (digits.startsWith("05")) return `+966${digits.slice(1)}`;
  if (digits.startsWith("5") && digits.length === 9) return `+966${digits}`;
  return digits.startsWith("00") ? `+${digits.slice(2)}` : `+${digits}`;
}
function isGoogleMapsHost(hostname: string) {
  const value = hostname.toLowerCase();
  return value === "google.com" || value.endsWith(".google.com") || value === "maps.app.goo.gl" || value === "goo.gl";
}
function extractCoordinates(value: string) {
  const decoded = decodeURIComponent(value);
  const matches = [
    decoded.match(/@(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/),
    decoded.match(/!3d(-?\d+(?:\.\d+)?)!4d(-?\d+(?:\.\d+)?)/),
    decoded.match(/[?&](?:q|query|destination)=(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/),
  ];
  for (const match of matches) if (match) return { latitude: match[1], longitude: match[2] };
  return null;
}
async function getGoogleMapsEmbedUrl(value: string) {
  const originalUrl = value.trim();
  if (!originalUrl) return "";
  try {
    const original = new URL(originalUrl);
    if (!isGoogleMapsHost(original.hostname)) return "";
    if (original.hostname.endsWith("google.com") && original.pathname.includes("/maps/embed")) return originalUrl;
    let resolvedUrl = originalUrl;
    if (original.hostname === "maps.app.goo.gl" || original.hostname === "goo.gl") {
      try {
        const response = await fetch(originalUrl, {
          method: "GET", redirect: "follow", cache: "no-store",
          headers: { "User-Agent": "Mozilla/5.0 (compatible; KingdomServices/1.0)" },
        });
        if (response.url) resolvedUrl = response.url;
      } catch (error) { console.error("Failed to resolve Google Maps URL:", error); }
    }
    const coordinates = extractCoordinates(resolvedUrl);
    if (coordinates) return `https://www.google.com/maps?q=${encodeURIComponent(`${coordinates.latitude},${coordinates.longitude}`)}&z=17&output=embed`;
    const resolved = new URL(resolvedUrl);
    if (!isGoogleMapsHost(resolved.hostname)) return "";
    const query = resolved.searchParams.get("query") || resolved.searchParams.get("q");
    if (query) return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=17&output=embed`;
    const placeMatch = decodeURIComponent(resolved.pathname).match(/\/maps\/place\/([^/@]+)/);
    if (placeMatch?.[1]) return `https://www.google.com/maps?q=${encodeURIComponent(placeMatch[1].replace(/\+/g, " "))}&z=17&output=embed`;
  } catch (error) { console.error("Invalid Google Maps URL:", error); }
  return "";
}

export const dynamic = "force-dynamic";
export const dynamicParams = false;

export function generateStaticParams() {
  return serviceSlugs.flatMap(service => citySlugs.map(city => ({ service, city })));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { service: serviceParam, city: cityParam } = await params;
  if (!isServiceSlug(serviceParam) || !isCitySlug(cityParam)) return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };
  const service = services[serviceParam];
  const city = cities[cityParam];
  const seoTitle = getSeoTitle(service, city);
  const canonical = getServiceCityUrl(service.slug, city.slug);
  const description = `${seoTitle} وخدمات ${service.name} المنزلية في ${city.name}. معلومات واضحة عن الخدمة ووسيلة تواصل مباشرة عبر المملكة للخدمات المنزلية.`;
  return {
    title: `${seoTitle} | المملكة للخدمات المنزلية`, description,
    keywords: [seoTitle, `${service.searchName} في ${city.name}`, `${service.pluralName} ${city.name}`, `${service.name} ${city.name}`, "المملكة للخدمات المنزلية"],
    alternates: { canonical },
    openGraph: { type: "website", locale: "ar_SA", url: canonical, siteName: "المملكة للخدمات المنزلية", title: `${seoTitle} | المملكة للخدمات المنزلية`, description },
    twitter: { card: "summary", title: `${seoTitle} | المملكة للخدمات المنزلية`, description },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
  };
}

export default async function ServiceCityPage({ params }: PageProps) {
  const { service: serviceParam, city: cityParam } = await params;
  if (!isServiceSlug(serviceParam) || !isCitySlug(cityParam)) notFound();
  const service = services[serviceParam];
  const city = cities[cityParam];
  const seoTitle = getSeoTitle(service, city);
  const canonical = getServiceCityUrl(service.slug, city.slug);

  let savedContact: ServiceContact | null = null;
  const supabaseAdmin = getSupabaseAdmin();
  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.from("service_contacts").select(`phone_number, whatsapp_number, google_maps_url, is_active`).eq("service_slug", service.slug).eq("city_slug", city.slug).maybeSingle();
    if (error) console.error("Failed to load service contact:", error);
    savedContact = data as ServiceContact | null;
  }

  const contactIsActive = savedContact?.is_active ?? true;
  const hasSavedContact = Boolean(savedContact);
  const boxOneValue = hasSavedContact ? savedContact?.whatsapp_number?.trim() || "" : WHATSAPP_NUMBER;
  const boxTwoValue = hasSavedContact ? savedContact?.phone_number?.trim() || "" : "0598863130";
  const boxOneIsPhone = isPhoneValue(boxOneValue);
  const boxTwoIsPhone = isPhoneValue(boxTwoValue);
  const whatsappNumber = boxOneIsPhone ? toWhatsAppNumber(boxOneValue) : "";
  const internationalPhone = boxTwoIsPhone ? toInternationalPhone(boxTwoValue) : "";
  const googleMapsUrl = savedContact?.google_maps_url?.trim() || "";
  const googleMapsEmbedUrl = contactIsActive && googleMapsUrl ? await getGoogleMapsEmbedUrl(googleMapsUrl) : "";
  const whatsappMessage = encodeURIComponent(`السلام عليكم، أرغب في الاستفسار عن خدمة ${service.searchName} في ${city.name}.`);
  const whatsappUrl = whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${whatsappMessage}` : "";
  const relatedServices = serviceSlugs.filter(slug => slug !== service.slug).map(slug => services[slug]);
  const nearbyCities = citySlugs.map(slug => cities[slug]).filter(item => item.region === city.region && item.slug !== city.slug).slice(0, 5);

  const serviceSchema = { "@context": "https://schema.org", "@type": "Service", name: seoTitle, serviceType: service.pluralName, description: service.intro, url: canonical, areaServed: { "@type": "City", name: city.name }, provider: { "@type": "Organization", name: "المملكة للخدمات المنزلية", url: SITE_URL }, availableChannel: { "@type": "ServiceChannel", serviceUrl: canonical, servicePhone: internationalPhone || undefined } };
  const breadcrumbSchema = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "الرئيسية", item: SITE_URL }, { "@type": "ListItem", position: 2, name: service.name, item: `${SITE_URL}/services/${service.slug}` }, { "@type": "ListItem", position: 3, name: city.name, item: canonical }] };
  const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: service.faq.map(item => ({ "@type": "Question", name: item.question, acceptedAnswer: { "@type": "Answer", text: item.answer } })) };

  return (
    <div dir="rtl" className="min-h-screen overflow-x-hidden bg-[#031225] text-white">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c") }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema).replace(/</g, "\\u003c") }} />
      <ServiceHeader />
      <main>
        <section className="relative isolate overflow-hidden px-4 py-14 text-center md:py-20"><div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_top_right,#173b62_0%,#07182c_45%,#020b16_100%)]" /><div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(3,18,37,0.03),#031225)]" /><div className="mx-auto max-w-5xl"><nav aria-label="مسار الصفحة" className="mx-auto flex max-w-max flex-wrap items-center justify-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-xs text-white/55"><Link href="/" className="transition hover:text-white">الرئيسية</Link><span>/</span><span>{service.name}</span><span>/</span><span className="text-[#e8ad45]">{city.name}</span></nav><div className="mx-auto mt-7 h-1 w-16 rounded-full bg-[#e8ad45]" /><h1 className="mx-auto mt-5 max-w-4xl text-[38px] font-black leading-[1.3] md:text-5xl lg:text-6xl">{seoTitle}</h1><p className="mx-auto mt-6 max-w-3xl text-[16px] leading-9 text-white/70 md:text-lg">{service.intro} هذه الصفحة مخصصة لعرض {service.pluralName} في {city.name} التابعة لـ{city.region}.</p>{contactIsActive ? <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">{boxOneValue && (boxOneIsPhone && whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex min-h-13 w-full items-center justify-center rounded-2xl bg-[#25D366] px-6 text-sm font-black text-white shadow-[0_14px_35px_rgba(37,211,102,0.25)] transition hover:-translate-y-0.5 sm:w-auto">{boxOneValue}</a> : <div className="flex min-h-13 w-full cursor-default items-center justify-center rounded-2xl bg-[#25D366]/20 px-6 text-sm font-black text-[#78f0a4] sm:w-auto">{boxOneValue}</div>)}{boxTwoValue && (boxTwoIsPhone && internationalPhone ? <a href={`tel:${internationalPhone}`} className="flex min-h-13 w-full items-center justify-center rounded-2xl border border-[#e8ad45]/50 bg-[#e8ad45]/10 px-6 text-sm font-black text-[#f3c36f] transition hover:bg-[#e8ad45] hover:text-[#031225] sm:w-auto">{boxTwoValue}</a> : <div className="flex min-h-13 w-full cursor-default items-center justify-center rounded-2xl border border-[#e8ad45]/30 bg-[#e8ad45]/10 px-6 text-sm font-black text-[#f3c36f] sm:w-auto">{boxTwoValue}</div>)}</div> : <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-sm font-bold text-white/60">بيانات التواصل غير متاحة حاليًا.</div>}</div></section>
        <section className="bg-[#06182e] px-4 py-14 md:py-20"><div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]"><article className="rounded-3xl border border-white/10 bg-[#081d37] p-6 shadow-2xl md:p-9"><span className="text-sm font-bold text-[#e8ad45]">تفاصيل الخدمة</span><h2 className="mt-3 text-3xl font-black">{service.pluralName} في {city.name}</h2><p className="mt-5 text-[16px] leading-9 text-white/68">نوفر في المملكة للخدمات المنزلية صفحة مستقلة لكل خدمة ومدينة، حتى تكون المعلومات واضحة ومباشرة. تعرض هذه الصفحة خدمات {service.name} في {city.name}، مع وسيلة تواصل مباشرة للاستفسار عن الأعمال المتاحة والتفاصيل المتعلقة بالخدمة.</p><div className="mt-7 grid gap-3 sm:grid-cols-2">{service.details.map(detail => <div key={detail} className="flex min-h-20 items-center gap-3 rounded-2xl border border-white/10 bg-[#031225]/70 p-4"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e8ad45]/10 font-black text-[#e8ad45]">✓</span><p className="text-sm leading-7 text-white/70">{detail}</p></div>)}</div></article><aside className="rounded-3xl border border-[#e8ad45]/20 bg-[#081d37] p-6 shadow-2xl md:p-9"><span className="text-sm font-bold text-[#e8ad45]">معلومات الصفحة</span><dl className="mt-5 space-y-4"><div className="rounded-2xl border border-white/10 bg-[#031225]/70 p-4"><dt className="text-xs text-white/45">الخدمة</dt><dd className="mt-2 font-black">{service.name}</dd></div><div className="rounded-2xl border border-white/10 bg-[#031225]/70 p-4"><dt className="text-xs text-white/45">المدينة</dt><dd className="mt-2 font-black">{city.name}</dd></div><div className="rounded-2xl border border-white/10 bg-[#031225]/70 p-4"><dt className="text-xs text-white/45">المنطقة</dt><dd className="mt-2 font-black">{city.region}</dd></div>{contactIsActive && googleMapsUrl && <div className="rounded-2xl border border-white/10 bg-[#031225]/70 p-4"><dt className="text-xs text-white/45">الموقع</dt><dd className="mt-2"><a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 font-black text-[#e8ad45] transition hover:text-[#f3c36f]">📍 فتح الموقع في Google Maps</a></dd></div>}</dl>{contactIsActive && googleMapsUrl && googleMapsEmbedUrl && <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-[#031225]"><iframe title={`موقع ${service.searchName} في ${city.name}`} src={googleMapsEmbedUrl} loading="lazy" allowFullScreen referrerPolicy="no-referrer-when-downgrade" className="h-[280px] w-full border-0" /></div>}{contactIsActive && googleMapsUrl && !googleMapsEmbedUrl && <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="mt-5 flex min-h-13 items-center justify-center gap-2 rounded-2xl bg-[#e8ad45] px-5 text-sm font-black text-[#031225] transition hover:-translate-y-0.5">📍 عرض الموقع في Google Maps</a>}</aside></div></section>
        <section className="px-4 py-14 md:py-20"><div className="mx-auto max-w-6xl"><h2 className="text-center text-3xl font-black md:text-4xl">خدمات أخرى في {city.name}</h2><div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">{relatedServices.map(item => <Link key={item.slug} href={`/services/${item.slug}/${city.slug}`} className="rounded-3xl border border-white/10 bg-[#071a31] p-6 text-center transition hover:-translate-y-1 hover:border-[#e8ad45]/50"><span className="text-sm text-white/45">{item.pluralName}</span><h3 className="mt-2 text-xl font-black text-[#e8ad45]">{item.searchName} {city.name}</h3></Link>)}</div>{nearbyCities.length > 0 && <><h2 className="mt-14 text-center text-3xl font-black md:text-4xl">{service.pluralName} في مدن قريبة</h2><div className="mt-8 flex flex-wrap justify-center gap-3">{nearbyCities.map(item => <Link key={item.slug} href={`/services/${service.slug}/${item.slug}`} className="rounded-2xl border border-white/10 bg-[#071a31] px-5 py-3 text-sm font-black transition hover:border-[#e8ad45]/50 hover:text-[#e8ad45]">{service.searchName} {item.name}</Link>)}</div></>}</div></section>
        <section className="bg-[#06182e] px-4 py-14 md:py-20"><div className="mx-auto max-w-4xl"><h2 className="text-center text-3xl font-black md:text-4xl">أسئلة شائعة عن {seoTitle}</h2><div className="mt-8 space-y-3">{service.faq.map(item => <article key={item.question} className="rounded-3xl border border-white/10 bg-[#081d37] p-6"><h3 className="text-lg font-black text-[#e8ad45]">{item.question}</h3><p className="mt-3 text-sm leading-8 text-white/68">{item.answer}</p></article>)}</div></div></section>
      </main>
      <footer className="border-t border-white/10 bg-[#020d1a] px-4 py-9 text-center"><Link href="/"><span className="block text-2xl font-black text-[#e8ad45]">المملكة</span><span className="mt-1 block font-bold">للخدمات المنزلية</span></Link><p className="mt-6 text-xs text-white/40">© 2026 المملكة للخدمات المنزلية. جميع الحقوق محفوظة.</p></footer>
    </div>
  );
}