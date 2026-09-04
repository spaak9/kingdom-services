import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

/*
 * تخزين محلي بدل قاعدة بيانات.
 *
 * الملفات تُحفظ داخل public/assets لأن هذا المجلد هو الوحيد
 * الذي يبقى بين عمليات النشر على استضافة GoDaddy.
 *
 * انتبه: كل ما في هذا المجلد متاح للجميع عبر الإنترنت،
 * لذلك لا تضع فيه أي بيانات سرية (مثل رمز الإدارة).
 */

const DATA_DIR =
  process.env.DATA_DIR?.trim() ||
  path.join(process.cwd(), "public", "assets");

export const CONTACTS_FILE = "service-contacts.json";
export const SETTINGS_FILE = "site-settings.json";

export async function readJsonFile<T>(
  fileName: string,
  fallback: T,
): Promise<T> {
  try {
    const raw = await readFile(
      path.join(DATA_DIR, fileName),
      "utf8",
    );

    return JSON.parse(raw) as T;
  } catch (error) {
    const code = (error as NodeJS.ErrnoException)
      ?.code;

    // الملف غير موجود بعد: هذه حالة طبيعية أول مرة.
    if (code !== "ENOENT") {
      console.warn(
        `Failed to read ${fileName}:`,
        error,
      );
    }

    return fallback;
  }
}

/*
 * الكتابة تتم على ملف مؤقت ثم إعادة تسمية، حتى لا يقرأ
 * أحد ملفًا نصفه مكتوب إذا تعطل الخادم أثناء الحفظ.
 */
export async function writeJsonFile(
  fileName: string,
  value: unknown,
) {
  await mkdir(DATA_DIR, { recursive: true });

  const target = path.join(DATA_DIR, fileName);
  const temp = `${target}.${process.pid}.tmp`;

  await writeFile(
    temp,
    JSON.stringify(value, null, 2),
    "utf8",
  );

  await rename(temp, target);
}
