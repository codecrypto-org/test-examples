export interface Cliente {
  identificador: string; // DNI (clave primaria)
  nombre: string;
  telefono: string;
  mail: string;
}

export interface CreateClienteDto {
  identificador: string;
  nombre: string;
  telefono: string;
  mail: string;
}

export interface UpdateClienteDto {
  nombre?: string;
  telefono?: string;
  mail?: string;
}

