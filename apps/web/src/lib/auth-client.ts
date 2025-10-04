import { createAuthClient } from "better-auth/react";
import { polarClient } from "@polar-sh/better-auth";
import { adminClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
	plugins: [adminClient(), polarClient()],
});
