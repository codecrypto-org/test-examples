/**
 * Calculadora implementada con TDD
 * 
 * Esta clase será implementada siguiendo el proceso TDD:
 * 1. Red: Los tests fallan
 * 2. Green: Implementar el código mínimo para que pasen
 * 3. Refactor: Mejorar el código
 */

export class Calculadora {
  /**
   * Suma dos números
   */
  sumar(a: number, b: number): number {
    // TODO: Implementar
    return a + b;
  }

  /**
   * Resta dos números
   */
  restar(a: number, b: number): number {
    return a - b;
  }

  /**
   * Multiplica dos números
   */
  multiplicar(a: number, b: number): number {
    // TODO: Implementar
    return a * b;
  
  }

  /**
   * Divide dos números
   * @throws Error si se intenta dividir por cero
   */
  dividir(a: number, b: number): number {
    // TODO: Implementar
    if (b === 0) {
      throw new Error('No se puede dividir por cero');
    }
    return a / b;
  
  }

  /**
   * Calcula la potencia de un número
   */
  potencia(base: number, exponente: number): number {
    // TODO: Implementar
    return Math.pow(base, exponente);
  
  
  }

  /**
   * Calcula la raíz cuadrada de un número
   * @throws Error si el número es negativo
   */
  raizCuadrada(numero: number): number {
    // TODO: Implementar
    if (numero < 0) {
      throw new Error('No se puede calcular la raíz cuadrada de un número negativo');
    }
   return Math.sqrt(numero);
  
  
  }

  /**
   * Calcula el porcentaje de un número
   */
  porcentaje(numero: number, porcentaje: number): number {
    // TODO: Implementar
    return numero * (porcentaje / 100);
  
  }

  /**
   * Suma múltiples números
   */
  sumarVarios(...numeros: number[]): number {
    // TODO: Implementar
    return numeros.reduce((acc, curr) => acc + curr, 0);
  
  }

  /**
   * Multiplica múltiples números
   */
  multiplicarVarios(...numeros: number[]): number {
    // TODO: Implementar
   return numeros.reduce((acc, curr) => acc * curr, 1);
  
  }
}

