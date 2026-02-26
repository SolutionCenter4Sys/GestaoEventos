export interface User {
  id: string;
  email: string;
  name?: string;
  roles: string[];
}

export interface LoginResponse {
  access_token: string;
  user: User;
  requiresTwoFactor?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}
