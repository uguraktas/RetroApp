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

  return (
    <div className="space-y-6">
      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Account Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.account")}
                </p>
                <p className="font-medium">{session.user.name}</p>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded bg-muted">
                <span className="font-medium text-xs">
                  {session.user.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.plan")}
                </p>
                <p className="font-medium">
                  {hasProSubscription
                    ? t("dashboard.pro")
                    : t("dashboard.free")}
                </p>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${hasProSubscription ? "bg-green-500" : "bg-gray-300"}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* API Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.apiStatus")}
                </p>
                <p className="font-medium">
                  {privateData.isLoading
                    ? t("dashboard.checking")
                    : privateData.data
                      ? t("dashboard.connected")
                      : t("dashboard.disconnected")}
                </p>
              </div>
              <div
                className={`h-2 w-2 rounded-full ${privateData.data ? "bg-green-500" : "bg-red-500"}`}
              />
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-muted-foreground text-sm">
                  {t("dashboard.activity")}
                </p>
                <p className="font-medium">{t("dashboard.active")}</p>
              </div>
              <div className="h-2 w-2 rounded-full bg-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Subscription Management */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.subscription")}</CardTitle>
              <CardDescription>
                {hasProSubscription
                  ? t("dashboard.manageProSubscription")
                  : t("dashboard.upgradeToUnlock")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasProSubscription ? (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">
                          {t("dashboard.proPlanActive")}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {t("dashboard.proPlanDescription")}
                        </p>
                      </div>
                      <Button
                        onClick={async () => await authClient.customer.portal()}
                        variant="outline"
                      >
                        {t("dashboard.manageSubscription")}
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg border p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">
                          {t("dashboard.unlockProFeatures")}
                        </h3>
                        <p className="text-muted-foreground text-sm">
                          {t("dashboard.unlockProDescription")}
                        </p>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span>{t("dashboard.advancedAiFeatures")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span>{t("dashboard.prioritySupport")}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          <span>{t("dashboard.unlimitedAccess")}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full"
                        onClick={async () =>
                          await authClient.checkout({ slug: "pro" })
                        }
                      >
                        {t("dashboard.upgradeToPro")}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                asChild
                className="w-full justify-start"
                size="sm"
                variant="outline"
              >
                <a href="/ai">{t("dashboard.aiChat")}</a>
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                size="sm"
                variant="outline"
              >
                <a href="/dashboard/settings">{t("dashboard.settings")}</a>
              </Button>
              <Button
                asChild
                className="w-full justify-start"
                size="sm"
                variant="outline"
              >
                <a href="/docs">{t("dashboard.documentation")}</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
