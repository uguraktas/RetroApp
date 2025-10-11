import "dotenv/config";
import { google } from "@ai-sdk/google";
import { trpcServer } from "@hono/trpc-server";
import { convertToModelMessages, streamText } from "ai";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { db } from "./db/index.js";
import { user } from "./db/schema/auth.js";
import { auth } from "./lib/auth.js";
import { createContext } from "./lib/context.js";
import { appRouter } from "./routers/index.js";

const app = new Hono();

app.use(logger());

app.use(
  "/*",
  cors({
    origin: process.env.CORS_ORIGIN || "",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: [
      "Content-Type",
      "Authorization",
      "Cookie",
      "X-Requested-With",
    ],
    exposeHeaders: ["Set-Cookie"],
    credentials: true,
    maxAge: 600,
  })
);

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw));

app.use(
  "/trpc/*",
  trpcServer({
    router: appRouter,
    createContext: (_opts, context) => createContext({ context }),
  })
);

app.post("/ai", async (c) => {
  const body = await c.req.json();
  const uiMessages = body.messages || [];
  const result = streamText({
    model: google("gemini-2.5-flash"),
    messages: convertToModelMessages(uiMessages),
  });

  return result.toUIMessageStreamResponse();
});

// Admin endpoint to list all users
app.get("/api/admin/list-users", async (c) => {
  try {
    // Get session from auth
    const session = await auth.api.getSession({
      headers: c.req.raw.headers,
    });

    // Check if user is authenticated and is admin
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Type assertion for role property added by admin plugin
    const userWithRole = session.user as typeof session.user & {
      role?: string | null;
    };

    if (userWithRole.role !== "admin") {
      return c.json({ error: "Unauthorized" }, 403);
    }

    // Fetch all users from database
    const users = await db.select().from(user);

    return c.json(users);
  } catch (error) {
    console.error("Error listing users:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

app.get("/", (c) => c.text("OK"));

import { serve } from "@hono/node-server";

serve(
  {
    fetch: app.fetch,
    port: 3000,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
