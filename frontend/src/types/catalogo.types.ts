export interface Marca {
  marcaId: number;
  nombre: string;
}

export interface Modelo {
  modeloId: number;
  nombre: string;
  marcaId: number;
  marca?: Marca;
}

export interface Especialidad {
  especialidadId: number;
  nombre: string;
  descripcion: string;
}

export interface Servicio {
  servicioId: number;
  nombre: string;
  descripcion: string;
  costo: number;
}

export interface ServicioDTO {
  nombre: string;
  descripcion: string;
  costo: number;
}

export interface Repuesto {
  repuestoId: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface RepuestoDTO {
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
}

export interface Rol {
  rolId: number;
  nombre: string;
  descripcion: string;
}
