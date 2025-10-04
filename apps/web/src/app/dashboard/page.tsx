import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import Dashboard from "./dashboard";
import { headers } from "next/headers";

export default async function DashboardPage() {
	const session = await authClient.getSession({
		fetchOptions: {
			headers: await headers(),
		},
	});

	if (!session.data) {
		redirect("/login");
	}

	const { data: customerState, error } = await authClient.customer.state({
		fetchOptions: {
			headers: await headers(),
		},
	});

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			<div className="space-y-8">
				{/* Header */}
				<div className="space-y-2">
					<h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
					<p className="text-xl text-muted-foreground">
						Welcome back, <span className="font-semibold text-foreground">{session.data.user.name}</span>
					</p>
				</div>

				{/* Dashboard Content */}
				<Dashboard session={session.data} customerState={customerState} />
			</div>
		</div>
	);
}
