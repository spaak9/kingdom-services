import "server-only";
import { cache } from "react";

import { getSupabaseAdminOrNull } from "./supabase-admin";

/*
 * قراءة بيانات المعلنين (service_contacts) للصفحات العامة.
 *
 * الصفحات 632 صفحة ثابتة، وكل صفحة تقرأ البيانات مرتين
 * (generateMetadata ثم جسم الصفحة). لذلك نجلب الجدول كاملًا
 * مرة واحدة ونحتفظ به في الذاكرة بدل استعلام لكل صفحة.
 */

export const VACANT_LABEL = "للإيجار";

const MEMO_TTL_MS = 60_000;

// عند فشل الاتصال نخزن نتيجة فارغة لفترة قصيرة حتى لا
// يحاول البناء الاتصال 632 مرة متتالية.
const MEMO_ERROR_TTL_MS = 15_000;

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

type Memo = {
  map: Map<string, ServiceContactRow>;
  expiresAt: number;
};

let memo: Memo | null = null;
let inFlight: Promise<Map<string, ServiceContactRow>> | null = null;

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

async function loadServiceContacts() {
  const supabase = getSupabaseAdminOrNull();

  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("service_contacts")
    .select(
      "service_slug, city_slug, phone_number, whatsapp_number, google_maps_url, is_active",
    )
    .eq("is_active", true)
    .order("updated_at", { ascending: true });

  if (error) {
    console.warn(
      "Failed to load service contacts:",
      error.message,
    );

    return null;
  }

  const map = new Map<string, ServiceContactRow>();

  for (const row of data ?? []) {
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

export const getServiceContacts = cache(
  async (): Promise<Map<string, ServiceContactRow>> => {
    const now = Date.now();

    if (memo && memo.expiresAt > now) {
      return memo.map;
    }

    if (inFlight) {
      return inFlight;
    }

    inFlight = (async () => {
      let map: Map<string, ServiceContactRow> | null = null;

      try {
        map = await loadServiceContacts();
      } catch (error) {
        console.warn(
          "Service contacts lookup error:",
          error,
        );
      }

      const resolved = map ?? new Map<string, ServiceContactRow>();

      memo = {
        map: resolved,
        expiresAt:
          Date.now() +
          (map ? MEMO_TTL_MS : MEMO_ERROR_TTL_MS),
      };

      return resolved;
    })();

    try {
      return await inFlight;
    } finally {
      inFlight = null;
    }
  },
);

export function invalidateServiceContacts() {
  memo = null;
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
