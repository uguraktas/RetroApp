import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Use DIRECT_URL for migrations and local development
// Use DATABASE_URL for serverless functions (connection pooled)
const connectionString = process.env.DATABASE_URL || process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL or DIRECT_URL environment variable is required");
}

// Configure postgres-js for Vercel serverless
const client = postgres(connectionString, {
  prepare: false, // Disable prepared statements for serverless
  max: 1, // Maximum number of connections in pool
  idle_timeout: 20, // Close connections after 20 seconds of inactivity
  max_lifetime: 60 * 30, // Close connections after 30 minutes
});

export const db = drizzle(client);
