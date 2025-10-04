import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { authClient } from "@/lib/auth-client";

export async function GET() {
  try {
    // Get the current session
    const session = await authClient.getSession({
      fetchOptions: {
        headers: await headers(),
      },
    });

    // Check if user is authenticated
    if (!session.data?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is admin
    if (session.data.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // For now, we'll use the Better Auth API to get users
    // You may need to create a custom endpoint in your server to list all users
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/admin/list-users`,
      {
        headers: await headers(),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    const users = await response.json();
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
