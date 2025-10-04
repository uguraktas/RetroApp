"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";
import {
  Users,
  ShieldCheck,
  Ban,
  Loader2,
  Mail,
  Calendar,
  UserCheck,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  banned?: boolean;
  banReason?: string;
  createdAt: Date;
  emailVerified: boolean;
}

export function AdminPanel() {
  const t = useTranslations();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [searchEmail, setSearchEmail] = useState("");
  const [banReason, setBanReason] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Note: You'll need to create an API endpoint to list users
      // This is a placeholder
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to load users:", error);
      toast.error(t("admin.errors.loadUsers"));
    } finally {
      setLoading(false);
    }
  };

  const handleSetRole = async (userId: string, role: string) => {
    setActionLoading(userId);
    try {
      await authClient.admin.setRole({
        userId,
        role,
      });
      toast.success(t("admin.success.roleUpdated"));
      await loadUsers();
    } catch (error) {
      console.error("Failed to set role:", error);
      toast.error(t("admin.errors.setRole"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleBanUser = async (userId: string) => {
    if (!banReason.trim()) {
      toast.error(t("admin.errors.banReasonRequired"));
      return;
    }

    setActionLoading(userId);
    try {
      await authClient.admin.banUser({
        userId,
        banReason,
      });
      toast.success(t("admin.success.userBanned"));
      setBanReason("");
      setSelectedUserId(null);
      await loadUsers();
    } catch (error) {
      console.error("Failed to ban user:", error);
      toast.error(t("admin.errors.banUser"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleUnbanUser = async (userId: string) => {
    setActionLoading(userId);
    try {
      await authClient.admin.unbanUser({
        userId,
      });
      toast.success(t("admin.success.userUnbanned"));
      await loadUsers();
    } catch (error) {
      console.error("Failed to unban user:", error);
      toast.error(t("admin.errors.unbanUser"));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveUser = async (userId: string) => {
    if (!confirm(t("admin.confirmDelete"))) {
      return;
    }

    setActionLoading(userId);
    try {
      await authClient.admin.removeUser({
        userId,
      });
      toast.success(t("admin.success.userRemoved"));
      await loadUsers();
    } catch (error) {
      console.error("Failed to remove user:", error);
      toast.error(t("admin.errors.removeUser"));
    } finally {
      setActionLoading(null);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 font-bold text-2xl tracking-tight sm:text-3xl">
          <ShieldCheck className="h-8 w-8" />
          {t("admin.title")}
        </h1>
        <p className="text-muted-foreground">{t("admin.description")}</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              {t("admin.stats.totalUsers")}
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">{users.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              {t("admin.stats.admins")}
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {users.filter((u) => u.role === "admin").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              {t("admin.stats.bannedUsers")}
            </CardTitle>
            <Ban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl">
              {users.filter((u) => u.banned).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Management */}
      <Card>
        <CardHeader>
          <CardTitle>{t("admin.usersManagement")}</CardTitle>
          <CardDescription>{t("admin.usersDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Search */}
          <div className="space-y-2">
            <Label htmlFor="search">{t("admin.searchByEmail")}</Label>
            <Input
              id="search"
              type="email"
              placeholder={t("admin.emailPlaceholder")}
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
            />
          </div>

          {/* Users List */}
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredUsers.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              {t("admin.noUsers")}
            </p>
          ) : (
            <div className="space-y-4">
              {filteredUsers.map((user) => (
                <Card key={user.id} className={user.banned ? "border-destructive" : ""}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      {/* User Info */}
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{user.name}</h3>
                            {user.banned && (
                              <span className="rounded-full bg-destructive px-2 py-0.5 text-destructive-foreground text-xs">
                                {t("admin.banned")}
                              </span>
                            )}
                            {user.role === "admin" && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
                                {t("admin.adminBadge")}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-3 text-muted-foreground text-sm">
                            <span className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </span>
                            {user.emailVerified && (
                              <span className="flex items-center gap-1 text-green-600">
                                <UserCheck className="h-3 w-3" />
                                {t("admin.verified")}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDistanceToNow(new Date(user.createdAt), {
                                addSuffix: true,
                              })}
                            </span>
                          </div>
                          {user.banned && user.banReason && (
                            <p className="text-destructive text-sm">
                              {t("admin.banReason")}: {user.banReason}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-wrap gap-2">
                        {/* Role Selection */}
                        <div className="flex items-center gap-2">
                          <Label className="text-xs">{t("admin.role")}:</Label>
                          <Select
                            value={user.role || "user"}
                            onValueChange={(value) => handleSetRole(user.id, value)}
                            disabled={actionLoading === user.id}
                          >
                            <SelectTrigger className="h-8 w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="user">
                                {t("admin.roles.user")}
                              </SelectItem>
                              <SelectItem value="admin">
                                {t("admin.roles.admin")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Ban/Unban */}
                        {user.banned ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnbanUser(user.id)}
                            disabled={actionLoading === user.id}
                          >
                            {actionLoading === user.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {t("admin.unban")}
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            {selectedUserId === user.id ? (
                              <>
                                <Input
                                  placeholder={t("admin.banReasonPlaceholder")}
                                  value={banReason}
                                  onChange={(e) => setBanReason(e.target.value)}
                                  className="h-8"
                                />
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => handleBanUser(user.id)}
                                  disabled={actionLoading === user.id}
                                >
                                  {actionLoading === user.id ? (
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  ) : null}
                                  {t("admin.confirmBan")}
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    setSelectedUserId(null);
                                    setBanReason("");
                                  }}
                                >
                                  {t("common.cancel")}
                                </Button>
                              </>
                            ) : (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setSelectedUserId(user.id)}
                              >
                                {t("admin.ban")}
                              </Button>
                            )}
                          </div>
                        )}

                        {/* Remove User */}
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleRemoveUser(user.id)}
                          disabled={actionLoading === user.id}
                        >
                          {actionLoading === user.id ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          ) : null}
                          {t("admin.removeUser")}
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
