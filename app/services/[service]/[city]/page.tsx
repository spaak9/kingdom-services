import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import {
    services,
    cities,
    isServiceSlug,
    isCitySlug,
    SITE_URL,
    WHATSAPP_NUMBER,
} from '@/app/lib/service-data';
import {
    getContactFor,
    getContactUrlDigits,
    VACANT_LABEL,
    type ContactValue,
    type ResolvedContact,
} from '@/app/lib/service-contacts';

/*
 * الرابط يحمل الرقم: /services/plumbing/al-hariq-0511567408
 *
 * الجزء الأخير من المسار هو ما يعرضه Google في السطر الرمادي،
 * فوجود الرقم فيه يجعله يظهر هناك أيضًا. المقطع قد يصل بصيغتين:
 * باسم المدينة وحده، أو باسم المدينة متبوعًا بشرطة وأرقام.
 */
function parseCityParam(cityParam: string) {
    if (isCitySlug(cityParam)) {
        return { citySlug: cityParam, digits: null as string | null };
    }

    const match = cityParam.match(/^(.+)-(\d+)$/);

    if (match && isCitySlug(match[1])) {
        return { citySlug: match[1], digits: match[2] };
    }

    return null;
}

function buildCityPath(citySlug: string, digits: string | null) {
    return digits ? `${citySlug}-${digits}` : citySlug;
}

/*
 * تُبنى الصفحة عند كل طلب.
 *
 * التوليد المسبق لا يصلح هنا: البناء يجري في بيئة لا تحتوي
 * ملف بيانات المعلنين، فتُولَّد كل الصفحات "للإيجار" وتبقى كذلك
 * حتى تنتهي مدة التحديث — وقد يزورها Google في تلك الأثناء
 * فلا يرى الرقم. قراءة ملف محلي رخيصة، فنقرأه مع كل طلب.
 *
 * الروابط الخاطئة ما زالت تعطي 404 عبر notFound() بالأسفل.
 */
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ service: string; city: string }> }): Promise<Metadata> {
    const { service: serviceParam, city: cityParam } = await params;
    const parsed = parseCityParam(cityParam);
    if (!isServiceSlug(serviceParam) || !parsed) return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };

    const service = services[serviceParam];
    const city = cities[parsed.citySlug];

    const contact = await getContactFor(service.slug, city.slug);

    /*
     * بلا تكرار: العنوان المكرر ("سباك الحريق ... سباك الحريق")
     * يدفع Google لإعادة كتابة العنوان وحذف الرقم منه.
     */
    const seoTitle = `${service.searchName} ${city.name} ${contact.displayValue} خصم 30%`;

    /*
     * الرقم في بداية الوصف أيضًا، ليظهر في السطر الرمادي أسفل
     * العنوان في نتائج البحث لا في العنوان وحده.
     */
    const description = contact.isRented
        ? `${service.searchName} ${city.name} — للتواصل والحجز: ${contact.displayValue}. ${service.intro}`
        : `${service.pluralName} في ${city.name}. ${service.intro}`;
    // الرابط المعتمد يحمل الرقم عند التأجير، وبدونه عند الشغور.
    const canonical = `${SITE_URL}/services/${service.slug}/${buildCityPath(city.slug, getContactUrlDigits(contact))}`;

    return {
        // absolute حتى لا يضيف القالب في layout اسم الموقع بعد الرقم.
        title: { absolute: seoTitle },
        description,
        keywords: [seoTitle, `${service.searchName} ${city.name}`],
        alternates: { canonical },
        openGraph: { type: "website", locale: "ar_SA", url: canonical, title: seoTitle, description },
        twitter: { card: "summary", title: seoTitle, description },
        robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    };
}

function ContactBox({ label, value, href }: { label: string; value: ContactValue | null; href: string | null }) {
    if (!value) {
        return null;
    }

    return (
        <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="mb-1 text-sm text-white/60">{label}</p>
            {href ? (
                <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    dir="ltr"
                    className="text-xl font-bold text-[#e8ad45] underline-offset-4 hover:underline"
                >
                    {value.raw}
                </a>
            ) : (
                <span dir="ltr" className="text-xl font-bold">{value.raw}</span>
            )}
        </div>
    );
}

/*
 * الصفحة الشاغرة: دعوة لاستئجار المكان عبر واتساب الموقع.
 */
