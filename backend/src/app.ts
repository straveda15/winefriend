import express, { type NextFunction, type Request, type Response } from "express";
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

export default app;
