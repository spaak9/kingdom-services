import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "../../../lib/admin-auth";
import { getSupabaseAdmin } from "../../../lib/supabase-admin";

import {
  isCitySlug,
  isServiceSlug,
} from "../../../lib/service-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ContactBody = {
  service_slug?: unknown;
  city_slug?: unknown;
  phone_number?: unknown;
  whatsapp_number?: unknown;
  google_maps_url?: unknown;
  is_active?: unknown;
};

function noStoreHeaders() {
  return {
    "Cache-Control":
      "no-store, no-cache, must-revalidate, max-age=0",
  };
}

function unauthorizedResponse() {
  return NextResponse.json(
    {
      message: "غير مصرح لك بالدخول.",
    },
    {
      status: 401,
      headers: noStoreHeaders(),
    },
  );
}

function isValidGoogleMapsUrl(value: string) {
  if (!value) {
    return true;
  }

  try {
    const url = new URL(value);
    const hostname =
      url.hostname.toLowerCase();

    if (url.protocol !== "https:") {
      return false;
    }

    return (
      hostname === "google.com" ||
      hostname.endsWith(".google.com") ||
      hostname === "maps.app.goo.gl" ||
      hostname === "goo.gl"
    );
  } catch {
    return false;
  }
}

function getSafeError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null
  ) {
    const currentError = error as {
      code?: unknown;
      message?: unknown;
      details?: unknown;
      hint?: unknown;
    };

    return {
      code:
        typeof currentError.code === "string"
          ? currentError.code
          : null,

      message:
        typeof currentError.message === "string"
          ? currentError.message
          : "Unknown error",

      details:
        typeof currentError.details === "string"
          ? currentError.details
          : null,

      hint:
        typeof currentError.hint === "string"
          ? currentError.hint
          : null,
    };
  }

  if (error instanceof Error) {
    return {
      code: null,
      message: error.message,
      details: null,
      hint: null,
    };
  }

  return {
    code: null,
    message: "Unknown server error",
    details: null,
    hint: null,
  };
}

export async function GET() {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return unauthorizedResponse();
  }

  try {
    const { data, error } =
      await getSupabaseAdmin()
        .from("service_contacts")
        .select(
          `
            id,
            service_slug,
            city_slug,
            phone_number,
            whatsapp_number,
            google_maps_url,
            is_active,
            created_at,
            updated_at
          `,
        )
        .order("city_slug", {
          ascending: true,
        })
        .order("service_slug", {
          ascending: true,
        });

    if (error) {
      console.error(
        "Failed to load service contacts:",
        error,
      );

      return NextResponse.json(
        {
          message:
            "تعذر تحميل بيانات الخدمات.",

          supabaseError:
            getSafeError(error),
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        },
      );
    }

    return NextResponse.json(
      {
        contacts: data ?? [],
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error(
      "Service contacts GET server error:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "حدث خطأ في اتصال قاعدة البيانات.",

        serverError:
          getSafeError(error),
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}

export async function POST(
  request: Request,
) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return unauthorizedResponse();
  }

  let body: ContactBody;

  try {
    body =
      (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json(
      {
        message:
          "البيانات المرسلة غير صالحة.",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  const serviceSlug =
    typeof body.service_slug === "string"
      ? body.service_slug.trim()
      : "";

  const citySlug =
    typeof body.city_slug === "string"
      ? body.city_slug.trim()
      : "";

  const boxTwoValue =
    typeof body.phone_number === "string"
      ? body.phone_number.trim()
      : "";

  const boxOneValue =
    typeof body.whatsapp_number === "string"
      ? body.whatsapp_number.trim()
      : "";

  const googleMapsUrl =
    typeof body.google_maps_url === "string"
      ? body.google_maps_url.trim()
      : "";

  const isActive =
    typeof body.is_active === "boolean"
      ? body.is_active
      : true;

  if (!isServiceSlug(serviceSlug)) {
    return NextResponse.json(
      {
        message: "نوع الخدمة غير صحيح.",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  if (!isCitySlug(citySlug)) {
    return NextResponse.json(
      {
        message: "المدينة غير صحيحة.",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  if (boxOneValue.length > 120) {
    return NextResponse.json(
      {
        message:
          "محتوى الصندوق الأول طويل جدًا.",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  if (boxTwoValue.length > 120) {
    return NextResponse.json(
      {
        message:
          "محتوى الصندوق الثاني طويل جدًا.",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  if (
    !isValidGoogleMapsUrl(
      googleMapsUrl,
    )
  ) {
    return NextResponse.json(
      {
        message:
          "رابط الموقع غير صحيح. الصق رابطًا من Google Maps.",
      },
      {
        status: 400,
        headers: noStoreHeaders(),
      },
    );
  }

  try {
    const { data, error } =
      await getSupabaseAdmin()
        .from("service_contacts")
        .upsert(
          {
            service_slug: serviceSlug,
            city_slug: citySlug,
            phone_number: boxTwoValue,
            whatsapp_number: boxOneValue,
            google_maps_url:
              googleMapsUrl,
            is_active: isActive,
          },
          {
            onConflict:
              "service_slug,city_slug",
          },
        )
        .select(
          `
            id,
            service_slug,
            city_slug,
            phone_number,
            whatsapp_number,
            google_maps_url,
            is_active,
            created_at,
            updated_at
          `,
        )
        .single();

    if (error) {
      console.error(
        "Failed to save service contact:",
        error,
      );

      return NextResponse.json(
        {
          message:
            "تعذر حفظ بيانات الخدمة.",

          supabaseError:
            getSafeError(error),
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        },
      );
    }

    return NextResponse.json(
      {
        message:
          "تم حفظ البيانات بنجاح.",
        contact: data,
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error(
      "Service contacts POST server error:",
      error,
    );

    return NextResponse.json(
      {
        message:
          "حدث خطأ في اتصال قاعدة البيانات.",

        serverError:
          getSafeError(error),
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}