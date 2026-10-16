import { apiClient } from './client';
import { Cliente, ClienteDTO } from '../types/cliente.types';

export const clientesService = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await apiClient.get<Cliente[]>('/clientes');
    return response.data;
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await apiClient.get<Cliente>(`/clientes/${id}`);
    return response.data;
  },

  create: async (dto: ClienteDTO): Promise<Cliente> => {
    const response = await apiClient.post<Cliente>('/clientes', dto);
    return response.data;
  },

  update: async (id: number, dto: ClienteDTO): Promise<void> => {
    await apiClient.put(`/clientes/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/clientes/${id}`);
  },
};
