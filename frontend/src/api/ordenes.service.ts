import { apiClient } from './client';
import { OrdenTrabajo, OrdenTrabajoDTO } from '../types/orden.types';

export const ordenesService = {
  getAll: async (): Promise<OrdenTrabajo[]> => {
    const response = await apiClient.get<OrdenTrabajo[]>('/ordenes-trabajo');
    return response.data;
  },

  getById: async (id: number): Promise<OrdenTrabajo> => {
    const response = await apiClient.get<OrdenTrabajo>(`/ordenes-trabajo/${id}`);
    return response.data;
  },

  create: async (dto: OrdenTrabajoDTO): Promise<OrdenTrabajo> => {
    const response = await apiClient.post<OrdenTrabajo>('/ordenes-trabajo', dto);
    return response.data;
  },

  update: async (id: number, dto: OrdenTrabajoDTO): Promise<void> => {
    await apiClient.put(`/ordenes-trabajo/${id}`, dto);
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/ordenes-trabajo/${id}`);
  },
};
