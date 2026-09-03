import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { services, isServiceSlug } from '@/data/services';
import { cities, isCitySlug } from '@/data/cities';
import { getServiceCityUrl } from '@/utils/url';

export const dynamicParams = false;

export async function generateStaticParams() {
    return services.flatMap(service => cities.map(city => ({ service: service.slug, city: city.slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string; city: string }> }): Promise<Metadata> {
    const { service: serviceParam, city: cityParam } = await params;
    if (!isServiceSlug(serviceParam) || !isCitySlug(cityParam)) return { title: "الصفحة غير موجودة", robots: { index: false, follow: false } };
    
    const service = services[serviceParam];
    const city = cities[cityParam];
    
    const contactInfo = (city as any).phone || "للإيجار";
    const seoTitle = `${service.name} ${city.name} ${contactInfo} خصم 30% ${service.name} ${city.name}`;
    const description = `يقدم ${service.name} في ${city.name} مجموعة من الخدمات للعملاء في المنطقة، بما في ذلك الكشف عن أنظمة السباكة وصيانعتها وإصلاحها وخدمات الطوارئ على مدار 24 ساعة.`;
    const canonical = getServiceCityUrl(service.slug, city.slug);

    return {
        title: seoTitle,
        description,
        keywords: [seoTitle, `${service.searchName} ${city.name}`],
        alternates: { canonical },
        openGraph: { type: "website", locale: "ar_SA", url: canonical, title: seoTitle, description },
        twitter: { card: "summary", title: seoTitle, description },
        robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } }
    };
}

export default async function ServiceCityPage({ params }: { params: Promise<{ service: string; city: string }> }) {
    const { service: serviceParam, city: cityParam } = await params;
    if (!isServiceSlug(serviceParam) || !isCitySlug(cityParam)) notFound();
    
    const service = services[serviceParam];
    const city = cities[cityParam];
    const contactInfo = (city as any).phone || "للإيجار";

    return (
        <main className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4">{service.name} في {city.name}</h1>
            <p className="text-xl text-gray-700 mb-6">التواصل أو الحجز: {contactInfo}</p>
        </main>
    );
}
