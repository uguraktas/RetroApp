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
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-orange-500 shadow-lg">
            <svg className="h-8 w-8 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v1H8V5z" />
            </svg>
          </div>
          <div>
            <h1 className="font-bold text-3xl tracking-tight sm:text-4xl lg:text-5xl">
              Dashboard
            </h1>
            <p className="text-muted-foreground text-lg sm:text-xl">
              Welcome back, {" "}
              <span className="bg-gradient-to-r from-primary to-orange-500 bg-clip-text font-semibold text-transparent">
                {session.data.user.name}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <Dashboard customerState={customerState} session={session.data} />
    </div>
  );
}
