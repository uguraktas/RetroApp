"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

export function ConditionalFooter() {
  const pathname = usePathname();

  // Hide footer on dashboard and docs pages
  const isDashboard = pathname?.includes("/dashboard");
  const isDocs = pathname?.includes("/docs");

  if (isDashboard || isDocs) {
    return null;
  }

  return <Footer />;
}
