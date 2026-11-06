import { existsSync } from "node:fs";
import path from "node:path";

// Load backend/.env.local when present (real environment variables always win).
const envFile = path.resolve(process.cwd(), ".env.local");
if (existsSync(envFile)) process.loadEnvFile(envFile);

export const isProduction = process.env.NODE_ENV === "production" || process.argv.includes("--production");

export const config = {
  port: Number(process.env.PORT ?? 4000),
  mongodbUri: process.env.MONGODB_URI ?? "",
  mongodbDb: process.env.MONGODB_DB ?? "winefriend",
  adminEmail: process.env.ADMIN_EMAIL ?? "",
  adminPassword: process.env.ADMIN_PASSWORD ?? "",
  sessionSecret: process.env.SESSION_SECRET ?? "",
  websiteUrl: process.env.WEBSITE_URL ?? "",
  revalidateSecret: process.env.REVALIDATE_SECRET ?? "",
};
