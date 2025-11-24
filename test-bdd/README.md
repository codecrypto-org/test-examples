# Tests con MongoDB - TypeScript

Este proyecto demuestra cómo crear tests unitarios e integración con MongoDB usando el driver nativo (sin Mongoose) en TypeScript. Los tests se ejecutan con datos iniciales predefinidos.

## Requisitos Previos

- Node.js instalado
- MongoDB instalado y ejecutándose localmente en `mongodb://localhost:27017`

## Estructura del Proyecto

```
test-bdd/
├── src/
│   ├── db/
│   │   ├── connection.ts    # Conexión a MongoDB
│   │   └── seed.ts          # Datos iniciales para tests
│   └── models/
│       └── user.ts          # Funciones CRUD de usuarios
├── __tests__/
│   ├── setup.ts             # Configuración global de tests
│   └── user.test.ts         # Tests de usuarios
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Instalación

```bash
npm install
```

## Configuración

El proyecto está configurado para conectarse a MongoDB local por defecto:
- **URI**: `mongodb://localhost:27017`
- **Base de datos**: `test_db`

Puedes cambiar estos valores usando variables de entorno:
```bash
export MONGODB_URI="mongodb://localhost:27017"
export DB_NAME="test_db"
```

## Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

## Cómo Funciona

### Inicialización de Datos

Cada vez que se ejecutan los tests:

1. **beforeAll**: Se conecta a MongoDB, limpia la base de datos e inserta datos iniciales
2. **beforeEach**: (Opcional) Reinicializa los datos antes de cada test para tener un estado limpio
3. **afterAll**: Cierra la conexión a MongoDB

### Datos Iniciales

Los datos iniciales se definen en `src/db/seed.ts` y se insertan automáticamente antes de cada suite de tests:

- Juan Pérez (activo)
- María García (activa)
- Carlos López (inactivo)
- Ana Martínez (activa)

### Ejemplo de Test

```typescript
it('debería obtener todos los usuarios', async () => {
  const usuarios = await obtenerUsuarios(db);
  expect(usuarios).toHaveLength(4);
});
```

## Tests Incluidos

- ✅ Obtener usuarios (todos, por ID, por email, activos)
- ✅ Crear nuevos usuarios
- ✅ Actualizar usuarios existentes
- ✅ Eliminar usuarios
- ✅ Flujo completo CRUD

## Notas Importantes

1. **Base de datos de prueba**: Los tests usan la base de datos `test_db`. Asegúrate de que no contenga datos importantes.

2. **Limpieza de datos**: Los datos se limpian e inicializan antes de cada suite de tests para garantizar un estado consistente.

3. **Timeout**: Los tests tienen un timeout de 10 segundos para dar tiempo a la conexión con MongoDB.

4. **Sin Mongoose**: Este ejemplo usa el driver nativo de MongoDB (`mongodb`), no Mongoose.

## Solución de Problemas

### Error de conexión a MongoDB

Asegúrate de que MongoDB esté ejecutándose:
```bash
# En macOS con Homebrew
brew services start mongodb-community

# O ejecutar directamente
mongod
```

### Puerto diferente

Si MongoDB está en un puerto diferente, configura la variable de entorno:
```bash
export MONGODB_URI="mongodb://localhost:27018"
```

