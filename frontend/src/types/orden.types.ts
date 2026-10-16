import { Cliente } from './cliente.types';
import { Vehiculo } from './vehiculo.types';

export interface Mecanico {
  mecanicoId: number;
  nombre: string;
  apellido: string;
  telefono?: string;
  especialidadId: number;
  especialidad?: {
    especialidadId: number;
    nombre: string;
  };
}

export interface Pago {
  pagoId: number;
  ordenId: number;
  montoTotal: number;
  metodoPago: string;
  fechaPago?: string;
  estado: string;
}

export interface OrdenTrabajo {
  ordenId: number;
  fechaIngreso: string;
  estado: string;
  observaciones?: string | null;
  clienteId: number;
  vehiculoId: number;
  mecanicoId: number;
  cliente?: Cliente;
  vehiculo?: Vehiculo;
  mecanico?: Mecanico;
  pago?: Pago | null;
}

export interface OrdenTrabajoDTO {
  fechaIngreso?: string;
  estado: string;
  observaciones?: string;
  clienteId: number;
  vehiculoId: number;
  mecanicoId: number;
}
