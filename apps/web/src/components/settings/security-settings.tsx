"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import { Loader2, Monitor, Smartphone, Tablet } from "lucide-react";
import { formatDistanceToNow, format, isValid } from "date-fns";

interface Session {
  id: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;
  token: string;
}

interface DisplaySession {
  id: string;
  userAgent: string;
  ip: string;
  lastActiveAt: Date;
  isCurrent: boolean;
}

export function SecuritySettings() {
  const t = useTranslations();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessions, setSessions] = useState<DisplaySession[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);
  const [revokingAll, setRevokingAll] = useState(false);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await authClient.listSessions();
      if (response.data) {
        // Get current session token
        const currentToken = await authClient.getSession();
        const currentSessionToken = currentToken?.data?.session?.token;

        // Transform sessions to display format
        const displaySessions: DisplaySession[] = response.data.map((session: Session) => ({
          id: session.id,
          userAgent: session.userAgent || "Unknown Device",
          ip: session.ipAddress || "Unknown IP",
          lastActiveAt: session.updatedAt,
          isCurrent: session.token === currentSessionToken,
        }));

        setSessions(displaySessions);
      }
    } catch (error) {
      console.error("Failed to load sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error(t("settings.security.allFieldsRequired"));
      return;
    }

    if (newPassword.length < 8) {
      toast.error(t("settings.security.passwordMinLength"));
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(t("settings.security.passwordMismatch"));
      return;
    }

    setIsLoading(true);

    try {
      const response = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: false,
      });

      if (response.error) {
        toast.error(response.error.message || t("settings.security.passwordChangeFailed"));
        setIsLoading(false);
        return;
      }

      toast.success(t("settings.security.passwordChanged"));
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      toast.error(t("settings.security.passwordChangeFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevokeAllSessions = async () => {
    setRevokingAll(true);
    try {
      const response = await authClient.revokeOtherSessions();

      if (response.error) {
        toast.error(response.error.message || t("settings.security.revokeFailed"));
        return;
      }

      toast.success(t("settings.security.sessionsRevoked"));
      await loadSessions();
    } catch (error) {
      console.error("Revoke sessions error:", error);
      toast.error(t("settings.security.revokeFailed"));
    } finally {
      setRevokingAll(false);
    }
  };

  const getDeviceIcon = (userAgent: string) => {
    const ua = userAgent.toLowerCase();
    if (ua.includes("mobile") || ua.includes("android") || ua.includes("iphone")) {
      return <Smartphone className="h-5 w-5" />;
    }
    if (ua.includes("tablet") || ua.includes("ipad")) {
      return <Tablet className="h-5 w-5" />;
    }
    return <Monitor className="h-5 w-5" />;
  };

  const getDeviceInfo = (userAgent: string) => {
    const ua = userAgent;
    // Simple parsing for common browsers
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return "Unknown Browser";
  };

  const formatSessionTime = (dateString: string | Date) => {
    try {
      const date = new Date(dateString);
      if (!isValid(date)) {
        return t("common.now");
      }

      // If within last 5 minutes, show "just now"
      const diffMs = Date.now() - date.getTime();
      if (diffMs < 5 * 60 * 1000) {
        return t("common.now");
      }

      // Otherwise show relative time (e.g., "2 hours ago")
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      return t("common.now");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {t("settings.security.title")}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t("settings.security.description")}
        </p>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {t("settings.security.changePassword")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("settings.security.passwordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password" className="text-sm">
                {t("settings.security.currentPassword")}
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="text-base"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password" className="text-sm">
                {t("settings.security.newPassword")}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="text-base"
                minLength={8}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-sm">
                {t("settings.security.confirmPassword")}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="text-base"
                required
              />
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("settings.security.updating")}
                </>
              ) : (
                t("settings.security.updatePassword")
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {t("settings.security.activeSessions")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("settings.security.sessionsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {loadingSessions ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : sessions.length > 0 ? (
              <>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-start justify-between gap-4 rounded-lg border p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5 text-muted-foreground">
                          {getDeviceIcon(session.userAgent)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium">
                            {getDeviceInfo(session.userAgent)}
                            {session.isCurrent && (
                              <span className="ml-2 text-muted-foreground text-sm">
                                ({t("settings.security.currentDevice")})
                              </span>
                            )}
                          </p>
                          <p className="text-muted-foreground text-sm">
                            {session.ip}
                          </p>
                          <p className="text-muted-foreground text-xs">
                            {t("settings.security.lastActive")}:{" "}
                            {formatSessionTime(session.lastActiveAt)}
                          </p>
                        </div>
                      </div>
                      {session.isCurrent && (
                        <span className="shrink-0 rounded-full bg-green-100 px-3 py-1 text-green-800 text-xs dark:bg-green-900 dark:text-green-300">
                          {t("settings.security.active")}
                        </span>
                      )}
                    </div>
                  ))}
                </div>

                {sessions.length > 1 && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleRevokeAllSessions}
                    disabled={revokingAll}
                  >
                    {revokingAll ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("settings.security.revoking")}
                      </>
                    ) : (
                      t("settings.security.revokeAllSessions")
                    )}
                  </Button>
                )}
              </>
            ) : (
              <p className="py-4 text-center text-muted-foreground text-sm">
                {t("settings.security.noSessions")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
