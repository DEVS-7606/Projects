import cors from "cors";
import express from "express";
import helmet from "helmet";
import { env, validateEnv } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.middleware.js";
import routes from "./routes/index.js";

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

// Global error handler — must be registered after all routes
app.use(errorHandler);

// Only start the server when running locally (not on Vercel)
if (process.env.VERCEL !== "1") {
  app.listen(env.port, () => {
    console.log(`Backend server running on http://localhost:${env.port}`);
  });
}

export default app;
