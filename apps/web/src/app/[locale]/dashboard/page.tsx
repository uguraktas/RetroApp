import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
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

  const { data: customerState } = await authClient.customer.state({
    fetchOptions: {
      headers: await headers(),
    },
  });

  const t = await getTranslations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl">{t("dashboard.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("dashboard.welcomeBack", { name: session.data.user.name })}
        </p>
      </div>

      {/* Dashboard Content */}
      <Dashboard customerState={customerState} session={session.data} />
    </div>
  );
}
