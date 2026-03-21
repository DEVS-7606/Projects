import { supabase } from "../config/supabase.js";
import { AppError, UnauthorizedError } from "../errors/AppError.js";

// Map Supabase auth error codes to proper HTTP status codes
function mapAuthError(message: string, code?: string): AppError {
  const msg = message.toLowerCase();
  if (
    code === "invalid_credentials" ||
    msg.includes("invalid login credentials")
  ) {
    return new UnauthorizedError("Invalid email or password");
  }
  if (code === "email_not_confirmed" || msg.includes("email not confirmed")) {
    return new AppError(
      401,
      "EMAIL_NOT_CONFIRMED",
      "Please confirm your email before logging in",
    );
  }
  if (
    msg.includes("user already registered") ||
    msg.includes("already been registered")
  ) {
    return new AppError(
      409,
      "EMAIL_IN_USE",
      "An account with this email already exists",
    );
  }
  return new AppError(400, "AUTH_ERROR", message);
}

export class AuthRepository {
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw mapAuthError(error.message, error.code);
    }

    return data;
  }

  async signUp(
    email: string,
    password: string,
    metadata: Record<string, string>,
  ) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) {
      throw mapAuthError(error.message, error.code);
    }

    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      throw new AppError(500, "SIGNOUT_ERROR", error.message);
    }
  }

  async getUser(accessToken: string) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      throw new UnauthorizedError(error.message);
    }

    return data.user;
  }

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      throw new AppError(500, "PROFILE_FETCH_ERROR", error.message);
    }

    return data;
  }
}
