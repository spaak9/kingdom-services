import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isCorrectAdminCode,
} from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type LoginBody = {
  code?: unknown;
};

export async function POST(request: Request) {
  let body: LoginBody;

  try {
    body = (await request.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "البيانات المرسلة غير صالحة.",
      },
      {
        status: 400,
      },
    );
  }

  const code =
    typeof body.code === "string"
      ? body.code.trim()
      : "";

  if (!code) {
    return NextResponse.json(
      {
        ok: false,
        message: "اكتب رمز الإدارة.",
      },
      {
        status: 400,
      },
    );
  }

  if (!isCorrectAdminCode(code)) {
    return NextResponse.json(
      {
        ok: false,
        message: "رمز الإدارة غير صحيح.",
      },
      {
        status: 401,
      },
    );
  }

  try {
    const response = NextResponse.json(
      {
        ok: true,
        message: "تم تسجيل الدخول بنجاح.",
      },
      {
        status: 200,
      },
    );

    response.cookies.set(
      ADMIN_COOKIE_NAME,
      createAdminSessionToken(),
      getAdminCookieOptions(),
    );

    return response;
  } catch (error) {
    console.error("Admin login error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "إعدادات رمز الإدارة غير موجودة.",
      },
      {
        status: 500,
      },
    );
  }
}