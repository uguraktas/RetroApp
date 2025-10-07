import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { DocsLayoutProps as FumadocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/lib/source";
import Link from "next/link";
import "./docs.css";

const baseOptions: Omit<FumadocsLayoutProps, 'tree' | 'children'> = {
	nav: {
		enabled: true,
		title: (
			<div className="flex items-center gap-2">
				<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-orange-500">
					<span className="font-bold text-primary-foreground">C</span>
				</div>
				<span className="font-bold">codebasehub</span>
			</div>
		),
		transparentMode: "top",
	},
	sidebar: {
		banner: (
			<Link href={"/" as any} className="flex items-center gap-3 px-6 py-4">
				<div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
					<span className="font-bold text-lg text-primary-foreground">C</span>
				</div>
				<div>
					<span className="font-bold text-xl">codebasehub</span>
					<p className="text-muted-foreground text-xs">Documentation</p>
				</div>
			</Link>
		),
		footer: (
			<div className="border-t p-4">
				<div className="rounded-xl border bg-gradient-to-r from-primary/5 via-primary/5 to-orange-500/5 p-4 text-center">
					<p className="font-semibold text-sm">Need Help?</p>
					<p className="text-muted-foreground text-xs mb-3">
						Join our community for support
					</p>
					<Link 
						href="/contact" 
						className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-primary via-primary/90 to-orange-500 px-3 py-2 text-xs font-medium text-primary-foreground transition-all hover:from-primary/90 hover:to-orange-600"
					>
						Get Support
					</Link>
				</div>
			</div>
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
