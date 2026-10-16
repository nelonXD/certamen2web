import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { LoginPage } from './LoginPage';
import { AuthProvider } from '../../context/AuthContext';
import { authService } from '../../api/auth.service';

vi.mock('../../api/auth.service', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('LoginPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form inputs and accessible submit button', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: /taller mecánico/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre de usuario/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
  });

  it('validates empty inputs with accessible error messages', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    const submitBtn = screen.getByRole('button', { name: /iniciar sesión/i });
    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText(/el nombre de usuario es obligatorio/i)).toBeInTheDocument();
      expect(screen.getByText(/la contraseña es obligatoria/i)).toBeInTheDocument();
    });
  });

  it('authenticates user and calls authService.login', async () => {
    const user = userEvent.setup();
    (authService.login as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      token: 'fake-jwt-token.payload.signature',
      usuario: {
        usuarioId: 1,
        nombre: 'CarlosAdmin',
        correo: 'admin@taller.cl',
        rol: 'Admin',
      },
    });

    render(
      <MemoryRouter>
        <AuthProvider>
          <LoginPage />
        </AuthProvider>
      </MemoryRouter>
    );

    await user.type(screen.getByLabelText(/nombre de usuario/i), 'CarlosAdmin');
    await user.type(screen.getByLabelText(/contraseña/i), 'admin123');
    await user.click(screen.getByRole('button', { name: /iniciar sesión/i }));

    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith({
        nombreUsuario: 'CarlosAdmin',
        password: 'admin123',
      });
    });
  });
});
