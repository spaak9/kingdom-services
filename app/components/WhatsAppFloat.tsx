"use client";

import { usePathname } from "next/navigation";

export default function WhatsAppFloat() {
  const pathname = usePathname();

  // لا يظهر الواتساب العائم في الصفحة الرئيسية
  if (pathname === "/") {
    return null;
  }

  return (
    <>
      <a
        href="https://wa.me/966598863130"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="احجز معنا الآن عبر واتساب"
        title="احجز معنا الآن"
        dir="ltr"
        className="whatsapp-float group fixed bottom-5 right-4 z-[80] flex items-center gap-2 sm:bottom-6 sm:right-6"
      >
        <span className="whatsapp-label relative overflow-hidden rounded-2xl border border-white/10 bg-[#1b1b1d]/95 px-4 py-3 text-sm font-black text-white shadow-[0_14px_38px_rgba(0,0,0,0.38)] backdrop-blur-xl transition duration-300 group-hover:-translate-y-0.5 group-hover:bg-[#111214] sm:px-5 sm:text-base">
          <span className="whatsapp-shine pointer-events-none absolute inset-y-0 -left-12 w-8 rotate-12 bg-white/20 blur-sm" />

          <span className="relative flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#25D366] shadow-[0_0_12px_rgba(37,211,102,0.95)]" />
            احجز معنا الآن
          </span>
        </span>

        <span className="whatsapp-icon relative flex h-15 w-15 shrink-0 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_14px_38px_rgba(37,211,102,0.42)] transition duration-300 group-hover:scale-110 group-active:scale-95 sm:h-16 sm:w-16">
          <span className="whatsapp-ring absolute inset-0 rounded-full border-2 border-[#25D366]" />

          <svg
            width="31"
            height="31"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            className="relative"
          >
            <path d="M12.04 2a9.83 9.83 0 0 0-8.45 14.84L2 22l5.31-1.54A9.96 9.96 0 1 0 12.04 2Zm0 17.98a8.03 8.03 0 0 1-4.09-1.12l-.29-.17-3.15.91.93-3.06-.19-.31a7.94 7.94 0 1 1 6.79 3.75Zm4.4-5.96c-.24-.12-1.43-.7-1.65-.78-.22-.08-.38-.12-.54.12-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.01-.37-1.92-1.19-.71-.63-1.19-1.41-1.33-1.65-.14-.24-.02-.37.1-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.39 1.37.5.58.18 1.1.16 1.51.1.46-.07 1.43-.58 1.63-1.15.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.46-.28Z" />
          </svg>
        </span>
      </a>

      <style>{`
        @keyframes whatsappFloat {
          0%,
          100% {
            transform: translateY(0);
          }

          50% {
            transform: translateY(-7px);
          }
        }

        @keyframes whatsappLabelIn {
          0% {
            opacity: 0;
            transform: translateX(28px) scale(0.94);
          }

          100% {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes whatsappRing {
          0% {
            opacity: 0.65;
            transform: scale(1);
          }

          75%,
          100% {
            opacity: 0;
            transform: scale(1.45);
          }
        }

        @keyframes whatsappShine {
          0%,
          55% {
            transform: translateX(0) rotate(12deg);
            opacity: 0;
          }

          65% {
            opacity: 1;
          }

          100% {
            transform: translateX(230px) rotate(12deg);
            opacity: 0;
          }
        }

        .whatsapp-float {
          animation: whatsappFloat 3.4s ease-in-out infinite;
        }

        .whatsapp-label {
          animation: whatsappLabelIn 0.75s
            cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        .whatsapp-ring {
          animation: whatsappRing 2.4s ease-out infinite;
        }

        .whatsapp-shine {
          animation: whatsappShine 4.2s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .whatsapp-float,
          .whatsapp-label,
          .whatsapp-ring,
          .whatsapp-shine {
            animation: none !important;
          }
        }
      `}</style>
    </>
  );
}