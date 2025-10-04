"use client";
import { useQuery } from "@tanstack/react-query";
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
  const privateData = useQuery(trpc.privateData.queryOptions());

  const hasProSubscription = customerState?.activeSubscriptions?.length! > 0;
  console.log("Active subscriptions:", customerState?.activeSubscriptions);

  return (
    <div className="grid gap-6">
      {/* Account Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* User Info Card */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
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
          className={`border-2 ${hasProSubscription ? "border-purple-500/50 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20" : ""}`}
        >
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              Current Plan
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {hasProSubscription ? (
                  <>
                    <span className="text-2xl">⭐</span>
                    <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text font-bold text-2xl text-transparent">
                      Pro
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-2xl">🆓</span>
                    <span className="font-bold text-2xl">Free</span>
                  </>
                )}
              </div>
              {hasProSubscription && (
                <p className="text-muted-foreground text-sm">
                  Premium features enabled
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* API Status Card */}
        <Card className="border-2">
          <CardHeader className="pb-3">
            <CardTitle className="font-medium text-muted-foreground text-sm">
              API Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <div
                  className={`h-3 w-3 rounded-full ${privateData.data ? "animate-pulse bg-green-500" : "bg-red-500"}`}
                />
                <span className="font-semibold">
                  {privateData.isLoading
                    ? "Checking..."
                    : privateData.data
                      ? "Connected"
                      : "Disconnected"}
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
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Subscription Management</CardTitle>
          <CardDescription>
            {hasProSubscription
              ? "Manage your Pro subscription, update payment methods, or view billing history"
              : "Upgrade to Pro to unlock premium features and capabilities"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hasProSubscription ? (
            <div className="space-y-4">
              <div className="rounded-lg border bg-gradient-to-r from-purple-50 to-blue-50 p-4 dark:from-purple-950/30 dark:to-blue-950/30">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <p className="font-semibold">Pro Plan Active</p>
                    <p className="text-muted-foreground text-sm">
                      Access to all premium features
                    </p>
                  </div>
                  <Button
                    onClick={async () => await authClient.customer.portal()}
                    variant="outline"
                  >
                    Manage Subscription
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="rounded-lg border bg-gradient-to-r from-blue-50 to-purple-50 p-6 dark:from-blue-950/30 dark:to-purple-950/30">
                <div className="space-y-4">
                  <div>
                    <h3 className="mb-2 font-semibold text-lg">
                      Unlock Pro Features
                    </h3>
                    <ul className="space-y-2 text-muted-foreground text-sm">
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Advanced AI capabilities</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Priority support</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Unlimited access to all features</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>Regular updates and new features</span>
                      </li>
                    </ul>
                  </div>
                  <Button
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 sm:w-auto"
                    onClick={async () =>
                      await authClient.checkout({ slug: "pro" })
                    }
                    size="lg"
                  >
                    Upgrade to Pro
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
