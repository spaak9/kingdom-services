import { redirect } from "next/navigation";

export default function SupportPage() {
  const message = encodeURIComponent(
    "السلام عليكم، أحتاج الدعم الفني من موقع المملكة للخدمات المنزلية.",
  );

  redirect(`https://wa.me/966598863130?text=${message}`);
}