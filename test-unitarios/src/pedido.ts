import { validarStock } from './inventory';
import { calcularPrecioTotal } from './pricing';

export interface Pedido {
  productoId: string;
  cantidad: number;
  precioUnitario: number;
}

export interface ResultadoPedido {
  exito: boolean;
  precioTotal?: number;
  mensaje: string;
}

/**
 * Función A: Procesa un pedido validando stock y calculando precio total
 * Esta función depende de validarStock (B) y calcularPrecioTotal (C)
 */
export function procesarPedido(pedido: Pedido): ResultadoPedido {
  // Llamada a función B
  const hayStock = validarStock(pedido.productoId, pedido.cantidad);
  
  if (!hayStock) {
    return {
      exito: false,
      mensaje: 'No hay stock suficiente para este pedido'
    };
  }

  // Llamada a función C
  const precioBase = pedido.precioUnitario * pedido.cantidad;
  const precioTotal = calcularPrecioTotal(precioBase);

  return {
    exito: true,
    precioTotal: precioTotal,
    mensaje: 'Pedido procesado correctamente'
  };
}


