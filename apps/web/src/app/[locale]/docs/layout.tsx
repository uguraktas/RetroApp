import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { BaseLayoutProps } from "fumadocs-ui/layouts/shared";
import { pageTree } from "@/lib/source";
import "./docs.css";

const baseOptions: BaseLayoutProps = {
	nav: {
		enabled: false,
	},
};

type DocsLayoutProps = {
	children: ReactNode;
	params: Promise<{ locale: string }>;
};

export default async function Layout({
	children,
	params,
}: DocsLayoutProps): Promise<React.JSX.Element> {
	const { locale } = await params;

	return (
		<DocsLayout tree={pageTree[locale]} {...baseOptions}>
			{children}
		</DocsLayout>
	);
}
