import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { UserProfile, UserRole } from '../types/auth.types';
import {
  getStoredToken,
  setStoredToken,
  removeStoredToken,
  getStoredUser,
  setStoredUser,
} from '../api/client';
import { authService, LoginPayload } from '../api/auth.service';
import { extractUserFromToken, isTokenExpired } from '../utils/jwt';

interface AuthContextType {
  user: UserProfile | null;
  token: string | null;
  role: UserRole | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginPayload) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    removeStoredToken();
    setToken(null);
    setUser(null);
  }, []);

  // Carga inicial y validación de expiración del token
  useEffect(() => {
    const savedToken = getStoredToken();
    if (savedToken) {
      if (isTokenExpired(savedToken)) {
        logout();
      } else {
        setToken(savedToken);
        const savedUser = getStoredUser();
        if (savedUser) {
          setUser(savedUser);
        } else {
          const extracted = extractUserFromToken(savedToken);
          if (extracted) {
            setUser(extracted);
            setStoredUser(extracted);
          }
        }
      }
    }
    setIsLoading(false);
  }, [logout]);

  // Escuchar eventos globales de 401 (deslogueo forzado al expirar token)
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, [logout]);

  const login = async (credentials: LoginPayload): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      const jwtToken = response.token;

      // Determinar usuario desde la respuesta enriquecida o desde el JWT decodificado
      let userProfile = response.usuario;
      if (!userProfile) {
        userProfile = extractUserFromToken(jwtToken) || undefined;
      }

      if (!userProfile) {
        throw new Error('No se pudo determinar el perfil del usuario autenticado.');
      }

      setStoredToken(jwtToken);
      setStoredUser(userProfile);
      setToken(jwtToken);
      setUser(userProfile);
    } finally {
      setIsLoading(false);
    }
  };

  const role = user?.rol || null;
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        role,
        isAuthenticated,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider');
  }
  return context;
};
