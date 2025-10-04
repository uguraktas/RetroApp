"use client";

import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useTransition, useEffect } from "react";
import {
  LayoutDashboard,
  Settings,
  User,
  Shield,
  CreditCard,
  AlertTriangle,
  ChevronDown,
  ChevronRight,
  LogOut,
  Moon,
  Sun,
  Globe,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { config } from "@repo/config";
import { useRouter, usePathname, Link } from "@/i18n/routing";

interface MenuItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
  subItems?: MenuItem[];
}

export function DashboardSidebar({
  user,
}: {
  user: { name: string; email: string };
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [expandedItems, setExpandedItems] = useState<string[]>([
    "account-settings",
  ]);
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const currentLocale = (params.locale as string) || config.i18n.default;
  const supportedLocales = Object.keys(config.i18n.locales);
  const localeNames = config.i18n.locales;

  const toggleExpanded = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  const handleLocaleChange = (locale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale });
    });
  };

  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  const menuItems: MenuItem[] = [
    {
      label: t("sidebar.overview"),
      href: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      label: t("sidebar.accountSettings"),
      href: "/dashboard/settings",
      icon: Settings,
      subItems: [
        {
          label: t("sidebar.general"),
          href: "/dashboard/settings/general",
          icon: User,
        },
        {
          label: t("sidebar.security"),
          href: "/dashboard/settings/security",
          icon: Shield,
        },
        {
          label: t("sidebar.billing"),
          href: "/dashboard/settings/billing",
          icon: CreditCard,
        },
        {
          label: t("sidebar.dangerZone"),
          href: "/dashboard/settings/danger-zone",
          icon: AlertTriangle,
        },
      ],
    },
  ];

  const renderMenuItem = (item: MenuItem, depth = 0) => {
    const isActive = pathname === item.href;
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const Icon = item.icon;

    if (hasSubItems) {
      return (
        <div key={item.label}>
          <button
            type="button"
            onClick={() => toggleExpanded(item.label)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
              "hover:bg-accent/80 hover:text-accent-foreground",
              isActive && "bg-accent text-accent-foreground"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 transition-transform" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-4 mt-1 space-y-1 border-l-2 border-muted pl-4">
              {item.subItems?.map((subItem) => renderMenuItem(subItem, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
          "hover:bg-accent/80 hover:text-accent-foreground",
          isActive && "bg-accent text-accent-foreground shadow-sm",
          depth > 0 && "text-muted-foreground hover:text-foreground"
        )}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="border-b p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="font-bold text-lg text-white">C</span>
          </div>
          <span className="font-bold text-lg">CodeBaseHub</span>
        </Link>
      </div>

      {/* User Profile with Logout */}
      <div className="border-b p-4">
        <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="font-semibold text-sm text-white">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold text-sm">{user.name}</p>
            <p className="truncate text-muted-foreground text-xs">
              {user.email}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSignOut}
            className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
            title={t("navigation.signOut")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-auto p-4">
        {menuItems.map((item) => renderMenuItem(item))}
      </nav>

      {/* Settings & Footer */}
      <div className="border-t p-4">
        <div className="mb-4 flex items-center justify-center gap-2">
          {/* Theme Toggle */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setTheme("light")}>
                {t("sidebar.light")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("dark")}>
                {t("sidebar.dark")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme("system")}>
                {t("sidebar.system")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Language Switcher */}
          {supportedLocales.length > 1 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  disabled={isPending}
                >
                  <Globe className="h-4 w-4" />
                  <span className="sr-only">Select language</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {supportedLocales.map((locale) => {
                  const isActive = currentLocale === locale;
                  return (
                    <DropdownMenuItem
                      key={locale}
                      className={isActive ? "bg-accent" : ""}
                      onClick={() => handleLocaleChange(locale)}
                    >
                      {localeNames[locale as keyof typeof localeNames] || locale.toUpperCase()}
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <p className="text-center text-muted-foreground text-xs">
          {t("sidebar.footer")}
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b bg-card p-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <span className="font-bold text-white">C</span>
          </div>
          <span className="font-bold">CodeBaseHub</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="lg:hidden"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </Button>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Desktop */}
      <aside className="hidden w-72 flex-col border-r bg-card shadow-sm lg:flex">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 transform flex-col border-r bg-card shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "translate-x-0 flex" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
