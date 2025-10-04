"use client";

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

export function BillingSettings({
  customerState,
}: {
  customerState: Awaited<ReturnType<typeof authClient.customer.state>>["data"];
}) {
  const t = useTranslations();
  const hasProSubscription =
    (customerState?.activeSubscriptions?.length ?? 0) > 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          {t("settings.billing.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.billing.description")}
        </p>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.billing.currentPlan")}</CardTitle>
          <CardDescription>
            {t("settings.billing.planDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div
              className={`rounded-lg border p-6 ${hasProSubscription ? "border-purple-500/50 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20" : ""}`}
            >
              <div className="flex items-center justify-between">
                <div>
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
                        <span className="font-bold text-2xl">
                          {t("dashboard.free")}
                        </span>
                      </>
                    )}
                  </div>
                  <p className="mt-2 text-muted-foreground text-sm">
                    {hasProSubscription
                      ? t("settings.billing.proDescription")
                      : t("settings.billing.freeDescription")}
                  </p>
                </div>
                {hasProSubscription ? (
                  <Button
                    onClick={async () => await authClient.customer.portal()}
                    variant="outline"
                  >
                    {t("settings.billing.manage")}
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                    onClick={async () =>
                      await authClient.checkout({ slug: "pro" })
                    }
                  >
                    {t("settings.billing.upgrade")}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
