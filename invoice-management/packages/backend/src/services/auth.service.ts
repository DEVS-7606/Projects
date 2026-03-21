import { AuthRepository } from "../repositories/auth.repository.js";
import { buildForwardingEmail } from "../utils/formatters.js";
import type { User } from "@invoice-management/shared";

const authRepository = new AuthRepository();

export class AuthService {
  async login(email: string, password: string) {
    const data = await authRepository.signInWithPassword(email, password);
    const profile = await authRepository.getProfile(data.user.id);

    const user: User = {
      id: data.user.id,
      username: profile?.username || data.user.email?.split("@")[0] || "",
      business_name: profile?.business_name || "",
      email: data.user.email || "",
      forwarding_email: buildForwardingEmail(data.user.id),
    };

    return { user, token: data.session.access_token };
  }

  async signup(
    email: string,
    password: string,
    businessName: string,
    username: string,
  ) {
    const data = await authRepository.signUp(email, password, {
      business_name: businessName,
      username,
    });

    if (!data.user) {
      throw new Error("Failed to create user");
    }

    const user: User = {
      id: data.user.id,
      username: username || email.split("@")[0],
      business_name: businessName,
      email,
      forwarding_email: buildForwardingEmail(data.user.id),
    };

    return { user, token: data.session?.access_token || "" };
  }

  async getSession(accessToken: string) {
    const supabaseUser = await authRepository.getUser(accessToken);
    const profile = await authRepository.getProfile(supabaseUser.id);

    const user: User = {
      id: supabaseUser.id,
      username: profile?.username || supabaseUser.email?.split("@")[0] || "",
      business_name: profile?.business_name || "",
      email: supabaseUser.email || "",
      forwarding_email: buildForwardingEmail(supabaseUser.id),
    };

    return { user, authenticated: true };
  }

  async logout(accessToken: string) {
    await authRepository.signOut(accessToken);
  }
}
