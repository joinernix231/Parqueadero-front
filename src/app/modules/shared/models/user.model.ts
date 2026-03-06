export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'guard';
  created_at?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface AuthResponse {
  data: LoginResponse;
}





