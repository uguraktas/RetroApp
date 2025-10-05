"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type SidebarClientProps = {
	tree: any;
};

export function SidebarClient({ tree }: SidebarClientProps) {
	const pathname = usePathname();

	return (
		<aside className="w-full md:w-64 border-r border-border bg-card">
			<nav className="sticky top-0 max-h-screen overflow-y-auto p-6">
				<h2 className="mb-4 text-sm font-semibold text-muted-foreground">
					Documentation
				</h2>
				<ul className="space-y-2">
					{tree.children?.map((item: any) => {
						if (item.type === "page") {
							const isActive = pathname === item.url;
							return (
								<li key={item.url}>
									<Link
										href={item.url}
										className={`block rounded-md px-3 py-2 text-sm transition-colors ${
											isActive
												? "bg-primary text-primary-foreground"
												: "text-foreground hover:bg-accent hover:text-accent-foreground"
										}`}
									>
										{item.name}
									</Link>
								</li>
							);
						}
						if (item.type === "folder") {
							return (
								<li key={item.name}>
									<div className="mb-2 mt-4 px-3 text-xs font-semibold uppercase text-muted-foreground">
										{item.name}
									</div>
									<ul className="space-y-1">
										{item.children?.map((child: any) => {
											if (child.type === "page") {
												const isActive = pathname === child.url;
												return (
													<li key={child.url}>
														<Link
															href={child.url}
															className={`block rounded-md px-3 py-2 text-sm transition-colors ${
																isActive
																	? "bg-primary text-primary-foreground"
																	: "text-foreground hover:bg-accent hover:text-accent-foreground"
															}`}
														>
															{child.name}
														</Link>
													</li>
												);
											}
											return null;
										})}
									</ul>
								</li>
							);
						}
						return null;
					})}
				</ul>
			</nav>
		</aside>
	);
}
