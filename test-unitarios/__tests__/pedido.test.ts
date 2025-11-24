import { procesarPedido, Pedido } from '../src/pedido';
import * as inventoryModule from '../src/inventory';
import * as pricingModule from '../src/pricing';

// Mockear las funciones B y C
jest.mock('../src/inventory');
jest.mock('../src/pricing');

// Tipar los mocks usando jest.mocked (más seguro)
const mockValidarStock = jest.mocked(inventoryModule.validarStock);
const mockCalcularPrecioTotal = jest.mocked(pricingModule.calcularPrecioTotal);

describe('procesarPedido (Función A)', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
  });

  it('debería procesar el pedido correctamente cuando hay stock', () => {
    // Arrange: Configurar los mocks
    const pedido: Pedido = {
      productoId: 'PROD-001',
      cantidad: 5,
      precioUnitario: 10
    };

    // Mock de función B: validarStock retorna true
    mockValidarStock.mockReturnValue(true);
    
    // Mock de función C: calcularPrecioTotal retorna 60.5 (50 * 1.21)
    mockCalcularPrecioTotal.mockReturnValue(60.5);

    // Act: Ejecutar la función A
    const resultado = procesarPedido(pedido);

    // Assert: Verificar el resultado
    expect(resultado.exito).toBe(true);
    expect(resultado.precioTotal).toBe(60.5);
    expect(resultado.mensaje).toBe('Pedido procesado correctamente');

    // Verificar que las funciones B y C fueron llamadas correctamente
    expect(mockValidarStock).toHaveBeenCalledWith('PROD-001', 5);
    expect(mockValidarStock).toHaveBeenCalledTimes(1);
    
    expect(mockCalcularPrecioTotal).toHaveBeenCalledWith(50); // 5 * 10
    expect(mockCalcularPrecioTotal).toHaveBeenCalledTimes(1);
  });

  it('debería rechazar el pedido cuando no hay stock suficiente', () => {
    // Arrange
    const pedido: Pedido = {
      productoId: 'PROD-002',
      cantidad: 150,
      precioUnitario: 20
    };

    // Mock de función B: validarStock retorna false (sin stock)
    mockValidarStock.mockReturnValue(false);

    // Act
    const resultado = procesarPedido(pedido);

    // Assert
    expect(resultado.exito).toBe(false);
    expect(resultado.precioTotal).toBeUndefined();
    expect(resultado.mensaje).toBe('No hay stock suficiente para este pedido');

    // Verificar que B fue llamada pero C NO fue llamada
    expect(mockValidarStock).toHaveBeenCalledWith('PROD-002', 150);
    expect(mockValidarStock).toHaveBeenCalledTimes(1);
    
    // La función C no debería ser llamada si no hay stock
    expect(mockCalcularPrecioTotal).not.toHaveBeenCalled();
  });

  it('debería calcular correctamente el precio base antes de llamar a calcularPrecioTotal', () => {
    // Arrange
    const pedido: Pedido = {
      productoId: 'PROD-003',
      cantidad: 3,
      precioUnitario: 15
    };

    mockValidarStock.mockReturnValue(true);
    mockCalcularPrecioTotal.mockReturnValue(54.45); // 45 * 1.21

    // Act
    const resultado = procesarPedido(pedido);

    // Assert
    expect(resultado.exito).toBe(true);
    expect(resultado.precioTotal).toBe(54.45);
    
    // Verificar que calcularPrecioTotal recibió el precio base correcto (3 * 15 = 45)
    expect(mockCalcularPrecioTotal).toHaveBeenCalledWith(45);
  });

  it('debería manejar diferentes valores de stock y precios', () => {
    // Arrange
    const pedido: Pedido = {
      productoId: 'PROD-004',
      cantidad: 1,
      precioUnitario: 100
    };

    mockValidarStock.mockReturnValue(true);
    mockCalcularPrecioTotal.mockReturnValue(121); // 100 * 1.21

    // Act
    const resultado = procesarPedido(pedido);

    // Assert
    expect(resultado.exito).toBe(true);
    expect(resultado.precioTotal).toBe(121);
    expect(mockValidarStock).toHaveBeenCalledWith('PROD-004', 1);
    expect(mockCalcularPrecioTotal).toHaveBeenCalledWith(100);
  });
});

