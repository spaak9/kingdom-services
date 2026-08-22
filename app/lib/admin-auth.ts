import { cookies } from "next/headers";
import {
  createHmac,
  randomUUID,
  timingSafeEqual,
} from "node:crypto";

export const ADMIN_COOKIE_NAME =
  "kingdom_admin_session_v3";

// مدة الجلسة: ساعة واحدة
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

export function isCorrectAdminCode(code: string) {
  const adminCode = getAdminCode();

  if (!adminCode || !code) {
    return false;
  }

  return code.trim() === adminCode;
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

    const suppliedBuffer = Buffer.from(
      signature,
      "hex",
    );

    const expectedBuffer = Buffer.from(
      expectedSignature,
      "hex",
    );

    if (
      suppliedBuffer.length !==
      expectedBuffer.length
    ) {
      return false;
    }

    return timingSafeEqual(
      suppliedBuffer,
      expectedBuffer,
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