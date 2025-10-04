import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";
import { config } from "@repo/config";

export const routing = defineRouting({
	locales: config.i18n.supported,
	defaultLocale: config.i18n.default,
	localePrefix: "as-needed",
});

export const { Link, redirect, usePathname, useRouter } =
	createNavigation(routing);
