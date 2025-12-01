import { NextRequest, NextResponse } from 'next/server';
import { validateMagicLink } from '@/lib/services/magic-link';
import { SignJWT } from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
const SESSION_COOKIE_NAME = 'magic-link-session';
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 días en segundos

// Convertir el secret a Uint8Array para jose
function getSecretKey(): Uint8Array {
  return new TextEncoder().encode(JWT_SECRET);
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.redirect(new URL('/?error=token-missing', request.url));
    }

    // Validar el magic link
    const result = await validateMagicLink(token);

    if (!result) {
      return NextResponse.redirect(
        new URL('/?error=invalid-token', request.url)
      );
    }

    // Crear token de sesión
    const secretKey = getSecretKey();
    const sessionToken = await new SignJWT({ email: result.email })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('7d')
      .setIssuedAt()
      .sign(secretKey);

    console.log('Session token created for:', result.email);

    // Crear respuesta de redirect y establecer cookie en la misma respuesta
    const redirectUrl = new URL('/dashboard', request.url);
    const response = NextResponse.redirect(redirectUrl);
    
    // Establecer cookie en la respuesta del redirect
    response.cookies.set(SESSION_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    console.log('Cookie set, redirecting to dashboard');
    return response;
  } catch (error) {
    console.error('Error verifying magic link:', error);
    return NextResponse.redirect(
      new URL('/?error=verification-failed', request.url)
    );
  }
}
