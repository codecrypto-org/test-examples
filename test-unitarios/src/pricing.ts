/**
 * Función C: Calcula el precio total incluyendo impuestos
 */
export function calcularPrecioTotal(precioBase: number, impuesto: number = 0.21): number {
  return precioBase * (1 + impuesto);
}




