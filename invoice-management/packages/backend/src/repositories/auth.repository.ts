import { supabase } from '../config/supabase.js';

export class AuthRepository {
  async signInWithPassword(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signUp(email: string, password: string, metadata: Record<string, string>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: metadata },
    });

    if (error) {
      throw new Error(error.message);
    }

    return data;
  }

  async signOut(accessToken: string) {
    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) {
      throw new Error(error.message);
    }
  }

  async getUser(accessToken: string) {
    const { data, error } = await supabase.auth.getUser(accessToken);

    if (error) {
      throw new Error(error.message);
    }

    return data.user;
  }

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw new Error(error.message);
    }

    return data;
  }
}
