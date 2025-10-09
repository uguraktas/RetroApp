"use client";

import { AlertTriangle, CreditCard, Shield, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

const settingsNavItems = [
  {
    titleKey: "settings.navigation.general",
    href: "/dashboard/settings/general",
    icon: User,
    descriptionKey: "settings.navigation.generalDescription",
  },
  {
    titleKey: "settings.navigation.security",
    href: "/dashboard/settings/security",
    icon: Shield,
    descriptionKey: "settings.navigation.securityDescription",
  },
  {
    titleKey: "settings.navigation.billing",
    href: "/dashboard/settings/billing",
    icon: CreditCard,
    descriptionKey: "settings.navigation.billingDescription",
  },
  {
    titleKey: "settings.navigation.dangerZone",
    href: "/dashboard/settings/danger-zone",
    icon: AlertTriangle,
    descriptionKey: "settings.navigation.dangerZoneDescription",
  },
] as const;

export function SettingsNavigation() {
  const pathname = usePathname();
  const t = useTranslations();

  return (
    <div className="border-b">
      <nav aria-label="Settings" className="flex space-x-8 overflow-x-auto">
        {settingsNavItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              className={cn(
                "flex items-center gap-2 whitespace-nowrap border-b-2 px-1 py-4 font-medium text-sm transition-colors hover:text-foreground",
                isActive
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground"
              )}
              href={item.href}
              key={item.href}
            >
              <Icon className="h-4 w-4" />
              {t(item.titleKey)}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
