import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { OrdenesListPage } from './OrdenesListPage';
import { ordenesService } from '../../api/ordenes.service';
import * as AuthContextModule from '../../context/AuthContext';
import { OrdenTrabajo } from '../../types/orden.types';

vi.mock('../../api/ordenes.service', () => ({
  ordenesService: {
    getAll: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockOrdenes: OrdenTrabajo[] = [
  {
    ordenId: 101,
    fechaIngreso: '2026-10-15T10:00:00Z',
    estado: 'Pendiente',
    observaciones: 'Cambio de pastillas de freno',
    clienteId: 1,
    vehiculoId: 1,
    mecanicoId: 1,
    cliente: {
      clienteId: 1,
      nombre: 'Pedro',
      apellido: 'Pascal',
      telefono: '+56911112222',
      correo: 'pedro@email.com',
    },
    vehiculo: {
      vehiculoId: 1,
      patente: 'JJXX12',
      color: 'Gris',
      clienteId: 1,
      modeloId: 1,
    },
  },
  {
    ordenId: 102,
    fechaIngreso: '2026-10-16T12:00:00Z',
    estado: 'Completado',
    observaciones: 'Alineación y balanceo',
    clienteId: 2,
    vehiculoId: 2,
    mecanicoId: 1,
    cliente: {
      clienteId: 2,
      nombre: 'Lucía',
      apellido: 'Méndez',
      telefono: '+56933334444',
      correo: 'lucia@email.com',
    },
    vehiculo: {
      vehiculoId: 2,
      patente: 'BBCC34',
      color: 'Azul',
      clienteId: 2,
      modeloId: 1,
    },
  },
];

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

describe('OrdenesListPage Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(AuthContextModule, 'useAuth').mockReturnValue({
      user: { usuarioId: 1, nombre: 'AdminUser', correo: 'admin@taller.cl', rol: 'Admin' },
      token: 'admin-token',
      role: 'Admin',
      isAuthenticated: true,
      isLoading: false,
      login: vi.fn(),
      logout: vi.fn(),
    });
  });

  it('renders order list retrieved from API', async () => {
    (ordenesService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrdenes);

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <OrdenesListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/#101/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/#102/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/pedro pascal/i)[0]).toBeInTheDocument();
      expect(screen.getAllByText(/lucía méndez/i)[0]).toBeInTheDocument();
    });
  });

  it('filters orders by search input', async () => {
    const user = userEvent.setup();
    (ordenesService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrdenes);

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <OrdenesListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByText(/#101/i)[0]).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/buscar por id, cliente, patente/i);
    await user.type(searchInput, 'JJXX12');

    await waitFor(() => {
      expect(screen.getAllByText(/#101/i)[0]).toBeInTheDocument();
      expect(screen.queryByText(/#102/i)).not.toBeInTheDocument();
    });
  });

  it('opens confirmation modal when clicking delete button', async () => {
    const user = userEvent.setup();
    (ordenesService.getAll as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockOrdenes);

    render(
      <QueryClientProvider client={createTestQueryClient()}>
        <MemoryRouter>
          <OrdenesListPage />
        </MemoryRouter>
      </QueryClientProvider>
    );

    await waitFor(() => {
      expect(screen.getAllByLabelText(/eliminar orden #101/i)[0]).toBeInTheDocument();
    });

    const deleteBtn = screen.getAllByLabelText(/eliminar orden #101/i)[0];
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/¿eliminar orden de trabajo\?/i)).toBeInTheDocument();
      expect(screen.getByText(/estás a punto de eliminar la orden #101/i)).toBeInTheDocument();
    });
  });
});
