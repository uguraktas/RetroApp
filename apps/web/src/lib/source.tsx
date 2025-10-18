import { docs, meta, blog, blogMeta, legal, legalMeta } from "@/.source";
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
	Scale,
	Shield,
	type LucideIcon
} from "lucide-react";

const source = createMDXSource(docs, meta);
const blogSource = createMDXSource(blog, blogMeta);
const legalSource = createMDXSource(legal, legalMeta);

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
	Scale,
	Shield,
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
export const blogSearchAPI = createI18nSearchAPI("advanced", {
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

// Legal loader
export const {
	getPage: getLegalPage,
	getPages: getLegalPages,
	pageTree: legalPageTree
} = loader({
	baseUrl: "/legal",
	source: legalSource,
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

// Legal search API
export const legalSearchAPI = createI18nSearchAPI("advanced", {
	i18n: {
		languages: ["en", "tr", "ar"],
		defaultLanguage: "en",
	},
	indexes: getLegalPages().map((page) => ({
		id: page.url,
		title: page.data.title,
		description: page.data.description,
		structuredData: page.data.structuredData,
		url: page.url,
		locale: page.locale ?? "en",
	})),
});
