import {
  NextRequest,
  NextResponse,
} from "next/server";

const ADMIN_COOKIE_NAME =
  "kingdom_admin_session_v3";

function hexToBytes(hex: string) {
  if (
    hex.length !== 64 ||
    !/^[0-9a-f]+$/i.test(hex)
  ) {
    return null;
  }

  const bytes = new Uint8Array(
    hex.length / 2,
  );

  for (
    let index = 0;
    index < hex.length;
    index += 2
  ) {
    bytes[index / 2] = parseInt(
      hex.slice(index, index + 2),
      16,
    );
  }

  return bytes;
}

async function isValidAdminEntry(
  request: NextRequest,
) {
  try {
    const secret =
      process.env.ADMIN_SESSION_SECRET?.trim();

    const sessionToken =
      request.cookies.get(
        ADMIN_COOKIE_NAME,
      )?.value;

    const ticket =
      request.nextUrl.searchParams.get(
        "ticket",
      );

    if (
      !secret ||
      !sessionToken ||
      !ticket
    ) {
      return false;
    }

    const sessionParts =
      sessionToken.split(".");

    if (sessionParts.length !== 3) {
      return false;
    }

    const sessionExpiresAt =
      Number(sessionParts[0]);

    if (
      !Number.isFinite(
        sessionExpiresAt,
      ) ||
      Date.now() > sessionExpiresAt
    ) {
      return false;
    }

    const ticketParts =
      ticket.split(".");

    if (ticketParts.length !== 3) {
      return false;
    }

    const [
      expiresAtString,
      nonce,
      signatureHex,
    ] = ticketParts;

    const expiresAt =
      Number(expiresAtString);

    if (
      !Number.isFinite(expiresAt) ||
      Date.now() > expiresAt
    ) {
      return false;
    }

    const signature =
      hexToBytes(signatureHex);

    if (!signature) {
      return false;
    }

    const encoder =
      new TextEncoder();

    const key =
      await crypto.subtle.importKey(
        "raw",
        encoder.encode(secret),
        {
          name: "HMAC",
          hash: "SHA-256",
        },
        false,
        ["verify"],
      );

    const payload =
      `${expiresAtString}.${nonce}.${sessionToken}`;

    return await crypto.subtle.verify(
      "HMAC",
      key,
      signature,
      encoder.encode(payload),
    );
  } catch {
    return false;
  }
}

export async function middleware(
  request: NextRequest,
) {
  const valid =
    await isValidAdminEntry(request);

  if (!valid) {
    const loginUrl =
      request.nextUrl.clone();

    loginUrl.pathname =
      "/admin-login";

    loginUrl.search = "";

    return NextResponse.redirect(
      loginUrl,
    );
  }

  const response =
    NextResponse.next();

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, private",
  );

  return response;
}

export const config = {
  matcher: ["/admin"],
};