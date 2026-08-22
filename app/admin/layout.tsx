import type { ReactNode } from "react";

import { redirect } from "next/navigation";

import { isAdminAuthenticated } from "../lib/admin-auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authenticated =
    await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin-login");
  }

  return children;
}