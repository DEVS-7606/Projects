import { apiClient } from '@/services/api-client';
import type { User, AuthResponse, SessionResponse } from '@/types';

export const authApi = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>('/auth/login', { email, password });
    apiClient.setToken(result.token);
    return result;
  },

  async signup(
    email: string,
    password: string,
    businessName: string,
    username: string
  ): Promise<AuthResponse> {
    const result = await apiClient.post<AuthResponse>('/auth/signup', {
      email,
      password,
      business_name: businessName,
      username,
    });
    apiClient.setToken(result.token);
    return result;
  },

  async getSession(): Promise<SessionResponse> {
    return apiClient.get<SessionResponse>('/auth/session');
  },

  async logout(): Promise<void> {
    await apiClient.post<{ message: string }>('/auth/logout', {});
    apiClient.clearToken();
  },
};

export type { User, AuthResponse, SessionResponse };
