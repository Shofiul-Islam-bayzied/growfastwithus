import { Pool, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import * as schema from "@shared/schema";

neonConfig.webSocketConstructor = ws;

if (!process.env.DATABASE_URL) {
  console.warn("⚠️  DATABASE_URL not set. Using development mode without database.");
  console.warn("💡 To set up a database:");
  console.warn("   1. Visit https://neon.tech for a free PostgreSQL database");
  console.warn("   2. Copy the connection string to your .env file");
  console.warn("   3. Restart the server");
}

// Only create pool if DATABASE_URL is available
export const pool = process.env.DATABASE_URL 
  ? new Pool({ connectionString: process.env.DATABASE_URL })
  : null;

export const db = process.env.DATABASE_URL && pool
  ? drizzle({ client: pool, schema })
  : null;