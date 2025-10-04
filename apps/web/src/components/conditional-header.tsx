"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";

export function ConditionalHeader() {
  const pathname = usePathname();

  // Hide header on dashboard pages
  const isDashboard = pathname?.includes("/dashboard");

  if (isDashboard) {
    return null;
  }

  return <Header />;
}
