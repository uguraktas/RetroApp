"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const ModeToggle = dynamic(() => import("./mode-toggle").then((mod) => ({ default: mod.ModeToggle })), {
  ssr: false,
  loading: () => <div className="h-10 w-10" />,
});

const LanguageSwitcher = dynamic(() => import("./language-switcher"), {
  ssr: false,
  loading: () => <div className="h-10 w-10" />,
});

export function ClientPreferences() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center gap-2">
        <div className="h-10 w-10" />
        <div className="h-10 w-10" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2">
      <LanguageSwitcher />
      <ModeToggle />
    </div>
  );
}
