import { Cliente, CreateClienteDto, UpdateClienteDto } from '@/lib/types/cliente';

// Base de datos en memoria (simula MongoDB)
let clientes: Cliente[] = [];

export const clienteService = {
  /**
   * Crea un nuevo cliente
   * @throws Error si el DNI ya existe
   */
  create(clienteData: CreateClienteDto): Cliente {
    // Validar que el DNI no exista
    const existe = clientes.find(c => c.identificador === clienteData.identificador);
    if (existe) {
      throw new Error('El DNI ya existe');
    }

    const nuevoCliente: Cliente = {
      identificador: clienteData.identificador,
      nombre: clienteData.nombre,
      telefono: clienteData.telefono,
      mail: clienteData.mail,
    };

    clientes.push(nuevoCliente);
    return nuevoCliente;
  },

  /**
   * Obtiene todos los clientes
   */
  findAll(): Cliente[] {
    return [...clientes];
  },

  /**
   * Busca un cliente por DNI
   */
  findByIdentificador(identificador: string): Cliente | null {
    return clientes.find(c => c.identificador === identificador) || null;
  },

  /**
   * Actualiza un cliente existente
   * @throws Error si el cliente no existe
   */
  update(identificador: string, updateData: UpdateClienteDto): Cliente {
    const index = clientes.findIndex(c => c.identificador === identificador);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    clientes[index] = {
      ...clientes[index],
      ...updateData,
    };

    return clientes[index];
  },

  /**
   * Elimina un cliente
   * @throws Error si el cliente no existe
   */
  delete(identificador: string): void {
    const index = clientes.findIndex(c => c.identificador === identificador);
    if (index === -1) {
      throw new Error('Cliente no encontrado');
    }

    clientes.splice(index, 1);
  },

  /**
   * Limpia todos los clientes (útil para tests)
   */
  clear(): void {
    clientes = [];
  },
};

