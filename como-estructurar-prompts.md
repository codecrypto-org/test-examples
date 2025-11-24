# Cómo Estructurar Prompts para Trabajar con IA de Desarrollo

Basado en la experiencia del proyecto de testing, aquí están las mejores prácticas para estructurar tus prompts y hacer el trabajo más eficiente.

## 🎯 Principios Fundamentales

### 1. **Sé Específico y Completo desde el Inicio**

**❌ Mal:**
```
crea un folder llamado test-unitarios donde hagas una function A que a su vez llame a dos funciones B y C
```

**✅ Mejor:**
```
Crea un proyecto TypeScript en la carpeta test-unitarios con:
- Función A que depende de funciones B y C
- Tests unitarios usando Jest que mockeen B y C
- Configuración completa (package.json, tsconfig.json, jest.config.js)
- README con instrucciones de uso
- Ejemplo práctico: sistema de pedidos (validar stock + calcular precio)
```

### 2. **Agrupa Requisitos Relacionados**

**❌ Mal (múltiples mensajes):**
```
1. "crea un folder test-unitarios"
2. "añade tests"
3. "configura jest"
4. "añade un README"
```

**✅ Mejor (un solo prompt):**
```
Crea un proyecto completo de tests unitarios en TypeScript con:
- Estructura de carpetas (src/, __tests__/)
- Configuración Jest y TypeScript
- Ejemplo funcional con mocks
- Tests que pasen
- README con documentación
```

### 3. **Especifica el Stack Tecnológico Completo**

**❌ Mal:**
```
haz un login con tests
```

**✅ Mejor:**
```
Crea un formulario de login en Next.js 14 con:
- TypeScript
- React Hook Form + Zod para validación
- API route en memoria para autenticación
- Tests unitarios con Jest y React Testing Library
- Tests E2E con Playwright
- Screenshots automáticos en cada test
```

### 4. **Define el Alcance y los Entregables**

**✅ Ejemplo de prompt completo:**
```
Crea un proyecto de tests con MongoDB en la carpeta test-bdd con:

REQUISITOS:
- TypeScript sin Mongoose (usar driver nativo)
- MongoDB local en localhost:27017
- Base de datos: test_db
- Inicialización automática de datos antes de cada test

FUNCIONALIDADES:
- CRUD completo de usuarios
- Seed data con 4 usuarios de ejemplo
- Setup/teardown automático

TESTS:
- Tests que verifiquen todas las operaciones CRUD
- Tests que usen los datos iniciales
- Todos los tests deben pasar

ENTREGABLES:
- Código fuente completo
- package.json con todas las dependencias
- README con instrucciones de instalación y ejecución
- Configuración de Jest
```

## 📋 Plantilla de Prompt Estructurado

```
OBJETIVO:
[Descripción clara del objetivo principal]

CONTEXTO:
- Tecnologías: [Lista de tecnologías a usar]
- Versiones: [Versiones específicas si es importante]
- Restricciones: [Lo que NO debe usar o hacer]

ESTRUCTURA:
- Carpetas: [Estructura de directorios]
- Archivos principales: [Archivos clave a crear]

FUNCIONALIDADES:
1. [Funcionalidad 1 con detalles]
2. [Funcionalidad 2 con detalles]
3. [Funcionalidad 3 con detalles]

TESTS:
- Tipo de tests: [Unitarios, E2E, Integración]
- Framework: [Jest, Playwright, etc.]
- Cobertura: [Qué debe cubrir]
- Estado esperado: [Todos deben pasar]

ENTREGABLES:
- [ ] Código fuente
- [ ] Configuración
- [ ] Tests
- [ ] Documentación
- [ ] README

EJEMPLO DE USO:
[Si aplica, un ejemplo de cómo se usaría]
```

## 🎨 Ejemplos de Prompts Mejorados

### Ejemplo 1: Tests Unitarios con Mocks

**Prompt Mejorado:**
```
Crea un proyecto TypeScript en test-unitarios/ que demuestre mocking de dependencias:

ESTRUCTURA:
- src/
  - pedido.ts (función principal A)
  - inventory.ts (función B: validarStock)
  - pricing.ts (función C: calcularPrecioTotal)
- __tests__/
  - pedido.test.ts (tests con mocks de B y C)

REQUISITOS:
- Función A: procesarPedido que depende de B y C
- Ejemplo: sistema de e-commerce (validar stock + calcular precio)
- Tests que mockeen B y C usando jest.mock()
- Verificar que los mocks fueron llamados correctamente
- Configuración completa: package.json, tsconfig.json, jest.config.js
- README con explicación del ejemplo

TECNOLOGÍAS:
- TypeScript
- Jest
- @types/jest

ENTREGABLES:
- Código funcional
- Tests que pasen
- Documentación
```

### Ejemplo 2: Tests con Base de Datos

