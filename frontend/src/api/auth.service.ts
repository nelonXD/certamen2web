import { apiClient } from './client';
import { LoginResponse, UserProfile } from '../types/auth.types';

export interface LoginPayload {
  nombreUsuario: string;
  password: string;
}

export interface RegisterPayload {
  nombre: string;
  correo: string;
  password: string;
}

export const authService = {
  login: async (credentials: LoginPayload): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/usuarios/login', credentials);
    return response.data;
  },

  register: async (data: RegisterPayload): Promise<UserProfile> => {
    const response = await apiClient.post<UserProfile>('/usuarios/registro', data);
    return response.data;
  },
};
