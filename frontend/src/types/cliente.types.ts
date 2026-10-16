export interface Cliente {
  clienteId: number;
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  direccion?: string | null;
}

export interface ClienteDTO {
  nombre: string;
  apellido: string;
  telefono: string;
  correo: string;
  direccion?: string;
}
