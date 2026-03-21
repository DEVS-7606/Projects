const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3002/api";

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    return localStorage.getItem("auth_token");
  }

  setToken(token: string): void {
    localStorage.setItem("auth_token", token);
  }

  clearToken(): void {
    localStorage.removeItem("auth_token");
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorBody = await response
        .json()
        .catch(() => ({ message: response.statusText }));
      throw new Error(
        errorBody.message || `Request failed with status ${response.status}`,
      );
    }

    const json = await response.json();
    return json.data as T;
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    const url = params
      ? `${endpoint}?${new URLSearchParams(params).toString()}`
      : endpoint;

    return this.request<T>(url, { method: "GET" });
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  async patch<T>(endpoint: string, body: Record<string, unknown>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
