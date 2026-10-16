import { UserProfile, UserRole } from '../types/auth.types';

export const parseJwt = (token: string): Record<string, unknown> | null => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
};

export const isTokenExpired = (token: string): boolean => {
  const payload = parseJwt(token);
  if (!payload || typeof payload.exp !== 'number') return true;
  const currentTime = Math.floor(Date.now() / 1000);
  return payload.exp < currentTime;
};

export const extractUserFromToken = (token: string): UserProfile | null => {
  const payload = parseJwt(token);
  if (!payload) return null;

  // En ASP.NET Core los claims usan URIs estándar o nombres abreviados
  const nameClaim =
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] ||
    payload['unique_name'] ||
    payload['name'];

  const roleClaim =
    payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ||
    payload['role'];

  const emailClaim =
    payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ||
    payload['email'];

  const idClaim = payload['usuarioId'] || payload['sub'];

  if (!nameClaim) return null;

  const validRole: UserRole = roleClaim === 'Admin' ? 'Admin' : 'Mecanico';

  return {
    usuarioId: Number(idClaim) || 0,
    nombre: String(nameClaim),
    correo: emailClaim ? String(emailClaim) : '',
    rol: validRole,
  };
};
