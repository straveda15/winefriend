import express, { type NextFunction, type Request, type Response } from "express";
import { config, isProduction } from "./config";
import { adminRouter } from "./routes/admin";
import { publicRouter } from "./routes/public";

const app = express();
app.disable("x-powered-by");
app.set("trust proxy", true);

// Uploads are sent as raw bytes (see the admin router); everything else is small JSON.
app.use((request, response, next) => {
  if (request.path === "/api/admin/uploads") return next();
  express.json({ limit: "1mb" })(request, response, next);
});

app.get("/health", (_request, response) => {
  response.json({ ok: true });
});

app.use(publicRouter);
app.use(adminRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Not found." });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, _request: Request, response: Response, _next: NextFunction) => {
  const status = typeof error === "object" && error && "status" in error && typeof error.status === "number" ? error.status : 500;
  if (status >= 500) console.error("[backend] Unhandled error:", error);
  response.status(status).json({ error: status === 413 ? "That upload is too large." : status >= 500 ? "Something went wrong." : "Bad request." });
});

app.listen(config.port, () => {
  console.log(`[backend] listening on http://localhost:${config.port} (${isProduction ? "production" : "development"})`);
  console.log(`[backend] data folder: ${config.dataDir}`);
  if (!config.adminEmail || !config.adminPassword) console.warn("[backend] ADMIN_EMAIL / ADMIN_PASSWORD are not set - dashboard login is disabled.");
  if (isProduction && config.sessionSecret.length < 32) console.warn("[backend] SESSION_SECRET must be at least 32 characters - logins will fail.");
});
