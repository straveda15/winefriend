import { existsSync } from "node:fs";
import path from "node:path";

// Prefer .env.local, and support .env for a conventional local setup.
const localEnvFile = path.resolve(process.cwd(), ".env.local");
const envFile = existsSync(localEnvFile) ? localEnvFile : path.resolve(process.cwd(), ".env");
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
