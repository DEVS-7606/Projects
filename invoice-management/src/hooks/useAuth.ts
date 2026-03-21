import { useState, useEffect, useCallback } from "react";
import { authApi } from "@/services/auth.api";
import type { User } from "@/types";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkSession = useCallback(async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) {
        setLoading(false);
        return;
      }

      const session = await authApi.getSession();
      setUser(session.user);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signIn = async (email: string, password: string) => {
    const result = await authApi.login(email, password);
    setUser(result.user);
    return result;
  };

  const signUp = async (
    email: string,
    password: string,
    metadata?: { business_name: string; username: string },
  ) => {
    const result = await authApi.signup(
      email,
      password,
      metadata?.business_name || "",
      metadata?.username || email.split("@")[0],
    );
    setUser(result.user);
    return result;
  };

  const signOut = async () => {
    await authApi.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
  };
}
