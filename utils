export interface Service {
  slug: string;
  name: string;
}

export const services: Service[] = [
  { slug: 'plumber', name: 'سباك' },
  { slug: 'electrician', name: 'كهربائي' },
];

export function isServiceSlug(slug: string): boolean {
  return services.some((s) => s.slug === slug);
}
