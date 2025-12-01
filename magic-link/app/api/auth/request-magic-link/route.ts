import { NextRequest, NextResponse } from 'next/server';
import { generateMagicLink } from '@/lib/services/magic-link';
import { sendMagicLinkEmail } from '@/lib/services/email';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validar email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email es requerido' },
        { status: 400 }
      );
    }

    // Validar formato de email básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email inválido' },
        { status: 400 }
      );
    }

    // Generar magic link
    const magicLinkUrl = await generateMagicLink(email);

    // Enviar email
    await sendMagicLinkEmail(email, magicLinkUrl);

    // Retornar éxito (no exponer el link por seguridad)
    return NextResponse.json(
      { message: 'Magic link enviado correctamente' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error requesting magic link:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}

