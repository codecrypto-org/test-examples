import { Db } from 'mongodb';
import { User } from '../models/user';

/**
 * Datos iniciales para los tests
 */
export const datosIniciales: Omit<User, '_id'>[] = [
  {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    edad: 30,
    activo: true
  },
  {
    nombre: 'María García',
    email: 'maria.garcia@example.com',
    edad: 25,
    activo: true
  },
  {
    nombre: 'Carlos López',
    email: 'carlos.lopez@example.com',
    edad: 35,
    activo: false
  },
  {
    nombre: 'Ana Martínez',
    email: 'ana.martinez@example.com',
    edad: 28,
    activo: true
  }
];

/**
 * Inicializa la base de datos con datos de prueba
 */
export async function seedDatabase(db: Db): Promise<void> {
  // Limpiar la colección antes de insertar datos
  await db.collection<User>('usuarios').deleteMany({});
  
  // Insertar datos iniciales
  await db.collection<User>('usuarios').insertMany(datosIniciales as User[]);
  
  console.log(`Base de datos inicializada con ${datosIniciales.length} usuarios`);
}

