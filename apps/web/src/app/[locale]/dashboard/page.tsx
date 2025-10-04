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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg lg:text-xl">
          Welcome back,{" "}
          <span className="font-semibold text-foreground">
            {session.data.user.name}
          </span>
        </p>
      </div>

      {/* Dashboard Content */}
      <Dashboard customerState={customerState} session={session.data} />
    </div>
  );
}
