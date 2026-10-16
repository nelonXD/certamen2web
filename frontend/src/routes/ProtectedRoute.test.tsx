import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import * as AuthContextModule from '../context/AuthContext';

describe('ProtectedRoute Guard', () => {
  it('redirects unauthenticated user to /login', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: null,
      token: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/privado" element={<div>Contenido Privado</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Página de Login')).toBeInTheDocument();
    expect(screen.queryByText('Contenido Privado')).not.toBeInTheDocument();
  });

  it('allows access to authenticated user', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { usuarioId: 1, nombre: 'Mecanico1', correo: 'm@taller.cl', rol: 'Mecanico' },
      token: 'valid-token',
      role: 'Mecanico',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/privado']}>
        <Routes>
          <Route path="/login" element={<div>Página de Login</div>} />
          <Route element={<ProtectedRoute />}>
            <Route path="/privado" element={<div>Contenido Privado</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Contenido Privado')).toBeInTheDocument();
  });

  it('blocks access and redirects to /acceso-denegado if role is insufficient', () => {
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { usuarioId: 2, nombre: 'Mecanico1', correo: 'm@taller.cl', rol: 'Mecanico' },
      token: 'valid-token',
      role: 'Mecanico',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/solo-admin']}>
        <Routes>
          <Route path="/acceso-denegado" element={<div>403 Acceso Denegado</div>} />
          <Route element={<ProtectedRoute allowedRoles={['Admin']} />}>
            <Route path="/solo-admin" element={<div>Área Exclusiva Admin</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('403 Acceso Denegado')).toBeInTheDocument();
    expect(screen.queryByText('Área Exclusiva Admin')).not.toBeInTheDocument();
  });
});
