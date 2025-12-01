# Calculadora TDD

Implementación de una calculadora usando **Test-Driven Development (TDD)**.

## 🎯 Objetivo

Este proyecto demuestra el proceso TDD:
1. **Red**: Escribir tests que fallen
2. **Green**: Implementar el código mínimo para que pasen
3. **Refactor**: Mejorar el código manteniendo los tests verdes

## 📋 Funcionalidades

La calculadora incluye las siguientes operaciones:

### Operaciones Básicas
- ✅ Suma
- ✅ Resta
- ✅ Multiplicación
- ✅ División (con validación de división por cero)

### Operaciones Avanzadas
- ✅ Potencia
- ✅ Raíz cuadrada
- ✅ Porcentaje

### Operaciones con Múltiples Valores
- ✅ Suma de múltiples números
- ✅ Multiplicación de múltiples números

## 🚀 Instalación

```bash
npm install
```

## 🧪 Ejecutar Tests

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con cobertura
npm run test:coverage
```

## 📝 Proceso TDD

### Fase 1: Red (Tests que fallan)
Los tests están escritos en `__tests__/calculadora.test.ts` y actualmente fallan porque la implementación aún no existe.

### Fase 2: Green (Implementación mínima)
La implementación se encuentra en `src/calculadora.ts`.

### Fase 3: Refactor
Una vez que todos los tests pasen, se puede refactorizar el código para mejorar su calidad manteniendo los tests verdes.

## 🏗️ Estructura del Proyecto

```
test-calculadora/
├── __tests__/
│   └── calculadora.test.ts    # Tests TDD
├── src/
│   └── calculadora.ts         # Implementación
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 📚 Tecnologías

- **TypeScript**: Lenguaje principal
- **Jest**: Framework de testing
- **ts-jest**: Preprocesador TypeScript para Jest



