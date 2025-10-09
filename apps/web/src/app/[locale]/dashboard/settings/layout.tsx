import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { SettingsNavigation } from "@/components/settings/settings-navigation";
import { authClient } from "@/lib/auth-client";

export default async function SettingsLayout({
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

  const t = await getTranslations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-semibold text-2xl">{t("settings.title")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("settings.description")}
        </p>
      </div>

      {/* Settings Navigation */}
      <SettingsNavigation />

      {/* Settings Content */}
      <div className="mt-6">{children}</div>
    </div>
  );
}
