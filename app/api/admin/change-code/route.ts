import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  createAdminCodeHash,
  getAdminCookieOptions,
  isAdminAuthenticated,
  isCorrectAdminCode,
} from "../../../lib/admin-auth";
import { getSupabaseAdmin } from "../../../lib/supabase-admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreHeaders() {
  return {
    "Cache-Control":
      "no-store, no-cache, must-revalidate, max-age=0",
  };
}

export async function POST(
  request: Request,
) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      {
        ok: false,
        message: "غير مصرح لك بالدخول.",
      },
      {
        status: 401,
        headers: noStoreHeaders(),
      },
    );
  }

  try {
    const body = await request.json();

    const currentCode =
      typeof body.current_code === "string"
        ? body.current_code.trim()
        : "";

    const newCode =
      typeof body.new_code === "string"
        ? body.new_code.trim()
        : "";

    const confirmCode =
      typeof body.confirm_code === "string"
        ? body.confirm_code.trim()
        : "";

    if (!currentCode) {
      return NextResponse.json(
        {
          ok: false,
          message: "اكتب الرمز الحالي.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    if (!(await isCorrectAdminCode(currentCode))) {
      return NextResponse.json(
        {
          ok: false,
          message: "الرمز الحالي غير صحيح.",
        },
        {
          status: 401,
          headers: noStoreHeaders(),
        },
      );
    }

    if (newCode.length < 4) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "الرمز الجديد يجب أن يكون 4 خانات على الأقل.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    if (newCode.length > 64) {
      return NextResponse.json(
        {
          ok: false,
          message: "الرمز الجديد طويل جدًا.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    if (newCode !== confirmCode) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "الرمز الجديد وتأكيد الرمز غير متطابقين.",
        },
        {
          status: 400,
          headers: noStoreHeaders(),
        },
      );
    }

    const { hash, salt } =
      createAdminCodeHash(newCode);

    const { error } =
      await getSupabaseAdmin()
        .from("site_settings")
        .upsert(
          {
            id: 1,
            admin_code_hash: hash,
            admin_code_salt: salt,
            updated_at:
              new Date().toISOString(),
          },
          {
            onConflict: "id",
          },
        );

    if (error) {
      console.error(
        "Failed to change admin code:",
        error,
      );

      return NextResponse.json(
        {
          ok: false,
          message:
            "تعذر تغيير رمز الإدارة.",
        },
        {
          status: 500,
          headers: noStoreHeaders(),
        },
      );
    }

    const response = NextResponse.json(
      {
        ok: true,
        message:
          "تم تغيير رمز الإدارة بنجاح.",
      },
      {
        status: 200,
        headers: noStoreHeaders(),
      },
    );

    // تسجيل خروج بعد تغيير الرمز.
    response.cookies.set(
      ADMIN_COOKIE_NAME,
      "",
      {
        ...getAdminCookieOptions(),
        maxAge: 0,
      },
    );

    return response;
  } catch (error) {
    console.error(
      "Change admin code error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "حدث خطأ أثناء تغيير رمز الإدارة.",
      },
      {
        status: 500,
        headers: noStoreHeaders(),
      },
    );
  }
}