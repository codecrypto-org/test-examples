# Tests Unitarios con Mocks - TypeScript

Este proyecto demuestra cómo crear tests unitarios en TypeScript usando Jest, donde una función principal (A) depende de otras dos funciones (B y C) que son mockeadas.

## Estructura del Proyecto

```
test-unitarios/
├── src/
│   ├── pedido.ts          # Función A: procesarPedido
│   ├── inventory.ts       # Función B: validarStock
│   └── pricing.ts         # Función C: calcularPrecioTotal
├── __tests__/
│   └── pedido.test.ts     # Tests de la función A con mocks de B y C
├── package.json
├── tsconfig.json
└── jest.config.js
```

## Ejemplo

### Función A: `procesarPedido`
Función principal que procesa un pedido. Depende de:
- **Función B**: `validarStock` - Valida si hay stock disponible
- **Función C**: `calcularPrecioTotal` - Calcula el precio total con impuestos

### Función B: `validarStock`
Valida si hay suficiente stock para un producto.

### Función C: `calcularPrecioTotal`
Calcula el precio total incluyendo impuestos.

## Instalación

```bash
npm install
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

## Ejemplo de Uso

```typescript
import { procesarPedido } from './src/pedido';

const pedido = {
  productoId: 'PROD-001',
  cantidad: 5,
  precioUnitario: 10
};

const resultado = procesarPedido(pedido);
console.log(resultado);
```

## Conceptos Demostrados

1. **Mocking de funciones**: Uso de `jest.mock()` para mockear funciones B y C
2. **Verificación de llamadas**: Verificar que las funciones mockeadas fueron llamadas con los parámetros correctos
3. **Aislamiento**: La función A se prueba de forma aislada sin depender de la implementación real de B y C
4. **Casos de prueba**: Múltiples escenarios (éxito, fallo, diferentes valores)

