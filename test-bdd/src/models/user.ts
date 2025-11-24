import { Db, ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  nombre: string;
  email: string;
  edad: number;
  activo: boolean;
}

/**
 * Obtiene todos los usuarios
 */
export async function obtenerUsuarios(db: Db): Promise<User[]> {
  const usuarios = await db.collection<User>('usuarios').find({}).toArray();
  return usuarios;
}

/**
 * Obtiene un usuario por ID
 */
export async function obtenerUsuarioPorId(db: Db, id: string): Promise<User | null> {
  const usuario = await db.collection<User>('usuarios').findOne({ _id: new ObjectId(id) });
  return usuario;
}

/**
 * Obtiene un usuario por email
 */
export async function obtenerUsuarioPorEmail(db: Db, email: string): Promise<User | null> {
  const usuario = await db.collection<User>('usuarios').findOne({ email });
  return usuario;
}

/**
 * Crea un nuevo usuario
 */
export async function crearUsuario(db: Db, usuario: Omit<User, '_id'>): Promise<User> {
  const result = await db.collection<User>('usuarios').insertOne(usuario as User);
  const nuevoUsuario = await db.collection<User>('usuarios').findOne({ _id: result.insertedId });
  if (!nuevoUsuario) {
    throw new Error('Error al crear el usuario');
  }
  return nuevoUsuario;
}

/**
 * Actualiza un usuario
 */
export async function actualizarUsuario(
  db: Db,
  id: string,
  datos: Partial<Omit<User, '_id'>>
): Promise<User | null> {
  await db.collection<User>('usuarios').updateOne(
    { _id: new ObjectId(id) },
    { $set: datos }
  );
  return await obtenerUsuarioPorId(db, id);
}

/**
 * Elimina un usuario
 */
export async function eliminarUsuario(db: Db, id: string): Promise<boolean> {
  const result = await db.collection<User>('usuarios').deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

/**
 * Obtiene usuarios activos
 */
export async function obtenerUsuariosActivos(db: Db): Promise<User[]> {
  const usuarios = await db.collection<User>('usuarios').find({ activo: true }).toArray();
  return usuarios;
}

