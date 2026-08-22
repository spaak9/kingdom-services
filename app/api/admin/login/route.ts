import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isCorrectAdminCode,
} from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (!code) {
      return NextResponse.json(
        {
          ok: false,
          message: "اكتب رمز الدخول.",
        },
        {
          status: 400,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, private",
          },
        },
      );
    }

    if (!isCorrectAdminCode(code)) {
      return NextResponse.json(
        {
          ok: false,
          message: "رمز الدخول غير صحيح.",
        },
        {
          status: 401,
          headers: {
            "Cache-Control":
              "no-store, no-cache, must-revalidate, private",
          },
        },
      );
    }

    const response = NextResponse.json(
      {
        ok: true,
        message: "تم تسجيل الدخول بنجاح.",
      },
      {
        status: 200,
      },
    );

    response.headers.set(
      "Cache-Control",
      "no-store, no-cache, must-revalidate, private",
    );

    response.cookies.set(
      ADMIN_COOKIE_NAME,
      createAdminSessionToken(),
      getAdminCookieOptions(),
    );

    return response;
  } catch (error) {
    console.error(
      "Admin login error:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        message:
          "حدث خطأ أثناء تسجيل الدخول.",
      },
      {
        status: 500,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, private",
        },
      },
    );
  }
}