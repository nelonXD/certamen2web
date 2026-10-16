export type UserRole = 'Admin' | 'Mecanico';

export interface UserProfile {
  usuarioId: number;
  nombre: string;
  correo: string;
  rol: UserRole;
}

export interface LoginResponse {
  token: string;
  usuario?: UserProfile;
}

export interface DecodedTokenPayload {
  [key: string]: unknown;
  name?: string;
  role?: string;
  email?: string;
  usuarioId?: string;
  exp?: number;
  iss?: string;
  aud?: string;
}

export interface AuthState {
  user: UserProfile | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
