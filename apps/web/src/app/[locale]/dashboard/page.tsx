import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Dashboard from "./dashboard";

export default async function DashboardPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });
  console.log("🚀 ~ DashboardPage ~ session:", session);

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
          <h1 className="font-bold text-4xl tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-xl">
            Welcome back,{" "}
            <span className="font-semibold text-foreground">
              {session.data.user.name}
            </span>
          </p>
        </div>

        {/* Dashboard Content */}
        <Dashboard customerState={customerState} session={session.data} />
      </div>
    </div>
  );
}
