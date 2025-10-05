import { pageTree } from "@/lib/source";
import { SidebarClient } from "./sidebar-client";

type SidebarProps = {
	locale: string;
};

export function Sidebar({ locale }: SidebarProps) {
	const tree = pageTree[locale];

	console.log("Sidebar tree for locale:", locale, {
		hasTree: !!tree,
		children: tree?.children?.length,
	});

	if (!tree) {
		return (
			<aside className="w-full md:w-64 border-r border-border bg-card p-6">
				<p className="text-sm text-muted-foreground">
					No documentation tree found for locale: {locale}
				</p>
			</aside>
		);
	}

	return <SidebarClient tree={tree} />;
}
