"use client";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { trpc } from "@/utils/trpc";

export default function Dashboard({
  customerState,
  session,
}: {
  customerState: ReturnType<typeof authClient.customer.state>;
  session: typeof authClient.$Infer.Session;
}) {
  const t = useTranslations();
  const privateData = useQuery(trpc.privateData.queryOptions());

  const hasProSubscription = customerState?.activeSubscriptions?.length! > 0;
  console.log("Active subscriptions:", customerState?.activeSubscriptions);

  return (
    <div className="grid gap-4 sm:gap-6">
      {/* Account Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {/* User Info Card */}
        <Card className="border-2 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              {t("dashboard.account")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                  <span className="font-semibold text-lg text-white">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{session.user.name}</p>
                  <p className="truncate text-muted-foreground text-sm">
                    {session.user.email}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card
          className={`border-2 shadow-sm transition-shadow hover:shadow-md ${hasProSubscription ? "border-purple-500/50 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20" : ""}`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              {t("dashboard.currentPlan")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {hasProSubscription ? (
                  <>
                    <span className="text-2xl">⭐</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text font-bold text-2xl text-transparent">
                      {t("dashboard.pro")}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🆓</span>
                    <span className="font-bold text-2xl">{t("dashboard.free")}</span>
                  </>
                )}
              </div>
              {hasProSubscription && (
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.premiumEnabled")}
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Status Card */}
        <Card className="border-2 shadow-sm transition-shadow hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
              {t("dashboard.apiStatus")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${privateData.data ? "animate-pulse bg-green-500 shadow-lg shadow-green-500/50" : "bg-red-500"}`}
                />
                <span className="font-semibold">
                  {privateData.isLoading
                    ? t("dashboard.checking")
                    : privateData.data
                      ? t("dashboard.connected")
                      : t("dashboard.disconnected")}
                </span>
              </div>
              {privateData.data && (
                <p className="text-muted-foreground text-sm">
                  {privateData.data.message}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscription Management */}
      <Card className="border-2 shadow-sm">
        <CardHeader>
          <CardTitle>{t("dashboard.subscription.title")}</CardTitle>
          <CardDescription>
            {hasProSubscription
              ? t("dashboard.subscription.proDescription")
              : t("dashboard.subscription.freeDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasProSubscription ? (
            <div className="space-y-4">
              <div className="rounded-xl border bg-gradient-to-r from-purple-50 to-blue-50 p-6 shadow-sm dark:from-purple-950/30 dark:to-blue-950/30">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-lg">
                      {t("dashboard.subscription.proActive")}
                    </p>
                    <p className="text-muted-foreground text-sm">
                      {t("dashboard.subscription.proActiveDesc")}
                    </p>
                  </div>
                  <Button
                    onClick={async () => await authClient.customer.portal()}
                    variant="outline"
                    className="shrink-0"
                  >
                    {t("dashboard.subscription.manageSubscription")}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-xl border bg-gradient-to-r from-blue-50 to-purple-50 p-6 shadow-sm dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="space-y-6">
                  <div>
                    <h3 className="mb-4 font-semibold text-xl">
                      {t("dashboard.subscription.unlockPro")}
                    </h3>
                    <ul className="space-y-3 text-muted-foreground text-sm">
                      <li className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                          <span className="font-bold text-green-600 text-lg">✓</span>
                        </div>
                        <span className="text-foreground">
                          {t("dashboard.subscription.features.advancedAi")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                          <span className="font-bold text-green-600 text-lg">✓</span>
                        </div>
                        <span className="text-foreground">
                          {t("dashboard.subscription.features.prioritySupport")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                          <span className="font-bold text-green-600 text-lg">✓</span>
                        </div>
                        <span className="text-foreground">
                          {t("dashboard.subscription.features.unlimitedAccess")}
                        </span>
                      </li>
                      <li className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10">
                          <span className="font-bold text-green-600 text-lg">✓</span>
                        </div>
                        <span className="text-foreground">
                          {t("dashboard.subscription.features.regularUpdates")}
                        </span>
                      </li>
                    </ul>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] hover:from-blue-600 hover:to-purple-700 hover:shadow-xl hover:shadow-purple-500/30 sm:w-auto"
                    onClick={async () =>
                      await authClient.checkout({ slug: "pro" })
                    }
                    size="lg"
                  >
                    {t("dashboard.subscription.upgradeToPro")}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
