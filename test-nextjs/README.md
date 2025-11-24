# Test Next.js - Login con Tests

Proyecto Next.js con un formulario de login que incluye:
- Validación con Zod y React Hook Form
- API en memoria para autenticación
- Tests unitarios con Jest y React Testing Library
- Tests E2E con Playwright

## Estructura del Proyecto

```
test-nextjs/
├── app/
│   ├── login/
│   │   └── page.tsx          # Página de login
│   ├── api/
│   │   └── auth/
│   │       └── login/
│   │           └── route.ts   # API route para autenticación
│   ├── layout.tsx
│   └── globals.css
├── components/
│   └── Login.tsx              # Componente de login
├── __tests__/
│   └── components/
│       └── Login.test.tsx     # Tests unitarios
├── e2e/
│   └── login.spec.ts          # Tests E2E con Playwright
└── package.json
```

## Instalación

```bash
npm install
```

## Ejecutar en Desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000/login](http://localhost:3000/login) en tu navegador.

## Usuarios Disponibles (en memoria)

- **admin** / admin123
- **test** / test123
- **demo** / demo123

## Tests

### Tests Unitarios

```bash
# Ejecutar tests unitarios
npm test

# Modo watch
npm run test:watch
```

Los tests unitarios cubren:
- Renderizado del formulario
- Validación de campos requeridos
- Login exitoso
- Manejo de errores
- Estado de carga

### Tests E2E con Playwright

```bash
# Ejecutar tests E2E
npm run test:e2e

# Ejecutar con UI interactiva
npm run test:e2e:ui
```

Los tests E2E cubren:
- Visualización del formulario
- Validaciones del formulario
- Login exitoso e incorrecto
- Múltiples usuarios válidos
- Estado de carga

## Tecnologías Utilizadas

- **Next.js 14** - Framework React
- **TypeScript** - Tipado estático
- **Zod** - Validación de esquemas
- **React Hook Form** - Manejo de formularios
- **Jest** - Framework de testing
- **React Testing Library** - Testing de componentes
- **Playwright** - Testing E2E

## Características

### Validación con Zod

El formulario valida que:
- El usuario no esté vacío
- La contraseña no esté vacía

### API en Memoria

La API `/api/auth/login` valida las credenciales contra una base de datos en memoria con 3 usuarios predefinidos.

### Tests

- **Unitarios**: Prueban el componente de forma aislada
- **E2E**: Prueban el flujo completo desde el navegador
