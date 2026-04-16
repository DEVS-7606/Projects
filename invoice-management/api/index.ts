import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env, validateEnv } from "../packages/backend/src/config/env.js";
import routes from "../packages/backend/src/routes/index.js";

validateEnv();

const app = express();

app.use(helmet());

const allowedOrigins = [
  env.frontendUrl,
  "https://www.dealerinvoice.co.in",
  "https://dealerinvoice.co.in",
  "https://projects-nu-lemon.vercel.app",
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl, etc.)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "dealers-invoice-backend",
  });
});

app.use("/api", routes);

export default app;
