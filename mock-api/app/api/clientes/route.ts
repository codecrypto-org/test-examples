import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clienteService } from '@/lib/services/cliente-service';

const createClienteSchema = z.object({
  identificador: z.string().min(1, 'El DNI es requerido'),
  nombre: z.string().min(1, 'El nombre es requerido'),
  telefono: z.string().min(1, 'El teléfono es requerido'),
  mail: z.string().email('El email no es válido'),
});

// GET /api/clientes - Listar todos los clientes
export async function GET() {
  try {
    const clientes = clienteService.findAll();
    return NextResponse.json(clientes, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

// POST /api/clientes - Crear un nuevo cliente
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createClienteSchema.parse(body);

    const nuevoCliente = clienteService.create(validatedData);
    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'El DNI ya existe') {
      return NextResponse.json(
        { message: 'El DNI ya existe' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { message: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}

