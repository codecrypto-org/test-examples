import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { clienteService } from '@/lib/services/cliente-service';

const updateClienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').optional(),
  telefono: z.string().min(1, 'El teléfono es requerido').optional(),
  mail: z.string().email('El email no es válido').optional(),
});

// GET /api/clientes/[identificador] - Obtener un cliente por DNI
export async function GET(
  request: NextRequest,
  { params }: { params: { identificador: string } }
) {
  try {
    const { identificador } = params;
    const cliente = clienteService.findByIdentificador(identificador);

    if (!cliente) {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(cliente, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: 'Error al obtener cliente' },
      { status: 500 }
    );
  }
}

// PUT /api/clientes/[identificador] - Actualizar un cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { identificador: string } }
) {
  try {
    const { identificador } = params;
    const body = await request.json();
    const validatedData = updateClienteSchema.parse(body);

    const clienteActualizado = clienteService.update(identificador, validatedData);
    return NextResponse.json(clienteActualizado, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    if (error instanceof Error && error.message === 'Cliente no encontrado') {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Error al actualizar cliente' },
      { status: 500 }
    );
  }
}

// DELETE /api/clientes/[identificador] - Eliminar un cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { identificador: string } }
) {
  try {
    const { identificador } = params;
    clienteService.delete(identificador);
    return NextResponse.json(
      { message: 'Cliente eliminado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error && error.message === 'Cliente no encontrado') {
      return NextResponse.json(
        { message: 'Cliente no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: 'Error al eliminar cliente' },
      { status: 500 }
    );
  }
}

