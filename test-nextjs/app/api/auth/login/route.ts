import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Base de datos en memoria de usuarios
const usuariosEnMemoria = [
  { usuario: 'admin', password: 'admin123' },
  { usuario: 'test', password: 'test123' },
  { usuario: 'demo', password: 'demo123' },
];

const loginSchema = z.object({
  usuario: z.string(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validar el schema
    const validatedData = loginSchema.parse(body);
    const { usuario, password } = validatedData;

    // Buscar usuario en la base de datos en memoria
    const usuarioEncontrado = usuariosEnMemoria.find(
      (u) => u.usuario === usuario && u.password === password
    );

    if (!usuarioEncontrado) {
      return NextResponse.json(
        { message: 'Usuario o contraseña incorrectos' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { message: 'Login exitoso', usuario: usuarioEncontrado.usuario },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: 'Datos inválidos', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: 'Error del servidor' },
      { status: 500 }
    );
  }
}

