import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Load from root of monorepo (4 levels up from packages/backend/src/config/)
const envPath = path.resolve(__dirname, "../../../../.env");
dotenv.config({ path: envPath });

export const env = {
  port: parseInt(process.env.PORT || "3002", 10),
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
} as const;

export function validateEnv(): void {
  const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"] as const;
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.warn(
      `Warning: Missing env vars: ${missing.join(", ")}. Running in dev mode.`,
    );
  }
}
