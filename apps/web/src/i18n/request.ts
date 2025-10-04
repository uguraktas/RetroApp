import { getRequestConfig } from "next-intl/server";
import { getMessagesForLocale } from "@repo/i18n";
import { routing } from "./routing";
import type { Locale } from "@repo/config";

export default getRequestConfig(async ({ requestLocale }) => {
	let locale = await requestLocale;

	if (!locale || !routing.locales.includes(locale as Locale)) {
		locale = routing.defaultLocale;
	}

	return {
		locale,
		messages: await getMessagesForLocale(locale),
	};
});
