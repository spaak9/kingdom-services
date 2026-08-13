import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "../lib/admin-auth";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/");
  }

  return children;
}