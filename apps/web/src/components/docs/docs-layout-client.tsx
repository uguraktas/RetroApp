"use client";

import { type ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "fumadocs-ui/components/sidebar";
import { Sidebar as FumadocsSidebar } from "fumadocs-ui/components/sidebar";

type DocsLayoutClientProps = {
	tree: any;
	children: ReactNode;
};

export function DocsLayoutClient({ tree, children }: DocsLayoutClientProps) {
	if (!tree) {
		return <div className="container mx-auto p-8">{children}</div>;
	}

	return (
		<div className="flex flex-1 flex-col md:flex-row">
			{/* Sidebar */}
			<aside className="w-full md:w-64 border-r border-border">
				<nav className="sticky top-0 h-screen overflow-y-auto p-6">
					<h2 className="mb-4 text-sm font-semibold">Documentation</h2>
					<div className="space-y-1">
						{tree.children?.map((item: any) => (
							<SidebarItem key={item.url || item.name} item={item} />
						))}
					</div>
				</nav>
			</aside>

			{/* Main content */}
			<main className="flex-1 w-full max-w-4xl mx-auto p-8">{children}</main>
		</div>
	);
}

function SidebarItem({ item }: { item: any }) {
	if (item.type === "page") {
		return (
			<a
				href={item.url}
				className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
			>
				{item.name}
			</a>
		);
	}

	if (item.type === "folder") {
		return (
			<div>
				<div className="px-3 py-2 text-xs font-semibold uppercase text-muted-foreground">
					{item.name}
				</div>
				<div className="space-y-1">
					{item.children?.map((child: any) => (
						<SidebarItem key={child.url || child.name} item={child} />
					))}
				</div>
			</div>
		);
	}

	return null;
}
