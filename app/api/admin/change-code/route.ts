import { NextResponse } from "next/server";

import { isAdminAuthenticated } from "../../../lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function noStoreHeaders() {
  return {
    "Cache-Control":
      "no-store, no-cache, must-revalidate, max-age=0",
  };
}

/*
 * بعد الاستغناء عن قاعدة البيانات لم يعد هناك مكان آمن
 * لحفظ رمز الإدارة:
 *   - ملفات public/assets مكشوفة للجميع.
 *   - أي ملف خارجها يُمحى مع كل عملية نشر.
 *
 * لذلك يُغيَّر الرمز من إعدادات الاستضافة عبر ADMIN_CODE.
 */
export async function POST() {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    return NextResponse.json(
      {
        ok: false,
        message: "غير مصرح لك بالدخول.",
      },
      {
        status: 401,
        headers: noStoreHeaders(),
      },
    );
  }

  return NextResponse.json(
    {
      ok: false,
      message:
        "لتغيير رمز الإدارة، عدّل قيمة ADMIN_CODE في إعدادات الاستضافة ثم أعد النشر.",
    },
    {
      status: 501,
      headers: noStoreHeaders(),
    },
  );
}
