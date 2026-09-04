import { cookies } from "next/headers";
import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

export const ADMIN_COOKIE_NAME =
  "kingdom_admin_session_v3";

export const ADMIN_SESSION_SECONDS = 60 * 60;

function getAdminCode() {
  return process.env.ADMIN_CODE?.trim() ?? "";
}

function getSessionSecret() {
  const secret =
    process.env.ADMIN_SESSION_SECRET?.trim() ?? "";

  if (!secret) {
    throw new Error(
      "ADMIN_SESSION_SECRET is not configured.",
    );
  }

  return secret;
}

function safeEqualHex(a: string, b: string) {
  try {
    const aBuffer = Buffer.from(a, "hex");
    const bBuffer = Buffer.from(b, "hex");

    if (
      aBuffer.length === 0 ||
      aBuffer.length !== bBuffer.length
    ) {
      return false;
    }

    return timingSafeEqual(aBuffer, bBuffer);
  } catch {
    return false;
  }
}

/*
 * رمز الإدارة يأتي من متغير البيئة ADMIN_CODE فقط.
 *
 * لا نحفظه في ملف لأن ملفات public/assets مكشوفة للجميع،
 * ولأن أي ملف خارجها يُمحى مع كل عملية نشر.
 */
export async function isCorrectAdminCode(
  code: string,
) {
  const normalizedCode = code.trim();

  if (!normalizedCode) {
    return false;
  }

  const expectedCode = getAdminCode();

  if (!expectedCode) {
    console.error(
      "ADMIN_CODE is not configured.",
    );

    return false;
  }

  // مقارنة بزمن ثابت حتى لا يتسرب طول الرمز أو محتواه.
  const candidate = Buffer.from(
    normalizedCode,
    "utf8",
  );

  const expected = Buffer.from(
    expectedCode,
    "utf8",
  );

  if (candidate.length !== expected.length) {
    return false;
  }

  return timingSafeEqual(candidate, expected);
}

export function createAdminSessionToken() {
  const secret = getSessionSecret();

  const expiresAt =
    Date.now() + ADMIN_SESSION_SECONDS * 1000;

  const nonce = randomUUID();

  const payload = `${expiresAt}.${nonce}`;

  const signature = createHmac(
    "sha256",
    secret,
  )
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

function verifyAdminSessionToken(token: string) {
  try {
    const parts = token.split(".");

    if (parts.length !== 3) {
      return false;
    }

    const [expiresAtString, nonce, signature] =
      parts;

    if (
      !expiresAtString ||
      !nonce ||
      !signature
    ) {
      return false;
    }

    const expiresAt = Number(expiresAtString);

    if (
      !Number.isFinite(expiresAt) ||
      Date.now() > expiresAt
    ) {
      return false;
    }

    const secret = getSessionSecret();

    const payload =
      `${expiresAtString}.${nonce}`;

    const expectedSignature = createHmac(
      "sha256",
      secret,
    )
      .update(payload)
      .digest("hex");

    return safeEqualHex(
      signature,
      expectedSignature,
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get(
    ADMIN_COOKIE_NAME,
  );

  if (!cookie?.value) {
    return false;
  }

  return verifyAdminSessionToken(
    cookie.value,
  );
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure:
      process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  };
}