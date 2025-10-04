import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AdminPanel } from "@/components/admin/admin-panel";

export default async function AdminPage() {
  const session = await authClient.getSession({
    fetchOptions: {
      headers: await headers(),
    },
  });

  if (!session.data) {
    redirect("/login");
  }

  // Check if user is admin
  if (session.data.user.role !== "admin") {
    redirect("/dashboard");
  }

  return <AdminPanel />;
}
