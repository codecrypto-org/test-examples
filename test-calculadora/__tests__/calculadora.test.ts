import { Calculadora } from '../src/calculadora';

describe('Calculadora - TDD', () => {
  let calculadora: Calculadora;

  beforeEach(() => {
    calculadora = new Calculadora();
  });

  describe('Operaciones básicas', () => {
    describe('Suma', () => {
      test('debería sumar dos números positivos', () => {
        expect(calculadora.sumar(2, 3)).toBe(5);
      });

      test('debería sumar un número positivo y uno negativo', () => {
        expect(calculadora.sumar(5, -3)).toBe(2);
      });

      test('debería sumar dos números negativos', () => {
        expect(calculadora.sumar(-2, -3)).toBe(-5);
      });

      test('debería sumar números decimales', () => {
        expect(calculadora.sumar(2.5, 3.7)).toBeCloseTo(6.2);
      });

      test('debería sumar cero', () => {
        expect(calculadora.sumar(5, 0)).toBe(5);
        expect(calculadora.sumar(0, 5)).toBe(5);
      });
    });

    describe('Resta', () => {
      test('debería restar dos números positivos', () => {
        expect(calculadora.restar(5, 3)).toBe(2);
      });

      test('debería restar y obtener resultado negativo', () => {
        expect(calculadora.restar(3, 5)).toBe(-2);
      });

      test('debería restar números negativos', () => {
        expect(calculadora.restar(-2, -3)).toBe(1);
      });

      test('debería restar números decimales', () => {
        expect(calculadora.restar(5.5, 2.3)).toBeCloseTo(3.2);
      });

      test('debería restar cero', () => {
        expect(calculadora.restar(5, 0)).toBe(5);
        expect(calculadora.restar(0, 5)).toBe(-5);
      });
    });

    describe('Multiplicación', () => {
      test('debería multiplicar dos números positivos', () => {
        expect(calculadora.multiplicar(4, 3)).toBe(12);
      });

      test('debería multiplicar un número positivo y uno negativo', () => {
        expect(calculadora.multiplicar(4, -3)).toBe(-12);
      });

      test('debería multiplicar dos números negativos', () => {
        expect(calculadora.multiplicar(-4, -3)).toBe(12);
      });

      test('debería multiplicar números decimales', () => {
        expect(calculadora.multiplicar(2.5, 4)).toBe(10);
      });

      test('debería multiplicar por cero', () => {
        expect(calculadora.multiplicar(5, 0)).toBe(0);
        expect(calculadora.multiplicar(0, 5)).toBe(0);
      });

      test('debería multiplicar por uno', () => {
        expect(calculadora.multiplicar(5, 1)).toBe(5);
        expect(calculadora.multiplicar(1, 5)).toBe(5);
      });
    });

    describe('División', () => {
      test('debería dividir dos números positivos', () => {
        expect(calculadora.dividir(10, 2)).toBe(5);
      });

      test('debería dividir y obtener resultado decimal', () => {
        expect(calculadora.dividir(7, 2)).toBe(3.5);
      });

      test('debería dividir un número positivo y uno negativo', () => {
        expect(calculadora.dividir(10, -2)).toBe(-5);
      });

      test('debería dividir dos números negativos', () => {
        expect(calculadora.dividir(-10, -2)).toBe(5);
      });

      test('debería dividir por uno', () => {
        expect(calculadora.dividir(5, 1)).toBe(5);
      });

      test('debería lanzar error al dividir por cero', () => {
        expect(() => calculadora.dividir(10, 0)).toThrow('No se puede dividir por cero');
      });

      test('debería dividir cero por un número', () => {
        expect(calculadora.dividir(0, 5)).toBe(0);
      });
    });
  });

  describe('Operaciones avanzadas', () => {
    describe('Potencia', () => {
      test('debería calcular la potencia de un número', () => {
        expect(calculadora.potencia(2, 3)).toBe(8);
      });

      test('debería calcular potencia con exponente cero', () => {
        expect(calculadora.potencia(5, 0)).toBe(1);
      });

      test('debería calcular potencia con exponente negativo', () => {
        expect(calculadora.potencia(2, -2)).toBeCloseTo(0.25);
      });

      test('debería calcular potencia con base negativa y exponente par', () => {
        expect(calculadora.potencia(-2, 2)).toBe(4);
      });

      test('debería calcular potencia con base negativa y exponente impar', () => {
        expect(calculadora.potencia(-2, 3)).toBe(-8);
      });
    });

    describe('Raíz cuadrada', () => {
      test('debería calcular la raíz cuadrada de un número positivo', () => {
        expect(calculadora.raizCuadrada(9)).toBe(3);
      });

      test('debería calcular la raíz cuadrada de un número decimal', () => {
        expect(calculadora.raizCuadrada(2.25)).toBeCloseTo(1.5);
      });

      test('debería calcular la raíz cuadrada de cero', () => {
        expect(calculadora.raizCuadrada(0)).toBe(0);
      });

      test('debería lanzar error al calcular raíz cuadrada de número negativo', () => {
        expect(() => calculadora.raizCuadrada(-4)).toThrow('No se puede calcular la raíz cuadrada de un número negativo');
      });
    });

    describe('Porcentaje', () => {
      test('debería calcular el porcentaje de un número', () => {
        expect(calculadora.porcentaje(100, 20)).toBe(20);
      });

      test('debería calcular porcentaje con decimales', () => {
        expect(calculadora.porcentaje(200, 15.5)).toBeCloseTo(31);
      });

      test('debería calcular porcentaje de cero', () => {
        expect(calculadora.porcentaje(0, 50)).toBe(0);
      });
    });
  });

  describe('Operaciones con múltiples valores', () => {
    test('debería sumar múltiples números', () => {
      expect(calculadora.sumarVarios(1, 2, 3, 4, 5)).toBe(15);
    });

    test('debería multiplicar múltiples números', () => {
      expect(calculadora.multiplicarVarios(2, 3, 4)).toBe(24);
    });

    test('debería manejar un solo número en operaciones múltiples', () => {
      expect(calculadora.sumarVarios(5)).toBe(5);
      expect(calculadora.multiplicarVarios(5)).toBe(5);
    });

    test('debería manejar cero en operaciones múltiples', () => {
      expect(calculadora.sumarVarios(1, 2, 0, 3)).toBe(6);
      expect(calculadora.multiplicarVarios(1, 2, 0, 3)).toBe(0);
    });
  });

  describe('Validaciones y casos especiales', () => {
    test('debería manejar números muy grandes', () => {
      const resultado = calculadora.sumar(Number.MAX_SAFE_INTEGER, 1);
      expect(typeof resultado).toBe('number');
    });

    test('debería manejar números muy pequeños', () => {
      const resultado = calculadora.sumar(Number.MIN_SAFE_INTEGER, -1);
      expect(typeof resultado).toBe('number');
    });

    test('debería mantener precisión con decimales', () => {
      const resultado = calculadora.sumar(0.1, 0.2);
      expect(resultado).toBeCloseTo(0.3);
    });
  });
});

