import { cookies } from "next/headers";

export const ADMIN_COOKIE_NAME = "kingdom_admin_session_v2";
export const ADMIN_SESSION_SECONDS = 60 * 60 * 12;

function getAdminCode() {
  return process.env.ADMIN_CODE?.trim() ?? "";
}

export function isCorrectAdminCode(code: string) {
  const adminCode = getAdminCode();

  if (!adminCode || !code) {
    return false;
  }

  return code.trim() === adminCode;
}

export function createAdminSessionToken() {
  return crypto.randomUUID();
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();

  const cookie = cookieStore.get(
    ADMIN_COOKIE_NAME,
  );

  return Boolean(cookie?.value);
}

export function getAdminCookieOptions() {
  return {
    httpOnly: true,
    secure: false,
    sameSite: "lax" as const,
    path: "/",
    maxAge: ADMIN_SESSION_SECONDS,
  };
}