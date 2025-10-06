import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { DocsLayoutProps as FumadocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/lib/source";
import Link from "next/link";
import "./docs.css";

const baseOptions: Omit<FumadocsLayoutProps, 'tree' | 'children'> = {
	nav: {
		enabled: false,
	},
	sidebar: {
		banner: (
			<Link href={"/" as any} className="flex items-center gap-2 px-4 py-3">
				<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
					<span className="font-bold text-lg text-white">C</span>
				</div>
				<span className="font-bold text-lg">CodeBaseHub</span>
			</Link>
		),
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
