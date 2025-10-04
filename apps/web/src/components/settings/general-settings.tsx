"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
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

export function GeneralSettings({
  user,
}: {
  user: { name: string; email: string };
}) {
  const t = useTranslations();
  const router = useRouter();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate name input
      if (!name.trim()) {
        toast.error(t("settings.general.nameRequired"));
        setIsLoading(false);
        return;
      }

      // Update only the name (email cannot be updated)
      const response = await authClient.updateUser({
        name: name.trim(),
      });

      if (response.error) {
        toast.error(response.error.message || t("settings.general.updateFailed"));
        setIsLoading(false);
        return;
      }

      toast.success(t("settings.general.saved"));

      // Refresh the page to show updated data
      router.refresh();
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error(t("settings.general.updateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-bold text-2xl tracking-tight sm:text-3xl">
          {t("settings.general.title")}
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          {t("settings.general.description")}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">
            {t("settings.general.profileInfo")}
          </CardTitle>
          <CardDescription className="text-sm">
            {t("settings.general.profileDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm">
                {t("common.name")}
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("settings.general.namePlaceholder")}
                className="text-base"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm">
                {t("common.email")}
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                disabled
                className="cursor-not-allowed bg-muted text-base text-muted-foreground"
              />
              <p className="text-muted-foreground text-xs">
                {t("settings.general.emailCannotChange")}
              </p>
            </div>

            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? t("settings.general.saving") : t("common.save")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
