import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { config, type Locale } from "@repo/config";

export const routing = defineRouting({
	locales: Object.keys(config.i18n.locales) as readonly Locale[],
	defaultLocale: config.i18n.default,
	localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
	createNavigation(routing);
