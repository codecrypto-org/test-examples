import { connectToDatabase, closeDatabase, clearDatabase } from '../src/db/connection';
import { seedDatabase } from '../src/db/seed';

/**
 * Setup global antes de todos los tests
 */
beforeAll(async () => {
  const db = await connectToDatabase();
  await clearDatabase();
  await seedDatabase(db);
});

/**
 * Teardown global después de todos los tests
 */
afterAll(async () => {
  await closeDatabase();
});

/**
 * Setup antes de cada test (opcional: reinicializar datos)
 * Descomenta si quieres datos frescos en cada test
 */
// beforeEach(async () => {
//   const db = await connectToDatabase();
//   await clearDatabase();
//   await seedDatabase(db);
// });

