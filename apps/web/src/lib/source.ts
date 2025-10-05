import { docs, meta } from "@/.source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";

const source = createMDXSource(docs, meta);

export const { getPage, getPages, pageTree } = loader({
	baseUrl: "/docs",
	source,
	i18n: {
		languages: ["en", "tr", "ar"],
		defaultLanguage: "en",
	},
});

export const searchAPI = createI18nSearchAPI("advanced", {
	i18n: {
		languages: ["en", "tr", "ar"],
		defaultLanguage: "en",
	},
	indexes: getPages().map((page) => ({
		id: page.url,
		title: page.data.title,
		description: page.data.description,
		structuredData: page.data.structuredData,
		url: page.url,
		locale: page.locale ?? "en",
	})),
});
