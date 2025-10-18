import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getLegalPage, getLegalPages } from "@/lib/source";

type PageProps = {
	params: Promise<{ slug?: string[]; locale: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
	const { slug, locale } = await params;
	const page = getLegalPage(slug, locale);

	if (!page) {
		return {
			title: "Legal",
		};
	}

	return {
		title: page.data.title,
		openGraph: {
			title: page.data.title,
		},
	};
}

export default async function LegalPage({ params }: PageProps) {
	const { slug, locale } = await params;
	const page = getLegalPage(slug, locale);

	if (!page) {
		notFound();
	}

	const { title, body: Content } = page.data;

	return (
		<div className="container mx-auto max-w-4xl px-4 pt-32 pb-24">
			<div className="mx-auto mb-12 max-w-3xl">
				<h1 className="text-center font-bold text-4xl">{title}</h1>
			</div>

			<article className="prose prose-neutral dark:prose-invert mx-auto max-w-none">
				<Content />
			</article>
		</div>
	);
}

export async function generateStaticParams() {
	return getLegalPages().map((page) => ({
		slug: page.slugs,
		locale: page.locale,
	}));
}
