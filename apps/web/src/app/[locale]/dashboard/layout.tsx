import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { DashboardSidebar } from "@/components/dashboard-sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    redirect("/login");
  }

  return (
    <div className="fixed inset-0 flex overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar user={session.data.user} />

      {/* Main content */}
      <main className="flex flex-1 flex-col overflow-hidden pt-16 lg:pt-0">
        <div className="flex-1 overflow-y-auto bg-muted/30">
          <div className="container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
