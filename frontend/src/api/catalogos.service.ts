import { apiClient } from './client';
import { Mecanico, Pago } from '../types/orden.types';
import { Marca, Modelo, Especialidad, Servicio, Repuesto, Rol } from '../types/catalogo.types';

export const catalogosService = {
  getMecanicos: async (): Promise<Mecanico[]> => {
    const response = await apiClient.get<Mecanico[]>('/mecanicos');
    return response.data;
  },

  getModelos: async (): Promise<Modelo[]> => {
    const response = await apiClient.get<Modelo[]>('/modelo');
    return response.data;
  },

  getMarcas: async (): Promise<Marca[]> => {
    const response = await apiClient.get<Marca[]>('/marca');
    return response.data;
  },

  getEspecialidades: async (): Promise<Especialidad[]> => {
    const response = await apiClient.get<Especialidad[]>('/especialidad');
    return response.data;
  },

  getServicios: async (): Promise<Servicio[]> => {
    const response = await apiClient.get<Servicio[]>('/servicios');
    return response.data;
  },

  getRepuestos: async (): Promise<Repuesto[]> => {
    const response = await apiClient.get<Repuesto[]>('/repuestos');
    return response.data;
  },

  getRoles: async (): Promise<Rol[]> => {
    const response = await apiClient.get<Rol[]>('/rol');
    return response.data;
  },

  getPagos: async (): Promise<Pago[]> => {
    const response = await apiClient.get<Pago[]>('/pago');
    return response.data;
  },
};
