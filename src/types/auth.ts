export interface User {
  id: string;
  username: string;
  role: 'admin' | 'teacher' | 'student';
  email?: string;
  name?: string;
  course?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}