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
    <div className="space-y-8">
      {/* Quick Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Account Card */}
        <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-orange-500">
                <svg className="h-5 w-5 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Account
                </CardTitle>
                <p className="truncate font-semibold text-lg">{session.user.name}</p>
              </div>
            </div>
          </CardHeader>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </Card>

        {/* Plan Card */}
        <Card className={`group relative overflow-hidden border-2 transition-all duration-300 hover:shadow-lg ${hasProSubscription ? "border-primary/50 bg-gradient-to-br from-primary/5 to-orange-500/5" : "hover:border-primary/50"}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br ${hasProSubscription ? "from-purple-500 to-purple-600" : "from-muted to-muted"}`}>
                {hasProSubscription ? (
                  <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Current Plan
                </CardTitle>
                <p className={`truncate font-semibold text-lg ${hasProSubscription ? "bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent" : ""}`}>
                  {hasProSubscription ? "Pro" : "Free"}
                </p>
              </div>
            </div>
          </CardHeader>
          <div className={`absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r transition-opacity group-hover:opacity-100 ${hasProSubscription ? "from-purple-500/20 via-purple-500/40 to-purple-500/20 opacity-50" : "from-primary/20 via-primary/40 to-primary/20 opacity-0"}`} />
        </Card>

        {/* API Status Card */}
        <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-green-500 to-green-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  API Status
                </CardTitle>
                <div className="flex items-center gap-2">
                  <div
                    className={`h-2 w-2 rounded-full ${privateData.data ? "animate-pulse bg-green-500" : "bg-red-500"}`}
                  />
                  <p className="truncate font-semibold text-lg">
                    {privateData.isLoading ? "Checking..." : privateData.data ? "Connected" : "Disconnected"}
                  </p>
                </div>
              </div>
            </div>
          </CardHeader>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-green-500/20 via-green-500/40 to-green-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </Card>

        {/* Activity Card */}
        <Card className="group relative overflow-hidden border-2 transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <CardTitle className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                  Activity
                </CardTitle>
                <p className="truncate font-semibold text-lg">Active</p>
              </div>
            </div>
          </CardHeader>
          <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500/20 via-blue-500/40 to-blue-500/20 opacity-0 transition-opacity group-hover:opacity-100" />
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Left Column - Subscription Management */}
        <div className="lg:col-span-2">
          <Card className="border-2 shadow-lg">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-primary via-primary/90 to-orange-500">
                  <svg className="h-6 w-6 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <CardTitle className="text-2xl">Subscription</CardTitle>
                  <CardDescription className="text-base">
                    {hasProSubscription
                      ? "Manage your Pro subscription"
                      : "Upgrade to unlock premium features"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {hasProSubscription ? (
                <div className="space-y-6">
                  <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/5 to-orange-500/5 p-8">
                    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-purple-600">
                            <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                          </div>
                          <h3 className="font-semibold text-xl">Pro Plan Active</h3>
                        </div>
                        <p className="text-muted-foreground">
                          You have access to all premium features
                        </p>
                      </div>
                      <Button
                        onClick={async () => await authClient.customer.portal()}
                        variant="outline"
                        size="lg"
                        className="shrink-0"
                      >
                        Manage Subscription
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="rounded-2xl border bg-gradient-to-br from-primary/5 via-primary/5 to-orange-500/5 p-8">
                    <div className="space-y-6">
                      <div>
                        <h3 className="mb-2 font-bold text-2xl">Unlock Pro Features</h3>
                        <p className="text-muted-foreground">
                          Get access to advanced tools and priority support
                        </p>
                      </div>
                      
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 mt-0.5">
                            <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Advanced AI Features</p>
                            <p className="text-muted-foreground text-sm">Enhanced AI capabilities</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 mt-0.5">
                            <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Priority Support</p>
                            <p className="text-muted-foreground text-sm">24/7 dedicated support</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 mt-0.5">
                            <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Unlimited Access</p>
                            <p className="text-muted-foreground text-sm">No usage limitations</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start gap-3">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500/10 mt-0.5">
                            <svg className="h-3 w-3 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium">Regular Updates</p>
                            <p className="text-muted-foreground text-sm">Latest features first</p>
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        className="w-full bg-gradient-to-r from-primary via-primary/90 to-orange-500 hover:from-primary/90 hover:to-orange-600 text-base font-medium h-12"
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

        {/* Right Column - Quick Actions & Stats */}
        <div className="space-y-6">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/ai">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  AI Chat
                </a>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/dashboard/settings">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Settings
                </a>
              </Button>
              
              <Button variant="outline" className="w-full justify-start" asChild>
                <a href="/docs">
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Documentation
                </a>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2">
            <CardHeader>
              <CardTitle className="text-lg">Account Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary via-primary/90 to-orange-500">
                  <span className="font-semibold text-sm text-primary-foreground">
                    {session.user.name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{session.user.name}</p>
                  <p className="truncate text-muted-foreground text-sm">{session.user.email}</p>
                </div>
              </div>
              {privateData.data && (
                <div className="rounded-lg border bg-muted/30 p-3">
                  <p className="text-muted-foreground text-sm">API Response:</p>
                  <p className="font-mono text-xs">{privateData.data.message}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
