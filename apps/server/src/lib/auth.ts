import { expo } from "@better-auth/expo";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db/index.js";
import * as schema from "../db/schema/auth.js";
import { polarClient } from "./payments.js";

export const auth = betterAuth<BetterAuthOptions>({
  baseURL: process.env.BETTER_AUTH_URL || "",
  database: drizzleAdapter(db, {
    provider: "pg",

    schema,
  }),
  trustedOrigins: [
    ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    "codebasehubapp://",
    "exp://",
    "https://my-better-t-appv11-server.vercel.app",
    "https://my-better-t-appv11-web.vercel.app",
  ],

  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none",
      secure: true,
      httpOnly: true,
      partitioned: true, // Required for cross-domain cookies in modern browsers
    },
    crossSubDomainCookies: {
      enabled: true,
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60, // 5 minutes cache
    },
  },
  plugins: [
    admin(),
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      enableCustomerPortal: true,
      use: [
        checkout({
          products: [
            {
              productId: "c37d8f2b-a93c-4510-93ca-008ca0eb2818",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal(),
      ],
    }),
    expo(),
  ],
});
