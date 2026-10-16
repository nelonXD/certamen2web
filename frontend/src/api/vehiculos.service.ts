import { apiClient } from './client';
import { Vehiculo, VehiculoDTO } from '../types/vehiculo.types';

export const vehiculosService = {
  getAll: async (): Promise<Vehiculo[]> => {
    const response = await apiClient.get<Vehiculo[]>('/vehiculos');
    return response.data;
  },

  getById: async (id: number): Promise<Vehiculo> => {
    const response = await apiClient.get<Vehiculo>(`/vehiculos/${id}`);
    return response.data;
  },

  create: async (dto: VehiculoDTO): Promise<Vehiculo> => {
    const response = await apiClient.post<Vehiculo>('/vehiculos', dto);
    return response.data;
  },

  update: async (id: number, dto: VehiculoDTO): Promise<void> => {
    await apiClient.put(`/vehiculos/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/vehiculos/${id}`);
  },
};
