export interface User {
  id: string;
  username: string;
  business_name: string;
  email: string;
  forwarding_email: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  email: string;
  password: string;
  business_name: string;
  username: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface SessionResponse {
  user: User | null;
  authenticated: boolean;
}
