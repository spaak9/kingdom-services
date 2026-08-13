import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "kingdom_admin_session";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

function getAdminCode() {
  return process.env.ADMIN_CODE?.trim() ?? "";
}

function safeEqual(firstValue: string, secondValue: string) {
  const firstHash = createHash("sha256")
    .update(firstValue)
    .digest();

  const secondHash = createHash("sha256")
    .update(secondValue)
    .digest();

  return timingSafeEqual(firstHash, secondHash);
}

function signExpiresAt(expiresAt: string) {
  const adminCode = getAdminCode();

  if (!adminCode) {
    throw new Error("ADMIN_CODE غير موجود");
  }

  return createHmac("sha256", adminCode)
    .update(`kingdom-admin:${expiresAt}`)
    .digest("base64url");
}

export function isCorrectAdminCode(code: string) {
  const adminCode = getAdminCode();

  if (!adminCode || !code) {
    return false;
  }

  return safeEqual(code, adminCode);
}

export function createAdminSessionToken() {
  const expiresAt = String(
    Date.now() + ADMIN_SESSION_SECONDS * 1000,
  );

  const signature = signExpiresAt(expiresAt);

  return `${expiresAt}.${signature}`;
}

export function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  const [expiresAt, receivedSignature, extraPart] =
    token.split(".");

  if (!expiresAt || !receivedSignature || extraPart) {
    return false;
  }

  const expiresAtNumber = Number(expiresAt);

  if (
    !Number.isFinite(expiresAtNumber) ||
    expiresAtNumber <= Date.now()
  ) {
    return false;
  }

  try {
    const expectedSignature = signExpiresAt(expiresAt);

    return safeEqual(
      receivedSignature,
      expectedSignature,
    );
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const token = cookieStore.get(
    ADMIN_COOKIE_NAME,
  )?.value;

  return verifyAdminSessionToken(token);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  };
}