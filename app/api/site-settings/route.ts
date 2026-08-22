import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "../../lib/admin-auth";
import { getSupabaseAdmin } from "../../lib/supabase-admin";

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
    const { data, error } =
      await getSupabaseAdmin()
        .from("site_settings")
        .select("whatsapp_number")
        .eq("id", 1)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to load site settings:",
        error,
      );

      return NextResponse.json(
        {
          whatsapp_number:
            "966598863130",
        },
        {
          status: 200,
          headers: noStoreHeaders(),
        },
      );
    }

    return NextResponse.json(
      {
        whatsapp_number:
          data?.whatsapp_number ||
          "966598863130",
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
          "966598863130",
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

    const { data, error } =
      await getSupabaseAdmin()
        .from("site_settings")
        .upsert(
          {
            id: 1,
            whatsapp_number:
              whatsappNumber,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        )
        .select(
          "whatsapp_number",
        )
        .single();

    if (error) {
      console.error(
        "Failed to save WhatsApp number:",
        error,
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "تعذر حفظ رقم الواتساب.",
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        },
      );
    }

    return NextResponse.json(
      {
        ok: true,
        message:
          "تم تحديث رقم الواتساب.",
        whatsapp_number:
          data.whatsapp_number,
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