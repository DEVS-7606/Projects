import express from "express";
import cors from "cors";
import helmet from "helmet";
import { validateEnv } from "../packages/backend/src/config/env.js";
import { env } from "../packages/backend/src/config/env.js";
import routes from "../packages/backend/src/routes/index.js";

validateEnv();

const app = express();

app.use(helmet());
app.use(cors({ origin: env.frontendUrl, credentials: true }));
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "invoice-management-backend",
  });
});

app.use("/api", routes);

export default app;
