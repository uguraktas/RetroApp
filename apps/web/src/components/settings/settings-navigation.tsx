"use client";

import { usePathname } from "next/navigation";
import { User, Shield, CreditCard, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";

const settingsNavItems = [
  {
    title: "General",
    href: "/dashboard/settings/general",
    icon: User,
    description: "Update your profile and personal information",
  },
  {
    title: "Security",
    href: "/dashboard/settings/security",
    icon: Shield,
    description: "Manage your password and security settings",
  },
  {
    title: "Billing",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
    description: "Manage your subscription and billing information",
  },
  {
    title: "Danger Zone",
    href: "/dashboard/settings/danger-zone",
    icon: AlertTriangle,
    description: "Delete your account and other irreversible actions",
  },
] as const;

export function SettingsNavigation() {
  const pathname = usePathname();

  return (
    <div className="border-b">
      <nav className="flex space-x-8 overflow-x-auto" aria-label="Settings">
        {settingsNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 text-sm font-medium transition-colors hover:text-foreground",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
