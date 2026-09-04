import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "../../lib/admin-auth";
import {
  DEFAULT_WHATSAPP_NUMBER,
  readSiteSettings,
  writeSiteSettings,
} from "../../lib/site-settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreHeaders() {
  return {
    "Cache-Control":
      "no-store, no-cache, must-revalidate, max-age=0",
  };
}

function normalizeWhatsAppNumber(value: string) {
  return value.replace(/\D/g, "");
}

/*
 * GET عام:
 * الموقع يستخدمه لمعرفة رقم الواتساب الحالي.
 */
export async function GET() {
  try {
    const settings = await readSiteSettings();

    return NextResponse.json(
      {
        whatsapp_number:
          settings.whatsapp_number ||
          DEFAULT_WHATSAPP_NUMBER,
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error(
      "Site settings GET error:",
      error,
    );

    return NextResponse.json(
      {
        whatsapp_number:
          DEFAULT_WHATSAPP_NUMBER,
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  }
}

/*
 * POST محمي:
 * يستخدم من لوحة الإدارة لتغيير رقم الواتساب.
 */
export async function POST(
  request: Request,
) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      {
        ok: false,
        message:
          "غير مصرح لك بالدخول.",
      },
      {
        status: 401,
        headers: noStoreHeaders(),
      },
    );
  }

  try {
    const body = await request.json();

    const rawNumber =
      typeof body.whatsapp_number ===
      "string"
        ? body.whatsapp_number.trim()
        : "";

    const whatsappNumber =
      normalizeWhatsAppNumber(
        rawNumber,
      );

    if (!whatsappNumber) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "اكتب رقم الواتساب.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    if (
      whatsappNumber.length < 10 ||
      whatsappNumber.length > 15
    ) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "رقم الواتساب غير صحيح.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    await writeSiteSettings(whatsappNumber);

    return NextResponse.json(
      {
        ok: true,
        message:
          "تم تحديث رقم الواتساب.",
        whatsapp_number: whatsappNumber,
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );
  } catch (error) {
    console.error(
      "Site settings POST error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "حدث خطأ أثناء حفظ رقم الواتساب.",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}