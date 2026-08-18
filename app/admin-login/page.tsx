"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const trimmedCode = code.trim();

    if (!trimmedCode) {
      setMessage("اكتب رمز الدخول.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "/api/admin/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            code: trimmedCode,
          }),
        },
      );

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
      };

      if (!response.ok || !result.ok) {
        setMessage(
          result.message ||
            "رمز الدخول غير صحيح.",
        );
        return;
      }

      router.replace("/admin");
      router.refresh();
    } catch (error) {
      console.error(
        "Admin login error:",
        error,
      );

      setMessage(
        "حدث خطأ أثناء تسجيل الدخول.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="flex min-h-screen items-center justify-center bg-[#031225] px-4 py-8 text-white"
    >
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-white/10 bg-[#071a31] p-6 shadow-2xl sm:p-8">
          <div className="text-center">
            <p className="text-sm font-bold text-[#e8ad45]">
              المملكة للخدمات المنزلية
            </p>

            <h1 className="mt-3 text-3xl font-black">
              لوحة الإدارة
            </h1>

            <p className="mt-3 text-sm leading-7 text-white/50">
              أدخل رمز الدخول للوصول إلى لوحة
              الإدارة.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-5"
          >
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-white/75">
                رمز الدخول
              </span>

              <input
                type="password"
                value={code}
                onChange={(event) =>
                  setCode(event.target.value)
                }
                autoComplete="current-password"
                placeholder="أدخل رمز الإدارة"
                dir="ltr"
                className="h-13 w-full rounded-2xl border border-white/15 bg-[#031225] px-4 text-center text-base font-bold tracking-widest text-white outline-none transition placeholder:text-white/25 focus:border-[#e8ad45]"
              />
            </label>

            {message && (
              <div className="rounded-2xl border border-red-400/30 bg-red-400/10 px-4 py-3 text-center text-sm font-bold text-red-300">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex h-13 w-full items-center justify-center rounded-2xl bg-[#e8ad45] px-5 text-base font-black text-[#031225] transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "جاري التحقق..."
                : "دخول لوحة الإدارة"}
            </button>
          </form>

          <div className="mt-6 rounded-2xl border border-white/10 bg-[#031225]/70 px-4 py-3 text-center text-xs leading-6 text-white/40">
            هذه الصفحة مخصصة للإدارة فقط.
          </div>
        </div>
      </div>
    </main>
  );
}