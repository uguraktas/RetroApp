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
  ShieldCheck,
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
  user: { name: string; email: string; role?: string | null };
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

  const isAdmin = user.role === "admin";

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
    ...(isAdmin
      ? [
          {
            label: t("sidebar.admin"),
            href: "/dashboard/admin",
            icon: ShieldCheck,
          },
        ]
      : []),
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
              "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
              "hover:bg-gradient-to-r hover:from-primary/5 hover:to-orange-500/5 hover:text-primary",
              "group relative",
              pathname.startsWith(item.href) && "bg-gradient-to-r from-primary/10 via-primary/5 to-orange-500/10 text-primary border border-primary/20 shadow-sm"
            )}
          >
            <div className={cn(
              "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
              pathname.startsWith(item.href) 
                ? "bg-gradient-to-br from-primary/20 to-orange-500/20 text-primary" 
                : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary"
            )}>
              <Icon className="h-4 w-4 shrink-0" />
            </div>
            <span className="flex-1 text-left">{item.label}</span>
            {isExpanded ? (
              <ChevronDown className="h-4 w-4 transition-transform text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 transition-transform text-muted-foreground" />
            )}
          </button>

          {isExpanded && (
            <div className="ml-6 mt-2 space-y-1 border-l-2 border-gradient-to-b border-primary/20 pl-4">
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
          "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200",
          "hover:bg-gradient-to-r hover:from-primary/5 hover:to-orange-500/5 hover:text-primary",
          "group relative",
          isActive 
            ? "bg-gradient-to-r from-primary/10 via-primary/5 to-orange-500/10 text-primary border border-primary/20 shadow-sm" 
            : "",
          depth > 0 ? "text-muted-foreground hover:text-foreground" : ""
        )}
      >
        <div className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg transition-colors",
          isActive 
            ? "bg-gradient-to-br from-primary/20 to-orange-500/20 text-primary" 
            : "bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary",
          depth > 0 && "h-6 w-6"
        )}>
          <Icon className={cn("shrink-0", depth > 0 ? "h-3 w-3" : "h-4 w-4")} />
        </div>
        <span>{item.label}</span>
        {isActive && depth === 0 && (
          <div className="absolute right-0 top-1/2 h-4 w-1 -translate-y-1/2 rounded-l bg-gradient-to-b from-primary to-orange-500" />
        )}
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="border-b border-border/50 p-6 bg-gradient-to-r from-background to-muted/20">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg group-hover:scale-105 transition-transform">
            <span className="font-bold text-xl text-primary-foreground">C</span>
          </div>
          <div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
              codebasehub
            </span>
            <p className="text-muted-foreground text-xs -mt-0.5">Dashboard</p>
          </div>
        </Link>
      </div>

      {/* User Profile with Logout */}
      <div className="border-b border-border/50 p-5">
        <div className="relative overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-primary/5 via-background to-orange-500/5 p-4 shadow-sm">
          <div className="absolute -top-6 -right-6 h-16 w-16 rounded-full bg-gradient-to-br from-primary/10 to-orange-500/10" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg border-2 border-white/20">
              <span className="font-bold text-lg text-primary-foreground">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-base">{user.name}</p>
              <p className="truncate text-muted-foreground text-xs">
                {user.email}
              </p>
              {user.role && (
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-md font-medium capitalize">
                  {user.role}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSignOut}
              className="h-10 w-10 shrink-0 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 overflow-auto p-5">
        <div className="space-y-1">
          <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Navigation
          </p>
          {menuItems.map((item) => renderMenuItem(item))}
        </div>
      </nav>

      {/* Settings & Footer */}
      <div className="border-t border-border/50 p-5 bg-gradient-to-r from-muted/10 to-background">
        <div className="space-y-3">
          <p className="px-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Preferences
          </p>
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 flex-1 justify-start gap-2 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-orange-500/5 hover:text-primary">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50">
                    <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                  </div>
                  <span className="text-sm">Theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuItem onClick={() => setTheme("light")} className="gap-2">
                  <Sun className="h-4 w-4" />
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="gap-2">
                  <Moon className="h-4 w-4" />
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="gap-2">
                  <Settings className="h-4 w-4" />
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Language Switcher */}
            {supportedLocales.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 flex-1 justify-start gap-2 rounded-xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-orange-500/5 hover:text-primary"
                    disabled={isPending}
                  >
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-muted/50">
                      <Globe className="h-4 w-4" />
                    </div>
                    <span className="text-sm">Language</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-48">
                  {supportedLocales.map((locale) => {
                    const isActive = currentLocale === locale;
                    return (
                      <DropdownMenuItem
                        key={locale}
                        className={cn("gap-2", isActive && "bg-accent")}
                        onClick={() => handleLocaleChange(locale)}
                      >
                        <div className={cn("h-2 w-2 rounded-full", isActive ? "bg-primary" : "bg-transparent")} />
                        {localeNames[locale as keyof typeof localeNames] || locale.toUpperCase()}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
        
        <div className="mt-4 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-xs">
              CodeBaseHub Dashboard
            </p>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs text-muted-foreground">Online</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between border-b bg-card p-4 lg:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-orange-500">
            <span className="font-bold text-primary-foreground">C</span>
          </div>
          <span className="font-bold">codebasehub</span>
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
