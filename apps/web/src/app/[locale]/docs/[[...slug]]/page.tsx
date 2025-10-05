import { getPage, getPages } from "@/lib/source";
import type { Metadata } from "next";
import { DocsPage, DocsBody } from "fumadocs-ui/page";
import { notFound } from "next/navigation";

type PageProps = {
	params: Promise<{ slug?: string[]; locale: string }>;
};

export default async function Page({ params }: PageProps) {
	const { slug, locale } = await params;
	const page = getPage(slug, locale);

	if (!page) {
		notFound();
	}

	const MDX = page.data.body;

	return (
		<DocsPage toc={page.data.toc} full={page.data.full}>
			<DocsBody>
				<h1>{page.data.title}</h1>
				{page.data.description && <p>{page.data.description}</p>}
				<MDX />
			</DocsBody>
		</DocsPage>
	);
}

export async function generateStaticParams() {
	return getPages().map((page) => ({
		slug: page.slugs,
		locale: page.locale,
	}));
}

export async function generateMetadata({
	params,
}: PageProps): Promise<Metadata> {
	const { slug, locale } = await params;
	const page = getPage(slug, locale);

	if (!page) {
		notFound();
	}

	return {
		title: page.data.title,
		description: page.data.description,
	};
}
