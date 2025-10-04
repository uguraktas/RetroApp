"use client";

import { useState } from "react";
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

export function SecuritySettings() {
  const t = useTranslations();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error(t("settings.security.passwordMismatch"));
      return;
    }

    setIsLoading(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    toast.success(t("settings.security.passwordChanged"));
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          {t("settings.security.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.security.description")}
        </p>
      </div>

      {/* Password Change */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.security.changePassword")}</CardTitle>
          <CardDescription>
            {t("settings.security.passwordDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">
                {t("settings.security.currentPassword")}
              </Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="new-password">
                {t("settings.security.newPassword")}
              </Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                {t("settings.security.confirmPassword")}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading
                ? t("settings.security.updating")
                : t("settings.security.updatePassword")}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* 2FA */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.security.twoFactor")}</CardTitle>
          <CardDescription>
            {t("settings.security.twoFactorDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline">{t("settings.security.enable2FA")}</Button>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.security.activeSessions")}</CardTitle>
          <CardDescription>
            {t("settings.security.sessionsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <p className="font-medium">
                  {t("settings.security.currentDevice")}
                </p>
                <p className="text-muted-foreground text-sm">
                  {t("settings.security.lastActive")}: {t("common.now")}
                </p>
              </div>
              <span className="rounded-full bg-green-100 px-3 py-1 text-green-800 text-xs dark:bg-green-900 dark:text-green-300">
                {t("settings.security.active")}
              </span>
            </div>

            <Button variant="destructive" size="sm">
              {t("settings.security.revokeAllSessions")}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
