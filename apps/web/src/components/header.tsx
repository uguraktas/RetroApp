"use client";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import LanguageSwitcher from "./language-switcher";
import { Logo } from "./logo";
import { ModeToggle } from "./mode-toggle";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import UserMenu from "./user-menu";

const links = [
  { to: "/", labelKey: "header.home", icon: "🏠" },
  { to: "/ai", labelKey: "header.aiChat", icon: "✨" },
  { to: "/docs", labelKey: "header.docs", icon: "📚" },
  { to: "/blog", labelKey: "header.blog", icon: "📝" },
  { to: "/changelog", labelKey: "header.changelog", icon: "🚀" },
  { to: "/contact", labelKey: "header.contact", icon: "📧" },
] as const;

function NavLink({
  to,
  labelKey,
  pathname,
  t,
}: {
  to: string;
  labelKey: string;
  pathname: string;
  t: (key: string) => string;
}) {
  const isActive = pathname === to;
  return (
    <Link
      className={`relative rounded-xl px-4 py-2.5 font-medium text-sm transition-all duration-300 ${
        isActive
          ? "border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-orange-500/10 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-gradient-to-r hover:from-primary/5 hover:to-orange-500/5 hover:text-foreground"
      }`}
      href={to}
    >
      {t(labelKey)}
      {isActive && (
        <div className="-bottom-px -translate-x-1/2 absolute left-1/2 h-0.5 w-8 rounded-full bg-gradient-to-r from-primary to-orange-500" />
      )}
    </Link>
  );
}

export default function Header() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 shadow-sm backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link className="group" href="/">
              <Logo className="sm:hidden" withLabel={false} />
              <Logo
                className="hidden transition-transform group-hover:scale-105 sm:flex"
                withLabel
              />
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden gap-2 lg:flex">
              {links.map(({ to, labelKey }) => (
                <NavLink
                  key={to}
                  labelKey={labelKey}
                  pathname={pathname}
                  t={t}
                  to={to}
                />
              ))}
            </nav>
          </div>

          {/* Right side actions */}
          <div className="flex items-center gap-3">
            {/* Desktop utilities */}
            <div className="hidden items-center gap-3 sm:flex">
              <LanguageSwitcher />
              <ModeToggle />
            </div>
            <UserMenu />

            {/* Mobile menu dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-xl hover:bg-primary/10 lg:hidden"
                  size="icon"
                  variant="ghost"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="mt-2 w-56">
                {/* Mobile navigation */}
                {links.map(({ to, labelKey, icon }) => {
                  const isActive = pathname === to;
                  return (
                    <DropdownMenuItem asChild key={to}>
                      <Link
                        className={`flex w-full items-center gap-3 ${
                          isActive
                            ? "bg-primary/10 font-medium text-primary"
                            : ""
                        }`}
                        href={to}
                      >
                        <span className="text-lg">{icon}</span>
                        {t(labelKey)}
                      </Link>
                    </DropdownMenuItem>
                  );
                })}
                <DropdownMenuSeparator />
                <div className="flex items-center justify-center gap-2 px-3 py-2">
                  <LanguageSwitcher />
                  <ModeToggle />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
