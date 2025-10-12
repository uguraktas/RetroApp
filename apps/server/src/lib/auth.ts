import { expo } from "@better-auth/expo";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";
import { db } from "../db/index.js";
import * as schema from "../db/schema/auth.js";
import { polarClient } from "./payments.js";

export const auth = betterAuth<BetterAuthOptions>({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),
  trustedOrigins: [
    ...(process.env.CORS_ORIGIN ? [process.env.CORS_ORIGIN] : []),
    "codebasehubapp://",
    "https://appleid.apple.com",
  ],
  user: {
    deleteUser: {
      enabled: true,
    },
  },
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ["google", "apple"],
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      scope: ["email", "profile"],
    },
    apple: {
      clientId: process.env.APPLE_CLIENT_ID as string,
      clientSecret: process.env.APPLE_CLIENT_SECRET as string,
      appBundleIdentifier: process.env.APPLE_APP_BUNDLE_IDENTIFIER as string,
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
