import { NextRequest } from 'next/server';

// Mock del servicio antes de importar las rutas
jest.mock('@/lib/services/cliente-service', () => ({
  clienteService: {
    create: jest.fn(),
    findAll: jest.fn(),
    findByIdentificador: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    clear: jest.fn(),
  },
}));

import { GET, POST } from '@/app/api/clientes/route';
import { GET as GETById, PUT, DELETE } from '@/app/api/clientes/[identificador]/route';
import { clienteService } from '@/lib/services/cliente-service';

// Helper para obtener mocks tipados
const getMockedService = () => ({
  create: jest.mocked(clienteService.create),
  findAll: jest.mocked(clienteService.findAll),
  findByIdentificador: jest.mocked(clienteService.findByIdentificador),
  update: jest.mocked(clienteService.update),
  delete: jest.mocked(clienteService.delete),
  clear: jest.mocked(clienteService.clear),
});

describe('API Clientes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const mockService = getMockedService();
    mockService.clear();
  });

  describe('GET /api/clientes', () => {
    it('debería retornar todos los clientes', async () => {
      const mockClientes = [
        {
          identificador: '12345678',
          nombre: 'Juan Pérez',
          telefono: '123456789',
          mail: 'juan@example.com',
        },
        {
          identificador: '87654321',
          nombre: 'María García',
          telefono: '987654321',
          mail: 'maria@example.com',
        },
      ];

      const mockService = getMockedService();
      mockService.findAll.mockReturnValue(mockClientes);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockClientes);
      expect(mockService.findAll).toHaveBeenCalledTimes(1);
    });

    it('debería retornar array vacío cuando no hay clientes', async () => {
      const mockService = getMockedService();
      mockService.findAll.mockReturnValue([]);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual([]);
    });
  });

  describe('POST /api/clientes', () => {
    it('debería crear un nuevo cliente exitosamente', async () => {
      const nuevoCliente = {
        identificador: '12345678',
        nombre: 'Juan Pérez',
        telefono: '123456789',
        mail: 'juan@example.com',
      };

      const mockService = getMockedService();
      mockService.create.mockReturnValue(nuevoCliente);

      const request = new NextRequest('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify(nuevoCliente),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(nuevoCliente);
      expect(mockService.create).toHaveBeenCalledWith(nuevoCliente);
    });

    it('debería retornar error 400 cuando faltan campos requeridos', async () => {
      const request = new NextRequest('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify({
          identificador: '12345678',
          // Faltan nombre, telefono, mail
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Datos inválidos');
      expect(data.errors).toBeDefined();
    });

    it('debería retornar error 400 cuando el email no es válido', async () => {
      const request = new NextRequest('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify({
          identificador: '12345678',
          nombre: 'Juan Pérez',
          telefono: '123456789',
          mail: 'email-invalido',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Datos inválidos');
    });

    it('debería retornar error 409 cuando el DNI ya existe', async () => {
      const mockService = getMockedService();
      mockService.create.mockImplementation(() => {
        throw new Error('El DNI ya existe');
      });

      const request = new NextRequest('http://localhost/api/clientes', {
        method: 'POST',
        body: JSON.stringify({
          identificador: '12345678',
          nombre: 'Juan Pérez',
          telefono: '123456789',
          mail: 'juan@example.com',
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(409);
      expect(data.message).toBe('El DNI ya existe');
    });
  });

  describe('GET /api/clientes/[identificador]', () => {
    it('debería retornar un cliente por DNI', async () => {
      const cliente = {
        identificador: '12345678',
        nombre: 'Juan Pérez',
        telefono: '123456789',
        mail: 'juan@example.com',
      };

      const mockService = getMockedService();
      mockService.findByIdentificador.mockReturnValue(cliente);

      const response = await GETById(
        new NextRequest('http://localhost/api/clientes/12345678'),
        { params: { identificador: '12345678' } }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(cliente);
      expect(mockService.findByIdentificador).toHaveBeenCalledWith('12345678');
    });

    it('debería retornar 404 cuando el cliente no existe', async () => {
      const mockService = getMockedService();
      mockService.findByIdentificador.mockReturnValue(null);

      const response = await GETById(
        new NextRequest('http://localhost/api/clientes/99999999'),
        { params: { identificador: '99999999' } }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('Cliente no encontrado');
    });
  });

  describe('PUT /api/clientes/[identificador]', () => {
    it('debería actualizar un cliente exitosamente', async () => {
      const clienteActualizado = {
        identificador: '12345678',
        nombre: 'Juan Pérez Actualizado',
        telefono: '987654321',
        mail: 'juan.actualizado@example.com',
      };

      const mockService = getMockedService();
      mockService.update.mockReturnValue(clienteActualizado);

      const request = new NextRequest('http://localhost/api/clientes/12345678', {
        method: 'PUT',
        body: JSON.stringify({
          nombre: 'Juan Pérez Actualizado',
          telefono: '987654321',
          mail: 'juan.actualizado@example.com',
        }),
      });

      const response = await PUT(request, { params: { identificador: '12345678' } });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(clienteActualizado);
      expect(mockService.update).toHaveBeenCalledWith('12345678', {
        nombre: 'Juan Pérez Actualizado',
        telefono: '987654321',
        mail: 'juan.actualizado@example.com',
      });
    });

    it('debería retornar 404 cuando el cliente no existe', async () => {
      const mockService = getMockedService();
      mockService.update.mockImplementation(() => {
        throw new Error('Cliente no encontrado');
      });

      const request = new NextRequest('http://localhost/api/clientes/99999999', {
        method: 'PUT',
        body: JSON.stringify({
          nombre: 'Nuevo Nombre',
        }),
      });

      const response = await PUT(request, { params: { identificador: '99999999' } });
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('Cliente no encontrado');
    });

    it('debería retornar 400 cuando el email no es válido', async () => {
      const request = new NextRequest('http://localhost/api/clientes/12345678', {
        method: 'PUT',
        body: JSON.stringify({
          mail: 'email-invalido',
        }),
      });

      const response = await PUT(request, { params: { identificador: '12345678' } });
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.message).toBe('Datos inválidos');
    });
  });

  describe('DELETE /api/clientes/[identificador]', () => {
    it('debería eliminar un cliente exitosamente', async () => {
      const mockService = getMockedService();
      mockService.delete.mockReturnValue(undefined);

      const response = await DELETE(
        new NextRequest('http://localhost/api/clientes/12345678'),
        { params: { identificador: '12345678' } }
      );
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.message).toBe('Cliente eliminado correctamente');
      expect(mockService.delete).toHaveBeenCalledWith('12345678');
    });

    it('debería retornar 404 cuando el cliente no existe', async () => {
      const mockService = getMockedService();
      mockService.delete.mockImplementation(() => {
        throw new Error('Cliente no encontrado');
      });

      const response = await DELETE(
        new NextRequest('http://localhost/api/clientes/99999999'),
        { params: { identificador: '99999999' } }
      );
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.message).toBe('Cliente no encontrado');
    });
  });
});

