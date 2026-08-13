import type { MetadataRoute } from "next";
import {
  SITE_URL,
  cities,
  citySlugs,
  services,
  serviceSlugs,
} from "@/app/lib/service-data";

export default function sitemap(): MetadataRoute.Sitemap {
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

  const serviceCityPages: MetadataRoute.Sitemap = serviceSlugs.flatMap(
    (serviceSlug) =>
      citySlugs.map((citySlug) => ({
        url: `${SITE_URL}/services/${services[serviceSlug].slug}/${cities[citySlug].slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  );

  return [...homePages, ...serviceCityPages];
}