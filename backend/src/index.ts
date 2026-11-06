import app from "./app";
import { config, isProduction } from "./config";

app.listen(config.port, () => {
  console.log(`[backend] listening on http://localhost:${config.port} (${isProduction ? "production" : "development"})`);
  console.log(`[backend] database: ${config.mongodbUri ? config.mongodbDb : "NOT CONFIGURED"}`);
  if (!config.mongodbUri) console.warn("[backend] MONGODB_URI is not set - products, posts and enquiries cannot be loaded.");
  if (!config.adminEmail || !config.adminPassword) console.warn("[backend] ADMIN_EMAIL / ADMIN_PASSWORD are not set - dashboard login is disabled.");
  if (isProduction && config.sessionSecret.length < 32) console.warn("[backend] SESSION_SECRET must be at least 32 characters - logins will fail.");
});
