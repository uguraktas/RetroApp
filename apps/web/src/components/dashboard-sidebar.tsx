"use client";

import { config } from "@repo/config";
import {
  AlertTriangle,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  Shield,
  ShieldCheck,
  User,
  X,
} from "lucide-react";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { ClientPreferences } from "./client-preferences";
import { Logo } from "./logo";

interface MenuItem {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
}

export function DashboardSidebar({
  user,
}: {
  user: { name: string; email: string; role?: string | null };
}) {
  const t = useTranslations();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

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
      label: t("sidebar.settings"),
      href: "/dashboard/settings",
      icon: Settings,
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

  const renderMenuItem = (item: MenuItem) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;

    return (
      <Link
        className={cn(
          "flex items-center gap-3 rounded-lg px-3 py-2 font-medium text-sm transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          isActive
            ? "bg-accent text-accent-foreground"
            : "text-muted-foreground"
        )}
        href={item.href}
        key={item.href}
      >
        <Icon className="h-4 w-4 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  };

  const SidebarContent = () => (
    <>
      {/* Logo/Brand */}
      <div className="border-b p-4">
        <Link href="/dashboard">
          <Logo withLabel />
        </Link>
      </div>

      {/* User Info */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex min-w-0 items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-muted font-medium text-xs">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-medium text-sm">{user.name}</p>
              <p className="truncate text-muted-foreground text-xs">
                {user.email}
              </p>
            </div>
          </div>
          <Button
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
            size="sm"
            title={t("sidebar.signOut")}
            variant="ghost"
          >
            <LogOut className="h-3 w-3" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => renderMenuItem(item))}
        </div>

        {/* Theme and Language Controls */}
        <div className="mt-6 border-t pt-4">
          <ClientPreferences />
        </div>
      </nav>
    </>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="fixed top-0 right-0 left-0 z-40 flex items-center justify-between border-b bg-card p-4 lg:hidden">
        <Link href="/dashboard">
          <Logo withLabel />
        </Link>
        <Button
          className="lg:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          size="icon"
          variant="ghost"
        >
          {isMobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
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
      <aside className="hidden w-64 flex-col border-r bg-card lg:flex">
        <SidebarContent />
      </aside>

      {/* Sidebar - Mobile */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 transform flex-col border-r bg-card shadow-xl transition-transform duration-300 ease-in-out lg:hidden",
          isMobileMenuOpen ? "flex translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
