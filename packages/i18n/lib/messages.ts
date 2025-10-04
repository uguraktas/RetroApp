import { config } from "@repo/config";
import deepmerge from "deepmerge";
import type { Messages } from "../types";

export const importLocale = async (locale: string): Promise<Messages> => {
	return (await import(`../translations/${locale}.json`)).default as Messages;
};

export const getMessagesForLocale = async (
	locale: string,
): Promise<Messages> => {
	const localeMessages = await importLocale(locale);
	if (locale === config.i18n.default) {
		return localeMessages;
	}
	const defaultLocaleMessages = await importLocale(config.i18n.default);
	return deepmerge(defaultLocaleMessages, localeMessages);
};
