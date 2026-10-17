import { apiClient } from './client';
import { Mecanico, MecanicoDTO, Pago } from '../types/orden.types';
import {
  Marca,
  Modelo,
  Especialidad,
  Servicio,
  ServicioDTO,
  Repuesto,
  RepuestoDTO,
  Rol,
} from '../types/catalogo.types';

export const catalogosService = {
  // Mecánicos
  getMecanicos: async (): Promise<Mecanico[]> => {
    const response = await apiClient.get<Mecanico[]>('/mecanicos');
    return response.data;
  },

  createMecanico: async (dto: MecanicoDTO): Promise<Mecanico> => {
    const response = await apiClient.post<Mecanico>('/mecanicos', dto);
    return response.data;
  },

  updateMecanico: async (id: number, dto: MecanicoDTO): Promise<void> => {
    await apiClient.put(`/mecanicos/${id}`, dto);
  },

  deleteMecanico: async (id: number): Promise<void> => {
    await apiClient.delete(`/mecanicos/${id}`);
  },

  // Modelos y Marcas
  getModelos: async (): Promise<Modelo[]> => {
    const response = await apiClient.get<Modelo[]>('/modelo');
    return response.data;
  },

  getMarcas: async (): Promise<Marca[]> => {
    const response = await apiClient.get<Marca[]>('/marca');
    return response.data;
  },

  // Especialidades
  getEspecialidades: async (): Promise<Especialidad[]> => {
    const response = await apiClient.get<Especialidad[]>('/especialidad');
    return response.data;
  },

  // Servicios
  getServicios: async (): Promise<Servicio[]> => {
    const response = await apiClient.get<Servicio[]>('/servicios');
    return response.data;
  },

  createServicio: async (dto: ServicioDTO): Promise<Servicio> => {
    const response = await apiClient.post<Servicio>('/servicios', dto);
    return response.data;
  },

  updateServicio: async (id: number, dto: ServicioDTO): Promise<void> => {
    await apiClient.put(`/servicios/${id}`, dto);
  },

  deleteServicio: async (id: number): Promise<void> => {
    await apiClient.delete(`/servicios/${id}`);
  },

  // Repuestos
  getRepuestos: async (): Promise<Repuesto[]> => {
    const response = await apiClient.get<Repuesto[]>('/repuestos');
    return response.data;
  },

  createRepuesto: async (dto: RepuestoDTO): Promise<Repuesto> => {
    const response = await apiClient.post<Repuesto>('/repuestos', dto);
    return response.data;
  },

  updateRepuesto: async (id: number, dto: RepuestoDTO): Promise<void> => {
    await apiClient.put(`/repuestos/${id}`, dto);
  },

  deleteRepuesto: async (id: number): Promise<void> => {
    await apiClient.delete(`/repuestos/${id}`);
  },

  // Roles y Pagos
  getRoles: async (): Promise<Rol[]> => {
    const response = await apiClient.get<Rol[]>('/rol');
    return response.data;
  },

  getPagos: async (): Promise<Pago[]> => {
    const response = await apiClient.get<Pago[]>('/pago');
    return response.data;
  },
};
