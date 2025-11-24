/**
 * Función B: Valida si hay stock disponible de un producto
 */
export function validarStock(productoId: string, cantidad: number): boolean {
  // Simulación: en un caso real, esto consultaría una base de datos
  const stockDisponible = 100; // Stock simulado
  return cantidad <= stockDisponible;
}

