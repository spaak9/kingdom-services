import "server-only";
import { cache } from "react";

import { CONTACTS_FILE, readJsonFile } from "./local-store";

/*
 * قراءة بيانات المعلنين للصفحات العامة.
 *
 * الصفحات 632 صفحة ثابتة، وكل صفحة تقرأ البيانات مرتين
 * (generateMetadata ثم جسم الصفحة). لذلك نقرأ الملف كاملًا
 * مرة واحدة ونحتفظ به في الذاكرة بدل قراءة لكل صفحة.
 */

export const VACANT_LABEL = "للإيجار";

// شكل السجل داخل ملف service-contacts.json
export type StoredContact = {
  service_slug: string;
  city_slug: string;
  phone_number: string;
  whatsapp_number: string;
  google_maps_url: string;
  is_active: boolean;
  updated_at: string;
};

export type ServiceContactRow = {
  serviceSlug: string;
  citySlug: string;
  phoneNumber: string;
  whatsappNumber: string;
  googleMapsUrl: string;
};

export type ContactValue = {
  raw: string;

  // أرقام دولية جاهزة للاتصال، أو null إذا كان النص عبارة.
  dialable: string | null;
};

export type ResolvedContact = {
  // ما يظهر في عنوان الصفحة: الرقم أو "للإيجار".
  displayValue: string;
  isRented: boolean;
  phone: ContactValue | null;
  whatsapp: ContactValue | null;
  googleMapsUrl: string | null;
};

function contactKey(serviceSlug: string, citySlug: string) {
  return `${serviceSlug}|${citySlug}`;
}

const ARABIC_INDIC_START = 0x0660;
const EXTENDED_ARABIC_INDIC_START = 0x06f0;

function toAsciiDigits(value: string) {
  return value.replace(/[٠-٩۰-۹]/g, (char) => {
    const code = char.charCodeAt(0);

    const base =
      code >= EXTENDED_ARABIC_INDIC_START
        ? EXTENDED_ARABIC_INDIC_START
        : ARABIC_INDIC_START;

    return String(code - base);
  });
}

/*
 * التطبيع:
 *   ٠٥٠… أو ۰۵۰… -> أرقام إنجليزية
 *   00966… -> 966…
 *   9665XXXXXXXX -> كما هو
 *   05XXXXXXXX  -> 9665XXXXXXXX
 *   5XXXXXXXX   -> 9665XXXXXXXX
 *   غير ذلك بطول 10-15 -> يُعتبر رقمًا دوليًا
 */
export function normalizeSaudiNumber(raw: string): string | null {
  let digits = toAsciiDigits(raw).replace(/\D/g, "");

  if (digits.startsWith("00")) {
    digits = digits.slice(2);
  }

  if (digits.length === 12 && digits.startsWith("966")) {
    return digits;
  }

  if (digits.length === 10 && digits.startsWith("05")) {
    return `966${digits.slice(1)}`;
  }

  if (digits.length === 9 && digits.startsWith("5")) {
    return `966${digits}`;
  }

  if (digits.length >= 10 && digits.length <= 15) {
    return digits;
  }

  return null;
}

/*
 * الصندوق قد يحتوي رقمًا أو عبارة مثل "للإيجار" أو "غير متاح".
 * وجود حروف عربية يعني أنه نص وليس رقمًا قابلًا للاتصال.
 */
export function isDialable(raw: string) {
  if (/[ء-ي]/.test(raw)) {
    return false;
  }

  return normalizeSaudiNumber(raw) !== null;
}

function toContactValue(raw: string): ContactValue | null {
  const trimmed = raw.trim();

  if (!trimmed) {
    return null;
  }

  return {
    raw: trimmed,
    dialable: isDialable(trimmed)
      ? normalizeSaudiNumber(trimmed)
      : null,
  };
}

export async function readStoredContacts() {
  const stored = await readJsonFile<StoredContact[]>(
    CONTACTS_FILE,
    [],
  );

  return Array.isArray(stored) ? stored : [];
}

async function loadServiceContacts() {
  const stored = await readStoredContacts();

  const map = new Map<string, ServiceContactRow>();

  for (const row of stored) {
    if (!row?.service_slug || !row?.city_slug) {
      continue;
    }

    // المخفية تُعامل كصفحة شاغرة.
    if (row.is_active === false) {
      continue;
    }

    map.set(
      contactKey(row.service_slug, row.city_slug),
      {
        serviceSlug: row.service_slug,
        citySlug: row.city_slug,
        phoneNumber: row.phone_number ?? "",
        whatsappNumber: row.whatsapp_number ?? "",
        googleMapsUrl: row.google_maps_url ?? "",
      },
    );
  }

  return map;
}

/*
 * cache() من React يوحّد القراءة داخل الطلب الواحد، فتقرأ
 * generateMetadata وجسم الصفحة نفس النتيجة بقراءة واحدة.
 *
 * لا نحتفظ بنسخة أطول من ذلك عمدًا: حالة الوحدات لا تُشارَك
 * بين معالجات الـ API ومكوّنات الخادم، فكان أي تخزين أطول
 * يُبقي الصفحة على بيانات قديمة بعد الحفظ. وقراءة ملف محلي
 * رخيصة أصلًا.
 */
export const getServiceContacts = cache(
  async (): Promise<Map<string, ServiceContactRow>> => {
    try {
      return await loadServiceContacts();
    } catch (error) {
      console.warn(
        "Service contacts lookup error:",
        error,
      );

      return new Map<string, ServiceContactRow>();
    }
  },
);

/*
 * الأرقام التي تُلحق بالرابط: نستخدم الرقم كما كتبه المعلن
 * (0511567408) لا الصيغة الدولية، ليطابق ما يظهر في العنوان.
 * تعود null إذا كان الصندوق عبارة نصية لا رقمًا.
 */
export function getContactUrlDigits(
  contact: ResolvedContact,
) {
  if (!contact.isRented) {
    return null;
  }

  const primary = contact.phone ?? contact.whatsapp;

  if (!primary?.dialable) {
    return null;
  }

  return primary.raw.replace(/\D/g, "") || null;
}

export async function getContactFor(
  serviceSlug: string,
  citySlug: string,
): Promise<ResolvedContact> {
  const contacts = await getServiceContacts();

  const row = contacts.get(
    contactKey(serviceSlug, citySlug),
  );

  const phone = row
    ? toContactValue(row.phoneNumber)
    : null;

  const whatsapp = row
    ? toContactValue(row.whatsappNumber)
    : null;

  // الصندوق الثاني (اتصال) له الأولوية في العنوان.
  const primary = phone ?? whatsapp;

  const googleMapsUrl =
    row && row.googleMapsUrl.trim().startsWith("https://")
      ? row.googleMapsUrl.trim()
      : null;

  return {
    displayValue: primary?.raw ?? VACANT_LABEL,
    isRented: Boolean(primary),
    phone,
    whatsapp,
    googleMapsUrl,
  };
}
