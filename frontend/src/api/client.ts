import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { NormalizedError } from '../types/api.types';

// Clave segura para almacenamiento del token
const TOKEN_KEY = 'taller_auth_token';
const USER_KEY = 'taller_auth_user';

export const getStoredToken = (): string | null => {
  return sessionStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string): void => {
  sessionStorage.setItem(TOKEN_KEY, token);
};

export const removeStoredToken = (): void => {
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
};

export const getStoredUser = () => {
  const data = sessionStorage.getItem(USER_KEY);
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

export const setStoredUser = (user: unknown): void => {
  sessionStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Cliente HTTP centralizado
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor de Solicitud: Adjunta el JWT Bearer Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getStoredToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor de Respuesta: Normalización de errores y mitigaciones OWASP
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<Record<string, unknown>>) => {
    if (!error.response) {
      const normalized: NormalizedError = {
        status: 0,
        message: 'No se pudo conectar con el servidor backend. Asegúrate de que la API esté en ejecución (dotnet run en puerto 5290 o 7027).',
      };
      return Promise.reject(normalized);
    }

    const status = error.response.status;
    const data = error.response.data;

    const normalized: NormalizedError = {
      status,
      message: 'Ocurrió un error inesperado.',
    };

    if (status === 401) {
      normalized.message = 'Tu sesión ha expirado o las credenciales no son válidas.';
      removeStoredToken();
      // Disparamos evento para que el contexto de Auth actualice el estado
      window.dispatchEvent(new CustomEvent('auth:unauthorized'));
    } else if (status === 403) {
      normalized.message = 'No tienes permisos suficientes para realizar esta acción (403 Acceso Denegado).';
      window.dispatchEvent(new CustomEvent('auth:forbidden'));
    } else if (status === 429) {
      normalized.message = 'Has realizado demasiadas solicitudes en poco tiempo. Por favor espera un momento (Rate Limiting).';
    } else if (status === 400 || status === 422) {
      normalized.message = (data?.title as string) || (data?.message as string) || 'Los datos proporcionados no son válidos.';
      if (data?.errors && typeof data.errors === 'object') {
        normalized.fieldErrors = data.errors as Record<string, string[]>;
      }
    } else if (status >= 500) {
      // Mitigación OWASP: no exponer trazas internas del backend en producción
      normalized.message = (data?.message as string) || 'Error interno del servidor. Por favor intenta más tarde.';
    }

    return Promise.reject(normalized);
  }
);
