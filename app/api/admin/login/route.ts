import {
  createHmac,
  randomUUID,
} from "node:crypto";

import { NextResponse } from "next/server";

import {
  ADMIN_COOKIE_NAME,
  createAdminSessionToken,
  getAdminCookieOptions,
  isCorrectAdminCode,
} from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function createEntryTicket(
  sessionToken: string,
) {
  const secret =
    process.env.ADMIN_SESSION_SECRET?.trim();

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured.",
    );
  }

  const expiresAt = Date.now() + 60_000;
  const nonce = randomUUID();

  const payload =
    `${expiresAt}.${nonce}.${sessionToken}`;

  const signature = createHmac(
    "sha256",
    secret,
  )
    .update(payload)
    .digest("hex");

  return `${expiresAt}.${nonce}.${signature}`;
}

export async function POST(
  request: Request,
) {
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

    if (!(await isCorrectAdminCode(code))) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "رمز الدخول غير صحيح.",
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

    const sessionToken =
      createAdminSessionToken();

    const entryTicket =
      createEntryTicket(sessionToken);

    const response = NextResponse.json(
      {
        ok: true,
        message:
          "تم تسجيل الدخول بنجاح.",
        entryTicket,
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
      sessionToken,
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