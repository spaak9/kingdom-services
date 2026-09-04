import type { MetadataRoute } from "next";
import {
  SITE_URL,
  cities,
  citySlugs,
  services,
  serviceSlugs,
} from "@/app/lib/service-data";
import {
  getContactFor,
  getContactUrlDigits,
} from "@/app/lib/service-contacts";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const homePages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/usage-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE_URL}/support`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  /*
   * الصفحات المؤجرة روابطها تحمل الرقم، فيجب أن يذكر
   * الـ sitemap الرابط المعتمد نفسه لا الرابط الذي يحوّل.
   */
  const pairs = serviceSlugs.flatMap((serviceSlug) =>
    citySlugs.map((citySlug) => ({ serviceSlug, citySlug })),
  );

  const serviceCityPages: MetadataRoute.Sitemap = await Promise.all(
    pairs.map(async ({ serviceSlug, citySlug }) => {
      const contact = await getContactFor(
        services[serviceSlug].slug,
        cities[citySlug].slug,
      );

      const digits = getContactUrlDigits(contact);

      const cityPath = digits
        ? `${cities[citySlug].slug}-${digits}`
        : cities[citySlug].slug;

      return {
        url: `${SITE_URL}/services/${services[serviceSlug].slug}/${cityPath}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      };
    }),
  );

  return [...homePages, ...serviceCityPages];
}