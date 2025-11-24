# Test Examples - TypeScript Testing Suite

Este repositorio contiene ejemplos completos de diferentes tipos de tests en TypeScript, incluyendo tests unitarios, tests BDD con MongoDB, y tests E2E con Playwright usando Page Object Model (POM).

## 📁 Estructura del Proyecto

### `test-unitarios/`
Tests unitarios usando Jest que demuestran:
- Tests de funciones puras
- Mocks y stubs
- Verificación de lógica de negocio

### `test-bdd/`
Tests BDD (Behavior-Driven Development) con MongoDB:
- Tests de integración con base de datos
- Setup y teardown de datos de prueba
- Tests de modelos y operaciones CRUD

### `test-nextjs/`
Aplicación Next.js con tests E2E usando Playwright:
- Tests E2E tradicionales
- **Tests E2E con Page Object Model (POM)**
- Tests unitarios de componentes React
- Configuración completa de Playwright

## 🚀 Tecnologías Utilizadas

- **TypeScript**: Lenguaje principal
- **Jest**: Framework de testing unitario
- **Playwright**: Framework de testing E2E
- **Next.js**: Framework React
- **MongoDB**: Base de datos para tests BDD
- **React Testing Library**: Testing de componentes React

## 📦 Instalación

Cada subdirectorio tiene su propio `package.json`. Para instalar las dependencias:

```bash
# Tests unitarios
cd test-unitarios && npm install

# Tests BDD
cd test-bdd && npm install

# Tests E2E Next.js
cd test-nextjs && npm install
```

## 🧪 Ejecutar Tests

### Tests Unitarios
```bash
cd test-unitarios
npm test
```

### Tests BDD
```bash
cd test-bdd
npm test
```

### Tests E2E
```bash
cd test-nextjs
npm test              # Tests unitarios de componentes
npx playwright test   # Tests E2E
```

## 📚 Page Object Model (POM)

El proyecto incluye una implementación completa de Page Object Model para los tests E2E:

- **`e2e/pages/LoginPage.ts`**: Clase Page Object que encapsula todos los elementos y acciones de la página de login
- **`e2e/login-pom.spec.ts`**: Suite de tests que utiliza el POM

### Ventajas del POM:
- ✅ Mantenibilidad: Cambios en la UI se reflejan en un solo lugar
- ✅ Legibilidad: Tests más claros y expresivos
- ✅ Reutilización: Métodos compartidos entre tests
- ✅ Separación de responsabilidades: Lógica de la página separada de los tests

## 📝 Documentación

Ver `tipos-de-test.md` para documentación detallada sobre los diferentes tipos de tests.

## 🤝 Contribuir

Este es un repositorio de ejemplos educativos. Las contribuciones son bienvenidas.

## 📄 Licencia

Este proyecto es de código abierto y está disponible para fines educativos.

