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

export interface LoginPayload {
  token: string;
  user: User;
}
