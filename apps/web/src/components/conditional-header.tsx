"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on dashboard and docs pages
  const isDashboard = pathname?.includes("/dashboard");
  const isDocs = pathname?.includes("/docs");

  if (isDashboard || isDocs) {
    return null;
  }

  return <Header />;
}
