import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE_NAME,
  getAdminCookieOptions,
} from "../../../lib/admin-auth";

export async function POST(request: Request) {
  const response = NextResponse.redirect(
    new URL("/", request.url),
    303,
  );

  response.cookies.set(ADMIN_COOKIE_NAME, "", {
    ...getAdminCookieOptions(),
    maxAge: 0,
  });

  return response;
}