function RentThisPage() {
    return (
        <section className="rounded-3xl border border-[#25D366]/20 bg-[#25D366]/[0.06] px-6 py-8 text-center">
            <p className="text-xl font-black">هل تريد أن يظهر رقمك هنا؟</p>
            <p className="mt-2 text-white/60">
                هذا المكان متاح {VACANT_LABEL}. تواصل معنا عبر واتساب لحجزه.
            </p>

            <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#25D366]/10 px-6 py-3 text-base font-black text-[#25D366] transition duration-300 hover:bg-[#25D366]/20"
            >
                تواصل عبر واتساب
                <span dir="ltr">{WHATSAPP_NUMBER}</span>
            </a>
        </section>
    );
}

function ServiceJsonLd({ serviceName, cityName, canonical, contact }: { serviceName: string; cityName: string; canonical: string; contact: ResolvedContact }) {
    const telephone = contact.phone?.dialable ?? contact.whatsapp?.dialable;

    // لا نضيف بيانات منظمة لصفحة شاغرة أو لعبارة نصية.
    if (!contact.isRented || !telephone) {
        return null;
    }

    const schema = {
        "@context": "https://schema.org",
        "@type": "Service",
        serviceType: serviceName,
        areaServed: { "@type": "City", name: cityName },
        provider: {
            "@type": "LocalBusiness",
            name: `${serviceName} ${cityName}`,
            telephone: `+${telephone}`,
            areaServed: { "@type": "City", name: cityName },
            url: canonical,
            ...(contact.googleMapsUrl ? { hasMap: contact.googleMapsUrl } : {}),
        },
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
            }}
        />
    );
}

export default async function ServiceCityPage({ params }: { params: Promise<{ service: string; city: string }> }) {
    const { service: serviceParam, city: cityParam } = await params;
    const parsed = parseCityParam(cityParam);
    if (!isServiceSlug(serviceParam) || !parsed) notFound();

    const service = services[serviceParam];
    const city = cities[parsed.citySlug];

    const contact = await getContactFor(service.slug, city.slug);
    const digits = getContactUrlDigits(contact);

    /*
     * رابط واحد معتمد لكل صفحة. إذا وصل الزائر برابط قديم
     * (بلا رقم بعد التأجير، أو برقم قديم بعد تغييره، أو برقم
     * بعد انتهاء الإيجار) نحوّله تحويلًا دائمًا إلى الرابط الحالي
     * حتى لا تتكرر الصفحة في نتائج البحث.
     */
    if (parsed.digits !== digits) {
        permanentRedirect(
            `/services/${service.slug}/${buildCityPath(city.slug, digits)}`,
        );
    }

    // الرابط المعتمد يحمل الرقم عند التأجير، وبدونه عند الشغور.
    const canonical = `${SITE_URL}/services/${service.slug}/${buildCityPath(city.slug, digits)}`;

    return (
        <main className="container mx-auto px-4 py-8">
            {/*
              * العنوان الظاهر يطابق عنوان الصفحة ويحمل الرقم.
              * عندما يعيد Google كتابة العنوان فإنه يستعين بـ h1،
              * فبقاء الرقم فيه يرفع فرصة ظهوره في نتائج البحث.
              */}
            <h1 className="mb-4 text-3xl font-bold">
                {service.searchName} {city.name}
                {contact.isRented ? (
                    <> <span dir="ltr">{contact.displayValue}</span></>
                ) : null}
            </h1>
            <p className="mb-6 text-lg text-white/70">{service.intro}</p>

            {contact.isRented ? (
                <>
                    <section className="grid gap-4 sm:grid-cols-2">
                        <ContactBox
                            label="واتساب"
                            value={contact.whatsapp}
                            href={contact.whatsapp?.dialable ? `https://wa.me/${contact.whatsapp.dialable}` : null}
                        />
                        <ContactBox
                            label="اتصال"
                            value={contact.phone}
                            href={contact.phone?.dialable ? `tel:+${contact.phone.dialable}` : null}
                        />
                    </section>

                    {contact.googleMapsUrl ? (
                        <a
                            href={contact.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="mt-4 inline-block text-[#e8ad45] underline-offset-4 hover:underline"
                        >
                            الموقع على خرائط Google
                        </a>
                    ) : null}
                </>
            ) : (
                <RentThisPage />
            )}

            <ServiceJsonLd
                serviceName={service.name}
                cityName={city.name}
                canonical={canonical}
                contact={contact}
            />
        </main>
    );
}
