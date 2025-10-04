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

export function DangerZoneSettings() {
  const t = useTranslations();
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (confirmText !== "DELETE") {
      toast.error(t("settings.dangerZone.confirmError"));
      return;
    }

    setIsDeleting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    toast.success(t("settings.dangerZone.accountDeleted"));
    setIsDeleting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">
          {t("settings.dangerZone.title")}
        </h1>
        <p className="text-muted-foreground">
          {t("settings.dangerZone.description")}
        </p>
      </div>

      {/* Delete Account */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">
            {t("settings.dangerZone.deleteAccount")}
          </CardTitle>
          <CardDescription>
            {t("settings.dangerZone.deleteWarning")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4">
            <p className="font-medium text-sm">
              {t("settings.dangerZone.permanentAction")}
            </p>
            <ul className="mt-2 space-y-1 text-muted-foreground text-sm">
              <li>• {t("settings.dangerZone.deleteItem1")}</li>
              <li>• {t("settings.dangerZone.deleteItem2")}</li>
              <li>• {t("settings.dangerZone.deleteItem3")}</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              {t("settings.dangerZone.typeDelete")}
            </Label>
            <Input
              id="confirm-delete"
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>

          <Button
            variant="destructive"
            onClick={handleDeleteAccount}
            disabled={confirmText !== "DELETE" || isDeleting}
          >
            {isDeleting
              ? t("settings.dangerZone.deleting")
              : t("settings.dangerZone.deleteAccountButton")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
