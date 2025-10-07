import type { ReactNode } from "react";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import type { DocsLayoutProps as FumadocsLayoutProps } from "fumadocs-ui/layouts/docs";
import { pageTree } from "@/lib/source";
import Link from "next/link";
import { Logo } from "@/components/logo";
import "./docs.css";

const baseOptions: Omit<FumadocsLayoutProps, 'tree' | 'children'> = {
	nav: {
		enabled: true,
		title: <Logo withLabel />,
		transparentMode: "top",
	},
	sidebar: {
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
