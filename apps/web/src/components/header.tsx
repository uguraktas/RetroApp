"use client";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";
import { ModeToggle } from "./mode-toggle";
import UserMenu from "./user-menu";
import LanguageSwitcher from "./language-switcher";

export default function Header() {
  const pathname = usePathname();
  const links = [
    { to: "/", label: "Home" },
    { to: "/ai", label: "AI Chat" },
    { to: "/docs", label: "Docs" },
    { to: "/blog", label: "Blog" },
    { to: "/changelog", label: "Changelog" },
    { to: "/contact", label: "Contact" },
  ] as const;

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-8">
            <Link className="flex items-center gap-2" href="/">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <span className="font-bold text-lg text-white">T</span>
              </div>
              <span className="hidden font-semibold text-xl sm:inline-block">
                codebasehub
              </span>
            </Link>
            <nav className="hidden gap-1 md:flex">
              {links.map(({ to, label }) => {
                const isActive = pathname === to;
                return (
                  <Link
                    className={`rounded-md px-4 py-2 font-medium text-sm transition-colors ${
                      isActive
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                    }`}
                    href={to}
                    key={to}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <ModeToggle />
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
}
