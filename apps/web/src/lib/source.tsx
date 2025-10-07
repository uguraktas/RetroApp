import { docs, meta, blog, blogMeta } from "@/.source";
import { createI18nSearchAPI } from "fumadocs-core/search/server";
import { loader } from "fumadocs-core/source";
import { createMDXSource } from "fumadocs-mdx";
import {
	BookOpen,
	Rocket,
	Settings,
	Code,
	Smartphone,
	Server,
	Globe,
	Blocks,
	Zap,
	FileCode,
	Box,
	type LucideIcon
} from "lucide-react";

const source = createMDXSource(docs, meta);
const blogSource = createMDXSource(blog, blogMeta);

// Icon mapping for sidebar
const iconMap: Record<string, LucideIcon> = {
	BookOpen,
	Rocket,
	Settings,
	Code,
	Smartphone,
	Server,
	Globe,
	Blocks,
	Zap,
	FileCode,
	Box,
};

export const { getPage, getPages, pageTree } = loader({
	baseUrl: "/docs",
	source,
	i18n: {
		languages: ["en", "tr", "ar"],
		defaultLanguage: "en",
	},
	icon(icon) {
		if (!icon) {
			return;
		}
		if (icon in iconMap) {
			const Icon = iconMap[icon as keyof typeof iconMap];
			return <Icon />;
		}
	},
});

// Blog loader
export const { 
	getPage: getBlogPage, 
	getPages: getBlogPages, 
	pageTree: blogPageTree 
} = loader({
	baseUrl: "/blog",
	source: blogSource,
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

// Blog search API
export const blogSearchAPI = createI18nSearchAPI("blog", {
	i18n: {
		languages: ["en", "tr", "ar"],
		defaultLanguage: "en",
	},
	indexes: getBlogPages().map((page) => ({
		id: page.url,
		title: page.data.title,
		description: page.data.description,
		structuredData: page.data.structuredData,
		url: page.url,
		locale: page.locale ?? "en",
	})),
});
