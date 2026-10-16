export interface Vehiculo {
  vehiculoId: number;
  patente: string;
  anio?: number | null;
  color: string;
  clienteId: number;
  modeloId: number;
  cliente?: {
    clienteId: number;
    nombre: string;
    apellido: string;
    telefono?: string;
    correo?: string;
  };
  modelo?: {
    modeloId: number;
    nombre: string;
    marcaId: number;
    marca?: {
      marcaId: number;
      nombre: string;
    };
  };
}

export interface VehiculoDTO {
  patente: string;
  anio?: number;
  color: string;
  clienteId: number;
  modeloId: number;
}
