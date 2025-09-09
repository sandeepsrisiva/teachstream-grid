export interface User {
  id?: string;
  username?: string;
  role?: 'admin' | 'teacher' | 'student';
  email?: string;
  name?: string;
  course?: string;
   sub?: string;
  userName?: string,
  exp?: number;
  type?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}
