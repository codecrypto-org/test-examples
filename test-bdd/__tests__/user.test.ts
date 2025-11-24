import { connectToDatabase, getDatabase } from '../src/db/connection';
import {
  obtenerUsuarios,
  obtenerUsuarioPorEmail,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario,
  obtenerUsuariosActivos,
  User
} from '../src/models/user';
import { seedDatabase } from '../src/db/seed';

describe('Tests de Usuarios con MongoDB', () => {
  let db: any;

  beforeAll(async () => {
    db = await connectToDatabase();
    // Asegurar que tenemos datos iniciales antes de cada suite de tests
    await seedDatabase(db);
  });

  beforeEach(async () => {
    // Reinicializar datos antes de cada test para tener un estado limpio
    await seedDatabase(db);
  });

  describe('Obtener usuarios', () => {
    it('debería obtener todos los usuarios', async () => {
      const usuarios = await obtenerUsuarios(db);
      
      expect(usuarios).toHaveLength(4);
      expect(usuarios[0]).toHaveProperty('nombre');
      expect(usuarios[0]).toHaveProperty('email');
      expect(usuarios[0]).toHaveProperty('edad');
      expect(usuarios[0]).toHaveProperty('activo');
    });

    it('debería obtener un usuario por email', async () => {
      const usuario = await obtenerUsuarioPorEmail(db, 'juan.perez@example.com');
      
      expect(usuario).not.toBeNull();
      expect(usuario?.nombre).toBe('Juan Pérez');
      expect(usuario?.email).toBe('juan.perez@example.com');
      expect(usuario?.edad).toBe(30);
      expect(usuario?.activo).toBe(true);
    });

    it('debería obtener un usuario por ID', async () => {
      // Primero obtener un usuario para tener su ID
      const usuarios = await obtenerUsuarios(db);
      const primerUsuario = usuarios[0];
      
      const usuario = await obtenerUsuarioPorId(db, primerUsuario._id!.toString());
      
      expect(usuario).not.toBeNull();
      expect(usuario?.nombre).toBe(primerUsuario.nombre);
      expect(usuario?.email).toBe(primerUsuario.email);
    });

    it('debería obtener solo usuarios activos', async () => {
      const usuariosActivos = await obtenerUsuariosActivos(db);
      
      // De los 4 usuarios iniciales, 3 están activos
      expect(usuariosActivos.length).toBeGreaterThanOrEqual(3);
      usuariosActivos.forEach(usuario => {
        expect(usuario.activo).toBe(true);
      });
    });
  });

  describe('Crear usuarios', () => {
    it('debería crear un nuevo usuario', async () => {
      const nuevoUsuario: Omit<User, '_id'> = {
        nombre: 'Pedro Sánchez',
        email: 'pedro.sanchez@example.com',
        edad: 32,
        activo: true
      };

      const usuarioCreado = await crearUsuario(db, nuevoUsuario);
      
      expect(usuarioCreado).not.toBeNull();
      expect(usuarioCreado._id).toBeDefined();
      expect(usuarioCreado.nombre).toBe('Pedro Sánchez');
      expect(usuarioCreado.email).toBe('pedro.sanchez@example.com');
      
      // Verificar que se guardó en la base de datos
      const usuarioEnBD = await obtenerUsuarioPorEmail(db, 'pedro.sanchez@example.com');
      expect(usuarioEnBD).not.toBeNull();
    });

    it('debería incrementar el número de usuarios después de crear uno', async () => {
      const usuariosAntes = await obtenerUsuarios(db);
      const cantidadAntes = usuariosAntes.length;

      await crearUsuario(db, {
        nombre: 'Test User',
        email: 'test@example.com',
        edad: 20,
        activo: true
      });

      const usuariosDespues = await obtenerUsuarios(db);
      expect(usuariosDespues.length).toBe(cantidadAntes + 1);
    });
  });

  describe('Actualizar usuarios', () => {
    it('debería actualizar un usuario existente', async () => {
      // Obtener un usuario existente
      const usuarios = await obtenerUsuarios(db);
      const usuario = usuarios[0];
      const usuarioId = usuario._id!.toString();

      // Actualizar el usuario
      const usuarioActualizado = await actualizarUsuario(db, usuarioId, {
        nombre: 'Juan Pérez Actualizado',
        edad: 31
      });

      expect(usuarioActualizado).not.toBeNull();
      expect(usuarioActualizado?.nombre).toBe('Juan Pérez Actualizado');
      expect(usuarioActualizado?.edad).toBe(31);
      expect(usuarioActualizado?.email).toBe(usuario.email); // Email no cambió
    });

    it('debería cambiar el estado activo de un usuario', async () => {
      const usuarios = await obtenerUsuarios(db);
      const usuarioInactivo = usuarios.find(u => !u.activo);
      
      if (usuarioInactivo) {
        const usuarioActualizado = await actualizarUsuario(db, usuarioInactivo._id!.toString(), {
          activo: true
        });

        expect(usuarioActualizado?.activo).toBe(true);
      }
    });
  });

  describe('Eliminar usuarios', () => {
    it('debería eliminar un usuario existente', async () => {
      const usuariosAntes = await obtenerUsuarios(db);
      const cantidadAntes = usuariosAntes.length;
      const usuarioAEliminar = usuariosAntes[0];
      const usuarioId = usuarioAEliminar._id!.toString();

      const eliminado = await eliminarUsuario(db, usuarioId);

      expect(eliminado).toBe(true);

      const usuariosDespues = await obtenerUsuarios(db);
      expect(usuariosDespues.length).toBe(cantidadAntes - 1);

      // Verificar que el usuario ya no existe
      const usuarioEliminado = await obtenerUsuarioPorId(db, usuarioId);
      expect(usuarioEliminado).toBeNull();
    });

    it('debería retornar false al intentar eliminar un usuario inexistente', async () => {
      const objectIdInexistente = '507f1f77bcf86cd799439011';
      const eliminado = await eliminarUsuario(db, objectIdInexistente);
      
      expect(eliminado).toBe(false);
    });
  });

  describe('Integración: Flujo completo', () => {
    it('debería realizar un flujo completo CRUD', async () => {
      // CREATE
      const nuevoUsuario = await crearUsuario(db, {
        nombre: 'Usuario Test',
        email: 'usuario.test@example.com',
        edad: 25,
        activo: true
      });
      expect(nuevoUsuario._id).toBeDefined();

      // READ
      const usuarioLeido = await obtenerUsuarioPorId(db, nuevoUsuario._id!.toString());
      expect(usuarioLeido?.nombre).toBe('Usuario Test');

      // UPDATE
      const usuarioActualizado = await actualizarUsuario(db, nuevoUsuario._id!.toString(), {
        nombre: 'Usuario Test Actualizado',
        edad: 26
      });
      expect(usuarioActualizado?.nombre).toBe('Usuario Test Actualizado');
      expect(usuarioActualizado?.edad).toBe(26);

      // DELETE
      const eliminado = await eliminarUsuario(db, nuevoUsuario._id!.toString());
      expect(eliminado).toBe(true);

      // Verificar eliminación
      const usuarioEliminado = await obtenerUsuarioPorId(db, nuevoUsuario._id!.toString());
      expect(usuarioEliminado).toBeNull();
    });
  });
});

