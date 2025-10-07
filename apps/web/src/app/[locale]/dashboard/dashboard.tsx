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
                <p className="text-sm text-muted-foreground">Account</p>
                <p className="font-medium">{session.user.name}</p>
              </div>
              <div className="h-8 w-8 rounded bg-muted flex items-center justify-center">
                <span className="text-xs font-medium">
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
                <p className="text-sm text-muted-foreground">Plan</p>
                <p className="font-medium">{hasProSubscription ? "Pro" : "Free"}</p>
              </div>
              <div className={`h-2 w-2 rounded-full ${hasProSubscription ? "bg-green-500" : "bg-gray-300"}`} />
            </div>
          </CardContent>
        </Card>

        {/* API Status Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">API Status</p>
                <p className="font-medium">
                  {privateData.isLoading ? "Checking..." : privateData.data ? "Connected" : "Disconnected"}
                </p>
              </div>
              <div className={`h-2 w-2 rounded-full ${privateData.data ? "bg-green-500" : "bg-red-500"}`} />
            </div>
          </CardContent>
        </Card>

        {/* Activity Card */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activity</p>
                <p className="font-medium">Active</p>
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
              <CardTitle>Subscription</CardTitle>
              <CardDescription>
                {hasProSubscription
                  ? "Manage your Pro subscription"
                  : "Upgrade to unlock premium features"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasProSubscription ? (
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium">Pro Plan Active</h3>
                        <p className="text-sm text-muted-foreground">
                          You have access to all premium features
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
                  <div className="p-4 border rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-medium">Unlock Pro Features</h3>
                        <p className="text-sm text-muted-foreground">
                          Get access to advanced tools and priority support
                        </p>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span>Advanced AI Features</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span>Priority Support</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                          <span>Unlimited Access</span>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full"
                        onClick={async () => await authClient.checkout({ slug: "pro" })}
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

        {/* Right Column - Quick Actions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/ai">AI Chat</a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/dashboard/settings">Settings</a>
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                <a href="/docs">Documentation</a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
