"use client";

import Link from "next/link";
import type { FormEvent } from "react";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  cities,
  citySlugs,
  services,
  serviceSlugs,
  type CitySlug,
  type ServiceSlug,
} from "../lib/service-data";

type AdminSection =
  | "contacts"
  | "maps"
  | "visibility";

type ServiceContact = {
  id?: number;
  service_slug: ServiceSlug;
  city_slug: CitySlug;
  phone_number: string;
  whatsapp_number: string;
  google_maps_url: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

type FormData = {
  box_one: string;
  box_two: string;
  google_maps_url: string;
  is_active: boolean;
};

const emptyForm: FormData = {
  box_one: "",
  box_two: "",
  google_maps_url: "",
  is_active: true,
};

export default function AdminPage() {
  useEffect(() => {
    window.history.replaceState(
      {},
      "",
      "/admin",
    );
  }, []);

  const [activeSection, setActiveSection] =
    useState<AdminSection>("contacts");

  const [serviceSlug, setServiceSlug] =
    useState<ServiceSlug>("plumbing");

  const [citySlug, setCitySlug] =
    useState<CitySlug>("riyadh");

  const [contacts, setContacts] = useState<
    ServiceContact[]
  >([]);

  const [form, setForm] =
    useState<FormData>(emptyForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<
    "success" | "error" | ""
  >("");

  const [siteWhatsApp, setSiteWhatsApp] =
    useState("966598863130");
  const [siteSaving, setSiteSaving] =
    useState(false);
  const [siteMessage, setSiteMessage] =
    useState("");
  const [siteMessageType, setSiteMessageType] =
    useState<"success" | "error" | "">("");

  const [currentAdminCode, setCurrentAdminCode] =
    useState("");
  const [newAdminCode, setNewAdminCode] =
    useState("");
  const [confirmAdminCode, setConfirmAdminCode] =
    useState("");
  const [passwordSaving, setPasswordSaving] =
    useState(false);
  const [passwordMessage, setPasswordMessage] =
    useState("");
  const [passwordMessageType, setPasswordMessageType] =
    useState<"success" | "error" | "">("");

  const selectedContact = useMemo(() => {
    return contacts.find(
      (contact) =>
        contact.service_slug === serviceSlug &&
        contact.city_slug === citySlug,
    );
  }, [contacts, serviceSlug, citySlug]);

  const loadContacts = useCallback(async () => {
    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        "/api/admin/service-contacts",
        {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        },
      );

      const result = (await response.json()) as {
        message?: string;
        contacts?: ServiceContact[];
      };

      /*
       * مهم:
       * لا نرجع المستخدم للرئيسية إذا كان API يرجع 401.
       * نخلي لوحة الإدارة مفتوحة ونظهر الخطأ للمستخدم.
       */
      if (response.status === 401) {
        throw new Error(
          result.message ||
            "الجلسة غير صالحة أو لم يتم التعرف على تسجيل الدخول.",
        );
      }

      if (!response.ok) {
        throw new Error(
          result.message ||
            "تعذر تحميل بيانات الخدمات.",
        );
      }

      setContacts(result.contacts ?? []);
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحميل البيانات.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadContacts();
  }, [loadContacts]);

  useEffect(() => {
    async function loadSiteSettings() {
      try {
        const response = await fetch(
          "/api/site-settings",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          return;
        }

        const result =
          (await response.json()) as {
            whatsapp_number?: string;
          };

        if (result.whatsapp_number) {
          setSiteWhatsApp(
            result.whatsapp_number,
          );
        }
      } catch (error) {
        console.error(
          "Failed to load site settings:",
          error,
        );
      }
    }

    void loadSiteSettings();
  }, []);

  useEffect(() => {
    if (selectedContact) {
      setForm({
        box_one:
          selectedContact.whatsapp_number ?? "",
        box_two:
          selectedContact.phone_number ?? "",
        google_maps_url:
          selectedContact.google_maps_url ?? "",
        is_active:
          selectedContact.is_active ?? true,
      });
    } else {
      setForm(emptyForm);
    }

    setMessage("");
    setMessageType("");
  }, [
    selectedContact,
    serviceSlug,
    citySlug,
  ]);

  function changeSection(section: AdminSection) {
    setActiveSection(section);
    setMessage("");
    setMessageType("");
  }

  async function saveData(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setMessageType("");

    try {
      const response = await fetch(
        "/api/admin/service-contacts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            service_slug: serviceSlug,
            city_slug: citySlug,

            // الصندوق الأول = واتساب
            whatsapp_number: form.box_one,

            // الصندوق الثاني = اتصال
            phone_number: form.box_two,

            google_maps_url:
              form.google_maps_url,

            is_active: form.is_active,
          }),
        },
      );

      const result = (await response.json()) as {
        message?: string;
        contact?: ServiceContact;
      };

      /*
       * لا نرجع للرئيسية عند 401.
       * نظهر السبب داخل لوحة الإدارة.
       */
      if (response.status === 401) {
        throw new Error(
          result.message ||
            "الجلسة غير صالحة أو لم يتم التعرف على تسجيل الدخول.",
        );
      }

      if (!response.ok || !result.contact) {
        throw new Error(
          result.message ||
            "تعذر حفظ البيانات.",
        );
      }

      setContacts((currentContacts) => {
        const contactExists =
          currentContacts.some(
            (contact) =>
              contact.service_slug ===
                result.contact?.service_slug &&
              contact.city_slug ===
                result.contact?.city_slug,
          );

        if (contactExists) {
          return currentContacts.map((contact) =>
            contact.service_slug ===
                result.contact?.service_slug &&
            contact.city_slug ===
                result.contact?.city_slug
              ? result.contact!
              : contact,
          );
        }

        return [
          ...currentContacts,
          result.contact!,
        ];
      });

      setMessageType("success");
      setMessage(
        result.message ||
          "تم حفظ البيانات بنجاح.",
      );
    } catch (error) {
      setMessageType("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء حفظ البيانات.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function saveSiteSettings(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSiteSaving(true);
    setSiteMessage("");
    setSiteMessageType("");

    try {
      const response = await fetch(
        "/api/site-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            whatsapp_number: siteWhatsApp,
          }),
        },
      );

      const result =
        (await response.json()) as {
          ok?: boolean;
          message?: string;
          whatsapp_number?: string;
        };

      if (!response.ok || !result.ok) {
        throw new Error(
          result.message ||
            "تعذر تحديث رقم الواتساب.",
        );
      }

      if (result.whatsapp_number) {
        setSiteWhatsApp(
          result.whatsapp_number,
        );
      }

      setSiteMessageType("success");
      setSiteMessage(
        result.message ||
          "تم تحديث رقم الواتساب.",
      );
    } catch (error) {
      setSiteMessageType("error");
      setSiteMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تحديث رقم الواتساب.",
      );
    } finally {
      setSiteSaving(false);
    }
  }

  async function changeAdminPassword(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordMessageType("");

    if (newAdminCode !== confirmAdminCode) {
      setPasswordMessageType("error");
      setPasswordMessage(
        "الرمز الجديد وتأكيد الرمز غير متطابقين.",
      );
      return;
    }

    setPasswordSaving(true);

    try {
      const response = await fetch(
        "/api/admin/change-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            current_code: currentAdminCode,
            new_code: newAdminCode,
            confirm_code: confirmAdminCode,
          }),
        },
      );

      const result =
        (await response.json()) as {
          ok?: boolean;
          message?: string;
        };

      if (!response.ok || !result.ok) {
        throw new Error(
          result.message ||
            "تعذر تغيير رمز الإدارة.",
        );
      }

      setPasswordMessageType("success");
      setPasswordMessage(
        result.message ||
          "تم تغيير رمز الإدارة.",
      );

      setCurrentAdminCode("");
      setNewAdminCode("");
      setConfirmAdminCode("");

      window.setTimeout(() => {
        window.location.replace(
          "/admin-login",
        );
      }, 700);
    } catch (error) {
      setPasswordMessageType("error");
      setPasswordMessage(
        error instanceof Error
          ? error.message
          : "حدث خطأ أثناء تغيير رمز الإدارة.",
      );
    } finally {
      setPasswordSaving(false);
    }
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-[#031225] px-4 py-6 text-white sm:py-8"
    >
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-[#071a31] p-5 shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-[#e8ad45]">
              المملكة للخدمات المنزلية
            </p>

            <h1 className="mt-2 text-3xl font-black">
              لوحة الإدارة
            </h1>
          </div>

          <div className="flex gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex h-11 flex-1 items-center justify-center rounded-xl border border-white/10 px-4 text-sm font-bold text-white/70 transition hover:border-white/25 hover:text-white sm:flex-none"
            >
              عرض الموقع
            </Link>

            <form
              action="/api/admin/logout"
              method="post"
              className="flex-1 sm:flex-none"
            >
              <button
                type="submit"
                className="flex h-11 w-full items-center justify-center rounded-xl bg-[#e8ad45] px-4 text-sm font-black text-[#031225] transition hover:brightness-110 active:scale-95"
              >
                تسجيل الخروج
              </button>
            </form>
          </div>
        </header>

        {/* Sections */}
        <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <AdminSectionButton
            active={activeSection === "contacts"}
            icon="▣"
            title="الصندوقان"
            description="نص عادي أو رقم واتساب واتصال."
            onClick={() =>
              changeSection("contacts")
            }
          />

          <AdminSectionButton
            active={activeSection === "maps"}
            icon="⌖"
            title="الموقع"
            description="رابط موقع Google Maps."
            onClick={() =>
              changeSection("maps")
            }
          />

          <AdminSectionButton
            active={
              activeSection === "visibility"
            }
            icon="◉"
            title="الظهور"
            description="إظهار أو إخفاء البيانات."
            onClick={() =>
              changeSection("visibility")
            }
          />
        </section>

        {/* Main form */}
        <form
          onSubmit={saveData}
          className="mt-6 overflow-hidden rounded-3xl border border-[#e8ad45]/20 bg-[#081d37] shadow-2xl"
        >
          <div className="border-b border-white/10 p-5 sm:p-6">
            <h2 className="text-xl font-black text-[#e8ad45]">
              {activeSection === "contacts" &&
                "الصندوق الأول والصندوق الثاني"}

              {activeSection === "maps" &&
                "رابط الموقع في Google Maps"}

              {activeSection === "visibility" &&
                "التحكم في ظهور البيانات"}
            </h2>

            <p className="mt-2 text-sm leading-7 text-white/55">
              اختر الخدمة والمدينة ثم أدخل
              البيانات واضغط حفظ.
            </p>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {/* Service + City */}
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-white/75">
                  الخدمة
                </span>

                <select
                  value={serviceSlug}
                  onChange={(event) =>
                    setServiceSlug(
                      event.target
                        .value as ServiceSlug,
                    )
                  }
                  className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-sm text-white outline-none transition focus:border-[#e8ad45]"
                >
                  {serviceSlugs.map(
                    (serviceItem) => (
                      <option
                        key={serviceItem}
                        value={serviceItem}
                      >
                        {
                          services[serviceItem]
                            .name
                        }
                      </option>
                    ),
                  )}
                </select>
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-bold text-white/75">
                  المدينة
                </span>

                <select
                  value={citySlug}
                  onChange={(event) =>
                    setCitySlug(
                      event.target
                        .value as CitySlug,
                    )
                  }
                  className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-sm text-white outline-none transition focus:border-[#e8ad45]"
                >
                  {citySlugs.map((cityItem) => (
                    <option
                      key={cityItem}
                      value={cityItem}
                    >
                      {cities[cityItem].name} —{" "}
                      {cities[cityItem].region}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            {/* Loading */}
            {loading ? (
              <div className="rounded-2xl border border-white/10 bg-[#031225] p-5 text-center text-sm text-white/55">
                جاري تحميل البيانات...
              </div>
            ) : (
              <>
                {/* Contacts */}
                {activeSection ===
                  "contacts" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-white/75">
                        الصندوق الأول
                      </span>

                      <input
                        type="text"
                        value={form.box_one}
                        onChange={(event) =>
                          setForm(
                            (current) => ({
                              ...current,
                              box_one:
                                event.target.value,
                            }),
                          )
                        }
                        maxLength={120}
                        placeholder="رقم واتساب أو عبارة مثل: للإيجار"
                        className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-right text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
                      />

                      <p className="mt-2 text-xs leading-6 text-white/40">
                        لو كتبت رقمًا يصير رابط
                        واتساب. لو كتبت كلامًا يظهر
                        كلام فقط بدون ضغط.
                      </p>
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-bold text-white/75">
                        الصندوق الثاني
                      </span>

                      <input
                        type="text"
                        value={form.box_two}
                        onChange={(event) =>
                          setForm(
                            (current) => ({
                              ...current,
                              box_two:
                                event.target.value,
                            }),
                          )
                        }
                        maxLength={120}
                        placeholder="رقم اتصال أو عبارة مثل: غير متاح"
                        className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-right text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
                      />

                      <p className="mt-2 text-xs leading-6 text-white/40">
                        لو كتبت رقمًا يصير اتصالًا
                        مباشرًا. لو كتبت كلامًا يظهر
                        كلام فقط بدون ضغط.
                      </p>
                    </label>
                  </div>
                )}

                {/* Google Maps */}
                {activeSection === "maps" && (
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-white/75">
                      رابط Google Maps
                    </span>

                    <input
                      type="url"
                      value={
                        form.google_maps_url
                      }
                      onChange={(event) =>
                        setForm((current) => ({
                          ...current,
                          google_maps_url:
                            event.target.value,
                        }))
                      }
                      placeholder="https://maps.app.goo.gl/..."
                      dir="ltr"
                      className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-left text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
                    />

                    <p className="mt-2 text-xs leading-6 text-white/40">
                      افتح الموقع في خرائط Google
                      واضغط مشاركة ثم انسخ الرابط.
                    </p>
                  </label>
                )}

                {/* Visibility */}
                {activeSection ===
                  "visibility" && (
                  <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-[#031225] p-5">
                    <div>
                      <h3 className="font-black">
                        إظهار البيانات
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-white/50">
                        عند إيقافها لن يظهر
                        الصندوقان ولا الموقع للزوار.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setForm(
                          (current) => ({
                            ...current,
                            is_active:
                              !current.is_active,
                          }),
                        )
                      }
                      aria-pressed={
                        form.is_active
                      }
                      className={`relative h-8 w-16 shrink-0 rounded-full transition duration-300 ${
                        form.is_active
                          ? "bg-[#e8ad45]"
                          : "bg-white/15"
                      }`}
                    >
                      <span
                        className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all duration-300 ${
                          form.is_active
                            ? "right-9"
                            : "right-1"
                        }`}
                      />
                    </button>
                  </div>
                )}

                {/* Existing data */}
                <div className="rounded-2xl border border-white/10 bg-[#031225]/70 px-4 py-3 text-xs leading-6 text-white/45">
                  {selectedContact
                    ? "توجد بيانات محفوظة لهذه الخدمة والمدينة، وسيتم تعديلها عند الحفظ."
                    : "لا توجد بيانات محفوظة لهذه الخدمة والمدينة، وسيتم إنشاؤها عند الحفظ."}
                </div>
              </>
            )}

            {/* Message */}
            {message && (
              <div
                className={`rounded-2xl border px-4 py-3 text-sm font-bold ${
                  messageType === "success"
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {message}
              </div>
            )}

            {/* Save */}
            <button
              type="submit"
              disabled={saving || loading}
              className="flex h-12 w-full items-center justify-center rounded-2xl bg-[#e8ad45] px-5 text-base font-black text-[#031225] transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "جاري الحفظ..."
                : "حفظ البيانات"}
            </button>
          </div>
        </form>

        {/* General site settings */}
        <section className="mt-6 grid gap-6 lg:grid-cols-2">
          <form
            onSubmit={saveSiteSettings}
            className="rounded-3xl border border-white/10 bg-[#071a31] p-5 shadow-2xl sm:p-6"
          >
            <p className="text-sm font-bold text-[#e8ad45]">
              إعدادات الموقع
            </p>

            <h2 className="mt-2 text-xl font-black">
              رقم واتساب الموقع
            </h2>

            <p className="mt-2 text-sm leading-7 text-white/50">
              هذا الرقم يستخدم في زر واتساب العام بالموقع.
            </p>

            <label className="mt-5 block">
              <span className="mb-2 block text-sm font-bold text-white/75">
                رقم الواتساب
              </span>

              <input
                type="tel"
                value={siteWhatsApp}
                onChange={(event) =>
                  setSiteWhatsApp(
                    event.target.value,
                  )
                }
                dir="ltr"
                inputMode="tel"
                placeholder="9665XXXXXXXX"
                className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-left text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
              />
            </label>

            {siteMessage && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
                  siteMessageType === "success"
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {siteMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={siteSaving}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-[#25D366] px-5 text-base font-black text-[#031225] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {siteSaving
                ? "جاري الحفظ..."
                : "حفظ رقم الواتساب"}
            </button>
          </form>

          <form
            onSubmit={changeAdminPassword}
            className="rounded-3xl border border-white/10 bg-[#071a31] p-5 shadow-2xl sm:p-6"
          >
            <p className="text-sm font-bold text-[#e8ad45]">
              أمان لوحة الإدارة
            </p>

            <h2 className="mt-2 text-xl font-black">
              تغيير رمز الإدارة
            </h2>

            <p className="mt-2 text-sm leading-7 text-white/50">
              بعد التغيير سيتم تسجيل خروجك، ثم تدخل بالرمز الجديد.
            </p>

            <div className="mt-5 space-y-4">
              <input
                type="password"
                value={currentAdminCode}
                onChange={(event) =>
                  setCurrentAdminCode(
                    event.target.value,
                  )
                }
                autoComplete="current-password"
                placeholder="الرمز الحالي"
                dir="ltr"
                className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-center text-sm font-bold tracking-widest text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
              />

              <input
                type="password"
                value={newAdminCode}
                onChange={(event) =>
                  setNewAdminCode(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="الرمز الجديد"
                dir="ltr"
                className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-center text-sm font-bold tracking-widest text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
              />

              <input
                type="password"
                value={confirmAdminCode}
                onChange={(event) =>
                  setConfirmAdminCode(
                    event.target.value,
                  )
                }
                autoComplete="new-password"
                placeholder="تأكيد الرمز الجديد"
                dir="ltr"
                className="h-12 w-full rounded-xl border border-white/15 bg-[#031225] px-4 text-center text-sm font-bold tracking-widest text-white outline-none transition placeholder:text-white/30 focus:border-[#e8ad45]"
              />
            </div>

            {passwordMessage && (
              <div
                className={`mt-4 rounded-2xl border px-4 py-3 text-sm font-bold ${
                  passwordMessageType === "success"
                    ? "border-green-400/30 bg-green-400/10 text-green-300"
                    : "border-red-400/30 bg-red-400/10 text-red-300"
                }`}
              >
                {passwordMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={passwordSaving}
              className="mt-5 flex h-12 w-full items-center justify-center rounded-2xl bg-[#e8ad45] px-5 text-base font-black text-[#031225] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passwordSaving
                ? "جاري التغيير..."
                : "تغيير رمز الإدارة"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

function AdminSectionButton({
  active,
  icon,
  title,
  description,
  onClick,
}: {
  active: boolean;
  icon: string;
  title: string;
  description: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex min-h-[145px] w-full flex-col items-center justify-center rounded-3xl border p-5 text-center transition duration-300 active:scale-[0.98] ${
        active
          ? "border-[#e8ad45] bg-[#e8ad45]/10 shadow-[0_15px_45px_rgba(232,173,69,0.12)]"
          : "border-white/10 bg-[#071a31] hover:-translate-y-1 hover:border-[#e8ad45]/40"
      }`}
    >
      <span
        className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl transition duration-300 ${
          active
            ? "rotate-3 bg-[#e8ad45] text-[#031225]"
            : "bg-white/5 text-[#e8ad45] group-hover:rotate-6"
        }`}
      >
        {icon}
      </span>

      <h2 className="mt-3 text-lg font-black">
        {title}
      </h2>

      <p className="mt-2 text-xs leading-6 text-white/50">
        {description}
      </p>
    </button>
  );
}