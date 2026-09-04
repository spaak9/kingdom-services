export const cities = [
  'riyadh',
  'jeddah',
  'ahsa' // أضف مدنك هنا
];

export function isCitySlug(slug: string): boolean {
  return cities.includes(slug);
}
