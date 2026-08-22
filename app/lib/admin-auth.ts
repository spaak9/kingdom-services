import { cookies } from "next/headers";
import {
  createHmac,
  randomBytes,
  randomUUID,
  scryptSync,
  timingSafeEqual,
} from "node:crypto";

import { getSupabaseAdmin } from "./supabase-admin";

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

function hashCode(code: string, salt: string) {
  return scryptSync(code, salt, 64).toString("hex");
}

export function createAdminCodeHash(code: string) {
  const salt = randomBytes(16).toString("hex");

  return {
    salt,
    hash: hashCode(code, salt),
  };
}

export async function isCorrectAdminCode(
  code: string,
) {
  const normalizedCode = code.trim();

  if (!normalizedCode) {
    return false;
  }

  try {
    const { data, error } =
      await getSupabaseAdmin()
        .from("site_settings")
        .select(
          "admin_code_hash, admin_code_salt",
        )
        .eq("id", 1)
        .maybeSingle();

    if (error) {
      console.error(
        "Failed to read admin code settings:",
        error,
      );
      return false;
    }

    if (
      data?.admin_code_hash &&
      data?.admin_code_salt
    ) {
      const candidateHash = hashCode(
        normalizedCode,
        data.admin_code_salt,
      );

      return safeEqualHex(
        candidateHash,
        data.admin_code_hash,
      );
    }
  } catch (error) {
    console.error(
      "Admin code verification error:",
      error,
    );
    return false;
  }

  // أول مرة فقط قبل حفظ رمز من لوحة الإدارة.
  const fallbackCode = getAdminCode();

  if (!fallbackCode) {
    return false;
  }

  return normalizedCode === fallbackCode;
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