**Prompt Mejorado:**
```
Crea un proyecto de tests con MongoDB en test-bdd/:

CONFIGURACIÓN:
- TypeScript
- Driver nativo de MongoDB (NO Mongoose)
- MongoDB local: mongodb://localhost:27017
- Base de datos: test_db

FUNCIONALIDADES:
- CRUD completo de usuarios
- Seed data automático antes de cada test
- Setup/teardown de conexión

ESTRUCTURA:
- src/
  - db/connection.ts (conexión y utilidades)
  - db/seed.ts (datos iniciales)
  - models/user.ts (operaciones CRUD)
- __tests__/
  - setup.ts (configuración global)
  - user.test.ts (tests CRUD)

DATOS INICIALES:
- 4 usuarios de ejemplo (admin, test, demo, etc.)
- Se insertan automáticamente antes de cada suite de tests

TESTS:
- Obtener usuarios (todos, por ID, por email)
- Crear usuario
- Actualizar usuario
- Eliminar usuario
- Flujo completo CRUD
- Todos deben pasar

ENTREGABLES:
- Código completo
- package.json con dependencias
- README con instrucciones
- Configuración Jest
```

### Ejemplo 3: Proyecto Completo con Tests

**Prompt Mejorado:**
```
Crea un proyecto Next.js completo en test-nextjs/ con formulario de login:

STACK:
- Next.js 14 (App Router)
- TypeScript
- React Hook Form + Zod
- Jest + React Testing Library (tests unitarios)
- Playwright (tests E2E)

FUNCIONALIDADES:
- Ruta /login con formulario
- Validación: usuario y password requeridos
- API /api/auth/login con validación en memoria
- Usuarios válidos: admin/admin123, test/test123, demo/demo123

ESTRUCTURA:
- app/login/page.tsx
- components/Login.tsx
- app/api/auth/login/route.ts
- __tests__/components/Login.test.tsx
- e2e/login.spec.ts

TESTS UNITARIOS:
- Renderizado del formulario
- Validación de campos
- Login exitoso/fallido
- Manejo de errores
- Estado de carga

TESTS E2E:
- Visualización del formulario
- Validaciones
- Login exitoso e incorrecto
- Múltiples usuarios
- Estado de carga
- Screenshots automáticos en cada test

ENTREGABLES:
- Código completo funcional
- Todos los tests pasando
- Screenshots en test-results/screenshots/
- README completo
```

## 💡 Tips Adicionales

### 1. **Menciona Preferencias Explícitamente**
```
- Prefiero Jest sobre Mocha
- No usar Mongoose, solo driver nativo
- Usar TypeScript estricto
```

### 2. **Especifica el Estado Final Esperado**
```
- Todos los tests deben pasar
- El proyecto debe ejecutarse con npm install && npm test
- Incluir README con instrucciones
```

### 3. **Pide Validación**
```
- Ejecuta los tests y verifica que pasen
- Verifica que no haya errores de linting
- Asegúrate de que el código compile
```

### 4. **Solicita Documentación**
```
- Incluye README con:
  - Instrucciones de instalación
  - Cómo ejecutar tests
  - Explicación del ejemplo
  - Estructura del proyecto
```

### 5. **Agrupa Tareas Relacionadas**
En lugar de múltiples mensajes pequeños, agrupa:
```
Crea un proyecto completo con:
1. Estructura de carpetas
2. Configuración (package.json, tsconfig, etc.)
3. Código fuente
4. Tests
5. Documentación
```

## 🚀 Ejemplo de Prompt "Todo en Uno"

```
OBJETIVO:
Crear un proyecto completo de testing que demuestre diferentes tipos de tests.

PROYECTOS A CREAR:

1. test-unitarios/ (TypeScript + Jest)
   - Ejemplo de mocking de dependencias
   - Función A que depende de B y C
   - Tests que mockeen B y C
   - Configuración completa

2. test-bdd/ (TypeScript + MongoDB)
   - CRUD con MongoDB driver nativo
   - Seed data automático
   - Tests de integración con BD
   - Setup/teardown automático

3. test-nextjs/ (Next.js + Playwright)
   - Formulario de login
   - Validación con Zod + React Hook Form
   - API en memoria
   - Tests unitarios y E2E
   - Screenshots automáticos

REQUISITOS COMUNES:
- TypeScript estricto
- Todos los tests deben pasar
- README en cada proyecto
- Configuración completa lista para usar

ENTREGABLES:
- 3 proyectos completos y funcionales
- Todos los tests pasando
- Documentación completa
- Listo para commit y push
```

## 📊 Comparación: Antes vs Después

| Aspecto | ❌ Antes | ✅ Después |
|---------|---------|-----------|
| **Especificidad** | "haz tests" | "Tests unitarios con Jest, mockear funciones B y C" |
| **Stack** | No mencionado | "TypeScript, Jest, @types/jest" |
| **Estructura** | No especificada | "src/, __tests__/, package.json, tsconfig.json" |
| **Estado final** | No claro | "Todos los tests deben pasar" |
| **Documentación** | No solicitada | "README con instrucciones" |
| **Validación** | No mencionada | "Ejecuta tests y verifica que pasen" |

## 🎯 Resumen

**Un buen prompt debe:**
1. ✅ Ser específico y completo
2. ✅ Incluir todas las tecnologías y versiones
3. ✅ Definir estructura y entregables
4. ✅ Especificar el estado final esperado
5. ✅ Agrupar requisitos relacionados
6. ✅ Solicitar validación y documentación

**Evita:**
1. ❌ Prompts vagos o incompletos
2. ❌ Múltiples mensajes pequeños
3. ❌ Asumir que se incluirán cosas "obvias"
4. ❌ No especificar el stack tecnológico
5. ❌ No definir el estado final esperado

---

*Este documento se basa en la experiencia real del proyecto de testing. Usa estos patrones para hacer tus prompts más efectivos y obtener resultados mejores y más rápidos.*

