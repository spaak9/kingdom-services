export const services = [
  'plumber',
  'electrician',
  'painting',
  'tiling'
];

export function isServiceSlug(slug: string): boolean {
  return services.includes(slug);
}
