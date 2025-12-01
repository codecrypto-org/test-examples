import { MongoClient, Db } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'magic-link-db';

let client: MongoClient | null = null;
let db: Db | null = null;

/**
 * Conecta a la base de datos MongoDB
 */
export async function connectToDatabase(): Promise<Db> {
  if (db) {
    return db;
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(DB_NAME);
    console.log('Conectado a MongoDB');
    return db;
  } catch (error) {
    console.error('Error conectando a MongoDB:', error);
    throw error;
  }
}

/**
 * Cierra la conexión a la base de datos
 */
export async function closeDatabase(): Promise<void> {
  if (client) {
    await client.close();
    client = null;
    db = null;
    console.log('Conexión a MongoDB cerrada');
  }
}

/**
 * Obtiene la instancia de la base de datos
 */
export function getDatabase(): Db | null {
  return db;
}

/**
 * Limpia todas las colecciones de la base de datos
 */
export async function clearDatabase(): Promise<void> {
  if (!db) {
    await connectToDatabase();
  }
  
  if (db) {
    const collections = await db.listCollections().toArray();
    for (const collection of collections) {
      await db.collection(collection.name).deleteMany({});
    }
  }
}

